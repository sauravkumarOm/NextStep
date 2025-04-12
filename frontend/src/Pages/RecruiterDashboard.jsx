import React, { useState, useEffect } from 'react';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('candidates');
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    applications: 0,
    status: 'Active'
  });
  
  // Initialize state from localStorage or use default data
  const [candidates, setCandidates] = useState(() => {
    const savedCandidates = localStorage.getItem('candidates');
    return savedCandidates ? JSON.parse(savedCandidates) : [
      { id: 1, name: 'Alex Johnson', role: 'Frontend Developer', status: 'Interview', rating: 4 },
      { id: 2, name: 'Maya Patel', role: 'Product Manager', status: 'Applied', rating: 5 },
      { id: 3, name: 'Carlos Rodriguez', role: 'UX Designer', status: 'Screening', rating: 3 },
      { id: 4, name: 'Sarah Kim', role: 'Data Scientist', status: 'Offer', rating: 5 },
      { id: 5, name: 'David Chen', role: 'Backend Developer', status: 'Interview', rating: 4 },
    ];
  });
  
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('jobs');
    return savedJobs ? JSON.parse(savedJobs) : [
      { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', applications: 23, status: 'Active' },
      { id: 2, title: 'Product Manager', department: 'Product', applications: 18, status: 'Active' },
      { id: 3, title: 'UX Designer', department: 'Design', applications: 12, status: 'Closed' },
      { id: 4, title: 'Data Scientist', department: 'Data', applications: 8, status: 'Active' },
    ];
  });
  
  const meetings = [
    { id: 1, title: 'Interview with Alex Johnson', date: '2025-04-05', time: '10:00', status: 'Scheduled' },
    { id: 2, title: 'Team Sync', date: '2025-04-04', time: '14:00', status: 'Completed' },
    { id: 3, title: 'Screening call with Lisa Wong', date: '2025-04-07', time: '11:30', status: 'Scheduled' },
  ];
  
  const feedback = [
    { id: 1, candidate: 'Alex Johnson', interviewer: 'Jamie Smith', rating: 4, note: 'Strong technical skills, good cultural fit' },
    { id: 2, candidate: 'Sarah Kim', interviewer: 'Pat Thomas', rating: 5, note: 'Excellent communication, top candidate' },
    { id: 3, candidate: 'Carlos Rodriguez', interviewer: 'Robin Chen', rating: 3, note: 'Needs more experience in enterprise applications' },
  ];

  // Save to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }, [candidates]);
  
  // Improved input change handler
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Debug log to check input values
    console.log(`Input changed: ${name} = ${value} (${type})`);
    
    if (type === 'radio') {
      setNewJob({
        ...newJob,
        [name]: value
      });
    } else {
      setNewJob({
        ...newJob,
        [name]: name === 'applications' ? (value === '' ? 0 : parseInt(value, 10)) : value
      });
    }
    
    // Debug log to check updated state
    console.log('Updated job state:', {...newJob, [name]: value});
  };
  
  // Reset form function
  const resetForm = () => {
    setNewJob({ 
      title: '', 
      department: '', 
      applications: 0, 
      status: 'Active' 
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation with more detailed feedback
    if (!newJob.title.trim()) {
      alert('Please enter a job title');
      return;
    }
    
    if (!newJob.department) {
      alert('Please select a department');
      return;
    }
    
    const newJobWithId = {
      ...newJob,
      id: jobs.length > 0 ? Math.max(...jobs.map(job => job.id)) + 1 : 1
    };
    
    setJobs([...jobs, newJobWithId]);
    setShowAddJobModal(false);
    resetForm();
  };
  
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
    ));
  };
  
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              &times;
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
          <div className="flex flex-wrap items-center mt-4">
            <div className="bg-white p-3 rounded-lg shadow-sm mr-4 mb-2">
              <p className="text-sm text-gray-500">Active Candidates</p>
              <p className="text-2xl font-bold">{candidates.length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm mr-4 mb-2">
              <p className="text-sm text-gray-500">Open Positions</p>
              <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'Active').length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm mr-4 mb-2">
              <p className="text-sm text-gray-500">Upcoming Meetings</p>
              <p className="text-2xl font-bold">{meetings.filter(m => m.status === 'Scheduled').length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
              <p className="text-sm text-gray-500">Total Feedback</p>
              <p className="text-2xl font-bold">{feedback.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            <button 
              className={`py-3 px-4 font-medium ${activeTab === 'candidates' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('candidates')}
            >
              Candidates
            </button>
            <button 
              className={`py-3 px-4 font-medium ${activeTab === 'jobs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('jobs')}
            >
              Job Postings
            </button>
            <button 
              className={`py-3 px-4 font-medium ${activeTab === 'meetings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('meetings')}
            >
              Schedule Meetings
            </button>
            <button 
              className={`py-3 px-4 font-medium ${activeTab === 'feedback' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('feedback')}
            >
              Feedback
            </button>
          </div>
        </div>

        {activeTab === 'candidates' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Candidates</h2>
              <div className="flex flex-wrap">
                <input type="text" placeholder="Search candidates..." className="border rounded px-3 py-2 mr-2 mb-2 sm:mb-0" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">Add Candidate</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-sm">
                    <th className="py-3 px-4 font-medium">Name</th>
                    <th className="py-3 px-4 font-medium">Role</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Rating</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidates.map(candidate => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">{candidate.name}</td>
                      <td className="py-3 px-4">{candidate.role}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                          candidate.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                          candidate.status === 'Applied' ? 'bg-gray-100 text-gray-800' :
                          candidate.status === 'Screening' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{renderStars(candidate.rating)}</td>
                      <td className="py-3 px-4 flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">View</button>
                        <button className="text-gray-500 hover:text-gray-700">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Job Postings</h2>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 flex items-center"
                onClick={() => {
                  resetForm();
                  setShowAddJobModal(true);
                }}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Job
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 text-sm">
                    <th className="py-3 px-4 font-medium">Job Title</th>
                    <th className="py-3 px-4 font-medium">Department</th>
                    <th className="py-3 px-4 font-medium">Applications</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">{job.title}</td>
                      <td className="py-3 px-4">{job.department}</td>
                      <td className="py-3 px-4">{job.applications}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                          job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">View</button>
                        <button className="text-gray-500 hover:text-gray-700">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Schedule Meetings</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">New Meeting</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-4">Upcoming Meetings</h3>
                <div className="space-y-3">
                  {meetings.filter(m => m.status === 'Scheduled').map(meeting => (
                    <div key={meeting.id} className="p-4 border rounded hover:bg-gray-50">
                      <p className="font-medium text-blue-600">{meeting.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(`${meeting.date}T${meeting.time}`).toLocaleString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </p>
                      <div className="flex mt-2">
                        <button className="text-sm text-blue-500 mr-3">Reschedule</button>
                        <button className="text-sm text-red-500">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-medium mb-4">Schedule New Meeting</h3>
                <form>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Meeting Title</label>
                    <input type="text" className="w-full border rounded p-2" placeholder="Interview with Candidate" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" className="w-full border rounded p-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <input type="time" className="w-full border rounded p-2" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Participants</label>
                    <input type="text" className="w-full border rounded p-2" placeholder="Add participants" />
                  </div>
                  <div>
                    <button type="button" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200">
                      Schedule Meeting
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Candidate Feedback</h2>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">Add Feedback</button>
            </div>
            
            <div className="space-y-4">
              {feedback.map(item => (
                <div key={item.id} className="p-4 border rounded hover:bg-gray-50">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.candidate}</h3>
                    <div>{renderStars(item.rating)}</div>
                  </div>
                  <p className="text-sm text-gray-500">Interviewer: {item.interviewer}</p>
                  <p className="mt-2">{item.note}</p>
                  <div className="flex mt-2">
                    <button className="text-sm text-blue-500">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Improved Add Job Modal Form */}
      <Modal 
        isOpen={showAddJobModal} 
        onClose={() => {
          setShowAddJobModal(false);
          resetForm();
        }} 
        title="Add New Job Posting"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="job-title">Job Title *</label>
            <input 
              id="job-title"
              type="text" 
              name="title"
              value={newJob.title}
              onChange={handleInputChange}
              className="w-full border rounded p-2" 
              placeholder="e.g. Senior Frontend Developer" 
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="job-department">Department *</label>
            <select 
              id="job-department"
              name="department" 
              value={newJob.department}
              onChange={handleInputChange}
              className="w-full border rounded p-2" 
              required
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Data">Data</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="job-applications">Initial Applications</label>
            <input 
              id="job-applications"
              type="number" 
              name="applications"
              value={newJob.applications}
              onChange={handleInputChange}
              className="w-full border rounded p-2" 
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  id="status-active"
                  name="status"
                  value="Active"
                  checked={newJob.status === 'Active'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Active
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  id="status-closed"
                  name="status"
                  value="Closed"
                  checked={newJob.status === 'Closed'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Closed
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              onClick={() => {
                setShowAddJobModal(false);
                resetForm();
              }}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Add Job
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterDashboard;