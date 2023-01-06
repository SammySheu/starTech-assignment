const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  connectionLimit:4,
  host: "localhost",
  port: 3306,
  user: "localUser",
  password: "password",
  database:"starTech_db",
})

pool.getConnection( (err, connection) => {
  if(err) throw err;
  console.log('Database connect successfully');
  connection.release()
})


module.exports = pool;