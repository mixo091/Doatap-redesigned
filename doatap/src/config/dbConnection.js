require('dotenv').config();
const mysql = require('mysql'); 

const connection = mysql.createPool({
	connectionLimit: 10,
	host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_USER || 'root',
	password: process.env.MYSQL_PASSWORD || 'password',
	database: process.env.MYSQL_DATABASE || 'test'
});

// let connection = mysql.createConnection({
//     connectionLimit: 10,
// 	host: process.env.MYSQL_HOST || 'localhost',
// 	user: process.env.MYSQL_USER || 'root',
// 	password: process.env.MYSQL_PASSWORD || 'root',
// 	database: process.env.MYSQL_DATABASE || 'users'
// });

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Database connected!");
// });

module.exports = connection;
