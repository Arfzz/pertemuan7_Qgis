const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "kenya_db",
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
