console.log("hello")
import connectDB from "./db/index.js"
import dotenv from "dotenv"
import app from "./app.js"

dotenv.config();

connectDB()
.then(()=>{ app.listen(process.env.PORT, ()=>{ console.log("Started to listen on port : ",process.env.PORT)})})
.catch((error)=>{console.log("failed to connect database.",err)});