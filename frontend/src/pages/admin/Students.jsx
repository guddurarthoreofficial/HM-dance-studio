
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchStudents = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError("");

      const endpoint = query.trim()
        ? `/students/search?search=${encodeURIComponent(query.trim())}`
        : "/students";

      const response = await api.get(endpoint);

      setStudents(response.data.students || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(search);
  };

  const handleStatusChange = async (student) => {
    const isActive = student.user?.isActive === false
      ? true
      : false;

    const confirmed = window.confirm(
      `Are you sure you want to ${isActive ? "unblock" : "block"} ${student.name}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(student._id);

      await api.patch(`/students/${student.studentId}/status`, {
        isActive,
      });

      await fetchStudents(search);
    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to update student status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-700">
            STUDENT MANAGEMENT
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            All Students
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage student profiles and account status.
          </p>
        </div>

        <button
          onClick={() => fetchStudents(search)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row"
      >
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or Student ID..."
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-600"
        />

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Search
        </button>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            fetchStudents("");
          }}
          className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Clear
        </button>
      </form>

      {/* Count */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">Students Found</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {students.length}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Students Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Student Directory
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600" />
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Student ID</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Admission Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const active = student.user?.isActive !== false;

                  return (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.email}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {student.studentId}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {student.phone}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {new Date(student.admissionDate).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {active ? "Active" : "Blocked"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          disabled={updatingId === student._id}
                          onClick={() => handleStatusChange(student)}
                          className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                            active
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {updatingId === student._id
                            ? "Updating..."
                            : active
                              ? "Block"
                              : "Unblock"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
