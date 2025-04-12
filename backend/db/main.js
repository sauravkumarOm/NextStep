import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// database is in another continent
// console.log(process.env.MONGODB_URI);

const connectDB = async ()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MONGOdb connected !! DB HOST : ${connectionInstance.connection.host}`);
        
    } catch (error) {

        console.log("MONGOdb connection error",error);
        
    }
}
    
export default connectDB