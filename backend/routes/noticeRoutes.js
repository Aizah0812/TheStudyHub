import express from "express";

import {
  createNotice,
  getAllNotices,
  deleteNotice,
} from "../controllers/noticeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public - Users can view notices
router.get("/", getAllNotices);

// Admin Only - Create Notice
router.post("/", authMiddleware, adminMiddleware, createNotice);

// Admin Only - Delete Notice
router.delete("/:id", authMiddleware, adminMiddleware, deleteNotice);

export default router;
