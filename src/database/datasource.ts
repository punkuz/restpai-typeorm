import { DataSource } from "typeorm";
import dotenv from "dotenv";

//config .env
dotenv.config();

export const MysqlDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: +process.env.DB_PORT,
  username: "root",
  database: process.env.DB_NAME,
  logging: false,
  synchronize: false,
  // logger: "simple-console",
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/database/migrations/**/*.ts"],
});