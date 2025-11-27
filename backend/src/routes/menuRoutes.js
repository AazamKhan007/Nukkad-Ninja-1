import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  listVendorMenu,
} from "../controllers/menuController.js";
const router = express.Router();
router.post("/", authenticate, addMenuItem);
router.put("/:id", authenticate, updateMenuItem);
router.delete("/:id", authenticate, deleteMenuItem);
router.get("/vendor/:vendorId", listVendorMenu);
export default router;
