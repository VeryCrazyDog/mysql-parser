const SINGLE_QUOTE = "'"
const DOUBLE_QUOTE = '"'
const BACKTICK = '`'
const DOUBLE_DASH_COMMENT_START = '--'
const HASH_COMMENT_START = '#'
const C_STYLE_COMMENT_START = '/*'
const DELIMITER_KEYWORD = 'DELIMITER'

export interface SplitOptions {
  multipleStatements?: boolean
}

interface ReadUntilExpResult {
  read: string
  expIndex: number
  exp: string | null
  unreadStartIndex: number
}

const regexEscapeSetRegex = /[-/\\^$*+?.()|[\]{}]/g
const doubleDashCommentStartRegex = /--[ \f\n\r\t\v]/
const cStyleCommentStartRegex = /\/\*/
const delimiterStartRegex = /[\n\r]+[ \f\t\v]*DELIMITER[ \t]+/i
const newLineRegex = /[\r\n]+/

function escapeRegex (value: string): string {
  return value.replace(regexEscapeSetRegex, '\\$&')
}

function readUntilExp (content: string, startIndex: number, regex: RegExp): ReadUntilExpResult {
  const contentToRead = content.slice(startIndex)
  const match = contentToRead.match(regex)
  let result: ReadUntilExpResult
  if (match?.index !== undefined) {
    result = {
      read: contentToRead.slice(0, match.index),
      expIndex: startIndex + match.index,
      exp: match[0],
      unreadStartIndex: startIndex + match.index + match[0].length
    }
  } else {
    result = {
      read: contentToRead,
      expIndex: -1,
      exp: null,
      unreadStartIndex: -1
    }
  }
  return result
}

function readUntilKeyToken (content: string, startIndex: number, currentDelimiter: string): ReadUntilExpResult {
  // TODO Cache the result to avoid re-calcuation
  const regex = new RegExp('(?:' + [
    escapeRegex(currentDelimiter),
    SINGLE_QUOTE,
    DOUBLE_QUOTE,
    BACKTICK,
    doubleDashCommentStartRegex.source,
    HASH_COMMENT_START,
    cStyleCommentStartRegex.source,
    delimiterStartRegex.source
  ].join('|') + ')', 'i')
  return readUntilExp(content, startIndex, regex)
}

function readUntilEndQuote (content: string, startIndex: number, quote: string): ReadUntilExpResult {
  if (![SINGLE_QUOTE, DOUBLE_QUOTE, BACKTICK].includes(quote)) {
    throw new TypeError('Incorrect quote supplied')
  }
  // TODO Cache the result to avoid re-calcuation
  const regex = new RegExp(/(?<!\\)/.source + quote)
  return readUntilExp(content, startIndex, regex)
}

function readUntilNewLine (content: string, startIndex: number): ReadUntilExpResult {
  return readUntilExp(content, startIndex, newLineRegex)
}

