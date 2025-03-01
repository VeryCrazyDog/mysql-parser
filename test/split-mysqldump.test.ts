// Import built-in modules
import { join } from 'path'
import { promises as fs } from 'fs'

// Import 3rd party modules
import test from 'ava'

// Import module to be tested
import { split, SqlStatementResult } from '../src/index'

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

test('should have correct 11st statement', t => {
  t.is(statements[10], 'DROP TABLE IF EXISTS `students`')
})

test('should have correct 12nd statement', t => {
  t.is(statements[11], '/*!40101 SET @saved_cs_client     = @@character_set_client */')
})

test('should have correct 13rd statement', t => {
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

test('should have correct 21st statement', t => {
  t.is(statements[20], '/*!50003 SET @saved_cs_client      = @@character_set_client */')
})

test('should have correct 22nd statement', t => {
  t.is(statements[21], '/*!50003 SET @saved_cs_results     = @@character_set_results */')
})

test('should have correct 23rd statement', t => {
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

test('should have correct 30th statement', t => {
  t.is(statements[29], '/*!50003 SET sql_mode              = @saved_sql_mode */')
})

test('should have correct 31st statement', t => {
  t.is(statements[30], '/*!50003 SET character_set_client  = @saved_cs_client */')
})

test('should have correct 32nd statement', t => {
  t.is(statements[31], '/*!50003 SET character_set_results = @saved_cs_results */')
})

test('should have correct 33rd statement', t => {
  t.is(statements[32], '/*!50003 SET collation_connection  = @saved_col_connection */')
})

test('should have correct 34th statement', t => {
  t.is(statements[33], 'DROP TABLE IF EXISTS `students_history`')
})

test('should have correct 35th statement', t => {
  t.is(statements[34], '/*!40101 SET @saved_cs_client     = @@character_set_client */')
})

test('should have correct 36th statement', t => {
  t.is(statements[35], '/*!40101 SET character_set_client = utf8 */')
})

test('should have correct 37th statement', t => {
  t.is(statements[36], [
    'CREATE TABLE `students_history` (',
    '  `id` int(11) NOT NULL AUTO_INCREMENT,',
    '  `student_id` int(11) NOT NULL,',
    '  `version` int(11) NOT NULL,',
    '  `action` char(1) NOT NULL,',
    '  `action_time` timestamp NOT NULL,',
    '  `name` varchar(50) NOT NULL,',
    '  `code` varchar(10) NOT NULL,',
    '  `gender` char(1) DEFAULT NULL,',
    '  `birthday` date DEFAULT NULL,',
    '  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,',
    '  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,',
    '  PRIMARY KEY (`id`),',
    '  UNIQUE KEY `uk_student_id_version` (`student_id`,`version`)',
    ') ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4'
  ].join('\r\n'))
})

test('should have correct 38th statement', t => {
  t.is(statements[37], '/*!40101 SET character_set_client = @saved_cs_client */')
})

test('should have correct 39th statement', t => {
  t.is(statements[38], 'LOCK TABLES `students_history` WRITE')
})

test('should have correct 40th statement', t => {
  t.is(statements[39], '/*!40000 ALTER TABLE `students_history` DISABLE KEYS */')
})

test('should have correct 41st statement', t => {
  t.is(statements[40], [
    'INSERT INTO `students_history` VALUES ',
    "(1,4,2,'M','2020-04-05 13:25:26','David','student4','M','1980-04-04','2020-04-05 13:25:26','2020-04-05 13:25:26')"
  ].join(''))
})

test('should have correct 42nd statement', t => {
  t.is(statements[41], '/*!40000 ALTER TABLE `students_history` ENABLE KEYS */')
})

test('should have correct 43rd statement', t => {
  t.is(statements[42], 'UNLOCK TABLES')
})

test('should have correct 44th statement', t => {
  t.is(statements[43], '/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */')
})

test('should have correct 45th statement', t => {
  t.is(statements[44], '/*!40101 SET SQL_MODE=@OLD_SQL_MODE */')
})

test('should have correct 46th statement', t => {
  t.is(statements[45], '/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */')
})

test('should have correct 47th statement', t => {
  t.is(statements[46], '/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */')
})

test('should have correct 48th statement', t => {
  t.is(statements[47], '/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */')
})

test('should have correct 49th statement', t => {
  t.is(statements[48], '/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */')
})

test('should have correct 50th statement', t => {
  t.is(statements[49], '/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */')
})

test('should have correct 51st statement', t => {
  t.is(statements[50], '/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */')
})

test('should have correct number of statements', t => {
  t.is(statements.length, 51)
})
