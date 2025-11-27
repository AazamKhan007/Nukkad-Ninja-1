import express from "express";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import {
  recalcHygieneForVendor,
  recalcAllVendorsHygiene,
} from "../controllers/hygieneController.js";
const router = express.Router();
router.post(
  "/vendor/:vendorId",
  authenticate,
  requireAdmin,
  recalcHygieneForVendor
);
router.post("/all", authenticate, requireAdmin, recalcAllVendorsHygiene);
export default router;
