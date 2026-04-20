import { Router } from "express";
import { getHome, postUser, loginUser, getProfile, singleUser } from "../controllers/usercontroller.js";
import { checkAuth } from "../middleware/authMiddleware.js";

const router = Router()

router.get('/', getHome).post("/post-user", postUser).post("/login", loginUser).get('/profile', checkAuth, getProfile).get('/:id', checkAuth, singleUser)

export default router;