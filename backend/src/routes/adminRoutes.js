import express from "express";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import {
  listUsersAdmin,
  deleteUserAdmin,
  listVendorsAdmin,
  updateVendorAdmin,
  deleteVendorAdmin,
  listReportsAdmin,
  resolveReportAdmin,
} from "../controllers/adminController.js";
const router = express.Router();
router.use(authenticate, requireAdmin);
router.get("/users", listUsersAdmin);
router.delete("/users/:id", deleteUserAdmin);
router.get("/vendors", listVendorsAdmin);
router.put("/vendors/:id", updateVendorAdmin);
router.delete("/vendors/:id", deleteVendorAdmin);
router.get("/reports", listReportsAdmin);
router.post("/reports/:id/resolve", resolveReportAdmin);
export default router;
