/* eslint-disable @typescript-eslint/quotes */

// Import 3rd party modules
import test from 'ava'

// Import module to be tested
import { splitIncludeSourceMap } from '../src/index'

test('should include original positions', t => {
    const output = splitIncludeSourceMap([
      "delimiter $$",
      "SELECT * FROM table1$$",
      "delimiter ;;",
      "SELECT t.id FROM table2 t WHERE status = 'pending';;",
      "DELIMITER ;",
      "UPDATE table2 SET count=count+1 WHERE status = 'pending';"
    ].join('\n'))
    t.deepEqual(output, [
      {
        stmt: 'SELECT * FROM table1',
        start: 12,
        end: 35,
      },
      {
        stmt: "SELECT t.id FROM table2 t WHERE status = 'pending'",
        start: 48,
        end: 101,
      },
      {
        stmt: "UPDATE table2 SET count=count+1 WHERE status = 'pending'",
        start: 113,
        end: 171,
      }
    ])
  })
  