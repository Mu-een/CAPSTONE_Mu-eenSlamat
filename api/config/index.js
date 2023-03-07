require('dotenv').config();
const { createPool} = require('mysql');

let connection = createPool({
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    port: process.env.dbPort,
    database: process.env.dbName,
    multipleStatements: true 
});
module.exports = connection;