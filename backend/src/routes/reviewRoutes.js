import express from "express";
import {
  addReview,
  getVendorReviews,
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authenticate, addReview);
router.get("/vendor/:vendorId", getVendorReviews);
export default router;
