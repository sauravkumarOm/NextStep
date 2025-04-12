import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Extract token after "Bearer"
        } 
        // If token is not in headers, check cookies
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        // If no token found, return error
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user and attach it to request (excluding password)
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to next middleware or route

    } catch (error) {
        console.error("JWT Authentication Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export { protect };
