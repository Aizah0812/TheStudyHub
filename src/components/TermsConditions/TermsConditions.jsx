import "../PrivacyPolicy/PrivacyPolicy.css";

const TermsConditions = () => {
  return (
    <section className="policy-page">
      <div className="policy-hero">
        <h1>
          Terms & <span>Conditions</span>
        </h1>

        <p>
          These terms govern the use of The Study Hub services. By using our
          platform, you agree to follow these guidelines.
        </p>

        <span className="policy-date">Last Updated: June 2026</span>
      </div>

      <div className="policy-container">
        <div className="policy-card">
          <h2>Membership Rules</h2>
          <p>
            Members must maintain discipline, follow study center guidelines,
            and respect fellow students and staff members at all times.
          </p>
        </div>

        <div className="policy-card">
          <h2>Payments & Bookings</h2>
          <p>
            Membership fees and seat bookings must be completed before access is
            granted. All payments are subject to our applicable policies.
          </p>
        </div>

        <div className="policy-card">
          <h2>User Responsibilities</h2>
          <p>
            Users are responsible for maintaining accurate account information
            and keeping login credentials secure.
          </p>
        </div>

        <div className="policy-card">
          <h2>Acceptable Use</h2>
          <p>
            Any misuse of the platform, disruptive behavior, or violation of
            study center rules may result in suspension or termination of
            membership.
          </p>
        </div>

        <div className="policy-card">
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to update these terms whenever necessary.
            Continued use of our services indicates acceptance of revised terms.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
