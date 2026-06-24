import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <section className="policy-page">
      <div className="policy-hero">
        <h1>
          Privacy <span>Policy</span>
        </h1>

        <p>
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information while using The Study Hub.
        </p>

        <span className="policy-date">Last Updated: June 2026</span>
      </div>

      <div className="policy-container">
        <div className="policy-card">
          <h2>Information We Collect</h2>
          <p>
            We may collect your name, email address, phone number, profile
            information, admission details, and communication records when you
            register or interact with our platform.
          </p>
        </div>

        <div className="policy-card">
          <h2>How We Use Your Information</h2>
          <p>
            Your information helps us manage admissions, bookings, customer
            support, account verification, notifications, and overall service
            improvement.
          </p>
        </div>

        <div className="policy-card">
          <h2>Data Security</h2>
          <p>
            We implement industry-standard security practices to safeguard your
            information from unauthorized access, misuse, or disclosure.
          </p>
        </div>

        <div className="policy-card">
          <h2>Third-Party Services</h2>
          <p>
            Certain features may rely on trusted third-party services such as
            payment processors, email providers, or cloud infrastructure
            partners.
          </p>
        </div>

        <div className="policy-card">
          <h2>Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, you may contact
            us through our website contact page or official support channels.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
