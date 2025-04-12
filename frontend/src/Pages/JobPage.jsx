import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, Briefcase, Filter, MapPin, Calendar, ChevronRight } from "lucide-react";

const BACKEND_URL = "https://nextstep-mb2t.onrender.com";

const JobSeekerPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    setJobs(storedJobs);
    setFilteredJobs(storedJobs);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/users/userDetail`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
        const userSkills = response.data.user.skills || [];
        setSkills(userSkills);
        
        // If skills are available, auto-select the first one
        if (userSkills.length > 0) {
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

  const fetchResourcesForSkill = (skill) => {
    // This is a placeholder for the skill-based resource fetching function
    console.log(`Fetching resources for skill: ${skill}`);
  };

  useEffect(() => {
    let updatedJobs = jobs;
    
    // Search filter
    if (search) {
      updatedJobs = updatedJobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Department filter
    if (departmentFilter) {
      updatedJobs = updatedJobs.filter(job => job.department === departmentFilter);
    }
    
    // Status filter
    if (statusFilter) {
      updatedJobs = updatedJobs.filter(job => job.status === statusFilter);
    }
    
    // Skill matching filter
    if (selectedSkill) {
      updatedJobs = updatedJobs.filter(job => 
        job.requiredSkills?.some(skill => 
          skill.toLowerCase() === selectedSkill.toLowerCase()
        )
      );
    }
    
    // Sorting
    updatedJobs = [...updatedJobs].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
        case "oldest":
          return new Date(a.postedDate || 0) - new Date(b.postedDate || 0);
        case "mostApplicants":
          return (b.applications || 0) - (a.applications || 0);
        default:
          return 0;
      }
    });
    
    setFilteredJobs(updatedJobs);
  }, [search, departmentFilter, statusFilter, selectedSkill, sortOption, jobs]);

  const departments = [...new Set(jobs.map(job => job.department))];
  const statuses = [...new Set(jobs.map(job => job.status).filter(Boolean))];
  
  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setStatusFilter("");
    setSelectedSkill("");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
          <p className="text-gray-600 mt-2">Find and apply to positions that match your skills and interests</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs by title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Skills</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="">All Skills</option>
                  {skills.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostApplicants">Most Applicants</option>
                </select>
              </div>
            </div>

            {skills.length > 0 && (
              <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium mb-3">Your Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span 
                      key={skill}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSkill === skill 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => setSelectedSkill(skill === selectedSkill ? "" : skill)}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Job listings */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">{filteredJobs.length} Jobs Found</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center text-sm font-medium text-gray-700"
              >
                <Filter className="h-4 w-4 mr-1" /> 
                Filters
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-10">
                <div className="loader">Loading...</div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <ul className="space-y-4">
                {filteredJobs.map(job => (
                  <li key={job.id} className="bg-white p-5 border rounded-lg shadow-sm hover:shadow transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span className="mr-4">{job.department}</span>
                          
                          {job.location && (
                            <>
                              <MapPin className="h-4 w-4 mr-1 ml-2" />
                              <span>{job.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <span className={`text-sm font-medium py-1 px-3 rounded-full ${
                        job.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    {job.description && (
                      <p className="text-gray-600 mt-3 line-clamp-2">{job.description}</p>
                    )}
                    
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.slice(0, 4).map(skill => (
                            <span 
                              key={skill} 
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                skills.includes(skill) 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                          {job.requiredSkills.length > 4 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                              +{job.requiredSkills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {job.postedDate 
                            ? new Date(job.postedDate).toLocaleDateString() 
                            : "Date not available"}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{job.applications || 0} applicants</span>
                      </div>
                      
                      <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        View Details <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-gray-400 mb-3">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                <button onClick={clearFilters} className="mt-4 text-blue-600 font-medium">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerPage;
