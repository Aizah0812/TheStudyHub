import React, { useState } from "react";
import "./Login.css";
import API_URL from "../../config/api";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const copyResetLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      alert("Reset link copied to clipboard ✅");
    } catch {
      alert(`Reset link:\n${link}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }

    if (!isForgot && !formData.password.trim()) {
      alert("Password is required");
      return;
    }

    try {
      setLoading(true);

      // FORGOT PASSWORD
      if (isForgot) {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Error sending reset link");
          return;
        }

        await copyResetLink(data.resetLink);

        setIsForgot(false);
        setIsLogin(true);

        return;
      }

      // LOGIN / SIGNUP URL
      const url = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/signup`;

      const body = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      // LOGIN SUCCESS
      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful ✅");

        if (data.user?.role === "admin") {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        alert("Signup successful ✅ Now login");

        setIsLogin(true);

        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h2>The Study Hub</h2>

          <p>
            A calm and distraction-free environment designed for focused study
            and productivity.
          </p>

          <div className="auth-features">
            <span>✔ 24/7 Study Access</span>
            <span>✔ High-Speed WiFi</span>
            <span>✔ Peaceful Environment</span>
          </div>
        </div>

        <div className="auth-right">
          <h2>
            {isForgot
              ? "Reset Password"
              : isLogin
                ? "Welcome Back 👋"
                : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && !isForgot && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {!isForgot && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            )}

            {isLogin && !isForgot && (
              <button
                type="button"
                className="forgot-link"
                onClick={() => setIsForgot(true)}
              >
                Forgot Password?
              </button>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isForgot
                  ? "Send Reset Link"
                  : isLogin
                    ? "Login"
                    : "Create Account"}
            </button>
          </form>

          {!isForgot && (
            <p className="switch-text">
              {isLogin ? "Don't have an account?" : "Already have an account?"}

              <span
                onClick={() => {
                  setIsLogin(!isLogin);

                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                  });
                }}
              >
                {isLogin ? " Signup" : " Login"}
              </span>
            </p>
          )}

          {isForgot && (
            <p className="switch-text">
              Remember your password?
              <span
                onClick={() => {
                  setIsForgot(false);
                  setIsLogin(true);
                }}
              >
                {" "}
                Login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
