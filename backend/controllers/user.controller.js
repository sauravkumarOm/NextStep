import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register a new user
const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if ([email, username, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required", status: 400 });
        }

        // Check if user already exists
        const existedUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existedUser) {
            return res.status(409).json({ message: "User already exists", status: 409 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({ email, username, password: hashedPassword });

        // ✅ Generate JWT Token with user ID
        const token = generateToken(user._id);

        // Send token as a cookie
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        //     sameSite: "none",
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,        // ❌ Don't require HTTPS in dev
            sameSite: "lax",      // ✅ "lax" works fine locally
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          

        return res.status(201).json({
            message: "User created successfully",
            status: 201,
            user: { _id: user._id, email: user.email, username: user.username }
        });

    } catch (error) {
        console.error("Error in user registration", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if ([email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required", status: 400 });
        }

        // Find user
        console.log("Trying login for:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log("User found:", user);
        console.log("password", user.password);
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);
        

        // ✅ Generate JWT Token with user ID
        const token = generateToken(user._id);

        // Send token as a cookie
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        //     sameSite: "none",
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,        // ❌ Don't require HTTPS in dev
            sameSite: "lax",      // ✅ "lax" works fine locally
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          

        return res.status(200).json({
            message: "Login successful",
            status: 200,
            user: { _id: user._id, email: user.email, username: user.username }
        });

    } catch (error) {
        console.error("Error in user login", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Logout User (Clears token from cookies)
const logoutUser = async (req, res) => {
    try {
        console.log("Logout request received");

        // ✅ Properly clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.error("Error in user logout", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { registerUser, loginUser, logoutUser };
