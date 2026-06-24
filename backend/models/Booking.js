import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: String,
    shift: String,
    plan: String,
    price: String,
    purpose: String,
    seat: String,
    message: String,

    status: {
      type: String,
      enum: ["Pending", "Paid", "Rejected", "Expired"],
      default: "Pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },
    membershipStartDate: {
      type: Date,
      default: null,
    },

    membershipExpiryDate: {
      type: Date,
      default: null,
    },
    paymentScreenshot: {
      type: String,
      default: "",
    },

    paymentSubmitted: {
      type: Boolean,
      default: false,
    },
    reminderEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Booking", bookingSchema);
