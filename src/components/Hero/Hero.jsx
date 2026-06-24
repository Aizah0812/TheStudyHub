import React from "react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>
          Your distraction-free <br />
          study space awaits
        </h1>

        <p>
          Join students and professionals who choose a calm, productive
          environment to achieve their goals. Available 24/7 with premium
          amenities designed for focus.
        </p>

        <div className="hero-buttons">
          <Link to="/admission" className="hero-primary-btn">
            Book a Seat
            <HiArrowRight className="arrow-icon" />
          </Link>

          <a href="#gallery" className="hero-secondary-btn">
            View Library
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
