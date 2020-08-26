const util = require('util');
const mysql = require('mysql');
require('dotenv').config();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_KEY,
    database: 'employees'
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
  //  connection.end();
});

connection.query = util.promisify(connection.query);
module.exports = connection;