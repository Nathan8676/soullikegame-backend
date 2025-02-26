import mongoose from "mongoose"

async function connectDb(){
  try{
    const db = await mongoose.connect("mongodb://localhost:27017/soulLikeGame")
      console.log("Database connected");

  }catch(err){
    console.log(err, "database connection error");
    process.exit(1)
  }

}

export default connectDb
