import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000"; // Replace with your backend URL

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Fetch user details using the token from cookies
                await axios.get(`${BACKEND_URL}/api/v1/users/userDetail`, {
                    withCredentials: true, // Sends cookies with the request
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsAuthenticated(false);
                navigate("/user/login"); // Redirect to login if authentication fails
            }
        };

        checkAuth();
    }, [navigate]);

    if (isAuthenticated === null) {
        return <div className="h-screen flex justify-center items-center text-xl">Checking authentication...</div>;
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;


