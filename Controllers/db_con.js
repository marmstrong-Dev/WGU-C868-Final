const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

// DB Connection Parameters
const dbCon = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBSCHEMA
});

// Establish DB Connection
dbCon.connect((error) => {
    if (error) { console.log(error); }
    else { console.log('Connected to MySQL'); }
});

module.exports = dbCon;
