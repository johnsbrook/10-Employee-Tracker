const { prompt } = require("inquirer");
const logo = require("asciiart-logo");

const { inherits } = require("util");
const { async } = require("rxjs");
const connection = require("./db/connection.js");
require("console.table");
init();

function init() {
  const logoText = logo({ name: "Employee Manager" }).render();
  console.log(logoText);
  loadMainPrompts();
}


async function loadMainPrompts() {

  const department = [
    {
      id: 1,
      name: "Sales",
    },
    {
      id: 2,
      name: "Engineering",
    },
    {
      id: 3,
      name: "HR",
    },
    {
      id: 4,
      name: "IT",
    }
  ];

  var depName = [];
  for(var i = 0; i < department.length; i++) {
    depName.push(department[i].name)
  }
  // console.log(depName);

  const role = [
    {
      id: 1,
      title: 'Sales Person',
      salary: 100000,
      department_id: 1,
    },
    {
      id: 2,
      title: 'Mechanical Engineer',
      salary: 120000,
      department_id: 2,
    },
    {
      id: 3,
      title: 'Software Engineer',
      salary: 150000,
      department_id: 2,
    },
    {
      id: 4,
      title: 'Junior Engineer',
      salary: 85000,
      department_id: 2,
    },
    {
      id: 5,
      title: 'HR Drone',
      salary: 80000,
      department_id: 3,
    },
    {
      id: 6,
      title: 'IT HERO',
      salary: 70000,
      department_id: 4,
    },
  ]

  const roleTitle = [];
  // const roleSalary = [];
  for (var r = 0; r < role.length; r++) {
    // console.log(role[r].title);
    // console.log(role[r].salary);
    roleTitle.push(role[r].title);
    // roleTitle.push(role[r].salary);
  }

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

  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees(); // select from database
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager();
    case "ADD_EMPLOYEE":
      return addEmployee(); // insert into database
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "UPDATE_EMPLOYEE_ROLE": 
      return updateEmployeeRole(); // update in the database
    case "VIEW_DEPARTMENTS":
      return viewDepartments(); // 
    case "ADD_DEPARTMENT":
      return addDepartment();
    case "REMOVE_DEPARTMENTS":
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

  

  function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      loadMainPrompts();
    })
  }

  function viewEmployeesByDepartment() {
    connection.query("SELECT department.name, employee.first_name, employee.last_name FROM employee INNER JOIN department ON department.id = employee.role_id ORDER BY department.name ASC;", function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      loadMainPrompts();
    })
  }

  function viewEmployeesByManager() {
    connection.query("SELECT employee.manager_id, employee.first_name, employee.last_name FROM employee WHERE manager_id IS NOT NULL ORDER BY manager_id ASC;", function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      loadMainPrompts();
    })
  }

  function addEmployee() {
    prompt([
      {
        type: 'input',
        name: 'firstname', 
        message: 'What\'s the employee\'s first name?'
      },
      {
        type: 'input',
        name: 'lastname', 
        message: 'What\'s the employee\'s last name?'
      },
      {
        type: 'input',
        name: 'role', 
        message: 'What\'s the employee\'s role ID?'
      },
      {
        type: 'input',
        name: 'manager', 
        message: 'What\'s the employee\'s manager\'s ID?'
      }
    ]).then(function(res) {
     
      console.log('=====================================');
      console.log('EMPLOYEE INFORMATION HAS BEEN RECEIVED');
      console.log(' ');
   
      empVal = [res.firstname, res.lastname, res.role, res.manager];
      var empsql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('" + res.firstname + "','" + res.lastname + "','" + res.role + "','" + res.manager + "')";
   
      console.log('First Name, Last Name, Role ID, Manager ID');
      console.log(' ');
      console.log(empVal);
      console.log('=====================================');
      connection.query(empsql, function (err, result) {
      if (err) throw err;
      console.log("THE EMPLOYEE ABOVE HAS BEEN ADDED TO THE DATABASE");
      console.log(' ');
      console.log(' ');
      console.log(' ');

      loadMainPrompts();
      })

    })
   
  }

  function removeEmployee() {
    console.log(' ');
    console.log(' ');
    
      connection.query("SELECT * FROM employee" , function (err, result, fields) {
      if (err) throw err;
      console.table(result);

      prompt([
        {
          type: 'input',
          name: 'empID',
          message: 'Enter the ID number of the employee above that you would like to delete.'
        }
      ]).then(function(res){

        var empID = res.empID;
        var deleteSQL = "DELETE FROM employee WHERE id = '" + empID + "'";

        connection.query(deleteSQL, function (err, result) {
          if (err) throw err;
          console.log(' ');
          console.log("The employee\'s records have been deleted successfully.");
          console.log(' ');
          console.log("The new employee records are the following");
          
        });
        connection.query("SELECT * FROM employee" , function (err, result, fields) {
          
          if (err) throw err;
          console.log(' ');
          console.table(result);
          console.log(' ');
          console.log('=====================================');
          console.log(' ');
          console.log(' ');
          loadMainPrompts();
        });
      }) 
    })
  }


  function updateEmployeeRole() {

    console.log(' ');
    console.log(' ');
    connection.query("SELECT * FROM employee", function (err, result, fields) {
    if (err) throw err;
    console.table(result);
    console.log(" ");
    console.log(" ");
    prompt([
      {
        type: 'input',
        message: 'What is the employee ID number whose role you would like to update?',
        name: 'empID'
      },
      {
        type: 'input',
        message: 'What woud be the employee\'s new role ID?',
        name: 'empRole'
      }
    ]).then(function(res) {
      var empRole = res.empRole;
      var empID = res.empID;
      connection.query("UPDATE employee SET role_id='" + empRole + "' WHERE id=" + empID, function (err, result, fields) {
          if (err) throw err;
      });
      connection.query("SELECT employee.first_name, employee.last_name FROM employee WHERE id=" + empID , function (err, result, fields) {
        var resultArray = []
        var empResult = result;
            resultArray.push(empResult)
            // console.log(resultArray);
            // console.log(resultArray[0][0].first_name)
        var empfn = resultArray[0][0].first_name;
        var empln = resultArray[0][0].last_name;
        console.log(' '); 
        console.log(empfn + " " + empln + "\'s new role number will be " + empRole);
        
        console.log(' ');
        console.log(' '); 
        console.log('=====================================');
        console.log(' ');
        console.log(' ');
        loadMainPrompts();
      });
    });  
  });
}

