import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  addFavorite,
  removeFavorite,
  listFavorites,
} from "../controllers/favoritesController.js";
const router = express.Router();
router.post("/", authenticate, addFavorite);
router.delete("/:vendor_id", authenticate, removeFavorite);
router.get("/", authenticate, listFavorites);
export default router;
