import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB=async ()=>{
    try{
        const connectionInstances=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("DB connected at : ", connectionInstances.connection.host)
    }
    catch(err){
        console.log("error in connection : ", e)
    }
}

export default connectDB;