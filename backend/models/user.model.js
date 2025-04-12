import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'; 

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    skills: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ""
    },
    metadata: {
        type: [Object],
        default: []
    }
},
    {
        timestamps: true
    });

// Hashing password using the pre-save middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password verification method
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });
};

export const User = mongoose.model("User", userSchema);
