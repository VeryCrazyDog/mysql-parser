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
test.before(async () => {
  const sql = await fs.readFile(join(__dirname, 'data', 'school-mysqldump.sql'), 'utf8')
  statements = split(sql)
})

// Test cases
test('should have correct 1st statement', t => {
  t.is(statements[0], '/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */')
})

test('should have correct 2nd statement', t => {
  t.is(statements[1], '/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */')
})

test('should have correct 3rd statement', t => {
  t.is(statements[2], '/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */')
})

test('should have correct 4th statement', t => {
  t.is(statements[3], '/*!40101 SET NAMES utf8 */')
})

test('should have correct 5th statement', t => {
  t.is(statements[4], '/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */')
})

test('should have correct 6th statement', t => {
  t.is(statements[5], "/*!40103 SET TIME_ZONE='+00:00' */")
})

test('should have correct 7th statement', t => {
  t.is(statements[6], '/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */')
})

test('should have correct 8th statement', t => {
  t.is(statements[7], '/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */')
})

test('should have correct 9th statement', t => {
  t.is(statements[8], "/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */")
})

test('should have correct 10th statement', t => {
  t.is(statements[9], '/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */')
})
