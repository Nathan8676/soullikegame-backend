import mongoose from "mongoose"
import { config } from "../../gameSetting.config.ts";
import { DB_NAME } from "./Name.database.ts"
async function connectDb() {
  try {
    await mongoose.connect(`${config.db.mongodbUrl}/${DB_NAME}`)
    console.log("Database connected");
  } catch (err) {
    console.log(err, "database connection error");
    process.exit(1)
  }

}

export default connectDb
