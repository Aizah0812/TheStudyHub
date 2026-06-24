import { motion as Motion } from "framer-motion";
import {
HiOutlineLocationMarker,
HiOutlineClock,
HiOutlineUsers,
HiOutlineSparkles,
HiOutlineBookOpen,
HiOutlineShieldCheck,
} from "react-icons/hi";
import "./About.css";

const About = () => {
const timings = [
{ day: "Mon - Fri", time: "08:00 - 23:00" },
{ day: "Saturday", time: "09:00 - 21:00" },
{ day: "Sunday", time: "10:00 - 18:00" },
];

return ( <section className="about" id="about">
{/* HERO */}

```
  <div className="about-hero">
    <Motion.h1
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Designed for <span>deep focus</span>
      <br />
      Built for your <span>success</span>
    </Motion.h1>

    <Motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      The Study Hub is more than a library. It is a focused learning
      environment where students, aspirants and professionals work towards
      their goals with discipline and consistency.
    </Motion.p>
  </div>

  {/* STATS */}

  <div className="about-stats">
    <div className="stat-box">
      <h3>100+</h3>
      <p>Study Seats</p>
    </div>

    <div className="stat-box">
      <h3>500+</h3>
      <p>Students Served</p>
    </div>

    <div className="stat-box">
      <h3>15+</h3>
      <p>Hours Open Daily</p>
    </div>
  </div>

  {/* MAIN GRID */}

  <div className="about-container">
    {/* LEFT */}

    <Motion.div
      className="about-left"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      <h2>Why Choose Study Hub?</h2>

      <div className="features">
        <div className="feature">
          <HiOutlineUsers />
          <div>
            <h4>Focused Community</h4>
            <p>
              Study alongside ambitious students preparing for success.
            </p>
          </div>
        </div>

        <div className="feature">
          <HiOutlineSparkles />
          <div>
            <h4>Premium Environment</h4>
            <p>
              Calm, modern and distraction-free study space.
            </p>
          </div>
        </div>

        <div className="feature">
          <HiOutlineBookOpen />
          <div>
            <h4>Dedicated Learning Space</h4>
            <p>
              Comfortable seating and productive atmosphere.
            </p>
          </div>
        </div>

        <div className="feature">
          <HiOutlineShieldCheck />
          <div>
            <h4>Safe & Secure</h4>
            <p>
              CCTV monitoring and secure environment for all members.
            </p>
          </div>
        </div>
      </div>

      <a href="/admission" className="primary-btn">
        Join Now
      </a>
    </Motion.div>

    {/* RIGHT */}

    <div className="about-right">
      <Motion.div
        className="glass-card"
        whileHover={{ y: -6 }}
      >
        <h3>
          <HiOutlineClock />
          Opening Hours
        </h3>

        {timings.map((t, i) => (
          <div key={i} className="row">
            <span>{t.day}</span>
            <b>{t.time}</b>
          </div>
        ))}
      </Motion.div>

      <Motion.div
        className="glass-card"
        whileHover={{ y: -6 }}
      >
        <h3>
          <HiOutlineLocationMarker />
          Location
        </h3>

        <p>
          The Study Hub
          <br />
          Muzaffarpur, Bihar
        </p>

        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          View Map
        </a>
      </Motion.div>
    </div>
  </div>
</section>
);
};
export default About;
