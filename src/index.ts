'use strict'

const path = require('path')
const fs = require('fs')

// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql-pass.ts#L156
/**
 * @param {string} sql - a SQL string
 * @return {string} - the SQL string without comments
 */
function removeComments (sql) {
  const quotes = /^((?:[^"`']*?(?:(?:"(?:[^"]|\\")*?(?<!\\)")|(?:'(?:[^']|\\')*?(?<!\\)')|(?:`(?:[^`]|\\`)*?(?<!\\)`)))*?[^"`']*?)/
  const cStyleComments = new RegExp(quotes.source + '/\\*.*?\\*/')
  const doubleDashComments = new RegExp(quotes.source + '--(?:(?:[ \t]+.*(\r\n|\n|\r)?)|(\r\n|\n|\r)|$)')
  const hashComments = new RegExp(quotes.source + '#.*(\r\n|\n|\r)?')
  while (sql.match(cStyleComments)) sql = sql.replace(cStyleComments, '$1')
  while (sql.match(doubleDashComments)) sql = sql.replace(doubleDashComments, '$1$2$3')
  while (sql.match(hashComments)) sql = sql.replace(hashComments, '$1$2')
  return sql
}

// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql-pass.ts#L122
/**
 * @param {string} sql - queries
 * @return {string[]}
 */
function splitQueries (sqlMulti) {
  const quotes = /^((?:[^"`']*?(?:(?:"(?:[^"]|\\")*?(?<!\\)")|(?:'(?:[^']|\\')*?(?<!\\)')|(?:`(?:[^`]|\\`)*?(?<!\\)`)))*?[^"`']*?)/
  const delimiterRegex = /^(?:\r\n|[ \t\r\n])*DELIMITER[\t ]*(.*?)(?:\r\n|\n|\r|$)/i
  const queries = []; let match = []; let delimiter = ';'
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
    if (!sql) {
      return false
    }
    const notEmpty = (sql.trim().replace(/(\r\n|\n|\r)/gm, '') !== '')
    return !!notEmpty
  })
}

;(async () => {
  const sql = await fs.promises.readFile(path.join(__dirname, 'test', 'data', 'school.sql'), 'utf8')
  const statements = splitQueries(removeComments(sql))
  for (const stat of statements) {
    console.log('------------------------- BREAK -------------------------')
    console.log(stat.trim())
  }
})().catch(err => console.log(err.stack))
