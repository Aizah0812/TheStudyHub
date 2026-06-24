import React, { useEffect, useState } from "react";
import "./Revenue.css";
import API_URL from "../../config/api";


import { FaMoneyBillWave, FaUsers, FaClipboardCheck } from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Revenue = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    paidMembers: 0,
    pendingMembers: 0,
    totalBookings: 0,
    monthlyData: [],
  });

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/admin/revenue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setStats(data);
    } catch (error) {
      console.error("Revenue fetch failed:", error);
    }
   
  };

  return (
    <div className="revenue-page">
      <div className="revenue-header">
        <h1>Revenue Dashboard</h1>
        <p>Track memberships and earnings</p>
      </div>

      <div className="revenue-cards">
        <div className="revenue-card">
          <FaMoneyBillWave className="revenue-icon" />
          <h3>₹{stats.totalRevenue}</h3>
          <span>Total Revenue</span>
        </div>

        <div className="revenue-card">
          <FaUsers className="revenue-icon" />
          <h3>{stats.paidMembers}</h3>
          <span>Paid Members</span>
        </div>

        <div className="revenue-card">
          <FaClipboardCheck className="revenue-icon" />
          <h3>{stats.pendingMembers}</h3>
          <span>Pending Members</span>
        </div>

        <div className="revenue-card">
          <FaClipboardCheck className="revenue-icon" />
          <h3>{stats.totalBookings}</h3>
          <span>Total Bookings</span>
        </div>

        <div className="revenue-card">
          <FaMoneyBillWave className="revenue-icon" />
          <h3>₹{stats.monthlyRevenue}</h3>
          <span>Monthly Revenue</span>
        </div>
      </div>

      <div className="chart-box">
        <h2>Monthly Revenue Chart</h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={stats.monthlyData || []}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="revenue" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Revenue;
