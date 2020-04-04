-- MySQL dump 10.13  Distrib 5.7.29, for Win64 (x86_64)
--
-- Host: localhost    Database: school
-- ------------------------------------------------------
-- Server version	5.7.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  `location` varchar(50) NOT NULL DEFAULT '',
  `teacher_id` int(11) DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `ix_name` (`name`),
  KEY `fk_courses_teachers_id` (`teacher_id`),
  CONSTRAINT `fk_courses_teachers_id` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Chinese','course01','Lecture Theatre A',1,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(2,'English','course02','Room 1',2,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(3,'Maths','course03','Lecture Theatre B',2,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(4,'Physics','course04','Room 2',3,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,'Chemistry','course05','Lecture Theatre C',6,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(6,'Biology','course06','Room 3',7,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(7,'Geography','course07','Lecture Theatre D',7,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(8,'Economics','course08','Room 2',7,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(9,'Accounting','course09','Lecture Theatre E',8,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(10,'Chinese History','course10','',NULL,1,'2020-04-04 09:33:45','2020-04-04 09:33:45');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  `gender` char(1) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `ix_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Amy','student1','F','1980-01-01',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(2,'Benny','student2','M','1981-02-02',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(3,'Carmen','student3','F','1981-03-03',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(4,'David','student4','M','1980-04-04',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,'Edith','student5','F','1983-05-05',2,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(6,'Fanny','student6','F','1980-06-06',2,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(7,'Gabriel','student7','M','1981-07-07',2,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(8,'Henry','student8','M','1980-08-08',2,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(9,'Ivan','student9','M','1982-09-09',3,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(10,'Janice','student10','F','1983-10-10',3,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(11,'Keith','student11','M','1983-11-11',4,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(12,'Ling','student12','F','1982-12-12',5,'2020-04-04 09:33:45','2020-04-04 09:33:46'),(13,'April','student13','F','1980-01-13',2,'2020-04-04 09:33:45','2020-04-04 09:33:45');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = big5 */ ;
/*!50003 SET character_set_results = big5 */ ;
/*!50003 SET collation_connection  = big5_chinese_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`skip-grants user`@`skip-grants host`*/ /*!50003 TRIGGER students_after_insert AFTER INSERT ON students FOR EACH ROW
BEGIN
	INSERT INTO students_history SET
		student_id = NEW.id,
		version = NEW.version,
		action = 'A',
		action_time = NEW.created_time,
		name = NEW.name,
		code = NEW.code,
		gender = NEW.gender,
		birthday = NEW.birthday;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = big5 */ ;
/*!50003 SET character_set_results = big5 */ ;
/*!50003 SET collation_connection  = big5_chinese_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`skip-grants user`@`skip-grants host`*/ /*!50003 TRIGGER students_after_update AFTER UPDATE ON students FOR EACH ROW
BEGIN
	INSERT INTO students_history SET
		student_id = NEW.id,
		version = NEW.version,
		action = 'M',
		action_time = NEW.modified_time,
		name = NEW.name,
		code = NEW.code,
		gender = NEW.gender,
		birthday = NEW.birthday;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = big5 */ ;
/*!50003 SET character_set_results = big5 */ ;
/*!50003 SET collation_connection  = big5_chinese_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`skip-grants user`@`skip-grants host`*/ /*!50003 TRIGGER students_after_delete AFTER DELETE ON students FOR EACH ROW
BEGIN
	INSERT INTO students_history SET
		student_id = OLD.id,
		version = OLD.version + 1,
		action = 'D',
		action_time = CURRENT_TIMESTAMP,
		name = OLD.name,
		code = OLD.code,
		gender = OLD.gender,
		birthday = OLD.birthday;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `students_courses`
--

DROP TABLE IF EXISTS `students_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students_courses` (
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `registered_date` date NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`,`course_id`),
  UNIQUE KEY `uk_students_courses` (`course_id`,`student_id`),
  CONSTRAINT `fk_students_courses_courses_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `fk_students_courses_students_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students_courses`
--

LOCK TABLES `students_courses` WRITE;
/*!40000 ALTER TABLE `students_courses` DISABLE KEYS */;
INSERT INTO `students_courses` VALUES (1,1,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(1,2,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(1,3,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(2,2,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(2,4,'2005-09-15','2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,1,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,4,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,8,'2005-10-02','2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,9,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,10,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(8,3,'2005-09-13','2020-04-04 09:33:45','2020-04-04 09:33:45'),(9,3,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(9,8,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(12,3,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(12,8,'2005-09-01','2020-04-04 09:33:45','2020-04-04 09:33:45');
/*!40000 ALTER TABLE `students_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students_history`
--

DROP TABLE IF EXISTS `students_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `version` int(11) NOT NULL,
  `action` char(1) NOT NULL,
  `action_time` timestamp NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  `gender` char(1) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_id_version` (`student_id`,`version`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students_history`
--

LOCK TABLES `students_history` WRITE;
/*!40000 ALTER TABLE `students_history` DISABLE KEYS */;
INSERT INTO `students_history` VALUES (1,1,1,'A','2020-04-04 09:33:45','Amy','student1','F','1980-01-01','2020-04-04 09:33:45','2020-04-04 09:33:45'),(2,2,1,'A','2020-04-04 09:33:45','Benny','student2','M','1981-02-02','2020-04-04 09:33:45','2020-04-04 09:33:45'),(3,3,1,'A','2020-04-04 09:33:45','Carmen','student3','F','1981-03-03','2020-04-04 09:33:45','2020-04-04 09:33:45'),(4,4,1,'A','2020-04-04 09:33:45','David','student4','M','1980-04-04','2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,5,2,'A','2020-04-04 09:33:45','Edith','student5','F','1983-05-05','2020-04-04 09:33:45','2020-04-04 09:33:45'),(6,6,2,'A','2020-04-04 09:33:45','Fanny','student6','F','1980-06-06','2020-04-04 09:33:45','2020-04-04 09:33:45'),(7,7,2,'A','2020-04-04 09:33:45','Gabriel','student7','M','1981-07-07','2020-04-04 09:33:45','2020-04-04 09:33:45'),(8,8,2,'A','2020-04-04 09:33:45','Henry','student8','M','1980-08-08','2020-04-04 09:33:45','2020-04-04 09:33:45'),(9,9,3,'A','2020-04-04 09:33:45','Ivan','student9','M','1982-09-09','2020-04-04 09:33:45','2020-04-04 09:33:45'),(10,10,3,'A','2020-04-04 09:33:45','Janice','student10','F','1983-10-10','2020-04-04 09:33:45','2020-04-04 09:33:45'),(11,11,4,'A','2020-04-04 09:33:45','Keith','student11','M','1983-11-11','2020-04-04 09:33:45','2020-04-04 09:33:45'),(12,12,4,'A','2020-04-04 09:33:45','Ling','student12',NULL,'1982-12-12','2020-04-04 09:33:45','2020-04-04 09:33:45'),(13,13,2,'A','2020-04-04 09:33:45','April','student13','F','1980-01-13','2020-04-04 09:33:45','2020-04-04 09:33:45'),(14,12,5,'M','2020-04-04 09:33:46','Ling','student12','F','1982-12-12','2020-04-04 09:33:46','2020-04-04 09:33:46');
/*!40000 ALTER TABLE `students_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  `gender` char(1) DEFAULT NULL,
  `version` int(11) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `ix_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'Andrew','teacher1','M',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(2,'Boris','teacher2','M',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(3,'Carol','teacher3','F',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(4,'Doris','teacher4',NULL,1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(5,'Edison','teacher5','M',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(6,'Fiona','teacher6','F',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(7,'Grace','teacher7','F',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(8,'Helen','teacher8','F',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(9,'Issac','teacher9','M',1,'2020-04-04 09:33:45','2020-04-04 09:33:45'),(10,'Jack','teacher10','M',1,'2020-04-04 09:33:45','2020-04-04 09:33:45');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'school'
--

--
-- Dumping routines for database 'school'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-04 17:34:01
