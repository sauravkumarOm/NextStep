import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URL = "http://localhost:3000"; 


const LoginRegister = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🛠 Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const userData = { username, email, password };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/users/register`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, 
        }
      );
      

      if (response.status === 201 || response.status === 200) {
        toast.success("Registration successful!");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setIsRegister(false); // Switch to login after registration
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
      toast.error("Error: " + (error.response?.data?.message || "Something went wrong!"));
    }
  };

  // 🛠 Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const loginData = { email, password };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/users/login`,
        loginData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 👈 important
        }
      );

      if (response.status === 200) {
        toast.success("Login successful!");
        setEmail("");
        setPassword("");
        navigate("/user/Home");
        onLoginSuccess && onLoginSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
      toast.error("Error: " + (error.response?.data?.message || "Something went wrong!"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">NextStep</h1>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isRegister ? "Register" : "Login"}
        </h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {isRegister && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition-colors"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setUsername("");
              setPassword("");
              setConfirmPassword("");
              setEmail("");
            }}
            className="text-indigo-500 hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
