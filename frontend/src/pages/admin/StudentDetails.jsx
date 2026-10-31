
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialForm = {
  name: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  parentPhone: "",
  email: "",
  presentAddress: "",
  permanentAddress: "",
};

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/students/${studentId}`);
      const data = response.data.student;

      setStudent(data);
      setForm({
        name: data.name || "",
        fatherName: data.fatherName || "",
        motherName: data.motherName || "",
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
          : "",
        gender: data.gender || "",
        phone: data.phone || "",
        parentPhone: data.parentPhone || "",
        email: data.email || "",
        presentAddress: data.presentAddress || "",
        permanentAddress: data.permanentAddress || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load student profile."
      );
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage("");
    if (student) {
      setForm({
        name: student.name || "",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().slice(0, 10)
          : "",
        gender: student.gender || "",
        phone: student.phone || "",
        parentPhone: student.parentPhone || "",
        email: student.email || "",
        presentAddress: student.presentAddress || "",
        permanentAddress: student.permanentAddress || "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.put(`/students/${studentId}`, form);

      await fetchStudent();
      setEditing(false);
      setMessage("Student profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update student profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100";

  const fields = [
    { name: "name", label: "Student Name", required: true },
    { name: "fatherName", label: "Father's Name", required: true },
    { name: "motherName", label: "Mother's Name", required: true },
    { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
    { name: "gender", label: "Gender", type: "select", required: true },
    { name: "phone", label: "Student Mobile", required: true },
    { name: "parentPhone", label: "Parent Mobile", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "presentAddress", label: "Present Address", type: "textarea", required: true },
    { name: "permanentAddress", label: "Permanent Address", type: "textarea", required: true },
  ];

  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          {error || "Student not found."}
        </p>
        <button
          onClick={() => navigate("/admin/students")}
          className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white"
        >
          Back to Students
        </button>
      </div>
    );
  }

  const active = student.user?.isActive !== false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/admin/students")}
            className="mb-3 text-sm font-semibold text-amber-700 hover:text-amber-900"
          >
            ← Back to Students
          </button>

          <p className="text-sm font-medium text-amber-700">
            STUDENT MANAGEMENT
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Student Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage student information.
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => {
              setMessage("");
              setEditing(true);
            }}
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Student Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {student.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {student.studentId}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {student.email}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {active ? "Active Account" : "Blocked Account"}
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="font-bold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Student ID: {student.studentId}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={
                field.type === "textarea" ? "md:col-span-2" : ""
              }
            >
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={!editing}
                  required={field.required}
                  rows={3}
                  className={inputClass}
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={!editing}
                  required={field.required}
                  className={inputClass}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={!editing}
                  required={field.required}
                  maxLength={
                    field.name === "phone" ||
                    field.name === "parentPhone"
                      ? 10
                      : undefined
                  }
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>

        {/* Admission Information */}
        <div className="mt-8 grid gap-5 border-t border-gray-100 pt-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="mt-1 font-semibold text-gray-900">
              {student.studentId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Admission Date</p>
            <p className="mt-1 font-semibold text-gray-900">
              {new Date(student.admissionDate).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {editing && (
          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentDetails;
