import express from "express";

import {
  getAllUsers,
  getAllBookings,
  getDashboardStats,
  approveBooking,
  rejectBooking,
  deleteUser,
  getRevenueStats,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);

// Users
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// Bookings
router.get("/bookings", authMiddleware, adminMiddleware, getAllBookings);

// Approve Membership
router.patch(
  "/bookings/:id/pay",
  authMiddleware,
  adminMiddleware,
  approveBooking,
);

// Reject Membership
router.patch(
  "/bookings/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectBooking,
);

// Delete User
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
// Revenue Stats
router.get("/revenue", authMiddleware, adminMiddleware, getRevenueStats);

  
export default router;
