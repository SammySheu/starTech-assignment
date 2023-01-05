let mysql = require('mysql2');


let pool = mysql.createPool({
  connectionLimit:4,
  host: "localhost",
  port: 3306,
  user: "localUser",
  password: "password",
  database:"starTech_userdb"
});

pool.getConnection((err,connection) => {
  if(err) throw err;
  console.log('Database connected successfully');
  if (connection) connection.release()
});

module.exports = pool;