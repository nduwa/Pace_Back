import { Sequelize } from "sequelize-typescript";
import VARIABLES from "./variables";
import models from "../database";

const dbConnect = () => {
  return new Sequelize(VARIABLES.DBNAME, VARIABLES.DBUSER, VARIABLES.DBPASS, {
    host: VARIABLES.DBHOST,
    dialect: "postgres",
  });
};

const db = dbConnect();
db.addModels(models);
db.options.logging = false;

export default db;
