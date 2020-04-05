# mysql-parser
A parser for MySQL statements. The current goal is to solve the [missing DELIMITER syntax support][1]
in Node.js module [mysql][mysqljs/mysql].


## Usage
Split into an array of MySQL statement, one statement per array item
```js
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
// Print [ 'SELECT 1', 'SELECT 2', 'SELECT 3', 'SELECT 4', 'SELECT 5', 'SELECT 6' ]
console.log(splitResult)
```

Split into an array of MySQL statement, allow multiple statements per array item
```js
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
// Print [ "SELECT 1;\nSELECT 2;", "SELECT 3", "SELECT 4", "SELECT 5;\nSELECT 6;" ]
console.log(JSON.stringify(splitResult))
```


## License
This module is licensed under the [MIT License](./LICENSE).


## Acknowledge
This module was built by referencing the following materials:
- [Support DELIMITER syntax issue][1] on Node.js module [mysql][mysqljs/mysql].
- [MySQL parser implementation][2] in VS Code extension [vscode-database].



[1]: https://github.com/mysqljs/mysql/issues/1683
[2]: https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql-pass.ts
[mysqljs/mysql]: https://github.com/mysqljs/mysql
[vscode-database]: https://github.com/Bajdzis/vscode-database
