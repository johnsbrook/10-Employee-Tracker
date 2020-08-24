const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
const { inherits } = require("util");
const { async } = require("rxjs");
require("console.table");
init();
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();
  console.log(logoText);
  loadMainPrompts();
}
async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View all employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "View all employees by department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
        },
        {
          name: "View all employees by manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER",
        },
        {
          name: "Add employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Remove employee",
          value: "REMOVE_EMPLOYEE",
        },
        {
          name: "Update employee role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Update employee manager",
          value: "UPDATE_EMPLOYEE_MANAGER",
        },
        {
          name: "View all roles",
          value: "VIEW_ROLES",
        },
        {
          name: "Add role",
          value: "ADD_ROLE",
        },
        {
          name: "Remove role",
          value: "REMOVE_ROLE",
        },
        {
          name: "View all departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "Add department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Remove department",
          value: "REMOVE_DEPARTMENTS",
        },
        {
          name: "Quit",
          value: "QUIT",
        },
      ],
    },
  ]);
}
switch (choice) {
  case "VIEW_EMPLOYEES":
    return viewEmployees();
  case "VIEW_EMPLOYEES_BY_DEPARTMENT":
    return viewEmployeesByDepartment();
  case "VIEW_EMPLOYEES_BY_MANAGER":
    return viewEmployeesByManager();
  case "ADD_EMPLOYEE":
    return addEmployee();
  case "REMOVE_EMPLOYEE":
    return removeEmployee();
  case "UPDATE_EMPLOYEE_ROLE":
    return updateEmployeeRole();
  case "VIEW_DEPARTMENT":
    return viewDepartments();
  case "ADD_DEPARTMENT":
    return addDepartment();
  case "REMOVE_DEPARTMENT":
    return removeDepartment();
  case "VIEW_ROLES":
    return viewRoles();
  case "ADD_ROLES":
    return addRole();
  case "REMOVE_ROLES":
    return removeRole();
  default:
    return quit();
}
