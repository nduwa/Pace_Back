import dotenv from "dotenv";

dotenv.config();

const VARIABLES = {
  PORT: process.env.PORT || 2023,
  DBHOST: process.env.DBHOST,
  DBUSER: process.env.DBUSER || "root",
  DBPASS: process.env.DBPASS || "",
  DBNAME: process.env.DBNAME || "posts",
  JWT_TOKEN: process.env.JWT_TOKEN || "posts",
  EXPIRE:
    Number(process.env.EXPIRE as unknown as string) * 60 * 60 ||
    (3600 as number),
  AIKEY: process.env.AIKEY || "",
  CLOUD_NAME: process.env.CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  MAILER_USERNAME: process.env.MAILER_USERNAME || "",
  MAILER_PASSWORD: process.env.MAILER_PASSWORD || "",
  MAILER_SERVICE: process.env.MAILER_SERVICE || "",
  LOGO_URL: process.env.LOGO_URL || "",
  APP_NAME: process.env.APP_NAME || "InsureMed",
  MAILER_NAME: process.env.MAILER_NAME || "",
  MAILER_PORT: process.env.MAILER_PORT || "",
};

export default VARIABLES;
