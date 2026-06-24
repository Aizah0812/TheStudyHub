import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

import { checkExpiredMemberships } from "./controllers/adminController.js";

dotenv.config();

const app = express();

/* =========================
MIDDLEWARE
========================= */

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

/* =========================
API ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complaints", complaintRoutes);

/* =========================
DATABASE CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected ✅");

    
// Run once when server starts
await checkExpiredMemberships();

// Run every 1 minute
setInterval(async () => {
  await checkExpiredMemberships();
}, 60000);
;
  })
  .catch((error) => {
    console.error("MongoDB connection error ❌", error.message);
  });

/* =========================
SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
