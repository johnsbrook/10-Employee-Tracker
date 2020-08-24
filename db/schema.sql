DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;

CREATE TABLE department(
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
department VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE employee_role (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30) UNIQUE NOT NULL,
salary DECIMAL(10,2) UNSIGNED NOT NULL,
INDEX dep_ind(department_id),
-- CONSTRAINT????
);

CREATE TABLE employee (
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
INDEX role_ind(role_id),
-- CONSTRAINT????
INDEX manager_ind(manager_id),
-- CONSTRAINT????
)