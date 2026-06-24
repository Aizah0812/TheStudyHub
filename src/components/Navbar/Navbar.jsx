import React, { useState, useEffect } from "react";
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import ProfileModal from "../ProfileModal/ProfileModal";
import "./Navbar.css";
import API_URL from "../../config/api"; // Import the API_URL from the config file

// Backend ka URL yahan define karein
const BASE_URL = API_URL;
const Avatar = ({ user, avatarLetter }) => {
  const imageUrl = user?.profileImage || "";

  return (
    <span
      className="profile-avatar"
      style={
        imageUrl
          ? {
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {!imageUrl && avatarLetter}
    </span>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // LocalStorage se fresh data lena zaroori hai
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const isAdmin = user?.role === "admin";

  const firstName = user?.name?.split(" ")[0] || "User";
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.clear(); // Sab clear karna behtar hai
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ... (navItems logic same rahegi)
const navItems = token
  ? [
      { name: "Home", link: "/" },
      { name: "About", link: "/about" },
      { name: "Services", link: "/services" },
      { name: "Notices", link: "/notices" },
      { name: "Contact", link: "/contact" },
    ]
  : [
      { name: "Home", link: "/" },
      { name: "About", link: "/about" },
      { name: "Services", link: "/services" },
      { name: "Admission", link: "/admission" },
      { name: "Notices", link: "/notices" },
      { name: "Contact", link: "/contact" },
    ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-wrapper">
          <NavLink to="/" className="logo" onClick={() => setIsOpen(false)}>
            The Study Hub
          </NavLink>

          <div className={`nav-center ${isOpen ? "open" : ""}`}>
            <ul>
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mobile-actions">
              {token && (
                <>
                  <NavLink
                    to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                    className="dashboard-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    {isAdmin ? "My Dashboard" : "My Booking"}
                  </NavLink>
                  <button
                    type="button"
                    className="profile-chip mobile-profile"
                    onClick={() => {
                      setShowProfile(true);
                      setIsOpen(false);
                    }}
                  >
                    <Avatar user={user} avatarLetter={avatarLetter} />
                    <span>{firstName}</span>
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
              {!token && (
                <>
                  <NavLink
                    to="/login"
                    className="login-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    Login / Signup
                  </NavLink>
                  <NavLink
                    to="/admission"
                    className="cta-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Now
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div className="nav-right">
            {token ? (
              <>
                <NavLink
                  to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                  className="dashboard-btn"
                >
                  {isAdmin ? "My Dashboard" : "My Booking"}
                </NavLink>
                <button
                  type="button"
                  className="profile-chip"
                  onClick={() => setShowProfile(true)}
                >
                  <Avatar user={user} avatarLetter={avatarLetter} />
                  <span>{firstName}</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="login-btn">
                  Login / Signup
                </NavLink>
                <NavLink to="/admission" className="cta-btn">
                  Join Now
                </NavLink>
              </>
            )}
            <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <HiOutlineX /> : <HiOutlineMenuAlt4 />}
            </div>
          </div>
        </div>
      </nav>

      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Navbar;
