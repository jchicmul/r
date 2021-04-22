const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        console.log('Error al conectar');
    };

    if (connection) connection.release();
    console.log('Conexion establecida');
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;