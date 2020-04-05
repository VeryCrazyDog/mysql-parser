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
  SELECT 1;
  SELECT 2;
  DELIMITER ;;
  SELECT 3;;
  DELIMITER $$
  SELECT 4$$
  DELIMITER ;
  SELECT 5;
  SELECT 6;
`)
// Print [
//   'SELECT 1', 'SELECT 2', 'SELECT 3',
//   'SELECT 4', 'SELECT 5', 'SELECT 6'
// ]
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
  DELIMITER $$
  SELECT 4$$
  DELIMITER ;
  SELECT 5;
  SELECT 6;
`, { multipleStatements: true })
// Print [
//   "SELECT 1;\nSELECT 2;",
//   "SELECT 3",
//   "SELECT 4",
//   "SELECT 5;\nSELECT 6;"
// ]
console.log(JSON.stringify(splitResult))
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
