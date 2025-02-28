# @verycrazydog/mysql-parser
A parser for MySQL statements. The current goal is to provide a solution to the
[missing DELIMITER syntax support][1] in Node.js module [mysql][mysqljs/mysql] with
the aim to support MySQL dump file and common usage scenario.

[![Version on npm]][mysql-parser]
[![Supported Node.js version]][Node.js download]
[![Build status]][Build workflow]


## Install
```
npm install @verycrazydog/mysql-parser
```


## Usage
Split into an array of MySQL statement, one statement per array item
```js
const mysqlParser = require('@verycrazydog/mysql-parser')
const splitResult = mysqlParser.split(`
  -- Comment is removed
  SELECT 1;
  DELIMITER ;;
  SELECT 2;;
  DELIMITER ;
  SELECT 3;
`)
// Print [ 'SELECT 1', 'SELECT 2', 'SELECT 3' ]
console.log(splitResult)
```

Split into an array of MySQL statement, allow multiple statements per array item
```js
const mysqlParser = require('@verycrazydog/mysql-parser')
const splitResult = mysqlParser.split(`
  SELECT 1;
  SELECT 2;
  DELIMITER $$
  SELECT 3$$
  DELIMITER ;
  SELECT 4;
`, { multipleStatements: true })
// Print ["SELECT 1;\nSELECT 2;\nSELECT 3;\nSELECT 4;"]
console.log(JSON.stringify(splitResult))
```

Split into an array of MySQL statement, retaining comments
```js
const mysqlParser = require('@verycrazydog/mysql-parser')
const splitResult = mysqlParser.split([
  '-- Comment is retained',
  'SELECT 1;',
  'SELECT 2;'
].join('\n'), { retainComments: true })
// Print [ '-- Comment is retained\nSELECT 1', 'SELECT 2' ]
console.log(splitResult)
```

Include orginal positions from where the statement was parsed
```js
const mysqlParser = require('@verycrazydog/mysql-parser')
const splitResult = mysqlParser.split([
  'delimiter $$',
  'SELECT 1$$',
  'delimiter ;',
  'SELECT 2;'
].join('\n'), { includePositions: true })
// Print
// [
//   { stmt: "SELECT 1", start: 12, end: 23 },
//   { stmt: "SELECT 2", start: 35, end: 45 }
// ]
// 
console.log(splitResult)
```

A more extensive example
```js
const util = require('util')
const mysql = require('mysql')
const mysqlParser = require('@verycrazydog/mysql-parser')

// Try change this to see the effect of `multipleStatements` option
const ENABLE_MULTI_STATEMENT = true

;(async () => {
  const rawConn = mysql.createConnection({
    host: 'my_host',
    user: 'my_username',
    password: 'my_password',
    multipleStatements: ENABLE_MULTI_STATEMENT
  })
  const conn = {
    raw: rawConn,
    connect: util.promisify(rawConn.connect).bind(rawConn),
    query: util.promisify(rawConn.query).bind(rawConn),
    end: util.promisify(rawConn.end).bind(rawConn)
  }
  const sqlFile = `
    SELECT 'Hello world!' message FROM dual;
    DELIMITER $$
    SELECT 'DELIMITER is supported!' message FROM dual$$
    DELIMITER ;    SELECT 'Same as MySQL client, this will not print out' message FROM dual;
    /*! SELECT "'/*!' style comment is executed!" message FROM dual */;
    -- multipleStatements option allows statements that can be separated by
    /* semicolon combined together in one, allowing to send to server in one */
    ## batch, reducing execution time on high latency network
    SELECT 'Goodbye world!' message FROM dual;
  `
  const sqls = mysqlParser.split(sqlFile, { multipleStatements: ENABLE_MULTI_STATEMENT })
  let queryCount = 0
  await conn.connect()
  try {
    sqls.forEach(async sql => {
      const queryResults = await conn.query(sql)
      queryCount++
      queryResults.forEach(queryResult => {
        if (!(queryResult instanceof Array)) {
          queryResult = [queryResult]
        }
        queryResult.forEach(row => console.log(row.message))
      })
    })
  } finally {
    await conn.end()
  }
  // Print:
  //   Hello world!
  //   DELIMITER is supported!
  //   '/*!' style comment is executed!
  //   Goodbye world!
  //   Done! Query count: 1
  console.log('Done! Query count:', queryCount)
})()
```


## Limitation
Some limitations of this module which are currently not addressed:
- MySQL client will return *DELIMITER cannot contain a backslash character* if backslash
  is used such as `DELIMITER \\`, however this module will not throw any error and will
  ignore the `DELIMITER` line.
- MySQL client support `\g` and `\G` as delimiter, however this module will not treat
  them as delimiter.
- MySQL client will return *DELIMITER must be followed by a 'delimiter' character or string*
  if there is nothing specified after keyword `DELIMITER`, however this module will not throw
  any error and will ignore the `DELIMITER` line.


## License
This module is licensed under the [MIT License](./LICENSE).


## Acknowledge
This module was built by referencing the following materials:
- [Support DELIMITER syntax issue][1] on Node.js module [mysql][mysqljs/mysql].
- [MySQL parser implementation][2] and [test cases implementation][3] in VS Code extension
  [vscode-database].


## Related
Below are some modules found to be related to the goal of this module during development:
- [exec-sql]: Execute MySQL SQL files in directories.
- [execsql]: Execute you *.sql file which contains multiple sql statements.
- [sql-ast]: Parse the output of mysqldump into an AST.
- [sql-parser][4]: A SQL parser written in pure JS.



[1]: https://github.com/mysqljs/mysql/issues/1683
[2]: https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql-pass.ts
[3]: https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql.spec.ts
[4]: https://github.com/forward/sql-parser
[Build status]: https://github.com/VeryCrazyDog/mysql-parser/workflows/CI/badge.svg
[Build workflow]: https://github.com/VeryCrazyDog/mysql-parser/actions?query=workflow%3A%22CI%22
[execsql]: https://www.npmjs.com/package/execsql
[exec-sql]: https://www.npmjs.com/package/exec-sql
[mysqljs/mysql]: https://github.com/mysqljs/mysql
[mysql-parser]: https://www.npmjs.com/package/@verycrazydog/mysql-parser
[Node.js download]: https://nodejs.org/en/download
[sql-ast]: https://www.npmjs.com/package/sql-ast
[Supported Node.js version]: https://badgen.net/npm/node/@verycrazydog/mysql-parser
[Version on npm]: https://badgen.net/npm/v/@verycrazydog/mysql-parser
[vscode-database]: https://github.com/Bajdzis/vscode-database
