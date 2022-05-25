const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');

// create the connection to database
const db = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'levitateme',
    database: 'employees'
  });

  db.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${db.threadId} \n`);
    startQuestions();
});

startQuestions = () => {
  inquirer.prompt([
      {
          name: 'initialInquiry',
          type: 'list',
          message: 'Welcome to the employee management program. What would you like to do?',
          choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role']
      }
  ]).then((response) => {
    switch (response.initialInquiry) {
      case 'View all departments':
          viewDepartments();    
          break;
      case 'View all roles':
          viewRoles();
          break;
      case 'View all employees':
          viewEmployees();
          break;
      case 'Add a department':
          addDepartment();
      break;
      case 'Add a role':
          addRole();
      break;
      case 'Add an employee':
          addEmployee();
      break;
      case 'Update employee role':
          updateEmployeeRole();
      break;
          return;
      default:
          break;

    }
  })
}

const viewDepartments = () => {
  db.query(
      'SELECT * FROM department',
      function(err, results) {
        if(err) throw err;
        console.table(results);
        startQuestions();
      }
    )
};  

const viewRoles = () => {
db.query(
  'SELECT * FROM role',
  function(err, results) {
    if(err) throw err;
    console.table(results);
    startQuestions();
  }
)
};

const viewEmployees = () => {
  db.query(
    'SELECT * FROM employee',
    function(err, results) {
      if(err) throw err;
        console.table(results);
        startQuestions();
    }
  )
  };

const addDepartment = () => {
    inquirer.prompt([
        {
        name: 'newDept',
        type: 'input',
        message: 'What is the name of the department you want to add?'   
        }
    ]).then((response) => {
        db.query(`INSERT INTO department SET ?`, 
        {
            name: response.newDept,
        },
        (err, res) => {
            if (err) throw err;
            console.log(`\n Thanks you, '${response.newDept}' was added as a new department to the database! \n`);
            startQuestions();
        })
    })
};

const addRole = () => {
  db.query(`SELECT * FROM department;`, (err, res) => {
      if (err) throw err;
      let departments = res.map(department => ({name: department.name, value: department.deptartment_id }));
      inquirer.prompt([
          {
          name: 'title',
          type: 'input',
          message: 'What is the name of the role you want to add?'   
          },
          {
          name: 'salary',
          type: 'input',
          message: 'What is the salary of the role you want to add?'   
          },
          {
          name: 'deptName',
          type: 'list',
          message: 'Which department do you want to add the new role to? Please type a number between 1-5',
          choices: departments
          },
      ]).then((response) => {
          db.query(`INSERT INTO role SET ?`, 
          {
              title: response.title,
              salary: response.salary,
              department_id: response.deptName,
          },
          (err, res) => {
              if (err) throw err;
              console.log(`\n New role: ${response.title} successfully added to database! \n`);
              startQuestions();
          })
      })
    })
};

addEmployee = () => {
  db.query(`SELECT * FROM role;`, (err, res) => {
      if (err) throw err;
      let roles = res.map(role => ({name: role.title, value: role.role_id }));

      db.query(`SELECT * FROM employee;`, (err, res) => {
          if (err) throw err;
          let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}));
          inquirer.prompt([
              {
                  name: 'firstName',
                  type: 'input',
                  message: 'What is the new employee\'s first name?'
              },
              {
                  name: 'lastName',
                  type: 'input',
                  message: 'What is the new employee\'s last name?'
              },
              {
                  name: 'role',
                  type: 'list',
                  message: 'What is the new employee\'s title?',
                  choices: roles
              },
              {
                  name: 'manager',
                  type: 'list',
                  message: 'Who is the new employee\'s manager?',
                  choices: employees
              }
          ]).then((response) => {
              db.query(`INSERT INTO employee SET ?`, 
              {
                  first_name: response.firstName,
                  last_name: response.lastName,
                  role_id: response.role,
                  manager_id: response.manager,
              }, 
              (err, res) => {
                  if (err) throw err;
              })
              db.query(`INSERT INTO role SET ?`, 
              {
                  department_id: response.dept,
              }, 
              (err, res) => {
                  if (err) throw err;
                  console.log(`\n Thank you '${response.firstName} ${response.lastName}' successfully added to database! \n`);
                  startQuestions();
              })
          })
      })
  })
};

const updateEmployeeRole = () => {
  db.query(`SELECT * FROM role;`, (err, res) => {
      if (err) throw err;
      let roles = res.map(role => ({name: role.title, value: role.role_id }));

      db.query(`SELECT * FROM employee;`, (err, res) => {
          if (err) throw err;
          let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
          
          inquirer.prompt([
              {
                  name: 'employee',
                  type: 'rawlist',
                  message: 'Which employee would you like to update the role for?',
                  choices: employees
              },
              {
                  name: 'newRole',
                  type: 'list',
                  message: 'What should the employee\'s new role be?',
                  choices: roles
              },
          ]).then((response) => {
              db.query(`UPDATE employee SET ? WHERE ?`, 
              [
                  {
                      role_id: response.newRole,
                  },
                  {
                      id: response.employee,
                  },
              ], 
              (err, res) => {
                  if (err) throw err;
                  console.log(`\n Thank you for the update to the database! \n`);
                  startQuestions();
              })
          })
      })
  })
}






// simple query
// db.query(
//   'SELECT * FROM department ',
//   function(err, results) {
//     if(err) throw err;
//     console.log(results); // results contains rows returned by server
//   }
// );

// // with placeholder
// db.query(
//   'SELECT * FROM role',
//   function(err, results) {
//     if(err) throw err;
//     console.log(results);
//   }
// );

// // employees joined with role

// // with placeholder
// db.query(
//   'SELECT employee.*, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id;',
//   function(err, results) {
//     console.log(results);
//   }
// );




module.exports = db;
