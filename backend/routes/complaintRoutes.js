import express from "express";

import {
  createComplaint,
  getAllComplaints,
  resolveComplaint,
} from "../controllers/complaintController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// User creates complaint
router.post("/", authMiddleware, createComplaint);

// Admin views all complaints
router.get("/", authMiddleware, adminMiddleware, getAllComplaints);

// Admin resolves complaint
router.patch("/:id/resolve", authMiddleware, adminMiddleware, resolveComplaint);

export default router;
