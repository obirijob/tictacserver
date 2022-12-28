/** @format */

const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

const { DB, DB_SERVER, DB_USER, DB_PASSWORD } = process.env

const con = mysql.createConnection({
  host: DB_SERVER,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB,
})

con.connect(err => {
  if (err) console.log(err)
  else console.log('🎃 db up!')
})

module.exports = con
