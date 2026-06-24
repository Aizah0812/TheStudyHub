import express from "express";

import {
  getAllSeats,
  getAvailableSeats,
  addSeat,
  deleteSeat,
  toggleSeatStatus,
} from "../controllers/seatController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Get all seats
router.get("/", authMiddleware, adminMiddleware, getAllSeats);

// Add seat
router.post("/", authMiddleware, adminMiddleware, addSeat);

// Delete seat
router.delete("/:id", authMiddleware, adminMiddleware, deleteSeat);

// Toggle seat status
router.patch("/:id/toggle", authMiddleware, adminMiddleware, toggleSeatStatus);
// Get available seats
router.get("/available", authMiddleware, getAvailableSeats);

export default router;
