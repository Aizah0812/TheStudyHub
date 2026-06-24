import { useState } from "react";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";
import "./Contact.css";
import API_URL from "../../config/api";


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/contact`,
        formData,
      );

      alert(response.data.message);

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        {/* HEADER */}
        <Motion.div
          className="contact-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h1>
            Get in <span>Touch</span>
          </h1>
          <p>We’d love to hear from you. Visit us or send a message.</p>
        </Motion.div>

        {/* GRID */}
        <div className="contact-grid">
          {/* LEFT - FORM */}
          <Motion.div
            className="contact-form"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3>Send a Message</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            {/* WHATSAPP BUTTON */}
            <a
              href="https://wa.me/919153847815"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
            >
              Connect on WhatsApp
            </a>
          </Motion.div>

          {/* RIGHT - INFO + MAP */}
          <Motion.div
            className="contact-info"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="info-card">
              <HiOutlineLocationMarker />
              <div>
                <h4>Location</h4>
                <p>Knowledge Hub, Sector 62, Noida</p>
              </div>
            </div>

            <div className="info-card">
              <HiOutlinePhone />
              <div>
                <h4>Phone</h4>
                <p>+91 9153847815</p>
              </div>
            </div>

            <div className="info-card">
              <HiOutlineMail />
              <div>
                <h4>Email</h4>
                <p>aizahsarfaraz0786@gmail.com</p>
              </div>
            </div>

            {/* MAP */}
            <div className="map">
              <iframe
                src="https://www.google.com/maps?q=Sector+62+Noida&output=embed"
                allowFullScreen=""
                loading="lazy"
                title="map"
              ></iframe>
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
