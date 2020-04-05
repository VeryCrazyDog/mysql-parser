const SINGLE_QUOTE = "'"
const DOUBLE_QUOTE = '"'
const BACKTICK = '`'
const DOUBLE_DASH_COMMENT_START = '--'
const HASH_COMMENT_START = '#'
const C_STYLE_COMMENT_START = '/*'
const SEMICOLON = ';'
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
const singleQuoteStringEndRegex = /(?<!\\)'/
const doubleQuoteStringEndRegex = /(?<!\\)"/
const backtickQuoteEndRegex = /(?<!`)`(?!`)/
const doubleDashCommentStartRegex = /--[ \f\n\r\t\v]/
const cStyleCommentStartRegex = /\/\*/
const cStyleCommentEndRegex = /(?<!\/)\*\//
const newLineRegex = /[\r\n]+/
const delimiterStartRegex = /[\n\r]+[ \f\t\v]*DELIMITER[ \t]+/i
const semicolonKeyTokenRegex = buildKeyTokenRegex(SEMICOLON)
const quoteEndRegexDict: Record<string, RegExp> = {
  [SINGLE_QUOTE]: singleQuoteStringEndRegex,
  [DOUBLE_QUOTE]: doubleQuoteStringEndRegex,
  [BACKTICK]: backtickQuoteEndRegex
}

function escapeRegex (value: string): string {
  return value.replace(regexEscapeSetRegex, '\\$&')
}

function buildKeyTokenRegex (delimiter: string): RegExp {
  return new RegExp('(?:' + [
    escapeRegex(delimiter),
    SINGLE_QUOTE,
    DOUBLE_QUOTE,
    BACKTICK,
    doubleDashCommentStartRegex.source,
    HASH_COMMENT_START,
    cStyleCommentStartRegex.source,
    delimiterStartRegex.source
  ].join('|') + ')', 'i')
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
  let regex
  if (currentDelimiter === SEMICOLON) {
    regex = semicolonKeyTokenRegex
  } else {
    regex = buildKeyTokenRegex(currentDelimiter)
  }
  return readUntilExp(content, startIndex, regex)
}

function readUntilEndQuote (content: string, startIndex: number, quote: string): ReadUntilExpResult {
  if (!(quote in quoteEndRegexDict)) {
    throw new TypeError(`Incorrect quote ${quote} supplied`)
  }
  return readUntilExp(content, startIndex, quoteEndRegexDict[quote])
}

function readUntilNewLine (content: string, startIndex: number): ReadUntilExpResult {
  return readUntilExp(content, startIndex, newLineRegex)
}

function readUntilCStyleCommentEnd (content: string, startIndex: number): ReadUntilExpResult {
  return readUntilExp(content, startIndex, cStyleCommentEndRegex)
}

export function split (sql: string, options?: SplitOptions): string[] {
  options = options ?? {}
  const multipleStatements = options.multipleStatements ?? false

  let nextIndex: number = 0
  const currentDelimiter: string = SEMICOLON
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
      currentStatement += lastRead
      switch (lastToken.trim()) {
        case currentDelimiter:
        case null:
          currentStatement = currentStatement.trim()
          if (currentStatement !== '') {
            result.push(currentStatement)
          }
          currentStatement = ''
          break
        case SINGLE_QUOTE:
        case DOUBLE_QUOTE:
        case BACKTICK:
          currentStatement += lastToken
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
          ;({
            exp: lastToken,
            unreadStartIndex: nextIndex
          } = readUntilNewLine(sql, lastTokenIndex + DOUBLE_DASH_COMMENT_START.length))
          if (lastToken !== null) {
            currentStatement += lastToken
          }
          break
        case HASH_COMMENT_START:
          ;({
            exp: lastToken,
            unreadStartIndex: nextIndex
          } = readUntilNewLine(sql, nextIndex))
          if (lastToken !== null) {
            currentStatement += lastToken
          }
          break
        case C_STYLE_COMMENT_START:
          if (['!', '+'].includes(sql[lastTokenIndex + C_STYLE_COMMENT_START.length])) {
            // Should not be skipped, see https://dev.mysql.com/doc/refman/5.7/en/comments.html
            currentStatement += lastToken
            ;({
              read: lastRead,
              exp: lastToken,
              unreadStartIndex: nextIndex
            } = readUntilCStyleCommentEnd(sql, nextIndex))
            currentStatement += lastRead
            if (lastToken !== null) {
              currentStatement += lastToken
            }
          } else {
            ;({
              unreadStartIndex: nextIndex
            } = readUntilCStyleCommentEnd(sql, nextIndex))
          }
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
