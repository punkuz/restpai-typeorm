import app from "./app";
import { MysqlDataSource } from "./database/datasource";


MysqlDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(3000, () => {
      console.log("TypeORM App Connected");
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

  export default MysqlDataSource
