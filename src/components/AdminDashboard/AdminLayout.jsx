import React, { useState, useEffect } from "react";
import "./AdminLayout.css";
import API_URL from "../../config/api";
import { FaHome, FaChair, FaUsers, FaMoneyBillWave } from "react-icons/fa";

import { FaIdCard } from "react-icons/fa";
import {
  FaBullhorn,
} from "react-icons/fa";

import NoticeManagement from "./NoticeManagement";

import MembershipManagement from "./MembershipManagement";
import AdminDashboard from "./AdminDashboard";
import SeatManagement from "./SeatManagement";
import UserManagement from "./UserManagement";
import Revenue from "./Revenue";
import ComplaintManagement from "./ComplaintManagement";
import { FaExclamationCircle } from "react-icons/fa";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [seats, setSeats] = useState([]);

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
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div>
          <div className="sidebar-header">
            <h2> </h2>
          </div>

          <div className="sidebar-menu">
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaHome />
              Dashboard
            </button>

            <button
              className={activeTab === "seats" ? "active" : ""}
              onClick={() => setActiveTab("seats")}
            >
              <FaChair />
              Seat Management
            </button>

            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              <FaUsers />
              Users
            </button>

            <button
              className={activeTab === "membership" ? "active" : ""}
              onClick={() => setActiveTab("membership")}
            >
              <FaIdCard />
              Memberships
            </button>
            <button
              className={activeTab === "revenue" ? "active" : ""}
              onClick={() => setActiveTab("revenue")}
            >
              <FaMoneyBillWave />
              Revenue
            </button>
            <button
              className={activeTab === "notices" ? "active" : ""}
              onClick={() => setActiveTab("notices")}
            >
              <FaBullhorn />
              Notices
            </button>
            <button
              className={activeTab === "complaints" ? "active" : ""}
              onClick={() => setActiveTab("complaints")}
            >
              <FaExclamationCircle />
              Complaints
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="avatar">A</div>

            <div>
              <h4>Admin</h4>
              <p>Study Hub</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        {activeTab === "dashboard" && <AdminDashboard seats={seats} />}

        {activeTab === "seats" && <SeatManagement />}

        {activeTab === "users" && <UserManagement />}

        {activeTab === "membership" && <MembershipManagement />}

        {activeTab === "revenue" && <Revenue />}

        {activeTab === "notices" && <NoticeManagement />}

        {activeTab === "complaints" && <ComplaintManagement />}
      </main>
    </div>
  );
};

export default AdminLayout;
