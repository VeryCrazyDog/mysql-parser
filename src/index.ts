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
  multipleStatements: boolean
  unread: string
  currentDelimiter: string
  currentStatement: string
  splitResult: string[]
}

interface FindExpResult {
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

function findExp (content: string, regex: RegExp): FindExpResult {
  const match = content.match(regex)
  let result: FindExpResult
  if (match?.index !== undefined) {
    result = {
      expIndex: match.index,
      exp: match[0],
      unreadStartIndex: match.index + match[0].length
    }
  } else {
    result = {
      expIndex: -1,
      exp: null,
      unreadStartIndex: content.length
    }
  }
  return result
}

function findKeyToken (content: string, currentDelimiter: string): FindExpResult {
  let regex
  if (currentDelimiter === SEMICOLON) {
    regex = semicolonKeyTokenRegex
  } else {
    regex = buildKeyTokenRegex(currentDelimiter)
  }
  return findExp(content, regex)
}

function findEndQuote (content: string, quote: string): FindExpResult {
  if (!(quote in quoteEndRegexDict)) {
    throw new TypeError(`Incorrect quote ${quote} supplied`)
  }
  return findExp(content, quoteEndRegexDict[quote])
}

function findNewLine (content: string): FindExpResult {
  return findExp(content, newLineRegex)
}

function findCStyleCommentEnd (content: string): FindExpResult {
  return findExp(content, cStyleCommentEndRegex)
}

function read (context: SplitExecutionContext, readToIndex: number, nextUnreadIndex?: number): void {
  context.currentStatement += context.unread.slice(0, readToIndex)
  if (nextUnreadIndex !== undefined && nextUnreadIndex > 0) {
    context.unread = context.unread.slice(nextUnreadIndex)
  } else {
    context.unread = context.unread.slice(readToIndex)
  }
}

function discard (context: SplitExecutionContext, nextUnreadIndex: number): void {
  if (nextUnreadIndex > 0) {
    context.unread = context.unread.slice(nextUnreadIndex)
  }
}

function publishStatement (context: SplitExecutionContext): void {
  const currentStatement = context.currentStatement.trim()
  if (currentStatement !== '') {
    if (!context.multipleStatements) {
      context.splitResult.push(currentStatement)
    } else {
      if (context.currentDelimiter === SEMICOLON) {
        if (context.splitResult.length === 0) {
          context.splitResult.push('')
        }
        context.splitResult[context.splitResult.length - 1] += currentStatement + SEMICOLON + '\n'
      } else {
        context.splitResult.push(currentStatement)
      }
    }
  }
  context.currentStatement = ''
}

function handleKeyTokenReadResult (context: SplitExecutionContext, readResult: FindExpResult): void {
  switch (readResult.exp?.trim()) {
    case context.currentDelimiter:
      read(context, readResult.expIndex, readResult.unreadStartIndex)
      publishStatement(context)
      break
    case SINGLE_QUOTE:
    case DOUBLE_QUOTE:
    case BACKTICK: {
      read(context, readResult.unreadStartIndex)
      const readQuoteResult = findEndQuote(context.unread, readResult.exp)
      read(context, readQuoteResult.unreadStartIndex)
      break
    }
    case DOUBLE_DASH_COMMENT_START: {
      read(context, readResult.expIndex, readResult.expIndex + DOUBLE_DASH_COMMENT_START.length)
      const readCommentResult = findNewLine(context.unread)
      discard(context, readCommentResult.expIndex)
      break
    }
    case HASH_COMMENT_START: {
      read(context, readResult.expIndex, readResult.unreadStartIndex)
      const readCommentResult = findNewLine(context.unread)
      discard(context, readCommentResult.expIndex)
      break
    }
    case C_STYLE_COMMENT_START: {
      if (['!', '+'].includes(context.unread[readResult.unreadStartIndex])) {
        // Should not be skipped, see https://dev.mysql.com/doc/refman/5.7/en/comments.html
        read(context, readResult.unreadStartIndex)
        const readCommentResult = findCStyleCommentEnd(context.unread)
        read(context, readCommentResult.unreadStartIndex)
      } else {
        read(context, readResult.expIndex, readResult.unreadStartIndex)
        const readCommentResult = findCStyleCommentEnd(context.unread)
        discard(context, readCommentResult.unreadStartIndex)
      }
      break
    }
    case DELIMITER_KEYWORD:
      // TODO Implement
      break
    case undefined:
    case null:
      read(context, readResult.unreadStartIndex)
      publishStatement(context)
      break
    default:
      // This should never happen
      throw new Error(`Unknown token '${readResult.exp ?? '(null)'}'`)
  }
}

export function split (sql: string, options?: SplitOptions): string[] {
  options = options ?? {}
  const multipleStatements = options.multipleStatements ?? false

  const context: SplitExecutionContext = {
    multipleStatements,
    unread: sql,
    currentDelimiter: SEMICOLON,
    currentStatement: '',
    splitResult: []
  }
  let readResult: FindExpResult = {
    expIndex: -1,
    exp: null,
    unreadStartIndex: 0
  }
  let lastUnreadLength
  do {
    lastUnreadLength = context.unread.length
    readResult = findKeyToken(context.unread, context.currentDelimiter)
    handleKeyTokenReadResult(context, readResult)
    // Prevent infinite loop by returning incorrect result
    if (lastUnreadLength === context.unread.length) {
      read(context, context.unread.length)
    }
  } while (context.unread !== '')
  publishStatement(context)
  return context.splitResult
}
