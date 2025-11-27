import express from "express";
import { userSignup, userLogin, getMe } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/me", authenticate, getMe);
export default router;
