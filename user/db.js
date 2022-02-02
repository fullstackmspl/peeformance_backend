const mysql = require('mysql');
let dbConnectionDetails = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    timezone: 'utc'
}
const db = mysql.createPool(dbConnectionDetails)

db.on('connection', (connection) => {
    connection.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });
});


module.exports = db;
