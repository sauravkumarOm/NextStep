import React from "react";
import { Link } from "react-router-dom";
import { Home, Brain, Code, Users, User, Sun, Moon, LogOut, MessageSquare, ChevronRight, Bot } from "lucide-react";

const Sidebar = ({ 
    isDarkMode, 
    toggleDarkMode, 
    isSidebarOpen, 
    toggleSidebar, 
    currentUser, 
    activeItem, 
    setActiveItem,
    goToProfile,
    handleLogout
}) => {
    const navItems = [
        {
            title: "Dashboard",
            description: "Your personal dashboard",
            icon: <Home className="w-5 h-5" />,
            lightClasses: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
            darkClasses: "text-gray-300 hover:bg-gray-700 hover:text-white",
            link: "/user/Home",
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
            link: "/test",
        },
        {
            title: "Job Finder",
            description: "Find jobs that match your skills and experience.",
            icon: <Users className="w-5 h-5" />,
            lightClasses: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
            darkClasses: "text-gray-300 hover:bg-gray-700 hover:text-white",
            link: "/Job",
        },
        {
            title: "Community",
            description: "Connect with other developers and share your experiences.",
            icon: <MessageSquare className="w-5 h-5" />,
            lightClasses: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
            darkClasses: "text-gray-300 hover:bg-gray-700 hover:text-white",
            link: "/community",
        },
        {
            title: "AI Interview",
            description: "Practice AI-driven interviews.",
            icon: <Bot className="w-5 h-5" />,
            lightClasses: "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
            darkClasses: "text-gray-300 hover:bg-gray-700 hover:text-white",
            link: "/ai-interview",
        },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 transition-all duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDarkMode ? "bg-gradient-to-b from-gray-800 to-gray-900" : "bg-white"} shadow-2xl border-r ${
            isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        style={{
            boxShadow: isDarkMode 
                ? '5px 0 15px rgba(0, 0, 0, 0.3)' 
                : '5px 0 15px rgba(0, 0, 0, 0.05)'
        }}>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 drop-shadow-lg">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold relative">
                        <Link to = "/"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">NextStep</span></Link>
                        <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></span>
                    </h1>
                    <button 
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transform transition-transform hover:scale-110"
                        onClick={toggleSidebar}
                    >
                        X
                    </button>
                </div>
            </div>
            
            {/* User Profile in Sidebar */}
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                            {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium">{currentUser?.username || "User"}</h3>
                        <p className="text-xs opacity-70">{currentUser?.email || "No email"}</p>
                    </div>
                </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="mt-4 p-4 space-y-2">
                {navItems.map((item, idx) => (
                    <Link 
                        key={idx} 
                        to={item.link}
                        onClick={() => setActiveItem(item.link)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all relative overflow-hidden transform hover:-translate-y-0.5 ${
                            activeItem === item.link 
                                ? (isDarkMode 
                                    ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md" 
                                    : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-md") 
                                : (isDarkMode ? item.darkClasses : item.lightClasses)
                        }`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.title}</span>
                    </Link>
                ))}
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col space-y-2">
                    <button 
                        onClick={goToProfile}
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all transform hover:-translate-y-0.5"
                    >
                        <User className="w-5 h-5 mr-3" />
                        <span>Profile</span>
                    </button>
                    
                    <button 
                        onClick={toggleDarkMode}
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all transform hover:-translate-y-0.5"
                    >
                        {isDarkMode ? 
                            <Sun className="w-5 h-5 mr-3 text-yellow-400" /> : 
                            <Moon className="w-5 h-5 mr-3 text-blue-600" />
                        }
                        <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-all transform hover:-translate-y-0.5"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
