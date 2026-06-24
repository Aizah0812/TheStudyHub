import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import "./ResetPassword.css";
 import API_URL from "../../config/api";
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Password reset successful ✅");
      navigate("/login");
    } catch {
      alert("Backend not connected");
    }
  };

  return (
    <section className="reset-page">
      <div className="reset-card">
        <h2>Reset Password</h2>
        <p>Create a new password to protect your Study Hub account.</p>

        <form onSubmit={handleReset} className="reset-form">
          <div className="reset-field">
            <input
              type={showPass ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
            </button>
          </div>

          <input
            className="reset-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="reset-main-btn">
            Update Password
          </button>
        </form>

        <button
          type="button"
          className="reset-back-btn"
          onClick={() => navigate("/login")}
        >
          Back to login
        </button>
      </div>
    </section>
  );
};

export default ResetPassword;
