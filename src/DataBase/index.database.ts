import mongoose from "mongoose"
import { DB_NAME } from "./Name.database.ts"
async function connectDb(){
  try{
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log("Database connected");
  }catch(err){
    console.log(err, "database connection error");
    process.exit(1)
  }

}

export default connectDb
