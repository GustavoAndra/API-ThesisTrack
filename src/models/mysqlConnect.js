const mysql = require("mysql2/promise");

async function connect() {
  if (global.connection && global.connection.state !== "disconnected") {
    return global.connection;
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASS,
    database: process.env.DB_DATABASE,
  });  

  console.log("Conectou no MySQL!");

  global.connection = connection;
  return connection;
}

module.exports = { connect };