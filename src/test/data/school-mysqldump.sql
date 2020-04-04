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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'Amy','student1','F','1980-01-01',1,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(2,'Benny','student2','M','1981-02-02',1,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(3,'Carmen','student3','F','1981-03-03',1,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(4,'David','student4','M','1980-04-04',2,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(5,'Edith','student5','F','1983-05-05',1,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(6,'Fanny','student6','F','1980-06-06',1,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(7,'Gabriel','student7','M','1981-07-07',1,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(8,'Henry','student8','M','1980-08-08',1,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(9,'Ivan','student9','M','1982-09-09',1,'2020-04-04 10:25:28','2020-04-04 10:25:28'),(10,'Janice','student10','F','1983-10-10',1,'2020-04-04 10:25:28','2020-04-04 10:25:28');
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students_history`
--

LOCK TABLES `students_history` WRITE;
/*!40000 ALTER TABLE `students_history` DISABLE KEYS */;
INSERT INTO `students_history` VALUES (1,1,1,'A','2020-04-04 10:25:28','Amy','student1','F','1980-01-01','2020-04-04 10:25:28','2020-04-04 10:25:28'),(2,2,1,'A','2020-04-04 10:25:28','Benny','student2','M','1981-02-02','2020-04-04 10:25:28','2020-04-04 10:25:28'),(3,3,1,'A','2020-04-04 10:25:28','Carmen','student3','F','1981-03-03','2020-04-04 10:25:28','2020-04-04 10:25:28'),(4,4,1,'A','2020-04-04 10:25:28','David','student4',NULL,'1980-04-04','2020-04-04 10:25:28','2020-04-04 10:25:28'),(5,5,1,'A','2020-04-04 10:25:28','Edith','student5','F','1983-05-05','2020-04-04 10:25:28','2020-04-04 10:25:28'),(6,6,1,'A','2020-04-04 10:25:28','Fanny','student6','F','1980-06-06','2020-04-04 10:25:28','2020-04-04 10:25:28'),(7,7,1,'A','2020-04-04 10:25:28','Gabriel','student7','M','1981-07-07','2020-04-04 10:25:28','2020-04-04 10:25:28'),(8,8,1,'A','2020-04-04 10:25:28','Henry','student8','M','1980-08-08','2020-04-04 10:25:28','2020-04-04 10:25:28'),(9,9,1,'A','2020-04-04 10:25:28','Ivan','student9','M','1982-09-09','2020-04-04 10:25:28','2020-04-04 10:25:28'),(10,10,1,'A','2020-04-04 10:25:28','Janice','student10','F','1983-10-10','2020-04-04 10:25:28','2020-04-04 10:25:28'),(11,4,2,'M','2020-04-04 10:25:28','David','student4','M','1980-04-04','2020-04-04 10:25:28','2020-04-04 10:25:28');
/*!40000 ALTER TABLE `students_history` ENABLE KEYS */;
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

-- Dump completed on 2020-04-04 18:26:22
