// Import built-in modules
import { join } from 'path'
import { promises as fs } from 'fs'

// Import 3rd party modules
import test from 'ava'

// Import module to be tested
import { split } from '../index'

// Variables
let statements: string[]

// Initialize
test.before(async t => {
  const sql = await fs.readFile(join(__dirname, 'data', 'school.sql'), 'utf8')
  statements = split(sql)
})

// Test cases
test.skip('should have correct 1st statement', t => {
  t.is(statements[0], [
    '-- -----------------------------------------------------------------------------',
    '-- Create database',
    '-- -----------------------------------------------------------------------------',
    'DROP DATABASE IF EXISTS school'
  ].join('\r\n'))
})

test.skip('should have correct 2nd statement', t => {
  t.is(statements[1], 'CREATE DATABASE school DEFAULT CHARACTER SET utf8mb4')
})

test.skip('should have correct 3rd statement', t => {
  t.is(statements[2], 'USE school')
})

test.skip('should have correct 4th statement', t => {
  t.is(statements[3], [
    '-- -----------------------------------------------------------------------------',
    '-- Create tables',
    '-- -----------------------------------------------------------------------------',
    'CREATE TABLE students (',
    '  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,',
    '  name VARCHAR(50) NOT NULL,',
    '  code VARCHAR(10) NOT NULL,',
    '  gender CHAR,',
    '  birthday DATE,',
    '  version INT NOT NULL DEFAULT 1,',
    '  created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,',
    '  modified_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,',
    '  INDEX ix_name (name),',
    '  UNIQUE uk_code (code)',
    ')'
  ].join('\r\n'))
})

test.skip('should have correct 5th statement', t => {
  t.is(statements[4], [
    'CREATE TABLE students_history (',
    '  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,',
    '  student_id INT NOT NULL,',
    '  version INT NOT NULL,',
    '  action CHAR NOT NULL,',
    '  action_time TIMESTAMP NOT NULL,',
    '  name VARCHAR(50) NOT NULL,',
    '  code VARCHAR(10) NOT NULL,',
    '  gender CHAR,',
    '  birthday DATE,',
    '  created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,',
    '  modified_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,',
    '  UNIQUE uk_student_id_version (student_id, version)',
    ')'
  ].join('\r\n'))
})