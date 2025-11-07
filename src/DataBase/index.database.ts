import mongoose from "mongoose"
import { config } from "../../gameSetting.config.ts";
async function connectDb() {
  try {
    await mongoose.connect(`${config.db.mongodbUrl}/${config.db.mongodbName}`)
    console.log("Database connected");
  } catch (err) {
    console.log(err, "database connection error");
    process.exit(1)
  }

}

export default connectDb
