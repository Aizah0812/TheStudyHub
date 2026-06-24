import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import API_URL from "../../config/api";
import {
  FaUsers,
  FaChair,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

import { MdEventSeat, MdPendingActions } from "react-icons/md";

const AdminDashboard = ({ seats = [] }) => {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    paidMembers: 0,
    pendingMembers: 0,
    recentUsers: [],
    recentBookings: [],
  });

  const [loading, setLoading] = useState(true);

  const totalSeats = seats.length;

  const occupiedSeats = seats.filter(
    (seat) => seat.status === "Occupied",
  ).length;

  const availableSeats = seats.filter(
    (seat) => seat.status === "Available",
  ).length;

  const occupancyRate =
    totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setDashboardStats(data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      title: "Users",
      value: dashboardStats.totalUsers,
      icon: <FaUsers />,
    },
    {
      title: "Bookings",
      value: dashboardStats.totalBookings,
      icon: <FaClipboardCheck />,
    },
    {
      title: "Paid Members",
      value: dashboardStats.paidMembers,
      icon: <FaMoneyBillWave />,
    },
    {
      title: "Pending Members",
      value: dashboardStats.pendingMembers,
      icon: <MdPendingActions />,
    },
    {
      title: "Total Seats",
      value: totalSeats,
      icon: <FaChair />,
    },
    {
      title: "Available Seats",
      value: availableSeats,
      icon: <MdEventSeat />,
    },
    {
      title: "Occupied Seats",
      value: occupiedSeats,
      icon: <FaChair />,
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      icon: <FaCheckCircle />,
    },
  ];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>

        <p>
          Welcome back! Manage users, memberships, bookings and seats from one
          place.
        </p>
      </div>

      <div className="admin-cards">
        {stats.map((item, index) => (
          <div className="admin-card" key={index}>
            <div className="card-icon">{item.icon}</div>

            <div className="card-info">
              <h3>{item.value}</h3>
              <span>{item.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        {/* Recent Activity */}
        <div className="dashboard-box">
          <h2>Recent Activity</h2>

          {dashboardStats.recentUsers?.length > 0 ? (
            <>
              {dashboardStats.recentUsers.map((user) => (
                <p key={user._id}>
                  <FaUsers className="activity-icon" />
                  {user.name} joined the platform
                </p>
              ))}

              {dashboardStats.recentBookings.map((booking) => (
                <p key={booking._id}>
                  <FaClipboardCheck className="activity-icon" />
                  {booking.name} booked {booking.plan} plan
                </p>
              ))}
            </>
          ) : (
            <p>No recent activity found.</p>
          )}
        </div>

        {/* System Overview */}
        <div className="dashboard-box">
          <h2>System Overview</h2>

          <div className="overview-item">
            <FaUsers className="overview-icon" />
            <span>Total Users: {dashboardStats.totalUsers}</span>
          </div>

          <div className="overview-item">
            <FaClipboardCheck className="overview-icon" />
            <span>Total Bookings: {dashboardStats.totalBookings}</span>
          </div>

          <div className="overview-item">
            <FaCheckCircle className="overview-icon" />
            <span>Paid Members: {dashboardStats.paidMembers}</span>
          </div>

          <div className="overview-item">
            <MdPendingActions className="overview-icon" />
            <span>Pending Members: {dashboardStats.pendingMembers}</span>
          </div>

          <div className="overview-item">
            <FaChair className="overview-icon" />
            <span>Total Seats: {totalSeats}</span>
          </div>

          <div className="overview-item">
            <MdEventSeat className="overview-icon" />
            <span>Available Seats: {availableSeats}</span>
          </div>

          <div className="overview-item">
            <FaChair className="overview-icon occupied" />
            <span>Occupied Seats: {occupiedSeats}</span>
          </div>

          <h3 className="occupancy-title">Seat Occupancy</h3>

          <div className="occupancy-bar">
            <div
              className="occupancy-fill"
              style={{
                width: `${occupancyRate}%`,
              }}
            />
          </div>

          <p className="occupancy-text">{occupancyRate}% Occupied</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
