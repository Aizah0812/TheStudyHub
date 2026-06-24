import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import cloudinary from "../config/cloudinary.js";
import PDFDocument from "pdfkit";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      shift,
      plan,
      price,
      purpose,
      seat,
      message,
    } = req.body;

    // Basic Validation
    if (!userId || !name || !email || !shift || !plan) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    // Prevent duplicate active memberships
    const existingMembership = await Booking.findOne({
      userId,
      status: {
        $in: ["Paid", "Pending"],
      },
    });

    if (existingMembership) {
      return res.status(400).json({
        message: "You already have an active membership request.",
      });
    }

    const booking = new Booking({
      userId,
      name,
      email,
      phone,
      shift,
      plan,
      price,
      purpose,
      seat,
      message,
    });

    await booking.save();

    // SEND CONFIRMATION EMAIL
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Booking Request Received - The Study Hub",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#2563eb;">
              Booking Request Received
            </h2>

            <p>Hello <strong>${name}</strong>,</p>

            <p>
              Thank you for choosing The Study Hub.
              Your booking request has been received successfully.
            </p>

            <div style="
              background:#f8fafc;
              padding:15px;
              border-radius:8px;
              margin-top:15px;
            ">
              <p><strong>Shift:</strong> ${shift}</p>
              <p><strong>Plan:</strong> ${plan}</p>
              <p><strong>Seat:</strong> ${seat || "Not Assigned Yet"}</p>
            </div>

            <p style="margin-top:20px;">
              Our team will review your request shortly.
            </p>

            <p>
              Regards,<br />
              The Study Hub
            </p>
          </div>
        `,
      });

      console.log("Booking confirmation email sent ✅");
    } catch (emailError) {
      console.error("Booking confirmation email failed:", emailError.message);
    }

    res.status(201).json({
      message: "Booking saved successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  }
};

// GET USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const bookings = await Booking.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "User bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// UPDATE PAYMENT STATUS
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const startDate = new Date();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    booking.status = "Paid";
    booking.paidAt = startDate;

    booking.membershipStartDate = startDate;
    booking.membershipExpiryDate = expiryDate;

    await booking.save();

    // OCCUPY SEAT AFTER PAYMENT
    const seatRecord = await Seat.findOne({
      seatNumber: booking.seat,
    });

    if (seatRecord) {
      seatRecord.status = "Occupied";
      seatRecord.assignedTo = booking.userId;

      await seatRecord.save();
    }

    res.status(200).json({
      message: "Payment successful",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment failed",
      error: error.message,
    });
  }
};
// UPLOAD PAYMENT SCREENSHOT
export const uploadPaymentScreenshot = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a screenshot",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    booking.paymentScreenshot = result.secure_url;
    booking.paymentSubmitted = true;

    await booking.save();

    res.status(200).json({
      message: "Payment screenshot uploaded successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};export const downloadMembershipCard = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Membership not found",
      });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=studyhub-receipt.pdf",
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // HEADER
    doc.rect(0, 0, doc.page.width, 110).fill("#4f8df7");

    doc.fillColor("white").fontSize(30).text("Study Hub Receipt", 50, 35);

    doc
      .fontSize(12)
      .text("Official payment receipt for your membership plan", 50, 75);

    // RESET TEXT COLOR
    doc.fillColor("black");

    // DETAILS BOX
    doc.roundedRect(40, 150, 515, 450, 15).stroke("#dbe3ef");
    
    doc.fontSize(20).fillColor("#111827").text("Payment Details", 70, 180);

    let y = 230;

    const row = (label, value) => {
      doc.fillColor("#64748b").fontSize(13).text(label, 70, y);

      doc
        .fillColor("#111827")
        .fontSize(13)
        .text(value || "N/A", 250, y);

      y += 38;
    };

    row("Booking ID", booking._id.toString().slice(-8).toUpperCase());
    row("Name", booking.name);
    row("Email", booking.email);
    row("Plan", booking.plan);
    row("Shift", booking.shift);
    row("Seat", booking.seat);
    row("Amount", `Rs. ${booking.price}`);
    row("Status", booking.status);

    row(
      "Payment Date",
      booking.paidAt ? new Date(booking.paidAt).toLocaleDateString() : "N/A",
    );

    row(
      "Expiry Date",
      booking.membershipExpiryDate
        ? new Date(booking.membershipExpiryDate).toLocaleDateString()
        : "N/A",
    );

    // FOOTER
    doc.roundedRect(70, 650, 450, 70, 12).fill("#f1f5ff");

    doc
      .fillColor("#2563eb")
      .fontSize(18)
      .text("Thank you for choosing Study Hub!", 95, 675);

    doc
      .fillColor("#64748b")
      .fontSize(11)
      .text("This is a system-generated receipt.", 95, 705);

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate membership card",
      error: error.message,
    });
  }
};
