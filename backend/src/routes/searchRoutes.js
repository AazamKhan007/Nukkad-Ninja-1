import express from "express";
import { findVendorsNearby } from "../controllers/searchController.js";
const router = express.Router();
router.get("/nearby", findVendorsNearby);
export default router;
