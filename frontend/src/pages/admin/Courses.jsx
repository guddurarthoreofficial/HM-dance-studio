
import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  packageName: "",
  danceStyle: "",
  durationMonths: "3",
  totalFees: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/courses");

      setCourses(
        Array.isArray(response.data.courses)
          ? response.data.courses
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to fetch courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const fees = Number(form.totalFees);

    if (!form.packageName.trim() || !form.danceStyle.trim()) {
      setError("Please fill all course details.");
      return;
    }

    if (!Number.isFinite(fees) || fees <= 0) {
      setError("Please enter a valid course fee.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        packageName: form.packageName.trim(),
        danceStyle: form.danceStyle.trim(),
        durationMonths: Number(form.durationMonths),
        totalFees: fees,
      };

      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        setSuccess("Course updated successfully.");
      } else {
        await api.post("/courses", payload);
        setSuccess("New course created successfully.");
      }

      resetForm();
      await fetchCourses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save course."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);

    setForm({
      packageName: course.packageName || "",
      danceStyle: course.danceStyle || "",
      durationMonths: String(course.durationMonths || 3),
      totalFees: String(course.totalFees || ""),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeactivate = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${course.packageName}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.patch(`/courses/${course._id}/deactivate`);

      setSuccess("Course deactivated successfully.");
      await fetchCourses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to deactivate course."
      );
    }
  };

  const activeCourses = courses.filter(
    (course) => course.isActive !== false
  ).length;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-purple-600">
            COURSE MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Courses & Packages
          </h1>

          <p className="mt-2 text-gray-500">
            Create and manage dance courses at HM Dance Studio.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Courses</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {courses.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active Courses</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {activeCourses}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Inactive Courses</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-500">
              {courses.length - activeCourses}
            </h2>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Course Form */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Course" : "Create New Course"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add course name, dance style, duration and fees.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Package Name *
                </label>

                <input
                  type="text"
                  name="packageName"
                  value={form.packageName}
                  onChange={handleChange}
                  placeholder="e.g. Beginner Dance Package"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Dance Style *
                </label>

                <input
                  type="text"
                  name="danceStyle"
                  value={form.danceStyle}
                  onChange={handleChange}
                  placeholder="e.g. Hip Hop, Bollywood, Freestyle"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Course Duration *
                </label>

                <select
                  name="durationMonths"
                  value={form.durationMonths}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Total Fees (₹) *
                </label>

                <input
                  type="number"
                  name="totalFees"
                  value={form.totalFees}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                  min="1"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3 border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Course"
                    : "Create Course"}
              </button>
            </div>
          </form>
        </div>

        {/* Course List */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                All Courses
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your existing dance packages.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCourses}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                No courses found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Create your first dance course using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Course</th>
                    <th className="px-5 py-4">Dance Style</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Fees</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {course.packageName}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {course.danceStyle}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {course.durationMonths} Months
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {formatCurrency(course.totalFees)}
                      </td>

                      <td className="px-5 py-4">
                        {course.isActive !== false ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(course)}
                            className="rounded-lg border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                          >
                            Edit
                          </button>

                          {course.isActive !== false && (
                            <button
                              type="button"
                              onClick={() => handleDeactivate(course)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
