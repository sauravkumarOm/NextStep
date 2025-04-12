// RecruiterAuth.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Login component
const RecruiterLogin = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Check local storage for user
        const recruiters = JSON.parse(localStorage.getItem('recruiters')) || [];
        const recruiter = recruiters.find(r => 
          r.email === formData.email && r.password === formData.password
        );
        
        if (recruiter) {
          // Store current user in session
          sessionStorage.setItem('currentRecruiter', JSON.stringify(recruiter));
          setLoading(false);
          onLoginSuccess(recruiter);
        } else {
          setLoading(false);
          setErrors({ general: 'Invalid email or password' });
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Recruiter Login</h2>
          <p className="text-gray-300 mb-8">Sign in to access your recruiter dashboard</p>
        </div>
        
        {errors.general && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-6 text-center">
            {errors.general}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`appearance-none relative block w-full px-4 py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-500'
              } bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className={`appearance-none relative block w-full px-4 py-3 border ${
                errors.password ? 'border-red-500' : 'border-gray-500'
              } bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-500 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-orange-400 hover:text-orange-300 transition duration-300">
                Forgot password?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium ${
                loading 
                  ? 'bg-orange-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300">
            Don't have an account?{" "}
            <button 
              onClick={onSwitchToRegister} 
              className="font-medium text-orange-400 hover:text-orange-300 transition duration-300"
            >
              Register now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Registration component
const RecruiterRegistration = ({ onSwitchToLogin, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const locations = [
    'New York', 'San Francisco', 'London', 'Tokyo', 'Berlin', 
    'Sydney', 'Toronto', 'Singapore', 'Dubai', 'Paris',
    'Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = 'Company/NGO name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.location) newErrors.location = 'Please select a location';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Check if email already exists
        const recruiters = JSON.parse(localStorage.getItem('recruiters')) || [];
        const emailExists = recruiters.some(r => r.email === formData.email);
        
        if (emailExists) {
          setErrors({ email: 'Email already registered' });
          setLoading(false);
          return;
        }
        
        // Create new recruiter
        const newRecruiter = {
          id: Date.now().toString(),
          companyName: formData.companyName,
          username: formData.username,
          email: formData.email,
          password: formData.password, // In a real app, NEVER store passwords in plain text
          location: formData.location,
          createdAt: new Date().toISOString()
        };
        
        // Add to local storage
        recruiters.push(newRecruiter);
        localStorage.setItem('recruiters', JSON.stringify(recruiters));
        
        // Set current user
        sessionStorage.setItem('currentRecruiter', JSON.stringify(newRecruiter));
        
        setLoading(false);
        onRegistrationSuccess(newRecruiter);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Recruiter Registration</h2>
          <p className="text-gray-300 mb-8">Create your recruiter account</p>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-200 mb-1">
              Company/NGO Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              className={`appearance-none relative block w-full px-4 py-3 border ${
                errors.companyName ? 'border-red-500' : 'border-gray-500'
              } bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              placeholder="Your company or NGO name"
            />
            {errors.companyName && <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>}
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              className={`appearance-none relative block w-full px-4 py-3 border ${
                errors.username ? 'border-red-500' : 'border-gray-500'
              } bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              placeholder="Choose a username"
            />
            {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`appearance-none relative block w-full px-4 py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-500'
              } bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-500'
                } bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-500'
                } bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-200 mb-1">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`appearance-none relative block w-full px-4 py-3 border ${
                errors.location ? 'border-red-500' : 'border-gray-500'
              } bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300`}
            >
              <option value="" disabled>Select your location</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
          </div>
          
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-500 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              I agree to the <a href="#" className="text-orange-400 hover:text-orange-300">Terms of Service</a> and <a href="#" className="text-orange-400 hover:text-orange-300">Privacy Policy</a>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium ${
                loading 
                  ? 'bg-orange-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <button 
              onClick={onSwitchToLogin} 
              className="font-medium text-orange-400 hover:text-orange-300 transition duration-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Main component that toggles between login and registration
const RecruiterAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = sessionStorage.getItem('currentRecruiter');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleRegistrationSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentRecruiter');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  const navigate=useNavigate()

  // Simple dashboard UI after login
  if (isAuthenticated && currentUser) {
   navigate('/recruiter/dashboard')
  }

  return isLogin ? (
    <RecruiterLogin 
      onSwitchToRegister={() => setIsLogin(false)} 
      onLoginSuccess={handleLoginSuccess} 
    />
  ) : (
    <RecruiterRegistration 
      onSwitchToLogin={() => setIsLogin(true)} 
      onRegistrationSuccess={handleRegistrationSuccess} 
    />
  );
};

export default RecruiterAuth;