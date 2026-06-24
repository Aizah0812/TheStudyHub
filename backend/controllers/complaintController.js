import Complaint from "../models/Complaint.js";

// ================= CREATE COMPLAINT =================

export const createComplaint = async (req, res) => {
  try {
    const { userId, name, email, subject, message } = req.body;

    if (!userId || !name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const complaint = new Complaint({
      userId,
      name,
      email,
      subject,
      message,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit complaint",
      error: error.message,
    });
  }
};

// ================= GET ALL COMPLAINTS =================

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
};

// ================= RESOLVE COMPLAINT =================

export const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: "Resolved",
      },
      {
        new: true,
      },
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.status(200).json({
      message: "Complaint resolved successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to resolve complaint",
      error: error.message,
    });
  }
};
