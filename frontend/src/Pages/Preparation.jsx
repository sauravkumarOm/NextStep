import React, { useEffect, useState } from 'react';
import { Moon, Sun, Menu, Users, User, LogOut } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';

const BACKEND_URL = "https://nextstep-mb2t.onrender.com";

const getDomain = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch (err) {
    return url;
  }
};

const Preparation = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [results, setResults] = useState({
    groq_response: '',
    videos: [],
    playlists: [],
    learning_resources: []
  });
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState('');
  const [currentUser] = useState({ username: "User", email: "user@example.com" });
  const [activeItem, setActiveItem] = useState("/preparation");
  const navigate = useNavigate();

  const fetchResourcesForSkill = async (skill) => {
    if (!skill) return;
    setLoading(true);
    setButtonLoading(skill);
    setResults({ groq_response: '', videos: [], playlists: [], learning_resources: [] }); // Reset results
    try {
      console.log("Fetching resources for:", skill); // Debug
      const response = await fetch('http://127.0.0.1:7000/prepbk/get_resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: skill })
      });
      const data = await response.json();
      console.log("API response:", data); // Debug
      setResults(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error("Failed to fetch resources. Please try again.");
    }
    setLoading(false);
    setButtonLoading('');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/users/userDetail`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        const userSkills = response.data.user.skills || [];
        console.log("User skills:", userSkills); // Debug
        setSkills(userSkills);
        
        if (userSkills.length > 0) {
          console.log("Auto-selecting skill:", userSkills[0]); // Debug
          setSelectedSkill(userSkills[0]);
          fetchResourcesForSkill(userSkills[0]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goToProfile = () => {
    navigate("/user/profile");
  };

  const handleLogout = async () => {
    try {
      toast.info("Logging out...", { autoClose: 1500 });
      localStorage.removeItem("token");
      setTimeout(() => navigate("/user/login"), 1500);
    } catch (error) {
      toast.error("Logout failed. Please try again!");
    }
  };

  const handleSkillSelect = (skill) => {
    console.log("Selected skill:", skill); // Debug
    setSelectedSkill(skill);
    setTimeout(() => fetchResourcesForSkill(skill), 0); // Ensure fetch happens after state update
  };

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Sidebar
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleTheme}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        currentUser={currentUser}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        goToProfile={goToProfile}
        handleLogout={handleLogout}
      />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}>
        <header className={`w-full px-6 py-4 ${
          isDarkMode ? "bg-gradient-to-r from-violet-600 to-indigo-600" : "bg-gradient-to-r from-blue-500 to-cyan-500"
        } flex items-center justify-between`}>
          <div className="flex items-center">
            {!isSidebarOpen && (
              <button 
                onClick={toggleSidebar}
                className="mr-4 p-1.5 rounded-lg hover:bg-white/20 transition-transform hover:scale-110"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">Preparation Guide</h1>
              <p className={`mt-1 text-md ${isDarkMode ? "text-indigo-100" : "text-blue-50"}`}>
                Select a skill to view curated resources
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isDarkMode ? (
              <Sun size={24} className="text-yellow-300" />
            ) : (
              <Moon size={24} className="text-blue-100" />
            )}
          </button>
        </header>

        <div className="relative">
          <div className="hidden md:block md:fixed md:top-32 md:left-64 md:h-[calc(100vh-8rem)] md:w-1/4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center scale-125">
              <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
                <DotLottieReact
                  src="https://lottie.host/e230966e-636a-4b44-af95-16d565fd2a65/rl5m8Y3ytl.lottie"
                  loop
                  autoplay
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute inset-0 ${isDarkMode ? "bg-slate-950/30" : "bg-white/30"}`} />
            </div>
          </div>

          <div className="md:ml-[25%]">
            <div className="max-w-3xl mx-auto p-6">
              {/* Skill Selection Buttons */}
              <div className="mb-8">
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Select a Skill to Prepare
                </h2>
                <div className="flex flex-wrap gap-3">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <button
                        key={index}
                        onClick={() => handleSkillSelect(skill)}
                        disabled={buttonLoading === skill}
                        className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                          selectedSkill === skill
                            ? isDarkMode
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                              : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                            : isDarkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-white"
                              : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                        } ${buttonLoading === skill ? "cursor-wait" : "cursor-pointer"}`}
                      >
                        {buttonLoading === skill ? (
                          <div className="flex items-center">
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></div>
                            <span>{skill}</span>
                          </div>
                        ) : (
                          skill
                        )}
                      </button>
                    ))
                  ) : (
                    <p className={`text-md ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      No skills found. Please add skills in your profile.
                    </p>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {loading && !buttonLoading && (
                <div className={`flex flex-col justify-center items-center py-12 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                  <p className="mt-4 text-lg font-medium">Loading resources...</p>
                </div>
              )}
            </div>

            {/* Results Container */}
            {!loading && selectedSkill && (
              <div key={selectedSkill} className="max-w-3xl mx-auto space-y-8 px-6 pb-12">
                {/* Selected Skill Header */}
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-slate-800" : "bg-white"
                } shadow-md border ${
                  isDarkMode ? "border-slate-700" : "border-gray-200"
                }`}>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    Resources for: <span className="font-bold">{selectedSkill}</span>
                  </h2>
                </div>
                
                {/* Groq AI Response */}
                {results.groq_response && (
                  <div className={`rounded-2xl shadow-lg p-6 transition-all duration-300 transform hover:scale-[1.01] ${
                    isDarkMode 
                      ? "bg-slate-900 border-slate-800 text-slate-300" 
                      : "bg-white border-gray-200 text-gray-700"
                    } border hover:shadow-xl`}>
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Preparation Hint
                    </h2>
                    <div className="prose max-w-none">
                      <ReactMarkdown>
                        {results.groq_response}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Videos Section */}
                {results.videos.length > 0 && (
                  <div className="space-y-6">
                    <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Videos
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {results.videos.map((video, idx) => (
                        <a
                          key={idx}
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border ${
                            isDarkMode 
                              ? "bg-slate-900 border-slate-800" 
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="relative">
                            {video.thumbnail && (
                              <div className="w-full h-48">
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${
                                  isDarkMode ? "from-gray-900/80 to-transparent" : "from-white/80 to-transparent"
                                }`}></div>
                              </div>
                            )}
                            <div className="p-6">
                              <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {video.title}
                              </h3>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Playlists Section */}
                {results.playlists.length > 0 && (
                  <div className="space-y-6">
                    <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Playlists
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {results.playlists.map((playlist, idx) => (
                        <a
                          key={idx}
                          href={playlist.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border ${
                            isDarkMode 
                              ? "bg-slate-900 border-slate-800" 
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="relative">
                            {playlist.thumbnail && (
                              <div className="w-full h-48">
                                <img
                                  src={playlist.thumbnail}
                                  alt={playlist.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${
                                  isDarkMode ? "from-gray-900/80 to-transparent" : "from-white/80 to-transparent"
                                }`}></div>
                              </div>
                            )}
                            <div className="p-6">
                              <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {playlist.title}
                              </h3>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Resources Section */}
                {results.learning_resources.length > 0 && (
                  <div className="space-y-6">
                    <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Learning Resources
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {results.learning_resources.map((resource, idx) => {
                        const domain = getDomain(resource);
                        const logoUrl = `https://logo.clearbit.com/${domain}`;
                        return (
                          <a
                            key={idx}
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block rounded-2xl p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border ${
                              isDarkMode 
                                ? "bg-slate-900 border-slate-800" 
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className={`w-12 h-12 mr-4 rounded-lg p-2 flex items-center justify-center ${
                                isDarkMode ? "bg-white/10" : "bg-gray-100"
                              }`}>
                                <img
                                  src={logoUrl}
                                  alt={domain}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = domain.charAt(0).toUpperCase();
                                  }}
                                />
                              </div>
                              <div>
                                <p className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                  {domain}
                                </p>
                                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {resource.length > 40 ? resource.substring(0, 40) + '...' : resource}
                                </p>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No Results State */}
                {!results.groq_response && 
                 results.videos.length === 0 && 
                 results.playlists.length === 0 && 
                 results.learning_resources.length === 0 && (
                  <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <h3 className="text-xl font-medium mb-2">No resources found</h3>
                    <p>Try selecting a different skill or check back later.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preparation;
