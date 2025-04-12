import React, { useState, useEffect } from "react";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Moon, Sun, Code, Users, Brain, ChevronRight, Home, User, LogOut, Menu, X, Bell, Settings, Globe } from "lucide-react";
import axios from "axios";
import Sidebar from "../Components/Sidebar"; // Import the Sidebar component
import ChatbotComponent from "./Chatbot";
import ChatBot from "react-chatbotify";
import SehpaathiBot from "./Chatbot";

const BACKEND_URL = "http://localhost:3000";

// Interview card data - now used for sidebar navigation
const navItems = [
    {
        title: "Dashboard",
        description: "Your personal dashboard",
        icon: <Home className="w-5 h-5" />,
        lightClasses: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
        darkClasses: "text-gray-300 hover:bg-gray-700 hover:text-white",
        link: "/dashboard",
    },
    {
        title: "Instant Preparation",
        description: "Prepare yourself based on the available resources.",
        icon: <Brain className="w-5 h-5" />,
        lightClasses: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
        darkClasses: "text-gray-300 hover:bg-gray-700 hover:text-white",
        link: "/preparation",
    },
    {
        title: "Testing Arena",
        description: "Practice interviews, coding problems, and MCQs.",
        icon: <Code className="w-5 h-5" />,
        lightClasses: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
        darkClasses: "text-gray-300 hover:bg-gray-700 hover:text-white",
        link: "/Test",
    },
    {
        title: "Job Finder",
        description: "Find jobs that match your skills and experience.",
        icon: <Users className="w-5 h-5" />,
        lightClasses: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
        darkClasses: "text-gray-300 hover:bg-gray-700 hover:text-white",
        link: "/Job",
    },
];

// List of languages for translation
const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "ta", name: "Tamil" },
    { code: "gu", name: "Gujarati" },
    { code: "ur", name: "Urdu" },
    { code: "kn", name: "Kannada" },
    { code: "or", name: "Odia" },
    { code: "ml", name: "Malayalam" },
    { code: "pa", name: "Punjabi" },
    { code: "as", name: "Assamese" },
    { code: "bh", name: "Bhojpuri" },
    { code: "ks", name: "Kashmiri" },
    { code: "sd", name: "Sindhi" },
    { code: "mni", name: "Manipuri" },
    { code: "kok", name: "Konkani" },
    { code: "ne", name: "Nepali" },
    { code: "doi", name: "Dogri" },
    { code: "sant", name: "Santali" },
];

const HomePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState({ name: "User" });
    const [activeItem, setActiveItem] = useState("/dashboard");
    const [isTranslateOpen, setIsTranslateOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState({ code: "en", name: "English" });
    const [isTranslateReady, setIsTranslateReady] = useState(false);
    const [translateLoading, setTranslateLoading] = useState(false);
    const navigate = useNavigate();

    // Sync dark mode with localStorage
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
        localStorage.setItem("darkMode", isDarkMode);
    }, [isDarkMode]);

    const checkGoogleTranslateAvailability = () => {
        return !!document.querySelector('.goog-te-combo');
    };

    // Initialize Google Translate when component mounts with improved error handling
    useEffect(() => {
        let checkInterval;
        let timeoutId;

        const addGoogleTranslateScript = () => {
            setTranslateLoading(true);
            const script = document.createElement("script");
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            
            // Handle script load error
            script.onerror = () => {
                setTranslateLoading(false);
                toast.error("Failed to load translation service. Please check your internet connection.");
            };
            
            document.body.appendChild(script);
            
            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    autoDisplay: false
                }, 'google_translate_element');
                
                // Start checking for the Google Translate dropdown
                checkInterval = setInterval(() => {
                    if (checkGoogleTranslateAvailability()) {
                        setIsTranslateReady(true);
                        setTranslateLoading(false);
                        clearInterval(checkInterval);
                    }
                }, 300);
                
                // Set a timeout to stop checking after 10 seconds
                timeoutId = setTimeout(() => {
                    if (!isTranslateReady) {
                        clearInterval(checkInterval);
                        setTranslateLoading(false);
                        toast.error("Translation service initialization timed out. Please refresh the page.");
                    }
                }, 10000);
            };
        };
        
        // Check if script is already added
        if (!document.querySelector('script[src*="translate.google.com"]')) {
            addGoogleTranslateScript();
        } else if (checkGoogleTranslateAvailability()) {
            // If script is already loaded and element exists
            setIsTranslateReady(true);
        } else {
            // If script is loaded but element doesn't exist yet
            checkInterval = setInterval(() => {
                if (checkGoogleTranslateAvailability()) {
                    setIsTranslateReady(true);
                    clearInterval(checkInterval);
                }
            }, 300);
            
            timeoutId = setTimeout(() => {
                clearInterval(checkInterval);
            }, 5000);
        }
        
        // Clean up intervals and timeouts
        return () => {
            if (checkInterval) clearInterval(checkInterval);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Function to change language with improved error handling
    const changeLanguage = (language) => {
        if (!isTranslateReady) {
            if (translateLoading) {
                toast.info("Translation service is still loading. Please wait a moment.");
            } else {
                toast.error("Translation service not available. Please refresh and try again.");
            }
            return;
        }
        
        setTranslateLoading(true);
        const googleTranslateSelect = document.querySelector('.goog-te-combo');
        
        try {
            googleTranslateSelect.value = language.code;
            googleTranslateSelect.dispatchEvent(new Event('change'));
            setSelectedLanguage(language);
            setIsTranslateOpen(false);
            setTranslateLoading(false);
        } catch (error) {
            console.error("Translation error:", error);
            toast.error("Failed to change language. Please try again.");
            setTranslateLoading(false);
        }
    };

    // Simulate fetching user data on component mount
    useEffect(() => {
        // Mock API call to get user data
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/users/userDetail`, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                });
                
                setCurrentUser(response.data.user);
            } catch (error) {
                console.error("Failed to fetch user data", error);
                toast.error("Failed to load user data. Please refresh the page.");
            } finally {
                // Hide loading screen after API call completes
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // Toggle translate dropdown
    const toggleTranslate = () => {
        setIsTranslateOpen(!isTranslateOpen);
    };

    // Navigate to Profile Page
    const goToProfile = () => {
        navigate("/user/profile");
    };

    // Logout function
    const handleLogout = async () => {
        try {
            await axios.get(`${BACKEND_URL}/api/v1/users/logout`, {
                withCredentials: true
            });

            toast.info("Logging out...", { autoClose: 1500 });
            localStorage.removeItem("token");

            setTimeout(() => navigate("/user/login"), 1500);
        } catch (error) {
            toast.error("Logout failed. Please try again!");
        }
    };

    // Enhanced Welcome/Loading Screen Component
    const LoadingScreen = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white transition-all duration-500">
            <div className="text-center relative overflow-hidden p-8 rounded-2xl backdrop-blur-sm bg-black bg-opacity-20">
                {/* Animated 3D elements in background */}
                <div className="absolute h-40 w-40 rounded-xl bg-blue-500 opacity-20 -top-20 -left-20 animate-float"></div>
                <div className="absolute h-32 w-32 rounded-full bg-indigo-500 opacity-20 bottom-10 -right-10 animate-float-delayed"></div>
                <div className="absolute h-24 w-24 rounded-full bg-purple-500 opacity-20 top-40 right-10 animate-float-slow"></div>
                
                <h1 className="text-5xl font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                    Welcome{currentUser.username ? `, ${currentUser.username}` : ""}
                </h1>
                <p className="text-xl mb-6 text-blue-100">Loading your personalized dashboard</p>
                
                {/* Enhanced loader animation */}
                <div className="relative my-8">
                    <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-blue-300 border-opacity-50 rounded-full mx-auto animate-pulse"></div>
                    <div className="absolute inset-0 w-16 h-16 m-2 border-4 border-indigo-400 border-opacity-50 border-t-transparent rounded-full mx-auto animate-spin-slow"></div>
                </div>
                
                {/* Pulse dots */}
                <div className="flex justify-center space-x-2 mt-4">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-delay-1"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-delay-2"></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse-delay-3"></div>
                </div>
            </div>
        </div>
    );

    // Dashboard Content Component
    const DashboardContent = () => {
        const cardColors = [
            "from-blue-500 to-indigo-600",
            "from-emerald-500 to-teal-600",
            "from-purple-500 to-pink-600"
        ];
        
        return (
            <div className="p-6">
                <h2 className="text-3xl font-bold mb-8 relative">
                    Your Dashboard
                    <span className="block h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mt-2 rounded-full"></span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {navItems.slice(1).map((card, idx) => (
                        <Link key={idx} to={card.link} className="group perspective">
                            <div className={`rounded-xl p-6 shadow-xl transform transition duration-300 group-hover:translate-y-2 group-hover:rotate-1 group-hover:shadow-2xl ${
                                isDarkMode 
                                    ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700" 
                                    : `bg-white text-gray-800 border border-gray-100`
                            }`}
                            style={{
                                boxShadow: isDarkMode 
                                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' 
                                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div className={`relative rounded-lg w-14 h-14 flex items-center justify-center mb-5 shadow-lg transform transition-transform group-hover:scale-110 bg-gradient-to-br ${cardColors[idx]}`}
                                style={{
                                    boxShadow: `0 8px 20px -3px ${idx === 0 ? 'rgba(59, 130, 246, 0.5)' : idx === 1 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(168, 85, 247, 0.5)'}`
                                }}>
                                    {card.icon}
                                    <div className="absolute inset-0 rounded-lg bg-white opacity-20 blur-sm"></div>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                                <p className="mb-5 text-sm opacity-80">{card.description}</p>
                                <div className="flex items-center text-sm font-medium group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                    <span className="mr-2">Get Started</span>
                                    <ChevronRight className="w-4 h-4 transform transition-all group-hover:translate-x-2" />
                                </div>
                                
                                {/* Subtle gradient overlay effect */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                {/* Stats Section */}
                <div className={`mt-10 p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}
                style={{
                    boxShadow: isDarkMode 
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' 
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}>
                    <h3 className="text-xl font-bold mb-4">Your Progress</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: "Sessions", value: "12", color: "from-blue-500 to-indigo-600" },
                            { label: "Problems Solved", value: "48", color: "from-green-500 to-emerald-600" },
                            { label: "Interviews", value: "5", color: "from-purple-500 to-pink-600" },
                            { label: "Applications", value: "8", color: "from-orange-500 to-red-600" },
                        ].map((stat, idx) => (
                            <div key={idx} className="rounded-lg p-4 text-center relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 hover:opacity-20 transition-opacity`}></div>
                                <h4 className="text-3xl font-bold mb-1">{stat.value}</h4>
                                <p className="text-sm opacity-70">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen flex transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <ToastContainer />
            
            {/* Loading Screen - only shows while API is loading */}
            {loading && <LoadingScreen />}
            {/* <SehpaathiBot/> */}
            {/* Hidden div for Google Translate */}
            <div id="google_translate_element" style={{ display: 'none' }}></div>

            {/* Sidebar Component */}
            <Sidebar
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                currentUser={currentUser}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                goToProfile={goToProfile}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}>
                {/* Top Nav with 3D-like elements */}
                <header className={`w-full px-6 py-4 ${
                    isDarkMode ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-white"} border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"} flex items-center justify-between shadow-md`}>
                    <div className="flex items-center">
                        {!isSidebarOpen && (
                            <button 
                                onClick={toggleSidebar}
                                className="mr-4 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform hover:scale-110"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}
                        <h2 className="text-xl font-semibold">Welcome, {currentUser.username || "User"}</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {/* Translation Button */}
                        <div className="relative">
                            <button 
                                onClick={toggleTranslate}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform hover:scale-110 flex items-center"
                            >
                                <Globe className="w-5 h-5 mr-1" />
                                <span className="text-sm hidden md:inline">{selectedLanguage.name}</span>
                            </button>
                            
                            {/* Translation Dropdown */}
                            {isTranslateOpen && (
                                <div className={`absolute right-0 mt-2 py-2 w-48 rounded-md shadow-lg z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className="px-4 py-2 text-sm font-medium border-b border-gray-200 dark:border-gray-700">
                                        Select Language
                                    </div>
                                    {languages.map((language) => (
                                        <button
                                            key={language.code}
                                            onClick={() => changeLanguage(language)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${selectedLanguage.code === language.code ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : ''}`}
                                        >
                                            {language.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative transition-transform hover:scale-110">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform hover:scale-110">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Page Content with enhanced styling */}
                <main className="p-6 relative">
                    {/* Background design elements */}
                    {!isDarkMode && (
                        <>
                            <div className="fixed top-24 right-12 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
                            <div className="fixed bottom-12 left-96 w-80 h-80 bg-indigo-500 rounded-full opacity-5 blur-3xl"></div>
                        </>
                    )}
                    
                    <Routes>
                        <Route path="/" element={<DashboardContent />} />
                        <Route path="/dashboard" element={<DashboardContent />} />
                        <Route path="/preparation" element={
                            <div className="p-6">
                                <h2 className="text-3xl font-bold mb-2">Instant Preparation</h2>
                                <span className="block h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-500 mb-8 rounded-full"></span>
                                <p className="text-lg opacity-80">Your preparation content will appear here.</p>
                            </div>
                        } />
                        <Route path="/Test" element={
                            <div className="p-6">
                                <h2 className="text-3xl font-bold mb-2">Testing Arena</h2>
                                <span className="block h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-500 mb-8 rounded-full"></span>
                                <p className="text-lg opacity-80">Your testing content will appear here.</p>
                            </div>
                        } />
                        <Route path="/Job" element={
                            <div className="p-6">
                                <h2 className="text-3xl font-bold mb-2">Job Finder</h2>
                                <span className="block h-1 w-32 bg-gradient-to-r from-blue-500 to-indigo-500 mb-8 rounded-full"></span>
                                <p className="text-lg opacity-80">Your job finding content will appear here.</p>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default HomePage;