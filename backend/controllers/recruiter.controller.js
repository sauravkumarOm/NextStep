import { Recruiter } from "../models/recruiter.model.js";
import { Job_posting } from "../models/job_posting.model.js";

const registerRecruiter = async (req, res) => {
    // steps for registering a recruiter
    // get details from the frontend
    // check for empty fields
    // check whether user exists or not
    // create a new recruiter
    // generate access token
    // send cookie
    // return response

    const { username, email, password,company } = req.body;

    // check for empty fields

    if (!username || !email || !password ||!company) {
        return res.status(400).json({ message: "Name, email, password and company are required", status: 400 });
    }

    // check whether user exists or not

    const existing_user = await Recruiter.findOne({$or:[{email},{username}]});

    if (existing_user) {
        return res.status(409).json({ message: "User already exists", status: 409 });
    }

    const recruiter = await Recruiter.create({
        username,
        email,
        password,
        company
    });

    const createdRecruiter = await Recruiter.findById(recruiter._id).select("-password");
    
            if (!createdRecruiter) {
                return res.status(500).json({ message: "User not created", status: 500 });
            }
    
            // Return response
            return res.status(201).json({
                message: "Recruiter created successfully",
                status: 201,
                recruiter: createdRecruiter
            });

}


const job_posting = async (req, res) => {
    try {
        // Extract job details from request body
        const { company_name, GST_number, job_location, stipened, job_category, required_skills, job_type,job_description } = req.body;

        // Validate required fields
        if (![company_name, GST_number, job_location, job_category,job_description].every(field => field && field.trim() !== "") || 
            !Array.isArray(required_skills) || required_skills.length === 0) {
            return res.status(400).json({ message: "All required fields must be filled correctly", status: 400 });
        }

        // Create new job posting
        const newJob = new Job_posting({
            company_name,
            GST_number,
            job_location,
            stipened,
            job_category,
            required_skills,
            job_type,
            job_description
        });

        // Save to database
        await newJob.save();

        return res.status(201).json({
            message: "Job posted successfully",
            status: 201,
            job: newJob
        });

    } catch (error) {
        console.error("Error in job posting:", error);
        return res.status(500).json({ message: "Internal Server Error", status: 500, error: error.message });
    }
};
// export { job_posting };



export {registerRecruiter,job_posting}