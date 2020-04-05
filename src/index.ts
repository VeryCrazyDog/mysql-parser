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

interface SplitExecutionContext {
  currentDelimiter: string
  currentStatement: string
  splitResult: string[]
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

  const context: SplitExecutionContext = {
    currentDelimiter: SEMICOLON,
    currentStatement: '',
    splitResult: []
  }
  let readResult: ReadUntilExpResult = {
    read: '',
    expIndex: -1,
    exp: null,
    unreadStartIndex: 0
  }
  do {
    readResult = readUntilKeyToken(sql, readResult.unreadStartIndex, context.currentDelimiter)
    if (readResult.exp !== null) {
      context.currentStatement += readResult.read
      switch (readResult.exp.trim()) {
        case context.currentDelimiter:
        case null:
          const currentStatement = context.currentStatement.trim()
          if (currentStatement !== '') {
            context.splitResult.push(currentStatement)
          }
          context.currentStatement = ''
          break
        case SINGLE_QUOTE:
        case DOUBLE_QUOTE:
        case BACKTICK:
          context.currentStatement += readResult.exp
          readResult = readUntilEndQuote(sql, readResult.unreadStartIndex, readResult.exp)
          context.currentStatement += readResult.read
          if (readResult.exp !== null) {
            context.currentStatement += readResult.exp
          }
          break
        case DOUBLE_DASH_COMMENT_START:
          readResult = readUntilNewLine(sql, readResult.expIndex + DOUBLE_DASH_COMMENT_START.length)
          if (readResult.exp !== null) {
            context.currentStatement += readResult.exp
          }
          break
        case HASH_COMMENT_START:
          readResult = readUntilNewLine(sql, readResult.unreadStartIndex)
          if (readResult.exp !== null) {
            context.currentStatement += readResult.exp
          }
          break
        case C_STYLE_COMMENT_START:
          if (['!', '+'].includes(sql[readResult.expIndex + C_STYLE_COMMENT_START.length])) {
            // Should not be skipped, see https://dev.mysql.com/doc/refman/5.7/en/comments.html
            context.currentStatement += readResult.exp
            readResult = readUntilCStyleCommentEnd(sql, readResult.unreadStartIndex)
            context.currentStatement += readResult.read
            if (readResult.exp !== null) {
              context.currentStatement += readResult.exp
            }
          } else {
            readResult = readUntilCStyleCommentEnd(sql, readResult.unreadStartIndex)
          }
          break
        case DELIMITER_KEYWORD:
          break
        default:
          // This should never happen
          throw new Error(`Unknown token '${readResult.exp}'`)
      }
    }
  } while (readResult.exp !== null)
  return context.splitResult
}
