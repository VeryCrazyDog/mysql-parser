-- -----------------------------------------------------------------------------
-- Create database
-- -----------------------------------------------------------------------------
DROP DATABASE IF EXISTS school;
CREATE DATABASE school DEFAULT CHARACTER SET utf8mb4;

USE school;

-- -----------------------------------------------------------------------------
-- Create tables
-- -----------------------------------------------------------------------------
CREATE TABLE students (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(10) NOT NULL,
  gender CHAR,
  birthday DATE,
  version INT NOT NULL DEFAULT 1,
  created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX ix_name (name),
  UNIQUE uk_code (code)
);

CREATE TABLE students_history (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  version INT NOT NULL,
  action CHAR NOT NULL,
  action_time TIMESTAMP NOT NULL,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(10) NOT NULL,
  gender CHAR,
  birthday DATE,
  created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE uk_student_id_version (student_id, version)
);

-- -----------------------------------------------------------------------------
-- Create triggers
-- -----------------------------------------------------------------------------
DELIMITER $$

CREATE /* DEFINER = `root`@`%` */ TRIGGER students_after_update AFTER UPDATE ON students FOR EACH ROW
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
END$$

DELIMITER ;

-- -----------------------------------------------------------------------------
-- Insert initial data
-- -----------------------------------------------------------------------------
INSERT students (id, name, code, gender, birthday) VALUES
  (1, 'Amy', 'student1', 'F', '1980-01-01'),
  (2, 'Benny', 'student2', 'M', '1981-02-02'),
  (3, 'Carmen', 'student3', 'F', '1981-03-03'),
  (4, 'David', 'student4', NULL, '1980-04-04'),
  (5, 'Edith', 'student5', 'F', '1983-05-05');

-- -----------------------------------------------------------------------------
-- Update data to trigger trigger
-- -----------------------------------------------------------------------------
UPDATE (SELECT SLEEP(1)) dummy, students
  SET gender = 'M', version = version + 1
  WHERE name = 'David';
