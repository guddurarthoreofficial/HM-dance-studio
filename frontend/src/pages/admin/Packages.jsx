
import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  studentId: "",
  courseId: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

export default function Packages() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [packages, setPackages] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentRes, courseRes] = await Promise.all([
        api.get("/students"),
        api.get("/courses"),
      ]);

      setStudents(studentRes.data.students || []);
      setCourses(
        (courseRes.data.courses || []).filter(
          (course) => course.isActive !== false
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load assignment data."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async (studentId) => {
    if (!studentId) {
      setPackages([]);
      return;
    }

    try {
      const response = await api.get(
        `/student-packages/student/${studentId}`
      );

      setPackages(response.data.packages || []);
    } catch (err) {
      setPackages([]);
      setError(
        err.response?.data?.message ||
          "Unable to fetch student package history."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStudentChange = async (e) => {
    const studentId = e.target.value;

    setForm((prev) => ({
      ...prev,
      studentId,
    }));

    setSuccess("");
    setError("");
    await fetchPackages(studentId);
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.studentId || !form.courseId) {
      setError("Please select both student and course.");
      return;
    }

    const selectedStudent = students.find(
      (student) => student.studentId === form.studentId
    );

    if (selectedStudent?.user?.isActive === false) {
      setError("This student account is blocked. Activate it first.");
      return;
    }

    try {
      setAssigning(true);

      await api.post("/student-packages/assign", {
        studentId: form.studentId,
        courseId: form.courseId,
      });

      setSuccess("Course assigned successfully. Payment is pending.");

      setForm((prev) => ({
        ...prev,
        courseId: "",
      }));

      await fetchPackages(form.studentId);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to assign package."
      );
    } finally {
      setAssigning(false);
    }
  };

  const selectedStudent = students.find(
    (student) => student.studentId === form.studentId
  );

  const selectedCourse = courses.find(
    (course) => course._id === form.courseId
  );

  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(keyword) ||
      student.studentId?.toLowerCase().includes(keyword) ||
      student.email?.toLowerCase().includes(keyword)
    );
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "active" || value === "paid") {
      return "bg-green-100 text-green-700";
    }

    if (value === "expired" || value === "inactive") {
      return "bg-gray-100 text-gray-600";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-purple-600">
            PACKAGE MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Assign Packages
          </h1>

          <p className="mt-2 text-gray-500">
            Assign dance courses to registered students.
          </p>
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

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            Loading students and courses...
          </div>
        ) : (
          <>
            {/* Assignment Form */}
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                New Package Assignment
              </h2>

              <p className="mb-6 text-sm text-gray-500">
                Select a student and assign an available dance course.
              </p>

              <form onSubmit={handleAssign}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* Student */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Select Student *
                    </label>

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name, ID or email"
                      className={`${inputClass} mb-2`}
                    />

                    <select
                      value={form.studentId}
                      onChange={handleStudentChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Choose Student</option>

                      {filteredStudents.map((student) => (
                        <option
                          key={student._id}
                          value={student.studentId}
                          disabled={student.user?.isActive === false}
                        >
                          {student.name} ({student.studentId})
                          {student.user?.isActive === false
                            ? " - Blocked"
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Course */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Select Course *
                    </label>

                    <select
                      value={form.courseId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          courseId: e.target.value,
                        }))
                      }
                      required
                      className={inputClass}
                    >
                      <option value="">Choose Course</option>

                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.packageName} -{" "}
                          {course.durationMonths} Months
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Student Preview */}
                {selectedStudent && (
                  <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-5">
                    <h3 className="font-bold text-purple-900">
                      Selected Student
                    </h3>

                    <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <p>
                        <span className="text-gray-500">Name: </span>
                        <strong>{selectedStudent.name}</strong>
                      </p>

                      <p>
                        <span className="text-gray-500">Student ID: </span>
                        <strong>{selectedStudent.studentId}</strong>
                      </p>

                      <p>
                        <span className="text-gray-500">Email: </span>
                        <strong>{selectedStudent.email}</strong>
                      </p>

                      <p>
                        <span className="text-gray-500">Phone: </span>
                        <strong>{selectedStudent.phone}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Course Preview */}
                {selectedCourse && (
                  <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-5">
                    <h3 className="font-bold text-green-900">
                      Course Summary
                    </h3>

                    <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                      <p>
                        <span className="text-gray-500">Course: </span>
                        <strong>{selectedCourse.packageName}</strong>
                      </p>

                      <p>
                        <span className="text-gray-500">Style: </span>
                        <strong>{selectedCourse.danceStyle}</strong>
                      </p>

                      <p>
                        <span className="text-gray-500">Duration: </span>
                        <strong>{selectedCourse.durationMonths} Months</strong>
                      </p>

                      <p className="sm:col-span-3">
                        <span className="text-gray-500">Total Fees: </span>
                        <strong className="text-green-800">
                          {formatCurrency(selectedCourse.totalFees)}
                        </strong>
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-7 flex justify-end border-t border-gray-100 pt-6">
                  <button
                    type="submit"
                    disabled={assigning || !form.studentId || !form.courseId}
                    className="rounded-lg bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {assigning ? "Assigning..." : "Assign Package"}
                  </button>
                </div>
              </form>
            </div>

            {/* Student Package History */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5">
                <h2 className="text-xl font-bold text-gray-900">
                  Student Package History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedStudent
                    ? `Packages assigned to ${selectedStudent.name}`
                    : "Select a student above to view their packages."}
                </p>
              </div>

              {!form.studentId ? (
                <div className="p-10 text-center text-sm text-gray-500">
                  No student selected.
                </div>
              ) : packages.length === 0 ? (
                <div className="p-10 text-center text-sm text-gray-500">
                  No packages assigned to this student yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Package</th>
                        <th className="px-5 py-4">Duration</th>
                        <th className="px-5 py-4">Fees</th>
                        <th className="px-5 py-4">Payment</th>
                        <th className="px-5 py-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {packages.map((item) => (
                        <tr key={item._id}>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-900">
                              {item.packageName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.danceStyle}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {item.durationMonths} Months
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                            {formatCurrency(item.totalFees)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                item.paymentStatus
                              )}`}
                            >
                              {item.paymentStatus || "Unpaid"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                item.status
                              )}`}
                            >
                              {item.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
