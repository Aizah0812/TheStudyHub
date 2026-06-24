import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/upload/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      // Check image
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload an image",
        });
      }

      // Extra Security:
      // Logged-in user sirf apni image update kar sakta hai
      if (req.user.id !== req.params.id) {
        return res.status(403).json({
          message: "Unauthorized access",
        });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Update user profile image
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          profileImage: result.secure_url,
        },
        {
          new: true,
        },
      );

      // User not found
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Remove password from response
      const { password, ...userData } = user._doc;

      res.status(200).json({
        message: "Profile image updated successfully",
        user: userData,
      });
    } catch (error) {
      res.status(500).json({
        message: "Upload failed",
        error: error.message,
      });
    }
  },
);

export default router;
