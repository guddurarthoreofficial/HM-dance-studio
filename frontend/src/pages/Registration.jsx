
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
// import "./Registration.css";

const initialForm = {
  studentName: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: "",
  aadhaarNumber: "",
  studentMobile: "",
  parentMobile: "",
  email: "",
  currentAddress: "",
  permanentAddress: "",
  gender: "",
};

export default function Registration() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        aadhaarNumber: form.aadhaarNumber.trim() || undefined,
      };

      const response = await api.post("/registrations", payload);

      setSuccess(
        response.data.emailSent
          ? "Your registration has been submitted successfully. A confirmation email has been sent to your email address."
          : "Your registration has been submitted successfully, but the confirmation email could not be sent right now."
      );

      setForm({ ...initialForm });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccess("");
  };

  return (
    <main className="hm-registration-page">
      <section className="hm-registration-container">

        {/* Page Heading */}
        <div className="hm-registration-heading">
          <span className="hm-registration-kicker">
            HM DANCE STUDIO
          </span>

          <h1>
            Begin Your <em>Journey</em>
          </h1>

          <p>
            Take the first step towards your passion. Fill in the
            registration form below and our team will contact you.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="hm-registration-alert error" role="alert">
            <strong>Registration Failed</strong>
            <p>{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form
          className="hm-registration-form"
          onSubmit={handleSubmit}
        >
          {/* Student Information */}
          <div className="hm-registration-section">
            <h2>Student Information</h2>

            <div className="hm-registration-grid">

              <div className="hm-form-group">
                <label htmlFor="studentName">
                  Student Full Name *
                </label>
                <input
                  id="studentName"
                  type="text"
                  name="studentName"
                  value={form.studentName}
                  onChange={handleChange}
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              <div className="hm-form-group">
                <label htmlFor="dateOfBirth">
                  Date of Birth *
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toLocaleDateString("en-CA")}
                  required
                />
              </div>

              <div className="hm-form-group">
                <label htmlFor="fatherName">
                  Father's Name *
                </label>
                <input
                  id="fatherName"
                  type="text"
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleChange}
                  placeholder="Enter father's name"
                  required
                />
              </div>

              <div className="hm-form-group">
                <label htmlFor="motherName">
                  Mother's Name *
                </label>
                <input
                  id="motherName"
                  type="text"
                  name="motherName"
                  value={form.motherName}
                  onChange={handleChange}
                  placeholder="Enter mother's name"
                  required
                />
              </div>

              <div className="hm-form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="hm-form-group">
                <label htmlFor="aadhaarNumber">
                  Aadhaar Number (Optional)
                </label>
                <input
                  id="aadhaarNumber"
                  type="text"
                  name="aadhaarNumber"
                  value={form.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                  inputMode="numeric"
                  pattern="[0-9]{12}"
                  title="Enter a valid 12-digit Aadhaar number"
                />
              </div>

            </div>
          </div>

          {/* Contact Information */}
          <div className="hm-registration-section">
            <h2>Contact Information</h2>

            <div className="hm-registration-grid">

              <div className="hm-form-group">
                <label htmlFor="studentMobile">
                  Student Mobile *
                </label>
                <input
                  id="studentMobile"
                  type="tel"
                  name="studentMobile"
                  value={form.studentMobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="hm-form-group">
                <label htmlFor="parentMobile">
                  Parent Mobile *
                </label>
                <input
                  id="parentMobile"
                  type="tel"
                  name="parentMobile"
                  value={form.parentMobile}
                  onChange={handleChange}
                  placeholder="Parent's 10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="hm-form-group full-width">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="hm-form-group full-width">
                <label htmlFor="currentAddress">
                  Current Address *
                </label>
                <textarea
                  id="currentAddress"
                  name="currentAddress"
                  value={form.currentAddress}
                  onChange={handleChange}
                  placeholder="Enter your current address"
                  rows={3}
                  required
                />
              </div>

              <div className="hm-form-group full-width">
                <label htmlFor="permanentAddress">
                  Permanent Address *
                </label>
                <textarea
                  id="permanentAddress"
                  name="permanentAddress"
                  value={form.permanentAddress}
                  onChange={handleChange}
                  placeholder="Enter your permanent address"
                  rows={3}
                  required
                />
              </div>

            </div>
          </div>

          {/* Submit */}
          <div className="hm-registration-submit">
            <p>
              By submitting this form, you confirm that the
              information provided is accurate.
            </p>

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Registration"}
              {!loading && <span>↗</span>}
            </button>

            <Link to="/" className="hm-registration-back">
              Back to Home
            </Link>
          </div>
        </form>
      </section>

      {/* Success Popup Modal */}
      {success && (
        <div
          className="hm-success-overlay"
          onClick={closeSuccessModal}
        >
          <div
            className="hm-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hm-success-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hm-success-icon">
              <svg viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27l7 7 15-16" />
              </svg>
            </div>

            <span className="hm-success-label">
              HM DANCE STUDIO
            </span>

            <h2 id="hm-success-title">
              Registration <em>Received!</em>
            </h2>

            <p>{success}</p>

            <button
              type="button"
              onClick={closeSuccessModal}
            >
              Done <span>↗</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
