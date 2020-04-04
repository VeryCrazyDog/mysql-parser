const HASH_COMMENT_START = '#'
const SINGLE_QUOTE = "'"
const DOUBLE_QUOTE = '"'
const BACKTICK = '`'
const C_STYLE_COMMENT_START = '/*'

export interface SplitOptions {
  retainHashComments?: boolean
  retainDoubleDashComments? : boolean
  retainCStyleComments?: boolean
  multipleStatements?: boolean
}

interface ReadUntilKeyTokenResult {
  read: string
  token: string | null
  unreadStartIndex: number
}

const regexEscapeSetRegex = /[-\/\\^$*+?.()|[\]{}]/g
const doubleDashCommentStartRegex = /--\s/
const cStyleCommentStartRegex = new RegExp(escapeRegex(C_STYLE_COMMENT_START))
const delimiterStartRegex = /\s*DELIMITER[\t ]+/

function escapeRegex (value: string): string {
  return value.replace(regexEscapeSetRegex, '\\$&')
}

function readUntilKeyToken (content: string, startIndex: number, currentDelimiter: string): ReadUntilKeyTokenResult {
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
  const partialContent = content.slice(startIndex)
  const match = partialContent.match(regex)
  let result
  if (match?.index !== undefined) {
    result = {
      read: partialContent.slice(0, match.index),
      token: match[0],
      unreadStartIndex: startIndex + match.index + match[0].length
    }
  } else {
    result = {
      read: partialContent,
      token: null,
      unreadStartIndex: -1
    }
  }
  return result
}

// TODO Combine with the function above
function readUntilEndOfSingleQuoteString (content: string, startIndex: number): ReadUntilKeyTokenResult {
  // TODO Cache the result to avoid re-calcuation
  // TODO This regex is not enough
  const regex = /'/
  const partialContent = content.slice(startIndex)
  const match = partialContent.match(regex)
  let result
  if (match?.index !== undefined) {
    result = {
      read: partialContent.slice(0, match.index),
      token: match[0],
      unreadStartIndex: startIndex + match.index + match[0].length
    }
  } else {
    result = {
      read: partialContent,
      token: null,
      unreadStartIndex: -1
    }
  }
  return result
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
  const retainHashComments = options.retainHashComments ?? false
  const retainDoubleDashComments = options.retainDoubleDashComments ?? false
  const retainCStyleComments = options.retainCStyleComments ?? false
  const multipleStatements = options.multipleStatements ?? false

  let nextIndex: number = 0
  const currentDelimiter: string = ';'
  let lastRead: string = ''
  let lastKeyToken: string | null = null
  let currentStatement = ''
  const result: string[] = []
  do {
    ;({
      read: lastRead,
      token: lastKeyToken,
      unreadStartIndex: nextIndex
    } = readUntilKeyToken(sql, nextIndex, currentDelimiter))
    if (lastKeyToken !== null) {
      switch (lastKeyToken.trim()) {
        case currentDelimiter:
          result.push(currentStatement + lastRead)
          currentStatement = ''
          break
        case SINGLE_QUOTE:
          currentStatement += lastRead + lastKeyToken
          ;({
            read: lastRead,
            token: lastKeyToken,
            unreadStartIndex: nextIndex
          } = readUntilEndOfSingleQuoteString(sql, nextIndex))
          currentStatement += lastRead + lastKeyToken
          break
        case DOUBLE_QUOTE:
          break
        case BACKTICK:
          break
        case '--':
        case HASH_COMMENT_START:
          break
        case C_STYLE_COMMENT_START:
          break
        case 'DELIMITER':
          break
        case null:
          break
        default:
          // This should never happen
          throw new Error(`Unknown key token '${lastKeyToken}'`)
      }
    }
  } while (lastKeyToken !== null)
  return result
}
