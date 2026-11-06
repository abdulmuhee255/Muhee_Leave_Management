CREATE DATABASE IF NOT EXISTS employee_leave;
USE employee_leave;
CREATE TABLE IF NOT EXISTS employees (
 employee_id INT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100), email VARCHAR(100), department VARCHAR(50), designation VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS leave_types (
 leave_type_id INT PRIMARY KEY AUTO_INCREMENT,
 type_name VARCHAR(50), max_days INT, description TEXT
);
CREATE TABLE IF NOT EXISTS leave_requests (
 request_id INT PRIMARY KEY AUTO_INCREMENT,
 employee_id INT, leave_type_id INT, from_date DATE, to_date DATE, reason TEXT,
 status VARCHAR(20) DEFAULT 'Pending',
 FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
 FOREIGN KEY (leave_type_id) REFERENCES leave_types(leave_type_id)
);
INSERT INTO leave_types(type_name,max_days,description)
SELECT 'Casual Leave',12,'For personal reasons'
WHERE NOT EXISTS(SELECT 1 FROM leave_types WHERE type_name='Casual Leave');
INSERT INTO leave_types(type_name,max_days,description)
SELECT 'Sick Leave',10,'For health problems'
WHERE NOT EXISTS(SELECT 1 FROM leave_types WHERE type_name='Sick Leave');
INSERT INTO leave_types(type_name,max_days,description)
SELECT 'Earned Leave',15,'For planned vacations'
WHERE NOT EXISTS(SELECT 1 FROM leave_types WHERE type_name='Earned Leave');
INSERT INTO leave_types(type_name,max_days,description)
SELECT 'Maternity Leave',90,'For maternity purposes'
WHERE NOT EXISTS(SELECT 1 FROM leave_types WHERE type_name='Maternity Leave');
