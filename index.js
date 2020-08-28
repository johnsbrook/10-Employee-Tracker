const { prompt } = require("inquirer");
const logo = require("asciiart-logo");

const { inherits, isNullOrUndefined } = require("util");
const { async } = require("rxjs");
const connection = require("./db/connection.js");
const { connect } = require("./db/connection.js");
require("console.table");
init();

function init() {
  const logoText = logo({ name: "Employee Manager" }).render();
  console.log(logoText);
  loadMainPrompts();
}


async function loadMainPrompts() {

  // const department = [
  //   {
  //     id: 1,
  //     name: "Sales",
  //   },
  //   {
  //     id: 2,
  //     name: "Engineering",
  //   },
  //   {
  //     id: 3,
  //     name: "HR",
  //   },
  //   {
  //     id: 4,
  //     name: "IT",
  //   }
  // ];

  // var depName = [];
  // for (var i = 0; i < department.length; i++) {
  //   depName.push(department[i].name)
  // }
  // // console.log(depName);

  // const role = [
  //   {
  //     id: 1,
  //     title: 'Sales Person',
  //     salary: 100000,
  //     department_id: 1,
  //   },
  //   {
  //     id: 2,
  //     title: 'Mechanical Engineer',
  //     salary: 120000,
  //     department_id: 2,
  //   },
  //   {
  //     id: 3,
  //     title: 'Software Engineer',
  //     salary: 150000,
  //     department_id: 2,
  //   },
  //   {
  //     id: 4,
  //     title: 'Junior Engineer',
  //     salary: 85000,
  //     department_id: 2,
  //   },
  //   {
  //     id: 5,
  //     title: 'HR Drone',
  //     salary: 80000,
  //     department_id: 3,
  //   },
  //   {
  //     id: 6,
  //     title: 'IT HERO',
  //     salary: 70000,
  //     department_id: 4,
  //   },
  // ]

  // const roleTitle = [];
  // // const roleSalary = [];
  // for (var r = 0; r < role.length; r++) {
  //   // console.log(role[r].title);
  //   // console.log(role[r].salary);
  //   roleTitle.push(role[r].title);
  //   // roleTitle.push(role[r].salary);
  // }

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
          value: "ADD_ROLES",
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
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeeManager();
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
    case "REMOVE_ROLE":
      return removeRole();
    default:
      return quit();
  }


  function viewEmployees() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, department.name FROM department, employee, role WHERE employee.role_id = role.id AND role.department_id = department.id GROUP BY employee.id;", function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      loadMainPrompts();
    })
  }

  function viewEmployeesByDepartment() {
    connection.query("SELECT department.name, employee.first_name, employee.last_name, role.title FROM department, employee, role WHERE employee.role_id = role.id AND role.department_id = department.id GROUP BY employee.id ORDER BY department.name ASC;", function (err, result, fields) {
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


    connection.query('SELECT * FROM role;', function (err, res) {

      if (err) throw err;

      // Array for title options in database
      var titleArray = [];
      var roleIDArray = [];
      // Loop through all the options available inside the database
      for (t = 0; t < res.length; t++) {
        var titleFor = res[t].title;
        // console.log(titleFor);
        titleArray.push(titleFor);
      }

      // console.log(titleArray);
      for (i = 0; i < res.length; i++) {
        var roleIDFor = res[i].id;
        // console.log(titleFor);
        roleIDArray.push(roleIDFor);
      }

      var newarray = [],
        objTitleRoleArray;

      // for (var y = 0; y < titleArray.length; y++) {

      for (var i = 0; i < roleIDArray.length; i++) {
        objTitleRoleArray = { [titleArray[i]]: roleIDArray[i] };
        newarray.push(objTitleRoleArray)
      }
      // console.log(newarray[0]);


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
          type: 'list',
          name: 'role',
          message: 'What\'s the employee\'s new role?',
          choices: titleArray
        },
        {
          type: 'input',
          name: 'manager',
          message: 'What\'s the employee\'s manager\'s ID?'
        }
      ])
        .then(function (res) {


          var fnRole = res.firstname;
          var lnRole = res.lastname;
          var rlRole = res.role;
          var mngrRole = res.manager;
          // console.log(rlRole);

          var queryRole = "SELECT role.id FROM employees.role WHERE role.title = '" + rlRole + "';";

          connection.query(queryRole, function (err, res) {
            if (err) throw err;
            // console.table(res);
            var roleID = res[0].id;
            // console.log(roleID);

            var empVal = fnRole + ' ' + lnRole + ' ';
            var empsql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('" + fnRole + "','" + lnRole + "','" + roleID + "','" + mngrRole + "');";
            connection.query(empsql, function (err, res){
              if (err) throw err;
              console.log(' ');
              console.log(empVal + 'has been added to Employee records.');
              console.log(' ');
              console.log('=====================================');
              console.log(' ');
              console.log(' ');
              loadMainPrompts();
            })
            
            
          })
        })
    })
  }

  function removeEmployee() {
    console.log(' ');
    console.log(' ');

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, department.name FROM employees.employee, employees.role, employees.department WHERE employee.role_id = role.id AND role.department_id = department.id;", function (err, result, fields) {
      if (err) throw err;
      // console.log(result);

      var eArray = [];
      for (var e = 0; e < result.length; e++) {
        // console.log("Employee: ID " + result[e].id + " - " + result[e].first_name + " " + result[e].last_name + " Title: " + result[e].title + ", " + result[e].name);
        var eResult = "Employee: ID " + result[e].id + " - " + result[e].first_name + " " + result[e].last_name + " Title: " + result[e].title + ", " + result[e].name;
        eArray.push(eResult);
      }
      // console.log(eArray);

      prompt([
        {
          type: 'list',
          name: 'empID',
          message: 'Select the employee to be deleted.',
          choices: eArray
        }
      ])
        .then(function (res) {

          // console.log(res);
          // console.log(res.empID.split(' '));
          var empSplit = res.empID.split(' ');
          // console.log(empSplit[2]);
          var empSplitEmpID = empSplit[2];
          // console.log(empSplitEmpID);
          var empID = empSplitEmpID;
          // console.log(empID);

          var deleteSQL = "DELETE FROM employee WHERE id = '" + empID + "'";

          connection.query(deleteSQL, function (err, result) {
            if (err) throw err;
            console.log(' ');
            console.log("The employee\'s records have been deleted successfully.");
            console.log(' ');
            console.log("The new employee records are the following");

          });
          connection.query("SELECT * FROM employee", function (err, result, fields) {

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
    
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, department.name FROM employees.employee, employees.role, employees.department WHERE employee.role_id = role.id AND role.department_id = department.id;", function (err, result, fields) {
      if (err) throw err;
      // console.table(result);
     

      var eArray = [];
      var rArray = [];
      for (var e = 0; e < result.length; e++) {
        // console.log("Employee: ID " + result[e].id + " - " + result[e].first_name + " " + result[e].last_name + " Title: " + result[e].title + ", " + result[e].name);
        var eResult = "Employee: ID " + result[e].id + " - " + result[e].first_name + " " + result[e].last_name + " Title: " + result[e].title + ", " + result[e].name;
        var rResult = result[e].title;
        eArray.push(eResult);
        rArray.push(rResult);

      }
      // // console.log(rArray);
      // rArray = new Set(rArray);
      // const rArrayU = [...rArray];
      // // console.log(rArrayU)

      connection.query("SELECT role.id, role.title FROM employees.role", function(err,res){

      rArrayU = []
      // console.log(res);
      for (r = 0; r < res.length; r++){
        // console.log(res[r].id);
        // console.log(res[r].title);
        rArrayU.push(res[r].title);
      }
      // console.log(rArrayU)
      
      prompt([
        {
          type: 'list',
          message: 'Which employee\'s role would you like to update?',
          name: 'empID',
          choices: eArray
        },
        {
          type: 'list',
          message: 'What woud be the employee\'s new role?',
          name: 'empRole',
          choices: rArrayU
        }
      ]).then(function (res) {
        var empRole = res.empRole;
        // console.log(res.empID.split(' '));
        var empSplit = res.empID.split(' ');
        var empID = empSplit[2];
        // console.log(empID);

        connection.query("SELECT * FROM employees.role WHERE role.title='" + empRole + "'", function (err, res) {
          if (err) throw err;
          // console.log(res);
          // console.log(res[0].id);
          var empRoleID = res[0].id;
          // console.log(empRoleID);
         

          connection.query("UPDATE employee SET role_id='" + empRoleID + "' WHERE id=" + empID, function (err, result, fields) {
            if (err) throw err;
          });



          connection.query("SELECT employee.first_name, employee.last_name FROM employee WHERE id=" + empID, function (err, result, fields) {
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
    });
  })
  }

  function updateEmployeeManager() {
    console.log(' ');
    console.log(' ');
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, department.name FROM employees.employee, employees.role, employees.department WHERE employee.role_id = role.id AND role.department_id = department.id;", function (err, result, fields) {
      if (err) throw err;
      console.table(result);
      console.log(" ");
      console.log(" ");

      var eArray = [];
      var rArray = [];
      for (var e = 0; e < result.length; e++) {
        // console.log("Employee: ID " + result[e].id + " - " + result[e].first_name + " " + result[e].last_name + " Title: " + result[e].title + ", " + result[e].name);
        var eResult = "Employee: ID " + result[e].id + " - " + result[e].first_name + " " + result[e].last_name + " Title: " + result[e].title + ", " + result[e].name;
        var rResult = result[e].title;
        eArray.push(eResult);
        rArray.push(rResult);

      }
      
      prompt([
        {
          type: 'list',
          message: 'Which employee\'s manager would you like to update?',
          name: 'empID',
          choices: eArray
        },
        {
          type: 'input',
          message: 'What woud be the employee\'s new manager\'s ID?',
          name: 'empRole',
        }
      ])
      .then(function (res) {
        var empRole = res.empRole;
        // console.log(res.empID.split(' '));
        var empSplit = res.empID.split(' ');
        var empID = empSplit[2];

          connection.query("UPDATE employee SET manager_id='" + empRole + "' WHERE id=" + empID, function (err, result, fields) {
            if (err) throw err;
          });

        connection.query("SELECT employee.first_name, employee.last_name FROM employee WHERE id=" + empID, function (err, result, fields) {
          var resultArray = []
          var empResult = result;
          resultArray.push(empResult)
      
          var empfn = resultArray[0][0].first_name;
          var empln = resultArray[0][0].last_name;
          console.log(' ');
          console.log(empfn + " " + empln + "\'s new manager will be number " + empRole);

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

  function addDepartment() {
    prompt([
      {
        type: 'input',
        message: 'What is the name of the new department?',
        name: 'depName'
      }
    ]).then(function (res) {
      var depName = res.depName;
      var ndsql = "INSERT INTO department (name) VALUES ('" + depName + "')";
      var depsql = "SELECT * FROM department ORDER BY id ASC;";
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

  // Change to selectors
  function removeDepartment() {

    console.log(' ');
    console.log(' ');

    connection.query("SELECT * FROM department ORDER BY id ASC", function (err, res, fields) {
      if (err) throw err;
      // console.table(res);
      
      resArray = [];
      
      for (r = 0; r < res.length; r++) {
        var deps = res[r].name;
        // console.log(deps);
        resArray.push(deps);
      }
      // console.log(resArray)

      prompt([
        {
          type: 'list',
          name: 'depID',
          message: 'Which department would you like to remove?',
          choices: resArray
        }
      ]).then(function (res) {

        var depID = res.depID;
        var deleteSQL = "DELETE FROM department WHERE department.name='" + depID + "'";

        connection.query(deleteSQL, function (err, res) {
          if (err) throw err;
          console.log(' ');
          console.log("The department\'s records have been deleted successfully.");
          console.log(' ');
          console.log("The new department records are the following");

        });
        connection.query("SELECT * FROM department ORDER BY id ASC", function (err, res, fields) {

          if (err) throw err;
          console.log(' ');
          console.table(res);
          console.log(' ');
          console.log('=====================================');
          console.log(' ');
        
          loadMainPrompts();
        });
      })
    })
  }

  function viewRoles() {
    console.log(' ');
    console.log(' ');
    connection.query("SELECT * FROM employees.role;", function (err, res, fields) {
      if (err) throw err;
      console.table(res);
      console.log(' ');
      console.log('=====================================');
      console.log(' ');
      console.log(' ');

      loadMainPrompts();
    })
  }

  function addRole() {

    prompt([
      {
        type: 'input',
        message: 'What is the title of the new role?',
        name: 'roleTitle'
      },
      {
        type: 'input',
        message: 'What is the salary of the new role?',
        name: 'roleSalary'
      },
      {
        type: 'input',
        message: 'What is the department ID of the new role?',
        name: 'roleDep'
      }
    ]).then(function (res) {

      var empsql = "INSERT INTO role (title, salary, department_id) VALUES ('" + res.roleTitle + "','" + res.roleSalary + "','" + res.roleDep + "');";
      var rolesql = "SELECT * FROM role";

      console.log('Role ID, Title, Salary, Department ID');

      connection.query(empsql, function (err, result) {
        if (err) throw err;


      });
      connection.query(rolesql, function (err, res) {
        console.table(res);
        console.log(' ');
        console.log("The new role has been created.");
        console.log(' ');
        console.log('==============================');
        console.log(' ');
        loadMainPrompts();
      })

    })

  }

  function removeRole() {
    console.log(' ');
 
    connection.query("SELECT * FROM role ORDER BY id ASC", function (err, res, fields) {
      if (err) throw err;
      // console.table(res);

      var resArray = []
      for (r = 0; r < res.length; r++) {
        // console.log(res[r].title)
        var titles = res[r].title;
        resArray.push(titles);
      }
      // console.log(resArray);
      prompt([
        {
          type: 'list',
          name: 'roleID',
          message: 'Which role would you like to delete?',
          choices: resArray
        }
      ]).then(function (res) {

        var roleID = res.roleID;
        var deleteSQL = "DELETE FROM role WHERE role.title='" + roleID + "'";

        connection.query(deleteSQL, function (err, res) {
          if (err) throw err;
          console.log(' ');
          console.log(' ');
          console.log("The role\'s above has been deleted successfully.");
          console.log(' ');
          console.log("The updated roles are the following");

        });
        connection.query("SELECT * FROM role ORDER BY id ASC", function (err, res, fields) {

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

  function quit() {
    process.exit();
  }

}