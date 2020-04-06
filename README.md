# @verycrazydog/mysql-parser
A parser for MySQL statements. The current goal is to solve the [missing DELIMITER syntax support][1]
in Node.js module [mysql][mysqljs/mysql].

[![Version on npm]][mysql-parser]
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
  DELIMITER $$
  SELECT 2$$
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
  DELIMITER ;;
  SELECT 3;;
  DELIMITER ;
  SELECT 4;
`, { multipleStatements: true })
// Print ["SELECT 1;\nSELECT 2;","SELECT 3","SELECT 4;"]
console.log(JSON.stringify(splitResult))
```

A more extensive complete example
```js
const util = require('util')
const mysql = require('mysql')
const mysqlParser = require('@verycrazydog/mysql-parser')

const ENABLE_MULTI_STATEMENT = true

;(async () => {
  const rawConn = mysql.createConnection({
    host: 'localhost',
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
    DELIMITER ;
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
  //   Done! Query count: 3
  console.log('Done! Query count:', queryCount)
})()
```


## License
This module is licensed under the [MIT License](./LICENSE).


## Acknowledge
This module was built by referencing the following materials:
- [Support DELIMITER syntax issue][1] on Node.js module [mysql][mysqljs/mysql].
- [MySQL parser implementation][2] and [test cases implementation][3] in VS Code extension
  [vscode-database].



[1]: https://github.com/mysqljs/mysql/issues/1683
[2]: https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql-pass.ts
[3]: https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql.spec.ts
[Build status]: https://img.shields.io/github/workflow/status/VeryCrazyDog/mysql-parser/Node.js%20CI
[Build workflow]: https://github.com/VeryCrazyDog/mysql-parser/actions?query=workflow%3A%22Node.js+CI%22
[mysqljs/mysql]: https://github.com/mysqljs/mysql
[mysql-parser]: https://www.npmjs.com/package/@verycrazydog/mysql-parser
[Version on npm]: https://img.shields.io/npm/v/@verycrazydog/mysql-parser
[vscode-database]: https://github.com/Bajdzis/vscode-database
