import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Available", "Occupied"],
      default: "Available",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Seat", seatSchema);
