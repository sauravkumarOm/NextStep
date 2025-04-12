import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Brain, Code, Users, User, Sun, Moon, LogOut, MessageSquare, ChevronRight } from "lucide-react";

const initialPosts = [
  { id: 1, name: "Alice", role: "Backend Developer", content: "Optimizing database queries for better performance.", timestamp: new Date('2025-03-30').getTime() },
  { id: 2, name: "Bob", role: "UI/UX Designer", content: "Working on a new design system for better user experience.", timestamp: new Date('2025-03-31').getTime() },
  { id: 3, name: "Charlie", role: "Data Analyst", content: "Analyzing user engagement data for insights.", timestamp: new Date('2025-04-01').getTime() },
  { id: 4, name: "David", role: "Backend Developer", content: "Implementing authentication with JWT.", timestamp: new Date('2025-04-01').getTime() },
  { id: 5, name: "Emma", role: "UI/UX Designer", content: "Creating wireframes for the new dashboard.", timestamp: new Date('2025-04-02').getTime() },
  { id: 6, name: "Frank", role: "Data Analyst", content: "Generating reports on customer behavior.", timestamp: new Date('2025-04-02').getTime() },
  { id: 7, name: "Grace", role: "Backend Developer", content: "Building RESTful APIs for mobile applications.", timestamp: new Date('2025-04-02').getTime() },
  { id: 8, name: "Hannah", role: "UI/UX Designer", content: "Designing a dark mode theme.", timestamp: new Date('2025-04-02').getTime() },
  { id: 9, name: "Ian", role: "Data Analyst", content: "Visualizing data trends using Power BI.", timestamp: new Date('2025-04-02').getTime() },
  { id: 10, name: "Jack", role: "Backend Developer", content: "Integrating third-party APIs.", timestamp: new Date('2025-04-02').getTime() },
  // More posts...
];

// First Sidebar Component (updated with enhanced styling)
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
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold relative">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">NextStep</span>
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
                            {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium">{currentUser.username || "User"}</h3>
                        <p className="text-xs opacity-70">{currentUser.email || "user@example.com"}</p>
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
                        style={{
                            boxShadow: activeItem === item.link 
                                ? (isDarkMode 
                                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' 
                                    : '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.05)')
                                : 'none'
                        }}
                    >
                        {activeItem === item.link && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                        )}
                        <span className={`mr-3 transition-transform transform ${activeItem === item.link ? "scale-110" : ""}`}>{item.icon}</span>
                        <span>{item.title}</span>
                        {activeItem === item.link && (
                            <span className="absolute right-4">
                                <ChevronRight className="w-4 h-4 opacity-70" />
                            </span>
                        )}
                    </Link>
                ))}
            </nav>
            
            {/* Sidebar Footer */}
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

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [newPost, setNewPost] = useState({ name: "", role: "Backend Developer", content: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the sidebar
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('/community');
  const [currentUser, setCurrentUser] = useState({ 
    username: "User", 
    email: "user@example.com" 
  });
  
  // Sidebar functions
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const goToProfile = () => console.log("Go to profile");
  const handleLogout = () => console.log("Logout");

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("communityPosts"));
    if (storedPosts) {
      setPosts(storedPosts);
    } else {
      localStorage.setItem("communityPosts", JSON.stringify(initialPosts));
      setPosts(initialPosts);
    }
    
    // Apply dark mode if needed
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addPost = () => {
    if (!newPost.name || !newPost.content) return;
    
    const updatedPosts = [
      { ...newPost, id: Date.now(), timestamp: Date.now() },
      ...posts
    ];
    setPosts(updatedPosts);
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts));
    setNewPost({ name: "", role: "Backend Developer", content: "" });
    setIsModalOpen(false);
  };

  // Sort posts by timestamp (most recent first)
  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);
  const filteredPosts = filter === "All" ? sortedPosts : sortedPosts.filter((post) => post.role === filter);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
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
        
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Community</h1>
              <button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white font-medium py-2 px-4 rounded-full flex items-center shadow-md transition-all transform hover:-translate-y-0.5"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="mr-2">+</span> New Post
              </button>
            </div>
            
            <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center flex-wrap gap-2">
                <span className="mr-3 text-gray-700 dark:text-gray-300">Filter by Role:</span>
                <div className="flex flex-wrap gap-2">
                  {["All", "Backend Developer", "UI/UX Designer", "Data Analyst"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setFilter(role)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        filter === role 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold mr-3">
                      {post.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-bold">{post.name}</h2>
                      <div className="flex items-center">
                        <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">{post.role}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={newPost.name}
                onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Role</label>
              <select
                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={newPost.role}
                onChange={(e) => setNewPost({ ...newPost, role: e.target.value })}
              >
                <option>Backend Developer</option>
                <option>UI/UX Designer</option>
                <option>Data Analyst</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Content</label>
              <textarea
                placeholder="What would you like to share?"
                className="w-full border rounded-lg p-2 min-h-24 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg mr-2 transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                onClick={addPost}
              >
                Post
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}