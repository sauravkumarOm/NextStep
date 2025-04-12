import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  StarIcon, 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  UserIcon,
  PencilIcon,
  BellIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const BACKEND_URL = "http://localhost:3000";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [userScores, setUserScores] = useState([]);
  const [activeTab, setActiveTab] = useState('skills');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [highlightedSkill, setHighlightedSkill] = useState(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const profileMenuRef = useRef(null);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/users/userDetail`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true 
        });
        setUser(response.data.user);
        
        // Add a small delay to simulate loading for better UX
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user details.");
        setLoading(false);
      }
    };

    fetchUserData();

    // Load user skill scores from localStorage
    const storedScores = localStorage.getItem('userScores');
    if (storedScores) {
      setUserScores(JSON.parse(storedScores) || [
        { skill: "React.js", level: "Advanced", score: 85, total: 100 },
        { skill: "Node.js", level: "Intermediate", score: 70, total: 100 },
        { skill: "UI/UX Design", level: "Advanced", score: 90, total: 100 },
        { skill: "GraphQL", level: "Beginner", score: 45, total: 100 }
      ]);
    } else {
      // Demo data if no stored data
      setUserScores([
        { skill: "React.js", level: "Advanced", score: 85, total: 100 },
        { skill: "Node.js", level: "Intermediate", score: 70, total: 100 },
        { skill: "UI/UX Design", level: "Advanced", score: 90, total: 100 },
        { skill: "GraphQL", level: "Beginner", score: 45, total: 100 }
      ]);
    }

    // Handle outside clicks for profile menu
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-amber-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-amber-400 fill-current opacity-50" />);
      } else {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
    return <div className="flex items-center">{stars}</div>;
  };

  const renderProgressBar = (score, total) => {
    const percentage = (score / total) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success("Message sent successfully!");
      setMessage('');
      setIsMessageOpen(false);
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      toast.success("Profile updated successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Banner with parallax effect */}
      <div 
        className="h-64 bg-cover bg-center relative overflow-hidden"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-700/80 backdrop-blur-sm"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
        
        {/* Floating action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300 hover:scale-110">
            <BellIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)} 
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300 hover:scale-110 relative"
          >
            <UserIcon className="h-5 w-5" />
            
            {/* Profile dropdown menu */}
            {showProfileMenu && (
              <div 
                ref={profileMenuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 animate-fadeIn"
              >
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">View Profile</a>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Help Center</a>
                <a href="#" className="block px-4 py-2 text-red-600 hover:bg-red-50">Logout</a>
              </div>
            )}
          </button>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-32 pb-12">
        {/* Profile Card with glassmorphism effect */}
        <div className="bg-white backdrop-blur-lg bg-opacity-95 rounded-xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image with edit option */}
              <div className="relative group mx-auto md:mx-0">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={user.profileImage || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"} 
                    alt="Profile" 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/50 rounded-full h-full w-full flex items-center justify-center">
                    <CameraIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 h-5 w-5 rounded-full border-2 border-white"></div>
              </div>
              
              {/* User Info with edit controls */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-center md:justify-start">
                      <h1 className="text-3xl font-bold text-gray-800">
                        {editMode ? (
                          <input 
                            type="text" 
                            value={user.username || "John Doe"} 
                            className="bg-blue-50 border border-blue-200 rounded px-2 py-1"
                            onChange={(e) => setUser({...user, username: e.target.value})}
                          />
                        ) : (
                          user.username || "John Doe"
                        )}
                      </h1>
                      
                      {/* Edit button */}
                      <button 
                        onClick={handleEditToggle}
                        className={`ml-2 p-1 rounded-full transition-all duration-300 hover:scale-110 ${
                          editMode ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {editMode ? <CheckIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    <p className="text-gray-600 flex items-center justify-center md:justify-start gap-1 mt-1">
                      <BriefcaseIcon className="h-4 w-4" />
                      {editMode ? (
                        <input 
                          type="text" 
                          value={user.title || "Senior Designer"}
                          className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-sm"
                          onChange={(e) => setUser({...user, title: e.target.value})}
                        />
                      ) : (
                        user.title || "Senior Designer"
                      )}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center md:items-end">
                    {user.rating && (
                      <div className="flex items-center gap-2">
                        {renderRating(user.rating)}
                        <span className="text-gray-700 font-medium">{user.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Verified Account
                    </div>
                  </div>
                </div>
                
                {/* Bio section */}
                <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-gray-700 italic">
                    {editMode ? (
                      <textarea 
                        className="w-full bg-white border border-blue-200 rounded p-2 text-sm"
                        value={user.bio || "Passionate designer with 7+ years of experience crafting digital experiences. Focused on creating intuitive and aesthetic user interfaces."}
                        onChange={(e) => setUser({...user, bio: e.target.value})}
                        rows={3}
                      />
                    ) : (
                      user.bio || "Passionate designer with 7+ years of experience crafting digital experiences. Focused on creating intuitive and aesthetic user interfaces."
                    )}
                  </p>
                </div>
                
                {/* Contact Details Summary */}
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600">
                  {user.email && (
                    <span className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      {user.email}
                    </span>
                  )}
                  
                  {user.phone && (
                    <span className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      {user.phone}
                    </span>
                  )}
                  
                  {user.location && (
                    <span className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      {user.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="bg-gray-50 px-6 py-3 flex flex-wrap gap-2 justify-center md:justify-start border-t border-gray-100">
            <button 
              onClick={() => setIsMessageOpen(!isMessageOpen)} 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Message
            </button>
            
            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Connect
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <ArrowRightIcon className="h-4 w-4 mr-2" />
              Share Profile
            </button>
          </div>
          
          {/* Message modal */}
          {isMessageOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 animate-fadeIn">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-scaleIn">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium">Send Message</h3>
                  <button onClick={() => setIsMessageOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2 rounded-b-lg">
                  <button 
                    onClick={() => setIsMessageOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Tabs with animation */}
          <div className="border-t border-gray-200">
            <div className="flex overflow-x-auto px-2">
              {["skills", "certifications", "contact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm focus:outline-none transition-all duration-200 whitespace-nowrap relative ${
                    activeTab === tab 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tab Content with animation */}
        <div className="mt-6 animate-fadeIn">
          {activeTab === 'skills' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
                Skills & Expertise
              </h2>
              
              {userScores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userScores.map((skill, index) => (
                    <div 
                      key={index} 
                      className={`border border-gray-100 rounded-lg p-4 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                        highlightedSkill === index ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onMouseEnter={() => setHighlightedSkill(index)}
                      onMouseLeave={() => setHighlightedSkill(null)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">{skill.skill}</h3>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          skill.level === 'Advanced' ? 'bg-green-100 text-green-800' :
                          skill.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Proficiency</span>
                        <span>{skill.score}/{skill.total}</span>
                      </div>
                      {renderProgressBar(skill.score, skill.total)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
                  <UserIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-gray-600">No skills have been added yet.</p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Add Skills
                  </button>
                </div>
              )}
              
              {/* Skill Chart Preview */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-md font-medium text-gray-800 mb-4">Skill Distribution</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-48 flex items-center justify-center">
                  <div className="flex h-full w-full">
                    {userScores.map((skill, index) => (
                      <div 
                        key={index}
                        className="flex-1 flex flex-col items-center justify-end h-full"
                      >
                        <div 
                          className={`w-full ${
                            index === highlightedSkill ? 'bg-blue-500' : 'bg-blue-400'
                          } rounded-t-md transition-all duration-500 ease-out`}
                          style={{ height: `${(skill.score / 100) * 80}%` }}
                        ></div>
                        <span className="text-xs mt-2 text-gray-600">{skill.skill.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  Hover over skills above to highlight on the chart
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'certifications' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                Certifications
              </h2>
              
              {user.certifications && user.certifications.length > 0 ? (
                <div className="space-y-4">
                  {(user.certifications || [
                    { name: "AWS Certified Developer", issuedBy: "Amazon Web Services", issueDate: "Jan 2024", expiryDate: "Jan 2027" },
                    { name: "Professional UX Designer", issuedBy: "Google", issueDate: "Mar 2023", expiryDate: "Mar 2026" }
                  ]).map((cert, index) => (
                    <div 
                      key={index} 
                      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                              {cert.name}
                            </h3>
                            <p className="text-sm text-gray-600">{cert.issuedBy}</p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {cert.issueDate} - {cert.expiryDate || "No expiry"}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-200">
                        <span className="text-xs text-gray-500">Credential ID: {index + 10234}</span>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                          View Certificate
                          <ArrowRightIcon className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 text-center">
                  <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-4 text-gray-600">No certifications have been added yet.</p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Add Certification
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'contact' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-blue-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-100 rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-full mr-4 shadow-md transform transition-transform hover:scale-110 duration-300">
                      <EnvelopeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{user.email || "johndoe@example.com"}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMessageOpen(true)}
                    className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-sm font-medium rounded-md text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow"
                  >
                    Send Message
                  </button>
                </div>
                
                <div className="border border-gray-100 rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-full mr-4 shadow-md transform transition-transform hover:scale-110 duration-300">
                      <PhoneIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{user.phone || "+91630******"}</p>
                    </div>
                  </div>
                  <button className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-sm font-medium rounded-md text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow">
                    Call Now
                  </button>
                </div>
                
                <div className="border border-gray-100 rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:border-amber-200">
                  <div className="flex items-center">
                  <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-full mr-4 shadow-md transform transition-transform hover:scale-110 duration-300">
                      <MapPinIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{user.location || "AIT PUNE, MH"}</p>
                    </div>
                  </div>
                  <button className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-sm font-medium rounded-md text-white hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-sm hover:shadow">
                    View on Map
                  </button>
                </div>
                
                <div className="border border-gray-100 rounded-lg p-5 transition-all duration-300 hover:shadow-md hover:border-purple-200">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-full mr-4 shadow-md transform transition-transform hover:scale-110 duration-300">
                      <ChartBarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium">{user.availability || "Available for projects"}</p>
                    </div>
                  </div>
                  <button className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-sm font-medium rounded-md text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow">
                    Schedule Meeting
                  </button>
                </div>
              </div>
              
              {/* Social media links */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-md font-medium text-gray-800 mb-4">Social Profiles</h3>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {(user.socialProfiles || [
                    { platform: "LinkedIn", url: "#", color: "bg-blue-500" },
                    { platform: "Twitter", url: "#", color: "bg-sky-500" },
                    { platform: "GitHub", url: "#", color: "bg-gray-800" },
                    // { platform: "Dribbble", url: "#", color: "bg-pink-500" }
                  ]).map((profile, index) => (
                    <a 
                      key={index}
                      href={profile.url}
                      className={`${profile.color} text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity duration-200 flex items-center shadow-sm`}
                    >
                      {profile.platform}
                      <ArrowRightIcon className="h-3 w-3 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;