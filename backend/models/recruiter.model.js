import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const recruiterSchema = new Schema({

    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    location:{
        type:String,
        default:""
    },
    NGO_Number:{  //rkhna hai
        type:String,
        default:""
    },
   
    candidates_hired:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    metadata:{
        type:[Object],
        default:[]
    }

  },{timestamps:true})

  
// hashing password using the pre hook middleware of mongoose 

recruiterSchema.pre("save", async function (next) {

    // further condition to check if password is modified or not
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// checking whether the password is correct or not

recruiterSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

recruiterSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
       
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}
recruiterSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
       
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}


  export const Recruiter= mongoose.model("Recruiter",recruiterSchema)