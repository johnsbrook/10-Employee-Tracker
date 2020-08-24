DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;

CREATE TABLE department(
id INT PRIMARY KEY,
department VARCHAR(30) NOT NULL
);

CREATE TABLE employee_role (
id INT PRIMARY KEY NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT 
);

CREATE TABLE employee (
id INT PRIMARY KEY NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT
)