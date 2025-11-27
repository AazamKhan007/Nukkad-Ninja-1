import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadVendorMainPhoto } from "../controllers/storageController.js";
import {
  uploadVendorPhoto,
  uploadVendorPhotosMultiple,
} from "../controllers/storageController.js";
const router = express.Router();
router.post("/vendor", authenticate, upload.single("photo"), uploadVendorPhoto);
router.post(
  "/vendor/multiple",
  authenticate,
  upload.array("photos", 5),
  uploadVendorPhotosMultiple
);
router.post(
  "/vendor/main-photo",
  authenticate,
  upload.single("photo"),
  uploadVendorMainPhoto
);
export default router;
