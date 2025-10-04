import mysql from "mysql2/promise"

const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "expense_mgmt",
  waitForConnections: true,
  connectionLimit: 10,
}

export const pool = mysql.createPool(config)
