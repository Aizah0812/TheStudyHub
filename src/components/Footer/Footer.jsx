import { useState } from "react";
import {
  HiOutlineBookOpen,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* TOP GRID */}
          <div className="footer-grid">
            {/* LEFT */}
            <div className="footer-col">
              <div className="logo">
                <HiOutlineBookOpen />
                <h2>24/7 Self-Study Center</h2>
              </div>

              <p>
                A calm, distraction-free environment designed for students and
                professionals to achieve their goals.
              </p>
            </div>

            {/* CENTER */}
            <div className="footer-col">
              <h3>Quick Links</h3>

              <ul>
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>

                <li>
                  <NavLink to="/about">About Us</NavLink>
                </li>

                <li>
                  <NavLink to="/services">Services</NavLink>
                </li>

                <li>
                  <NavLink to="/admission">Admission</NavLink>
                </li>

                <li>
                  <NavLink to="/contact">Contact</NavLink>
                </li>
              </ul>
            </div>

            {/* RIGHT */}
            <div className="footer-col">
              <h3>Contact Information</h3>

              <div className="info">
                <HiOutlinePhone />
                <span>+91 9153847815</span>
              </div>

              <div className="info">
                <HiOutlineMail />
                <span>aizahsarfaraz0786@gmail.com</span>
              </div>

              <div className="info">
                <HiOutlineLocationMarker />
                <span>Sector 62, Noida, India</span>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="footer-bottom">
            <p>© 2026 24/7 Self-Study Center Library. All rights reserved.</p>

            <div className="footer-links">
              <NavLink to="/privacy-policy">Privacy Policy</NavLink>

              <button
                className="footer-faq-btn"
                onClick={() => setShowFAQ(true)}
              >
                FAQ
              </button>

              <NavLink to="/terms-and-conditions">Terms of Service</NavLink>
            </div>
          </div>
        </div>
      </footer>

      {/* FAQ MODAL */}
      {showFAQ && (
        <div className="faq-modal-overlay" onClick={() => setShowFAQ(false)}>
          <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
            <button className="faq-close" onClick={() => setShowFAQ(false)}>
              ×
            </button>

            <h2>Frequently Asked Questions</h2>

            <div className="faq-item">
              <h4>Is the library open 24/7?</h4>
              <p>Yes, active members can access the study center 24/7.</p>
            </div>

            <div className="faq-item">
              <h4>How can I book a seat?</h4>
              <p>
                Simply create an account and visit the Admission page to reserve
                your seat.
              </p>
            </div>

            <div className="faq-item">
              <h4>Do you provide high-speed WiFi?</h4>
              <p>Yes, high-speed internet is available for all members.</p>
            </div>

            <div className="faq-item">
              <h4>Is air conditioning available?</h4>
              <p>Yes, the entire study area is fully air conditioned.</p>
            </div>

            <div className="faq-item">
              <h4>Can I access my booking online?</h4>
              <p>
                Yes, you can manage and view your booking through your
                dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
