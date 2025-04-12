import mongoose from "mongoose";
import { Schema } from "mongoose";

const job_postingSchema=new Schema({
    company_name:{
        type:String,
        required:true,
    },
    GST_number:{
        type:String,
        required:true,
    },
    job_location:{
        type:String,
        required:true,
    },
    stipened:{
        type:Number,

    },
    job_category:{
        type:String,
        required:true,
    },
    required_skills:{
        type:[String],
        required:true,
    },
    job_description:{
        type:String,
        required:true,
    },
    job_type:{
        type:String, //full time , part time, internship,contract
    }

},{timestamps:true})

export const Job_posting=mongoose.model("Job_posting",job_postingSchema)