export interface SplitOptions {
  multipleStatements?: boolean
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
  // TODO Implement options
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const multipleStatements = options.multipleStatements ?? false

  return splitQueries(removeComments(sql))
}
