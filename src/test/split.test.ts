// Import built-in modules
import { join } from 'path'
import { promises as fs } from 'fs'

// Import 3rd party modules
import test from 'ava'

// Import module to be tested
import { split } from '../index'

// Test cases
test('TODO add description', async (t) => {
  const sql = await fs.readFile(join(__dirname, 'data', 'school.sql'), 'utf8')
  const statements = split(sql)
  for (const stat of statements) {
    console.log('------------------------- BREAK -------------------------')
    console.log(stat.trim())
  }
})
