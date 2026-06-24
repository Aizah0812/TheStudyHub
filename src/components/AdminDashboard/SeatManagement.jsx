import React, { useEffect, useState } from "react";
import "./SeatManagement.css";
import API_URL from "../../config/api";

import { FaChair, FaPlus, FaTrash, FaExchangeAlt } from "react-icons/fa";

const SeatManagement = () => {
  const [seats, setSeats] = useState([]);
  const [seatNumber, setSeatNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/seats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setSeats(data);
    } catch (error) {
      console.error("Failed to fetch seats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeat = async () => {
    if (!seatNumber.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          seatNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setSeatNumber("");
      fetchSeats();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this seat?");

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/seats/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchSeats();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/seats/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchSeats();
    } catch (error) {
      console.error(error);
    }
  };

  const totalSeats = seats.length;

  const availableSeats = seats.filter(
    (seat) => seat.status === "Available",
  ).length;

  const occupiedSeats = seats.filter(
    (seat) => seat.status === "Occupied",
  ).length;

  if (loading) {
    return <h2>Loading Seats...</h2>;
  }

  return (
    <div className="seat-page">
      <div className="seat-header">
        <h1>Seat Management</h1>
        <p>Manage and monitor all library seats</p>
      </div>

      <div className="seat-stats">
        <div className="stat-card">
          <h3>{totalSeats}</h3>
          <span>Total Seats</span>
        </div>

        <div className="stat-card">
          <h3>{availableSeats}</h3>
          <span>Available</span>
        </div>

        <div className="stat-card">
          <h3>{occupiedSeats}</h3>
          <span>Occupied</span>
        </div>
      </div>

      <div className="seat-add-box">
        <input
          type="text"
          placeholder="Enter seat number"
          value={seatNumber}
          onChange={(e) => setSeatNumber(e.target.value)}
        />

        <button onClick={handleAddSeat}>
          <FaPlus />
          Add Seat
        </button>
      </div>

      <div className="seat-list">
        {seats.map((seat) => (
          <div className="seat-card" key={seat._id}>
            <div className="seat-left">
              <div className="seat-icon">
                <FaChair />
              </div>

              <div>
                <h3>{seat.seatNumber}</h3>

                <span
                  className={`status ${
                    seat.status === "Available" ? "available" : "booked"
                  }`}
                >
                  {seat.status}
                </span>

                {seat.assignedTo && (
                  <div className="seat-user-info">
                    <p>👤 {seat.assignedTo.name}</p>

                    <p>✉ {seat.assignedTo.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="seat-actions">
              <button
                className="toggle-btn"
                onClick={() => toggleStatus(seat._id)}
              >
                <FaExchangeAlt />
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(seat._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatManagement;