// Not able to split long URL
// eslint-disable-next-line max-len
// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql-pass.ts#L156
function removeComments (sql: string): string {
  // eslint-disable-next-line max-len
  const quotes = /^((?:[^"`']*?(?:(?:"(?:[^"]|\\")*?(?<!\\)")|(?:'(?:[^']|\\')*?(?<!\\)')|(?:`(?:[^`]|\\`)*?(?<!\\)`)))*?[^"`']*?)/
  const cStyleComments = new RegExp(quotes.source + '/\\*.*?\\*/')
  const doubleDashComments = new RegExp(quotes.source + '--(?:(?:[ \t]+.*(\r\n|\n|\r)?)|(\r\n|\n|\r)|$)')
  const hashComments = new RegExp(quotes.source + '#.*(\r\n|\n|\r)?')
  while (sql.match(cStyleComments) !== null) {
    sql = sql.replace(cStyleComments, '$1')
  }
  while (sql.match(doubleDashComments) !== null) {
    sql = sql.replace(doubleDashComments, '$1$2$3')
  }
  while (sql.match(hashComments) !== null) {
    sql = sql.replace(hashComments, '$1$2')
  }
  return sql
}

// Not able to split long URL
// eslint-disable-next-line max-len
// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql-pass.ts#L122
function splitQueries (sqlMulti: string): string[] {
  // eslint-disable-next-line max-len
  const quotes = /^((?:[^"`']*?(?:(?:"(?:[^"]|\\")*?(?<!\\)")|(?:'(?:[^']|\\')*?(?<!\\)')|(?:`(?:[^`]|\\`)*?(?<!\\)`)))*?[^"`']*?)/
  const delimiterRegex = /^(?:\r\n|[ \t\r\n])*DELIMITER[\t ]*(.*?)(?:\r\n|\n|\r|$)/i
  const queries = []
  let match: RegExpMatchArray | null = []
  let delimiter = ';'
  let splitRegex = new RegExp(quotes.source + delimiter)
  while (match !== null) {
    const delimiterCommand = sqlMulti.match(delimiterRegex)
    if (delimiterCommand !== null) { // if to change delimiter
      delimiter = delimiterCommand[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // change delimiter
      splitRegex = new RegExp(quotes.source + delimiter)
      sqlMulti = sqlMulti.slice(delimiterCommand[0].length) // remove delimiter from sql string
    } else {
      match = sqlMulti.match(splitRegex) // split sql string
      if (match !== null) {
        queries.push(match[1]) // push the split query into the queries array
        sqlMulti = sqlMulti.slice(match[1].length + delimiter.length) // remove split query from sql string
      }
    }
  }
  queries.push(sqlMulti) // push last query which could have no delimiter
  // remove empty queries
  return queries.filter((sql) => {
    if (sql === '') {
      return false
    }
    const notEmpty = (sql.trim().replace(/(\r\n|\n|\r)/gm, '') !== '')
    return !!notEmpty
  })
}

export function split (sql: string, options?: SplitOptions): string[] {
  options = options ?? {}
  const multipleStatements = options.multipleStatements ?? false

  let nextIndex: number = 0
  const currentDelimiter: string = ';'
  let lastRead: string = ''
  let lastTokenIndex: number = -1
  let lastToken: string | null = null
  let currentStatement = ''
  const result: string[] = []
  do {
    ;({
      read: lastRead,
      expIndex: lastTokenIndex,
      exp: lastToken,
      unreadStartIndex: nextIndex
    } = readUntilKeyToken(sql, nextIndex, currentDelimiter))
    if (lastToken !== null) {
      switch (lastToken.trim()) {
        case currentDelimiter:
        case null:
          currentStatement += lastRead
          currentStatement = currentStatement.trim()
          if (currentStatement !== '') {
            result.push(currentStatement)
          }
          currentStatement = ''
          break
        case SINGLE_QUOTE:
        case DOUBLE_QUOTE:
        case BACKTICK:
          currentStatement += lastRead + lastToken
          ;({
            read: lastRead,
            exp: lastToken,
            unreadStartIndex: nextIndex
          } = readUntilEndQuote(sql, nextIndex, lastToken))
          currentStatement += lastRead
          if (lastToken !== null) {
            currentStatement += lastToken
          }
          break
        case DOUBLE_DASH_COMMENT_START:
          currentStatement += lastRead
          ;({
            exp: lastToken,
            unreadStartIndex: nextIndex
          } = readUntilNewLine(sql, lastTokenIndex + DOUBLE_DASH_COMMENT_START.length))
          if (lastToken !== null) {
            currentStatement += lastToken
          }
          break
        case HASH_COMMENT_START:
          currentStatement += lastRead
          ;({
            exp: lastToken,
            unreadStartIndex: nextIndex
          } = readUntilNewLine(sql, nextIndex))
          if (lastToken !== null) {
            currentStatement += lastToken
          }
          break
        case C_STYLE_COMMENT_START:
          break
        case DELIMITER_KEYWORD:
          break
        default:
          // This should never happen
          throw new Error(`Unknown token '${lastToken}'`)
      }
    }
  } while (lastToken !== null)
  return result
}