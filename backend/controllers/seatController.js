import Seat from "../models/Seat.js";

// ================= GET ALL SEATS =================


export const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find().populate("assignedTo", "name email").sort({
      seatNumber: 1,
    });

    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch seats",
      error: error.message,
    });
  }
};

// ================= GET AVAILABLE SEATS =================
export const getAvailableSeats = async (req, res) => {
  try {
    const seats = await Seat.find({
      status: "Available",
    }).sort({
      seatNumber: 1,
    });

    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch available seats",
      error: error.message,
    });
  }
};
// ================= ADD SEAT =================

export const addSeat = async (req, res) => {
  try {
    const { seatNumber } = req.body;

    if (!seatNumber) {
      return res.status(400).json({
        message: "Seat number is required",
      });
    }

    const existingSeat = await Seat.findOne({
      seatNumber,
    });

    if (existingSeat) {
      return res.status(400).json({
        message: "Seat already exists",
      });
    }

    const seat = await Seat.create({
      seatNumber,
    });

    res.status(201).json({
      message: "Seat added successfully",
      seat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add seat",
      error: error.message,
    });
  }
};

// ================= DELETE SEAT =================

export const deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found",
      });
    }

    res.status(200).json({
      message: "Seat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete seat",
      error: error.message,
    });
  }
};

// ================= TOGGLE STATUS =================

export const toggleSeatStatus = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found",
      });
    }

    seat.status = seat.status === "Available" ? "Occupied" : "Available";

    await seat.save();

    res.status(200).json({
      message: "Seat updated successfully",
      seat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update seat",
      error: error.message,
    });
  }
};
