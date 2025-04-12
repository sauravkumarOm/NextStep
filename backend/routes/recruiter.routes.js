import { Router } from "express";
import { registerRecruiter,job_posting } from "../controllers/recruiter.controller.js";

const router = Router()

router.route("/register").post(registerRecruiter)
router.route("/job_posting").post(job_posting)

export default router