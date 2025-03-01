const SINGLE_QUOTE = "'"
const DOUBLE_QUOTE = '"'
const BACKTICK = '`'
const DOUBLE_DASH_COMMENT_START = '--'
const HASH_COMMENT_START = '#'
const C_STYLE_COMMENT_START = '/*'
const SEMICOLON = ';'
const LINE_FEED = '\n'
const DELIMITER_KEYWORD = 'DELIMITER'

export interface SplitOptions {
  multipleStatements?: boolean
  retainComments?: boolean
  includePositions?: boolean
}

interface SqlStatement {
  value: string
  supportMulti: boolean
  start: number
  end: number
}

interface SplitExecutionContext extends Required<SplitOptions> {
  unread: string
  position: number
  currentDelimiter: string
  currentStatement: SqlStatement
  output: SqlStatement[]
}

interface FindExpResult {
  expIndex: number
  exp: string | null
  nextIndex: number
}

const regexEscapeSetRegex = /[-/\\^$*+?.()|[\]{}]/g
const singleQuoteStringEndRegex = /(?<!\\)'/
const doubleQuoteStringEndRegex = /(?<!\\)"/
const backtickQuoteEndRegex = /(?<!`)`(?!`)/
const doubleDashCommentStartRegex = /--[ \f\n\r\t\v]/
const cStyleCommentStartRegex = /\/\*/
const cStyleCommentEndRegex = /(?<!\/)\*\//
const newLineRegex = /(?:[\r\n]+|$)/
const delimiterStartRegex = /(?:^|[\n\r]+)[ \f\t\v]*DELIMITER[ \t]+/i
// Best effort only, unable to find a syntax specification on delimiter
const delimiterTokenRegex = /^(?:'(.+)'|"(.+)"|`(.+)`|([^\s]+))/
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
      nextIndex: match.index + match[0].length
    }
  } else {
    result = {
      expIndex: -1,
      exp: null,
      nextIndex: content.length
    }
  }
  return result
}

function findKeyToken (content: string, currentDelimiter: string): FindExpResult {
  let regex: RegExp
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

function read (
  context: SplitExecutionContext,
  readToIndex: number,
  nextUnreadIndex?: number,
  checkSemicolon?: boolean
): void {
  const readContent = context.unread.slice(0, readToIndex)
  if ((checkSemicolon ?? true) && readContent.includes(SEMICOLON)) {
    context.currentStatement.supportMulti = false
  }
  context.currentStatement.value += readContent
  let consumed = 0
  if (nextUnreadIndex !== undefined && nextUnreadIndex > 0) {
    consumed = nextUnreadIndex
    context.unread = context.unread.slice(nextUnreadIndex)
  } else {
    consumed = readToIndex
    context.unread = context.unread.slice(readToIndex)
  }
  context.position += consumed
}

function readTillNewLine (context: SplitExecutionContext, checkSemicolon?: boolean): void {
  const findResult = findExp(context.unread, newLineRegex)
  read(context, findResult.expIndex, findResult.expIndex, checkSemicolon)
}

function discard (context: SplitExecutionContext, nextUnreadIndex: number): void {
  if (nextUnreadIndex > 0) {
    context.unread = context.unread.slice(nextUnreadIndex)
    context.position += nextUnreadIndex
  }
}

function discardTillNewLine (context: SplitExecutionContext): void {
  const findResult = findExp(context.unread, newLineRegex)
  discard(context, findResult.expIndex)
}

function publishStatementInMultiMode (
  splitOutput: SqlStatement[],
  currentStatement: SqlStatement,
  currentPos: number,
  includePositions: boolean
): void {
  if (splitOutput.length === 0) {
    let stmt: SqlStatement = { value: '', supportMulti: true }
    if (includePositions) {
      stmt.start = currentStatement.start
      stmt.end = currentPos
    }
    splitOutput.push(stmt)
  }
  const lastSplitResult = splitOutput[splitOutput.length - 1]
  if (currentStatement.supportMulti) {
    if (lastSplitResult.supportMulti) {
      if (lastSplitResult.value !== '' && !lastSplitResult.value.endsWith(LINE_FEED)) {
        lastSplitResult.value += LINE_FEED
      }
      lastSplitResult.value += currentStatement.value + SEMICOLON
      if (includePositions) {
        lastSplitResult.end = currentPos
      }
    } else {
      let stmt: SqlStatement = { value: currentStatement.value + SEMICOLON, supportMulti: true }
      if (includePositions) {
        stmt.start = currentStatement.start
        stmt.end = currentPos
      }
      splitOutput.push(stmt)
    }
  } else {
    let stmt: SqlStatement = { value: currentStatement.value, supportMulti: false }
    if (includePositions) {
      stmt.start = currentStatement.start
      stmt.end = currentPos
    }
    splitOutput.push(stmt)
  }
}

function publishStatement (context: SplitExecutionContext): void {
  const trimmed = context.currentStatement.value.trim()
  if (trimmed !== '') {
    if (!context.multipleStatements) {
      if (context.includePositions) {
        context.output.push({
          value: trimmed,
          supportMulti: context.currentStatement.supportMulti,
          start: context.currentStatement.start,
          end: context.position
        })
      } else {
        context.output.push({
          value: trimmed,
          supportMulti: context.currentStatement.supportMulti
        })
      }
    } else {
      context.currentStatement.value = trimmed
      if (context.includePositions) {
        context.currentStatement.end = context.position
      }
      publishStatementInMultiMode(context.output, context.currentStatement, context.position, context.includePositions)
    }
  }
  // Reset current statement for the next statement.
  context.currentStatement.value = ''
  context.currentStatement.supportMulti = true
  if (context.includePositions) {
    context.currentStatement.start = context.position
  }
}

export type SqlStatementResult = string | { stmt: string, start: number, end: number };

export function split (sql: string, options?: SplitOptions): SqlStatementResult[] {
  const context: SplitExecutionContext = {
    multipleStatements: options?.multipleStatements ?? false,
    retainComments: options?.retainComments ?? false,
    includePositions: options?.includePositions ?? false,
    unread: sql,
    position: 0,
    currentDelimiter: SEMICOLON,
    currentStatement: {
      value: '',
      supportMulti: true,
      start: 0
    },
    output: []
  }
  let findResult: FindExpResult = {
    expIndex: -1,
    exp: null,
    nextIndex: 0
  }
  let lastUnreadLength: number
  do {
    lastUnreadLength = context.unread.length
    findResult = findKeyToken(context.unread, context.currentDelimiter)
    handleKeyTokenFindResult(context, findResult)
    // Prevent infinite loop by returning incorrect result
    if (lastUnreadLength === context.unread.length) {
      read(context, context.unread.length)
    }
  } while (context.unread !== '')
  publishStatement(context)
  // Return either the list of statements or their positions as well.
  return context.includePositions
    ? context.output.map(v => ({ stmt: v.value, start: v.start!, end: v.end! }))
    : context.output.map(v => v.value)
}

function handleKeyTokenFindResult (context: SplitExecutionContext, findResult: FindExpResult): void {
  // ignore case of delimiter command
  switch (findResult.exp?.trim().toUpperCase()) {
    case context.currentDelimiter:
      read(context, findResult.expIndex, findResult.nextIndex)
      publishStatement(context)
      break
    case SINGLE_QUOTE:
    case DOUBLE_QUOTE:
    case BACKTICK: {
      read(context, findResult.nextIndex)
      const findQuoteResult = findEndQuote(context.unread, findResult.exp)
      read(context, findQuoteResult.nextIndex, undefined, false)
      break
    }
    case DOUBLE_DASH_COMMENT_START: {
      if (context.retainComments) {
        read(context, findResult.nextIndex)
        readTillNewLine(context, false)
      } else {
        read(context, findResult.expIndex, findResult.expIndex + DOUBLE_DASH_COMMENT_START.length)
        discardTillNewLine(context)
      }
      break
    }
    case HASH_COMMENT_START: {
      if (context.retainComments) {
        read(context, findResult.nextIndex)
        readTillNewLine(context, false)
      } else {
        read(context, findResult.expIndex, findResult.nextIndex)
        discardTillNewLine(context)
      }
      break
    }
    case C_STYLE_COMMENT_START: {
      if (['!', '+'].includes(context.unread[findResult.nextIndex]) || context.retainComments) {
        // Should not be skipped, see https://dev.mysql.com/doc/refman/5.7/en/comments.html
        read(context, findResult.nextIndex)
        const findCommentResult = findExp(context.unread, cStyleCommentEndRegex)
        read(context, findCommentResult.nextIndex)
      } else {
        read(context, findResult.expIndex, findResult.nextIndex)
        const findCommentResult = findExp(context.unread, cStyleCommentEndRegex)
        discard(context, findCommentResult.nextIndex)
      }
      break
    }
    case DELIMITER_KEYWORD: {
      // Instead of appending the delimiter command text, discard it.
      discard(context, findResult.nextIndex)
      const matched = context.unread.match(delimiterTokenRegex)
      if (matched?.index !== undefined) {
        context.currentDelimiter = matched[0].trim()
        discard(context, matched[0].length)
      }
      discardTillNewLine(context)
      // Reset the start position for the next statement so that the delimiter command is not included.
      if (context.includePositions) {
        context.currentStatement.start = context.position
      }
      break
    }
    case undefined:
    case null:
      read(context, findResult.nextIndex)
      publishStatement(context)
      break
    default:
      // This should never happen
      throw new Error(`Unknown token '${findResult.exp ?? '(null)'}'`)
  }
}
