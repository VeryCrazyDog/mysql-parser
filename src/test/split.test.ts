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
test.skip('test c-style comments, with nested and escaped quotes', t => {
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
test.skip('test misc comments, with nested and escaped quotes', t => {
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
