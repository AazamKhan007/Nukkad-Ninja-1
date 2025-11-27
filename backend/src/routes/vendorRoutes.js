import express from "express";
import {
  vendorSignup,
  getMyVendorProfile,
  updateMyVendorProfile,
  getVendorById,
} from "../controllers/vendorController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { vendorLogin } from "../controllers/vendorController.js";
const router = express.Router();
router.post("/signup", vendorSignup);
router.post("/login", vendorLogin);
router.get("/me", authenticate, getMyVendorProfile);
router.put("/me", authenticate, updateMyVendorProfile);
router.get("/:id", getVendorById);
export default router;
