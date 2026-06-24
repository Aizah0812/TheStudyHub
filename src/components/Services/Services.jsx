import React from "react";
import { motion as Motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  HiOutlineClock,
  HiOutlineWifi,
  HiOutlineLightBulb,
  HiOutlineBookOpen,
  HiOutlineStatusOnline,
  HiOutlineBeaker,
} from "react-icons/hi";
import "./Services.css";

const Services = () => {
  const services = [
    {
      title: "24/7 Access",
      desc: "Access the library anytime with complete flexibility.",
      icon: <HiOutlineClock />,
    },
    {
      title: "High-Speed WiFi",
      desc: "Fast and reliable internet for uninterrupted study.",
      icon: <HiOutlineWifi />,
    },
    {
      title: "Filtered Water",
      desc: "Clean and safe drinking water available always.",
      icon: <HiOutlineBeaker />,
    },
    {
      title: "Quiet Study Zones",
      desc: "Noise-free environment for deep focus.",
      icon: <HiOutlineLightBulb />,
    },
    {
      title: "Digital Archive",
      desc: "Access journals and study materials online.",
      icon: <HiOutlineStatusOnline />,
    },
    {
      title: "E-Book Lending",
      desc: "Borrow books digitally anytime, anywhere.",
      icon: <HiOutlineBookOpen />,
    },
  ];

  return (
    <section className="services">
      <div className="services-container">
        {/* HEADER */}
        <Motion.div
          className="services-header"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="sub-tag">Our Services</span>
          <h2>What We Offer</h2>
          <p>
            Everything you need for a productive and focused learning
            environment.
          </p>
        </Motion.div>

        {/* GRID */}
        <Motion.div
          className="services-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {services.map((item, index) => (
            <Motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                <div className="service-card">
                  {/* 🔥 GLOW EFFECT */}
                  <div className="card-glow"></div>

                  {/* 🔥 ICON WITH ANIMATION */}
                  <Motion.div
                    className="service-icon"
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {item.icon}
                  </Motion.div>

                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Tilt>
            </Motion.div>
          ))}
        </Motion.div>

        {/* 🔥 CTA SECTION */}
        <Motion.div
          className="services-cta"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3>Ready to boost your productivity?</h3>
          <button>Join Now</button>
        </Motion.div>
      </div>
    </section>
  );
};

export default Services;
