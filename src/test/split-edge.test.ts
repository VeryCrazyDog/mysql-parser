/* eslint-disable @typescript-eslint/quotes */

// Import 3rd party modules
import test from 'ava'

// Import module to be tested
import { split } from '../index'

// Test cases
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
