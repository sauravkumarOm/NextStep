import {Router} from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = Router()

router
.post("/register", registerUser)
.post("/login",loginUser)
.get("/userDetail", protect, (req, res) => {
    res.status(200).json({
        message: "User details fetched successfully",
        status: 200,
        user: req.user, // The `protect` middleware attaches the user object
    });
})
.get("/logout",logoutUser)
// .get("/check",protect,check)



export default router