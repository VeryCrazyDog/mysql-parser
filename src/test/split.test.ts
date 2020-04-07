/* eslint-disable @typescript-eslint/quotes */

// Import 3rd party modules
import test from 'ava'

// Import module to be tested
import { split } from '../index'

// Test cases
// eslint-disable-next-line max-len
// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql.spec.ts#L12
test('correct split many query', t => {
  const output = split('SELECT * FROM `table1`;SELECT * FROM `table2`;')
  t.deepEqual(output, [
    'SELECT * FROM `table1`',
    'SELECT * FROM `table2`'
  ])
})

// eslint-disable-next-line max-len
// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql.spec.ts#L21
test('delete empty query', t => {
  const output = split(';;;\n;;SELECT * FROM `table1`;;;;;SELECT * FROM `table2`;;; ;;;')
  t.deepEqual(output, [
    'SELECT * FROM `table1`',
    'SELECT * FROM `table2`'
  ])
})

// eslint-disable-next-line max-len
// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql.spec.ts#L30
test('test double dash comments, with nested and escaped quotes', t => {
  const output = split([
    '',
    '    SELECT col FROM -- comment',
    `    \`table1\` AS ' \\' "\` -- not a "comment\`';`,
    '  '
  ].join('\r\n'))
  t.deepEqual(output, [
    [
      'SELECT col FROM ',
      `    \`table1\` AS ' \\' "\` -- not a "comment\`'`
    ].join('\r\n')
  ])
})

// eslint-disable-next-line max-len
// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql.spec.ts#L41
test('test c-style comments, with nested and escaped quotes', t => {
  const output = split([
    '',
    `    SELECT col FROM /* comment */ \`table1\` AS ' \\' "\` -/* not a " comment */ \`';`,
    '  '
  ].join('\r\n'))
  t.deepEqual(output, [
    `SELECT col FROM  \`table1\` AS ' \\' "\` -/* not a " comment */ \`'`
  ])
})

// eslint-disable-next-line max-len
// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql.spec.ts#L50
test('test hash comments, with nested and escaped quotes', t => {
  const output = split([
    '',
    `    SELECT col FROM #comment`,
    `    \`table1\` AS ' \\' "\` -#not a " comment */ \`';`,
    '  '
  ].join('\r\n'))
  t.deepEqual(output, [
    [
      'SELECT col FROM ',
      `    \`table1\` AS ' \\' "\` -#not a " comment */ \`'`
    ].join('\r\n')
  ])
})

// eslint-disable-next-line max-len
// https://github.com/Bajdzis/vscode-database/blob/1cbe33bd63330d08c931fc8ef46d199f0c8ae597/src/extension/engine/mysql.spec.ts#L61
test('test misc comments, with nested and escaped quotes', t => {
  const output = split([
    '',
    `    SELECT col FROM #comment`,
    `    --`,
    `    -- a comment`,
    `    \`table1\` AS ' \\' "\` -#not a " comment /* neither */ \`';#comment`,
    '  '
  ].join('\r\n'))
  t.deepEqual(output, [
    [
      `SELECT col FROM `,
      `    `,
      `    `,
      `    \`table1\` AS ' \\' "\` -#not a " comment /* neither */ \`'`
    ].join('\r\n')
  ])
})

test('should split correctly when SQL command in single quoted string', t => {
  const input = [
    `SELECT 'SELECT "text1";' AS val`,
    `SELECT 'SELECT "text2";' AS val`
  ]
  const output = split(input.join(';') + ';')
  t.deepEqual(output, input)
})

test('should split correctly when in double quoted string', t => {
  const input = [
    `SELECT "SELECT 'text1';" AS val`,
    `SELECT "SELECT 'text2';" AS val`
  ]
  const output = split(input.join(';\n') + ';')
  t.deepEqual(output, input)
})

test('should split correctly when in single quoted national character set string', t => {
  const input = [
    `SELECT n'SELECT "text1";' AS val`,
    `SELECT n'SELECT "text2";' AS val`
  ]
  const output = split(input.join(';\n') + ';')
  t.deepEqual(output, input)
})

test('should split correctly when SQL command in quoted field name', t => {
  const input = [
    "SELECT 'text1' AS `SELECT 'text';`",
    "SELECT 'text2' AS `SELECT 'text';`"
  ]
  const output = split(input.join(';\n') + ';')
  t.deepEqual(output, input)
})

test('should handle special C style comment ending correctly', t => {
  const input = [
    '/*',
    'SELECT 1;',
    'SELECT 2;',
    '/*/',
    'SELECT 3;',
    '/* xxxx */',
    'SELECT 4;'
  ]
  const output = split(input.join('\n'))
  t.deepEqual(output, ['SELECT 4'])
})

test('should retain C style comments start with `/*!`', t => {
  const input = [
    "SHOW VARIABLES LIKE '%character_set_client%'",
    '/*!40101 SET character_set_client = big5 */',
    "SHOW VARIABLES LIKE '%character_set_client%'"
  ]
  const output = split(input.join(';\n') + ';')
  t.deepEqual(output, input)
})

test('should retain C style comments start with `/*+`', t => {
  const input = [
    "SHOW VARIABLES LIKE '%character_set_client%'",
    'SELECT /*+ BKA(t1) */ 1 FROM dual',
    "SHOW VARIABLES LIKE '%character_set_client%'"
  ]
  const output = split(input.join(';\n') + ';')
  t.deepEqual(output, input)
})

test('should handle double backtick', t => {
  const input = [
    'CREATE TABLE `a``b` (`c"d` INT)',
    'CREATE TABLE `a````b` (`c"d` INT)'
  ]
  const output = split(input.join(';\n') + ';')
  t.deepEqual(output, input)
})

test('should drop statement after delimiter command', t => {
  const output = split('DELIMITER $$  SELECT 2;')
  t.deepEqual(output, [])
})

test('should not treat \\G as delimiter', t => {
  const input = [
    'SELECT 1\\G',
    'SELECT 2\\G'
  ].join('\n')
  const output = split(input)
  t.deepEqual(output, [input])
})

test('should ignore invalid delimiter command', t => {
  const output = split([
    'SELECT 1;',
    'DELIMITER    ',
    'SELECT 2;'
  ].join('\n'))
  t.deepEqual(output, [
    'SELECT 1',
    'SELECT 2'
  ])
})

test('should combine compatible statements', t => {
  const output = split([
    'SELECT 1;',
    'SELECT 2;',
    'DELIMITER ;;',
    'SELECT 3;;',
    'DELIMITER $$',
    'SELECT 4$$',
    'DELIMITER ;',
    "SELECT '--- 5; ---';",
    'SELECT 6;'
  ].join('\n'), { multipleStatements: true })
  t.deepEqual(output, [
    [
      'SELECT 1;',
      'SELECT 2;',
      'SELECT 3;',
      'SELECT 4;',
      "SELECT '--- 5; ---';",
      'SELECT 6;'
    ].join('\n')
  ])
})
