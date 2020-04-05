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

test('should have correct 11th statement', t => {
  t.is(statements[10], 'DROP TABLE IF EXISTS `students`')
})

test('should have correct 12th statement', t => {
  t.is(statements[11], '/*!40101 SET @saved_cs_client     = @@character_set_client */')
})

test('should have correct 13th statement', t => {
  t.is(statements[12], '/*!40101 SET character_set_client = utf8 */')
})

test('should have correct 14th statement', t => {
  t.is(statements[13], [
    'CREATE TABLE `students` (',
    '  `id` int(11) NOT NULL AUTO_INCREMENT,',
    '  `name` varchar(50) NOT NULL,',
    '  `code` varchar(10) NOT NULL,',
    '  `gender` char(1) DEFAULT NULL,',
    '  `birthday` date DEFAULT NULL,',
    "  `version` int(11) NOT NULL DEFAULT '1',",
    '  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,',
    '  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,',
    '  PRIMARY KEY (`id`),',
    '  UNIQUE KEY `uk_code` (`code`),',
    '  KEY `ix_name` (`name`)',
    ') ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4'
  ].join('\r\n'))
})

test('should have correct 15th statement', t => {
  t.is(statements[14], '/*!40101 SET character_set_client = @saved_cs_client */')
})

test('should have correct 16th statement', t => {
  t.is(statements[15], 'LOCK TABLES `students` WRITE')
})

test('should have correct 17th statement', t => {
  t.is(statements[16], '/*!40000 ALTER TABLE `students` DISABLE KEYS */')
})

test('should have correct 18th statement', t => {
  t.is(statements[17], [
    'INSERT INTO `students` VALUES ',
    "(1,'Amy','student1','F','1980-01-01',1,'2020-04-05 13:25:26','2020-04-05 13:25:26'),",
    "(2,'Benny','student2','M','1981-02-02',1,'2020-04-05 13:25:26','2020-04-05 13:25:26'),",
    "(3,'Carmen','student3','F','1981-03-03',1,'2020-04-05 13:25:26','2020-04-05 13:25:26'),",
    "(4,'David','student4','M','1980-04-04',2,'2020-04-05 13:25:26','2020-04-05 13:25:26'),",
    "(5,'Edith','student5','F','1983-05-05',1,'2020-04-05 13:25:26','2020-04-05 13:25:26')"
  ].join(''))
})

test('should have correct 19th statement', t => {
  t.is(statements[18], '/*!40000 ALTER TABLE `students` ENABLE KEYS */')
})

test('should have correct 20th statement', t => {
  t.is(statements[19], 'UNLOCK TABLES')
})

test('should have correct 21th statement', t => {
  t.is(statements[20], '/*!50003 SET @saved_cs_client      = @@character_set_client */')
})

test('should have correct 22th statement', t => {
  t.is(statements[21], '/*!50003 SET @saved_cs_results     = @@character_set_results */')
})

test('should have correct 23th statement', t => {
  t.is(statements[22], '/*!50003 SET @saved_col_connection = @@collation_connection */')
})

test('should have correct 24th statement', t => {
  t.is(statements[23], '/*!50003 SET character_set_client  = big5 */')
})

test('should have correct 25th statement', t => {
  t.is(statements[24], '/*!50003 SET character_set_results = big5 */')
})

test('should have correct 26th statement', t => {
  t.is(statements[25], '/*!50003 SET collation_connection  = big5_chinese_ci */')
})

test('should have correct 27th statement', t => {
  t.is(statements[26], '/*!50003 SET @saved_sql_mode       = @@sql_mode */')
})

test('should have correct 28th statement', t => {
  t.is(statements[27], [
    '/*!50003 SET sql_mode              = ',
    "'ONLY_FULL_GROUP_BY,",
    'STRICT_TRANS_TABLES,',
    'NO_ZERO_IN_DATE,',
    'NO_ZERO_DATE,',
    'ERROR_FOR_DIVISION_BY_ZERO,',
    "NO_ENGINE_SUBSTITUTION' */"
  ].join(''))
})

test('should have correct 29th statement', t => {
  t.is(statements[28], [
    [
      '/*!50003 CREATE*/ ',
      '/*!50017 DEFINER=`skip-grants user`@`skip-grants host`*/ ',
      '/*!50003 TRIGGER students_after_update AFTER UPDATE ON students FOR EACH ROW'
    ].join(''),
    'BEGIN',
    '  INSERT INTO students_history SET',
    '    student_id = NEW.id,',
    '    version = NEW.version,',
    "    action = 'M',",
    '    action_time = NEW.modified_time,',
    '    name = NEW.name,',
    '    code = NEW.code,',
    '    gender = NEW.gender,',
    '    birthday = NEW.birthday;',
    'END */'
  ].join('\r\n'))
})

// test('should have correct xth statement', t => {
//   t.is(statements[x], "LOCK TABLES `students_history` WRITE;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40000 ALTER TABLE `students_history` DISABLE KEYS */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "INSERT INTO `students_history` VALUES (1,1,1,'A','2020-04-04 10:25:28','Amy','student1','F','1980-01-01','2020-04-04 10:25:28','2020-04-04 10:25:28'),(2,2,1,'A','2020-04-04 10:25:28','Benny','student2','M','1981-02-02','2020-04-04 10:25:28','2020-04-04 10:25:28'),(3,3,1,'A','2020-04-04 10:25:28','Carmen','student3','F','1981-03-03','2020-04-04 10:25:28','2020-04-04 10:25:28'),(4,4,1,'A','2020-04-04 10:25:28','David','student4',NULL,'1980-04-04','2020-04-04 10:25:28','2020-04-04 10:25:28'),(5,5,1,'A','2020-04-04 10:25:28','Edith','student5','F','1983-05-05','2020-04-04 10:25:28','2020-04-04 10:25:28'),(6,6,1,'A','2020-04-04 10:25:28','Fanny','student6','F','1980-06-06','2020-04-04 10:25:28','2020-04-04 10:25:28'),(7,7,1,'A','2020-04-04 10:25:28','Gabriel','student7','M','1981-07-07','2020-04-04 10:25:28','2020-04-04 10:25:28'),(8,8,1,'A','2020-04-04 10:25:28','Henry','student8','M','1980-08-08','2020-04-04 10:25:28','2020-04-04 10:25:28'),(9,9,1,'A','2020-04-04 10:25:28','Ivan','student9','M','1982-09-09','2020-04-04 10:25:28','2020-04-04 10:25:28'),(10,10,1,'A','2020-04-04 10:25:28','Janice','student10','F','1983-10-10','2020-04-04 10:25:28','2020-04-04 10:25:28'),(11,4,2,'M','2020-04-04 10:25:28','David','student4','M','1980-04-04','2020-04-04 10:25:28','2020-04-04 10:25:28');")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40000 ALTER TABLE `students_history` ENABLE KEYS */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "UNLOCK TABLES;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "--")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "-- Dumping events for database 'school'")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "--")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "--")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "-- Dumping routines for database 'school'")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "--")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "-- Dump completed on 2020-04-04 18:26:22")
// })

// test('should have correct xth statement', t => {
//   t.is(statements[x], "")
// })
