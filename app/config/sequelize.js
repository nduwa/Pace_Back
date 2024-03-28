const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  dialect: "postgres",
  host: process.env[`DBHOST`],
  database: process.env[`DBNAME`],
  username: process.env[`DBUSER`],
  password: process.env[`DBPASS`],
};