function viewDepartments() {

  connection.query("SELECT * FROM department ORDER BY id ASC;", function (err, res) {
    if (err) throw err;
    console.log(' ');
    console.log('These are all the departments in the Company.');
    console.log(' ');
    console.table(res);
    console.log(' ');
    console.log('=====================================');
    console.log(' ');
    console.log(' ');
    loadMainPrompts();
  })
}

function addDepartment(){
  prompt([
   {
      type: 'input',
      message: 'What is the name of the new department?',
      name: 'depName'
    }
  ]).then(function(res){
    var depName = res.depName;
    var ndsql = "INSERT INTO department (name) VALUES ('" + depName + "')";
    var depsql = "SELECT * FROM department ORDER BY id ASC;"
    connection.query(ndsql, function (err, res) {
      if (err) throw err;
    })
    connection.query(depsql, function (err, res) {
      if (err) throw err;
      console.log(' ');
      console.table(res);
      console.log(' ');
      console.log('=====================================');
      console.log(' ');
      console.log(' ');
      loadMainPrompts();
    })
  
  })
}

function removeDepartment() {

  console.log(' ');
  console.log(' ');
  
    connection.query("SELECT * FROM department ORDER BY id ASC" , function (err, res, fields) {
    if (err) throw err;
    console.table(res);

    prompt([
      {
        type: 'input',
        name: 'depID',
        message: 'Enter the ID number of the department above that you would like to delete.'
      }
    ]).then(function(res){

      var depID = res.depID;
      var deleteSQL = "DELETE FROM department WHERE id = '" + depID + "'";

      connection.query(deleteSQL, function (err, res) {
        if (err) throw err;
        console.log(' ');
        console.log("The department\'s records have been deleted successfully.");
        console.log(' ');
        console.log("The new department records are the following");
        
      });
      connection.query("SELECT * FROM department ORDER BY id ASC" , function (err, res, fields) {
        
        if (err) throw err;
        console.log(' ');
        console.table(res);
        console.log(' ');
        console.log('=====================================');
        console.log(' ');
        console.log(' ');
        loadMainPrompts();
        });    
      })
    })
  }



  
}