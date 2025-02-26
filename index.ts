import {app}  from "./src/app.ts"
import connectDb from "./src/DataBase/index.database.ts";

connectDb()
.then(() => {
  app.on('error', (error: Error ) => {
    console.log(error);
  })
  app.get(
    '/',
    async(req:any , res:any , next:any  ): Promise<void> => {
      res.status(200).json('hello,world ')
    }
  )
  app.listen(8080, () => {
    console.log(`server is up and running on port 8080`);
  });
  console.log("Database connected");
})
.catch((err) => {
  console.log(err, "database connection error");
})


