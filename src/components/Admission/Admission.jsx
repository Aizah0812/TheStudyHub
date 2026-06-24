import React, { useState, useRef, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { HiOutlineBadgeCheck, HiArrowRight } from "react-icons/hi";
import "./Admission.css";
import qrCode from "../../assets/qr-code.png";
import API_URL from "../../config/api";
const Admission = () => {
  const formRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [seats, setSeats] = useState([]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    shift: "",
    plan: "",
    price: "",
    purpose: "",
    zone: "",
    seat: "",
    message: "",
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const plans = [
    {
      name: "Scholar",
      price: "600",
      features: ["6 Hours Access", "WiFi", "Water"],
    },
    {
      name: "Researcher",
      price: "1000",
      features: ["12 Hours", "Locker", "Cabin"],
      popular: true,
    },
    {
      name: "Philosopher",
      price: "1800",
      features: ["24/7", "Personal Desk", "Archive"],
    },
  ];

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/seats/available`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setSeats(
        Array.isArray(data)
          ? data.filter((seat) => seat.status === "Available")
          : [],
      );
    } catch (error) {
      console.error("Failed to fetch seats:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlanSelect = (plan) => {
    setFormData((prev) => ({
      ...prev,
      plan: plan.name,
      price: plan.price,
    }));

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  if (!paymentScreenshot) {
    alert(
      "Please complete the payment and upload the payment screenshot to confirm your booking.",
    );
    return;
  }

  if (!formData.plan) {
    alert("Please select a plan first.");
    return;
  }

  const bookingData = {
    ...formData,
    userId: user?._id,
  };

  try {
    // CREATE BOOKING
    const res = await fetch(`${API_URL}/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();

    // console.log("Booking Response:", data);
    // console.log("Response Status:", res.status);
    // console.log("Response OK:", res.ok);

    if (!res.ok) {
      alert(data.message || "You already have an active membership request.");
      return;
    }

    const bookingId = data.booking._id;

    console.log("Booking ID:", bookingId);

    // UPLOAD SCREENSHOT
    const screenshotFormData = new FormData();

    screenshotFormData.append("paymentScreenshot", paymentScreenshot);

    const uploadRes = await fetch(
      `${API_URL}/booking/upload-payment/${bookingId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: screenshotFormData,
      },
    );

    const uploadData = await uploadRes.json();

    console.log("Upload Response:", uploadData);

    if (!uploadRes.ok) {
      alert("Payment screenshot upload failed ❌");
      return;
    }

    alert(
      "Application submitted successfully ✅\n\nYour payment screenshot has been submitted for admin verification.",
    );

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      shift: "",
      plan: "",
      price: "",
      purpose: "",
      zone: "",
      seat: "",
      message: "",
    });

    setPaymentScreenshot(null);

    fetchSeats();
  } catch (error) {
    console.error(error);
    alert("Backend not connected ❌");
  }
};
  return (
    <section className="admission-section" id="admission">
      <div className="container">
        <div className="header">
          <span>PRICING</span>
          <h2>Choose Your Focus Zone</h2>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <Motion.div
              key={i}
              whileHover={{ y: -8 }}
              className={`card ${
                plan.popular ? "featured" : ""
              } ${formData.plan === plan.name ? "active" : ""}`}
            >
              {plan.popular && <div className="tag">Popular</div>}

              <h3>{plan.name}</h3>
              <h1>₹{plan.price}</h1>

              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <HiOutlineBadgeCheck /> {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="btn"
                onClick={() => handlePlanSelect(plan)}
              >
                {formData.plan === plan.name ? "Selected ✓" : "Select Plan"}
              </button>
            </Motion.div>
          ))}
        </div>

        <div className="form-box" ref={formRef}>
          <h3>Apply for Admission</h3>

          <form onSubmit={handleSubmit}>
            <div className="grid">
              <input
                name="name"
                value={formData.name}
                placeholder="Full Name"
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid">
              <input
                name="phone"
                value={formData.phone}
                placeholder="Phone Number"
                onChange={handleChange}
                required
              />

              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                required
              >
                <option value="">Select Shift</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Full Day">Full Day</option>
              </select>
            </div>

            <div className="grid">
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
              >
                <option value="">Study Purpose</option>
                <option value="Competitive Exam">Competitive Exam</option>
                <option value="College Study">College Study</option>
                <option value="Freelancing">Freelancing</option>
              </select>

              <select name="zone" value={formData.zone} onChange={handleChange}>
                <option value="">Select Zone</option>
                <option value="Silent Zone">Silent Zone</option>
                <option value="Group Zone">Group Zone</option>
                <option value="Cabin">Cabin</option>
              </select>
            </div>

            <div className="grid">
              <select name="seat" value={formData.seat} onChange={handleChange}>
                <option value="">Select Seat Number</option>

                {seats.map((seat) => (
                  <option key={seat._id} value={seat.seatNumber}>
                    {seat.seatNumber}
                  </option>
                ))}
              </select>
            </div>

            <input
              value={formData.plan}
              readOnly
              placeholder="Selected Plan"
              className="plan-field"
            />

            <input
              value={formData.price ? `₹${formData.price}` : ""}
              readOnly
              placeholder="Plan Price"
              className="plan-field"
            />

            <textarea
              name="message"
              value={formData.message}
              placeholder="Additional Notes..."
              onChange={handleChange}
            />
            <div className="payment-section">
              <h4>Scan & Pay</h4>

              <img src={qrCode} alt="Payment QR" className="payment-qr" />

              <p>After payment, upload the screenshot for verification.</p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                required
              />

              {paymentScreenshot && (
                <p
                  style={{
                    color: "#16a34a",
                    marginTop: "10px",
                    fontWeight: "600",
                  }}
                >
                  ✅ Payment screenshot selected
                </p>
              )}
            </div>
            <button type="submit" className="submit-btn">
              Submit Application
              <HiArrowRight />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Admission;
