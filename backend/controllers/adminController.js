import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";
import nodemailer from "nodemailer";

// ================= USERS =================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ================= BOOKINGS =================

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// ================= DASHBOARD =================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const paidMembers = await Booking.countDocuments({
      status: "Paid",
    });

    const pendingMembers = await Booking.countDocuments({
      status: "Pending",
    });

    // Recent Users
    const recentUsers = await User.find()
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Bookings
    const recentBookings = await Booking.find()
      .select("name plan status createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalUsers,
      totalBookings,
      paidMembers,
      pendingMembers,
      recentUsers,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

// ================= APPROVE MEMBERSHIP =================

export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const seat = await Seat.findOne({
      seatNumber: booking.seat,
    });

    if (!seat) {
      return res.status(404).json({
        message: "Seat not found",
      });
    }

    if (seat.status === "Occupied") {
      return res.status(400).json({
        message: "Seat is already occupied",
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

    seat.status = "Occupied";
    seat.assignedTo = booking.userId;

    await seat.save();

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
        to: booking.email,
        subject: "Membership Approved - Study Hub",
        html: `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2 style="color:#16a34a;">
          Membership Approved 🎉
        </h2>

        <p>Hello <strong>${booking.name}</strong>,</p>

        <p>
          Your membership request has been approved successfully.
        </p>

        <div style="
          background:#f8fafc;
          padding:15px;
          border-radius:8px;
          margin-top:15px;
        ">
          <p><strong>Plan:</strong> ${booking.plan}</p>
          <p><strong>Seat:</strong> ${booking.seat}</p>
          <p><strong>Shift:</strong> ${booking.shift}</p>
          <p><strong>Status:</strong> Paid</p>
        </div>

        <p style="margin-top:20px;">
          You can now access your dashboard and start using your membership.
        </p>

        <p>
          Regards,<br/>
          Study Hub
        </p>
      </div>
    `,
      });

      console.log("Approval email sent ✅");
    } catch (emailError) {
      console.error("Approval email failed:", emailError.message);
    }
    res.status(200).json({
      message: "Membership approved successfully",
      booking,
      seat,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve membership",
      error: error.message,
    });
  }
};

// ================= REJECT MEMBERSHIP =================

export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "Rejected",
      },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Membership rejected successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject membership",
      error: error.message,
    });
  }
};

// ================= DELETE USER =================

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // User exists?
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete all bookings of user
    await Booking.deleteMany({
      userId: user._id,
    });

    // Release user's seat
    await Seat.updateMany(
      {
        assignedTo: user._id,
      },
      {
        status: "Available",
        assignedTo: null,
      },
    );

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User, bookings and seat removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
// ================= REVENUE =================
export const getRevenueStats = async (req, res) => {
  try {
    const paidBookings = await Booking.find({
      status: "Paid",
    });

    const totalRevenue = paidBookings.reduce(
      (sum, booking) => sum + Number(booking.price || 0),
      0,
    );

    const paidMembers = await Booking.countDocuments({
      status: "Paid",
    });

    const pendingMembers = await Booking.countDocuments({
      status: "Pending",
    });

    const totalBookings = await Booking.countDocuments();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = paidBookings
      .filter((booking) => {
        if (!booking.paidAt) return false;

        const date = new Date(booking.paidAt);

        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      })
      .reduce((sum, booking) => sum + Number(booking.price || 0), 0);

    const monthlyData = [
      { month: "Jan", revenue: 0 },
      { month: "Feb", revenue: 0 },
      { month: "Mar", revenue: 0 },
      { month: "Apr", revenue: 0 },
      { month: "May", revenue: 0 },
      { month: "Jun", revenue: 0 },
      { month: "Jul", revenue: 0 },
      { month: "Aug", revenue: 0 },
      { month: "Sep", revenue: 0 },
      { month: "Oct", revenue: 0 },
      { month: "Nov", revenue: 0 },
      { month: "Dec", revenue: 0 },
    ];

    paidBookings.forEach((booking) => {
      if (!booking.paidAt) return;

      const monthIndex = new Date(booking.paidAt).getMonth();

      monthlyData[monthIndex].revenue += Number(booking.price || 0);
    });

    res.status(200).json({
      totalRevenue,
      paidMembers,
      pendingMembers,
      totalBookings,
      monthlyRevenue,
      monthlyData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch revenue stats",
      error: error.message,
    });
  }
};
// ================= CHECK EXPIRED MEMBERSHIPS =================
export const checkExpiredMemberships = async () => {
  try {
    const today = new Date();

    // ==========================
    // 3 DAYS REMINDER EMAIL
    // ==========================

    const reminderBookings = await Booking.find({
      status: "Paid",
      reminderEmailSent: false,
      membershipExpiryDate: {
        $ne: null,
      },
    });

    for (const booking of reminderBookings) {
      const daysLeft = Math.ceil(
        (new Date(booking.membershipExpiryDate) - today) /
          (1000 * 60 * 60 * 24),
      );

      if (daysLeft === 3) {
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
            to: booking.email,
            subject: "Membership Expiry Reminder - The Study Hub",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color:#2563eb;">
                  Membership Expiry Reminder
                </h2>

                <p>Hello <strong>${booking.name}</strong>,</p>

                <p>
                  Your Study Hub membership will expire in
                  <strong>3 days</strong>.
                </p>

                <div style="
                  background:#f8fafc;
                  padding:15px;
                  border-radius:8px;
                  margin-top:15px;
                ">
                  <p><strong>Plan:</strong> ${booking.plan}</p>
                  <p><strong>Seat:</strong> ${booking.seat}</p>
                  <p>
                    <strong>Expiry Date:</strong>
                    ${new Date(
                      booking.membershipExpiryDate,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <p style="margin-top:20px;">
                  Please renew your membership to avoid
                  interruption of services.
                </p>

                <p>
                  Regards,<br />
                  The Study Hub
                </p>
              </div>
            `,
          });

          booking.reminderEmailSent = true;
          await booking.save();

          console.log(`Reminder email sent to ${booking.email}`);
        } catch (emailError) {
          console.error("Reminder email failed:", emailError.message);
        }
      }
    }

    // ==========================
    // EXPIRE MEMBERSHIPS
    // ==========================

    const expiredBookings = await Booking.find({
      status: "Paid",
      membershipExpiryDate: {
        $lt: today,
      },
    });

    for (const booking of expiredBookings) {
      booking.status = "Expired";

      await booking.save();

      await Seat.updateOne(
        {
          seatNumber: booking.seat,
        },
        {
          status: "Available",
          assignedTo: null,
        },
      );
    }

    if (expiredBookings.length > 0) {
      console.log(`${expiredBookings.length} memberships expired`);
    }
  } catch (error) {
    console.error("Expiry checker error:", error.message);
  }
};