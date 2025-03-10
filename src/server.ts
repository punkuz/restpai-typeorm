import dotenv from "dotenv";
import "reflect-metadata"
import { DataSource } from "typeorm";
import app from "./app";
import { User } from "./entities/user-entity";

//config .env
dotenv.config();

const MysqlDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  database: "node_typeorm",
  logging: false,
  synchronize: process.env.NODE_ENV === "development",
  // logger: "simple-console",
  entities: [User]
});

MysqlDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(3000, () => {
      console.log("Connected");
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

  export default MysqlDataSource
