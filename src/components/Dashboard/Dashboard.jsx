import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineLocationMarker,
  HiOutlineDownload,
  HiOutlineSparkles,
  HiOutlineRefresh,
  HiOutlineArrowUp,
  HiOutlineTicket,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import "./Dashboard.css";
import API_URL from "../../config/api";


const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [user?._id]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${API_URL}/booking/user/${user?._id}`,
      );

      const data = await res.json();

      if (res.ok) {
        const allBookings = data.bookings || [];
        setBookings(allBookings);

        if (allBookings.length > 0) {
          const updatedSelected = allBookings.find(
            (booking) => booking._id === selectedBooking?._id,
          );

          setSelectedBooking(updatedSelected || allBookings[0]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const latestBooking = selectedBooking || bookings[0];

  const getAccessDuration = (plan) => {
    if (plan === "Scholar") return "6 Hours / Day";
    if (plan === "Researcher") return "12 Hours / Day";
    if (plan === "Philosopher") return "24/7 Access";
    return "Not Available";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getMembershipStartDate = (booking) => {
    if (!booking || booking.status !== "Paid") return null;
    return booking.paidAt || booking.updatedAt || booking.createdAt;
  };

  const getExpiryDate = (booking) => {
    const startDate = getMembershipStartDate(booking);
    if (!startDate) return null;

    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    expiryDate.setHours(0, 0, 0, 0);

    return expiryDate;
  };

  const getRemainingDaysNumber = (booking) => {
    if (!booking || booking.status !== "Paid") return 0;

    const expiryDate = getExpiryDate(booking);
    if (!expiryDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return Math.max(diffDays, 0);
  };

  const getRemainingDaysText = (booking) => {
    if (!booking) return "N/A";
    if (booking.status !== "Paid") return "Not activated";

    const days = getRemainingDaysNumber(booking);

    if (days <= 0) return "Expired";
    if (days <= 3) return `${days} days left ⚠️`;

    return `${days} days left`;
  };

  const getWarningData = (booking) => {
    if (!booking) return null;

    if (booking.status !== "Paid") {
      return {
        type: "pending",
        title: "Payment pending",
        message:
          "Your payment screenshot has been submitted and is awaiting admin verification.",
        button: "Under Verification",
      };
    }

    const days = getRemainingDaysNumber(booking);

    if (days <= 0) {
      return {
        type: "expired",
        title: "Plan expired",
        message: "Your membership has expired. Renew now to continue access.",
        button: "Renew Now",
      };
    }

    if (days <= 3) {
      return {
        type: "warning",
        title: "Plan expiring soon",
        message: `Only ${days} day${
          days > 1 ? "s" : ""
        } left. Renew your plan to avoid interruption.`,
        button: "Renew Now",
      };
    }

    return null;
  };

  const daysLeft = getRemainingDaysNumber(latestBooking);
  const progress = Math.min(Math.max((daysLeft / 30) * 100, 0), 100);
  const warningData = getWarningData(latestBooking);

  const bookingId = useMemo(() => {
    if (!latestBooking?._id) return "N/A";
    return `BK-${latestBooking._id.slice(-6).toUpperCase()}`;
  }, [latestBooking]);

  const submitComplaint = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/complaints`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          userId: user?._id,
          name: user?.name,
          email: user?.email,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit complaint");
        return;
      }

      alert("Complaint submitted successfully ✅");

      setSubject("");
      setMessage("");

      setShowComplaintModal(false);
    } catch (error) {
      console.error(error);

      alert("Server Error ❌");
    }
  };
  const handleReceipt = () => {
    if (!latestBooking) return alert("No booking found");

    if (latestBooking.status !== "Paid") {
      alert("Receipt is available only after payment");
      return;
    }

    const doc = new jsPDF();

    doc.setFillColor(248, 251, 255);
    doc.rect(0, 0, 210, 297, "F");

    doc.setFillColor(37, 99, 235);
    doc.roundedRect(14, 14, 182, 38, 5, 5, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Study Hub Receipt", 24, 31);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Official payment receipt for your membership plan", 24, 40);

    doc.setTextColor(15, 23, 42);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(14, 64, 182, 145, 6, 6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Payment Details", 24, 80);

    const receiptData = [
      ["Booking ID", bookingId],
      ["Name", latestBooking.name || "N/A"],
      ["Email", latestBooking.email || "N/A"],
      ["Plan", latestBooking.plan || "N/A"],
      ["Shift", latestBooking.shift || "N/A"],
      ["Seat", latestBooking.seat || "N/A"],
      ["Amount", `Rs. ${latestBooking.price || "0"}`],
      ["Status", latestBooking.status || "N/A"],
      ["Payment Date", formatDate(getMembershipStartDate(latestBooking))],
      ["Expiry Date", formatDate(getExpiryDate(latestBooking))],
      ["Days Left", getRemainingDaysText(latestBooking)],
    ];

    let y = 94;

    receiptData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`${label}`, 24, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(String(value), 82, y);

      y += 10;
    });

    doc.setFillColor(239, 246, 255);
    doc.roundedRect(24, 222, 162, 28, 5, 5, "F");

    doc.setTextColor(37, 99, 235);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Thank you for choosing Study Hub!", 34, 236);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("This is a system-generated receipt.", 34, 244);

    doc.save(`${bookingId}-receipt.pdf`);
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <span className="dash-tag">
              <HiOutlineSparkles /> Student Dashboard
            </span>
            <h1>Welcome back, {user?.name || "Student"}</h1>
            <p>Click any booking history card to view its full details.</p>
          </div>

          <div className="dashboard-actions">
            <Link to="/admission" className="dash-action-btn">
              Book / Renew Plan
            </Link>

            <button
              className="complaint-btn"
              style={{
                background: "red",
                color: "white",
                padding: "20px",
              }}
              onClick={() => setShowComplaintModal(true)}
            >
              Raise Complaint
            </button>
          </div>
        </div>

        {warningData && (
          <div className={`expiry-alert ${warningData.type}`}>
            <div className="expiry-alert-left">
              <span className="expiry-alert-icon">
                <HiOutlineExclamationCircle />
              </span>

              <div>
                <h3>{warningData.title}</h3>
                <p>{warningData.message}</p>
              </div>
            </div>

            {warningData.type === "pending" ? (
              <span className="expiry-alert-btn pending-verification">
                Payment Under Verification
              </span>
            ) : (
              <Link to="/admission" className="expiry-alert-btn">
                {warningData.button}
              </Link>
            )}
          </div>
        )}

        <div className="overview-grid">
          <div className="overview-card">
            <HiOutlineCalendar />
            <span>Selected Plan</span>
            <h3>{latestBooking?.plan || "No Plan"}</h3>
          </div>

          <div className="overview-card">
            <HiOutlineClock />
            <span>Access</span>
            <h3>{getAccessDuration(latestBooking?.plan)}</h3>
          </div>

          <div className="overview-card">
            <HiOutlineTicket />
            <span>Booking ID</span>
            <h3>{bookingId}</h3>
          </div>

          <div className="overview-card">
            <HiOutlineCreditCard />
            <span>Payment</span>
            <h3>{latestBooking?.status === "Paid" ? "Paid" : "Pending"}</h3>
          </div>
        </div>

        {!latestBooking ? (
          <div className="empty-box premium-empty">
            <h3>No active booking found</h3>
            <p>Choose a plan and start your focused study journey.</p>
            <Link to="/admission" className="empty-btn">
              Choose Plan
            </Link>
          </div>
        ) : (
          <div className="premium-membership-card">
            <div className="membership-left">
              <div className="membership-top">
                <span className="premium-label">Selected Membership</span>

                <div className="badge-row">
                  <span className="status-badge active">
                    <HiOutlineCheckCircle />{" "}
                    {latestBooking.status === "Paid" ? "Active" : "Inactive"}
                  </span>

                  <span
                    className={
                      latestBooking.status === "Paid"
                        ? "status-badge paid"
                        : "status-badge pending"
                    }
                  >
                    {latestBooking.status === "Paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>

              <h2>{latestBooking.plan} Plan</h2>

              <p className="membership-subtitle">
                {getAccessDuration(latestBooking.plan)} • Seat{" "}
                {latestBooking.seat || "N/A"} • {latestBooking.shift || "N/A"}
              </p>

              <div className="booking-id-box">
                <HiOutlineTicket />
                <span>Booking ID</span>
                <strong>{bookingId}</strong>
              </div>

              <div className="date-grid">
                <div>
                  <span>Payment Date</span>
                  <strong>
                    {formatDate(getMembershipStartDate(latestBooking))}
                  </strong>
                </div>

                <div>
                  <span>Expiry Date</span>
                  <strong>{formatDate(getExpiryDate(latestBooking))}</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>₹{latestBooking.price}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>Study Hub</strong>
                </div>
              </div>

              <div className="quick-actions">
                <Link to="/admission" className="quick-btn primary">
                  <HiOutlineRefresh /> Renew
                </Link>

                <Link to="/admission" className="quick-btn">
                  <HiOutlineArrowUp /> Upgrade
                </Link>

                <button className="quick-btn" onClick={handleReceipt}>
                  <HiOutlineDownload /> Receipt
                </button>

                {latestBooking.status === "Pending" && (
                  <button className="quick-btn pending-btn" disabled>
                    Payment Under Verification
                  </button>
                )}
              </div>
            </div>

            <div className="progress-panel">
              <div
                className="circle-progress"
                style={{
                  background:
                    latestBooking.status === "Paid"
                      ? `conic-gradient(#ffffff ${progress}%, rgba(255,255,255,0.18) ${progress}%)`
                      : `conic-gradient(rgba(255,255,255,0.25) 100%, rgba(255,255,255,0.18) 0%)`,
                }}
              >
                <div className="circle-inner">
                  <strong>
                    {latestBooking.status === "Paid" ? daysLeft : 0}
                  </strong>
                  <span>Days Left</span>
                </div>
              </div>

              <p>{getRemainingDaysText(latestBooking)}</p>
            </div>
          </div>
        )}

        <div className="details-section">
          <div className="section-title">
            <h2>Selected Booking Details</h2>
          </div>

          {latestBooking && (
            <div className="booking-details-grid">
              <div>
                <span>Name</span>
                <p>{latestBooking.name}</p>
              </div>
              <div>
                <span>Email</span>
                <p>{latestBooking.email}</p>
              </div>
              <div>
                <span>Plan</span>
                <p>{latestBooking.plan}</p>
              </div>
              <div>
                <span>Shift</span>
                <p>{latestBooking.shift}</p>
              </div>
              <div>
                <span>Seat</span>
                <p>{latestBooking.seat}</p>
              </div>
              <div>
                <span>Amount</span>
                <p>₹{latestBooking.price}</p>
              </div>
              <div>
                <span>Validity</span>
                <p>{getRemainingDaysText(latestBooking)}</p>
              </div>
              <div>
                <span>Status</span>
                <p>{latestBooking.status}</p>
              </div>
            </div>
          )}
        </div>

        <div className="history-box">
          <div className="section-title">
            <h2>Booking History</h2>
            <span>{bookings.length} Records</span>
          </div>

          {bookings.length === 0 ? (
            <p className="empty-text">No bookings found.</p>
          ) : (
            <div className="history-list">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className={`history-item ${
                    latestBooking?._id === b._id ? "selected-history" : ""
                  }`}
                  onClick={() => setSelectedBooking(b)}
                >
                  <div className="history-main">
                    <div className="history-icon">
                      <HiOutlineLocationMarker />
                    </div>

                    <div>
                      <h3>{b.plan} Plan</h3>
                      <p>
                        {b.shift} • Seat {b.seat || "N/A"} •{" "}
                        {b.status === "Paid"
                          ? `Paid on ${formatDate(getMembershipStartDate(b))}`
                          : "Payment pending"}
                      </p>
                    </div>
                  </div>

                  <div className="history-right">
                    <strong>₹{b.price}</strong>
                    <span
                      className={
                        b.status === "Paid" ? "paid-text" : "pending-text"
                      }
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showComplaintModal && (
        <div
          className="complaint-overlay"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 999999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="complaint-modal">
            <h2>Raise Complaint</h2>

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: "100%", padding: "10px" }}
            />

            <textarea
              rows="5"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "100%", padding: "10px" }}
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowComplaintModal(false)}
              >
                Cancel
              </button>

              <button className="submit-btn" onClick={submitComplaint}>
                Submit Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
