import React from "react";
import "./AdminDashboard.css";

const AdminDashboard = ({ seats }) => {
  const totalSeats = seats.length;
  const bookedSeats = seats.filter((s) => s.status === "Booked").length;
  const availableSeats = seats.filter((s) => s.status === "Available").length;

  const stats = [
    {
      title: "Total Seats",
      value: totalSeats,
      icon: "💺",
      color: "#10b981",
    },
    {
      title: "Booked Seats",
      value: bookedSeats,
      icon: "📌",
      color: "#f59e0b",
    },
    {
      title: "Available Seats",
      value: availableSeats,
      icon: "🪑",
      color: "#6366f1",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Real-time seat insights</p>
        </div>

        <div className="admin-cards">
          {stats.map((item, index) => (
            <div className="admin-card" key={index}>
              <div className="card-icon" style={{ background: item.color }}>
                {item.icon}
              </div>

              <div className="card-info">
                <h3>{item.value}</h3>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
