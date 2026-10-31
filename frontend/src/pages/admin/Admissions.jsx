
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const initialForm = {
  name: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: "",
  gender: "",
  aadhaarNumber: "",
  phone: "",
  parentPhone: "",
  email: "",
  password: "",
  presentAddress: "",
  permanentAddress: "",
};

const fields = [
  { name: "name", label: "Student Full Name", required: true },
  { name: "fatherName", label: "Father's Name", required: true },
  { name: "motherName", label: "Mother's Name", required: true },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    required: true,
  },
  {
    name: "aadhaarNumber",
    label: "Aadhaar Number",
    required: true,
    maxLength: 12,
  },
  {
    name: "phone",
    label: "Student Mobile",
    required: true,
    maxLength: 10,
  },
  {
    name: "parentPhone",
    label: "Parent Mobile",
    required: true,
    maxLength: 10,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
  },
  {
    name: "password",
    label: "Temporary Login Password",
    type: "password",
    required: true,
  },
  {
    name: "presentAddress",
    label: "Current Address",
    required: true,
    fullWidth: true,
  },
  {
    name: "permanentAddress",
    label: "Permanent Address",
    required: true,
    fullWidth: true,
  },
];

export default function Admissions() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setForm(initialForm);
    setError("");
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(null);

    if (!/^\d{12}$/.test(form.aadhaarNumber)) {
      setError("Aadhaar number must contain exactly 12 digits.");
      return;
    }

    if (
      !/^\d{10}$/.test(form.phone) ||
      !/^\d{10}$/.test(form.parentPhone)
    ) {
      setError("Both mobile numbers must contain exactly 10 digits.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!form.gender) {
      setError("Please select student gender.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        name: form.name.trim(),
        fatherName: form.fatherName.trim(),
        motherName: form.motherName.trim(),
        email: form.email.trim().toLowerCase(),
        presentAddress: form.presentAddress.trim(),
        permanentAddress: form.permanentAddress.trim(),
      };

      const response = await api.post(
        "/students/admission",
        payload
      );

      setSuccess(response.data);
      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Admission creation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-purple-600">
            STUDENT MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            New Admission
          </h1>

          <p className="mt-2 text-gray-500">
            Register a new student at HM Dance Studio.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                ✓
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-green-800">
                  Admission created successfully!
                </h3>

                <p className="mt-2 text-sm text-green-700">
                  Student Name:{" "}
                  <strong>{success.student?.name}</strong>
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Student ID:{" "}
                  <strong>{success.student?.studentId}</strong>
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Login Email:{" "}
                  <strong>{success.student?.email}</strong>
                </p>

                {success.emailSent ? (
                  <p className="mt-3 text-sm font-semibold text-green-700">
                    ✓ Login credentials sent successfully to student's email.
                  </p>
                ) : (
                  <p className="mt-3 text-sm font-semibold text-red-600">
                    ⚠ Admission created, but credentials email was not sent.
                    {success.emailError
                      ? ` ${success.emailError}`
                      : ""}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/students")}
                    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                  >
                    View Students
                  </button>

                  <button
                    type="button"
                    onClick={() => setSuccess(null)}
                    className="rounded-lg border border-green-300 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
                  >
                    New Admission
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admission Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-8"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the student's details carefully.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.fullWidth ? "md:col-span-2" : ""}
              >
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {field.label}

                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  maxLength={field.maxLength}
                  autoComplete={
                    field.name === "password"
                      ? "new-password"
                      : field.name === "email"
                        ? "email"
                        : "off"
                  }
                  inputMode={
                    field.name === "phone" ||
                    field.name === "parentPhone" ||
                    field.name === "aadhaarNumber"
                      ? "numeric"
                      : undefined
                  }
                  className={inputClass}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Password information */}
          <div className="mt-6 rounded-lg border border-purple-100 bg-purple-50 p-4">
            <p className="text-sm font-semibold text-purple-800">
              Student Login Information
            </p>

            <p className="mt-1 text-sm text-purple-700">
              A temporary password will be created for the student.
              Login credentials will be sent to the registered email address.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Admission..." : "Create Admission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
