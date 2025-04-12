import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login.jsx'

import HomePage from './Pages/UserHomePage.jsx'
import Preparation from './Pages/Preparation.jsx'
import Profile from './Pages/Profile.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx'
import AiInterview from './Pages/AiInterview.jsx'
import Test from './Pages/Exam.jsx'
import CommunityPage from './Pages/Community.jsx'
import LandingPage from './Pages/LandingPage.jsx'
import RecruiterPage from './Pages/Recruiter.jsx'
import RecruiterDashboard from './Pages/RecruiterDashboard.jsx'
import JobSeekerPage from './Pages/JobPage.jsx'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@denserai/embed-chat@1/dist/web.min.js';
    script.onload = () => {
      // Initialize the chatbot once the script is loaded
      Chatbot.init({
        chatbotId: "a6732d92-e004-4212-8d05-1ee80c6c69bd",
      });
    };
    document.body.appendChild(script);  // Append script to the body

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/user/login" element={<Login/>} />
        
        <Route path="/user/Home" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
        <Route path="/preparation" element={<ProtectedRoute><Preparation/></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/ai-interview" element={<ProtectedRoute><AiInterview/></ProtectedRoute>} />
        <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityPage/></ProtectedRoute>} />
        <Route path="/recruiter" element={<RecruiterPage/>} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard/>} />
        <Route path="/job" element={<ProtectedRoute><JobSeekerPage/></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
