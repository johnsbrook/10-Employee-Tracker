USE employees;
INSERT INTO department
    (name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("HR"),
    ("IT");
INSERT INTO role
    (title,salary, department_id)
VALUES
    ("Sales person", 100000, 1),
    ("Mechanical Engineer",120000, 2),
    ("Software Engineer", 150000, 2),
    ("Junior Engineer",85000, 2),
    ("HR Drone", 80000, 3),
    ("IT HERO", 70000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Smith", 1, 1),
    ("Jane","Doe", 2, 2),
    ("Maria", "Perez", 2, NULL),
    ("Juan", "Lopez", 2, NULL),
    ("Jacques", "Tardi", 3 ,3),
    ("Juan", "Ponce", 4, 4);