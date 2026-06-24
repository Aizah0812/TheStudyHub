import express from "express";
import {
  createBooking,
  getUserBookings,
  updatePaymentStatus,
  downloadMembershipCard,
  uploadPaymentScreenshot,
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create Booking
router.post("/create", authMiddleware, createBooking);

// Get User Bookings
router.get("/user/:userId", getUserBookings);

// Update Payment Status
router.put("/pay/:id", updatePaymentStatus);

// Upload Payment Screenshot
router.post(
  "/upload-payment/:id",
  authMiddleware,
  upload.single("paymentScreenshot"),
  uploadPaymentScreenshot,
);

// Download Membership Card PDF
// TEMPORARY: auth removed for testing
router.get("/membership-card/:id", authMiddleware, downloadMembershipCard);

export default router;
