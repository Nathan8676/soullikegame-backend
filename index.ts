import {Character,} from "./src/dataModel/index.ts"
import {server, startGameLoop }  from "./src/app.ts"
import connectDb from "./src/DataBase/index.database.ts";

connectDb()
.then(async () => {
  server.on('error', (error: Error ) => {
    console.log(error);
  })
    await startGameLoop();
  server.listen(8080, () => {
    console.log(`server is up and running on port 8080`);
  });
  console.log("Database connected");
})
.catch((err) => {
  console.log(err, "database connection error");
})


