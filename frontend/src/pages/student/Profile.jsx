
import { useEffect, useState } from "react";
import api from "../../services/api";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/students/me");
        setStudent(response.data.student);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const profileSections = [
    {
      title: "Personal Information",
      fields: [
        ["Full Name", student?.name],
        ["Date of Birth", formatDate(student?.dateOfBirth)],
        ["Gender", student?.gender],
      ],
    },
    {
      title: "Family Information",
      fields: [
        ["Father's Name", student?.fatherName],
        ["Mother's Name", student?.motherName],
        ["Parent's Mobile", student?.parentPhone],
      ],
    },
    {
      title: "Contact Information",
      fields: [
        ["Email Address", student?.email],
        ["Mobile Number", student?.phone],
        ["Present Address", student?.presentAddress],
        ["Permanent Address", student?.permanentAddress],
      ],
    },
    {
      title: "Admission Information",
      fields: [
        ["Student ID", student?.studentId],
        ["Admission Date", formatDate(student?.admissionDate)],
      ],
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-shell flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-shell rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">Profile Error</h2>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-shell space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your personal and admission information.
        </p>
      </div>

      {/* Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
            {student?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{student?.name}</h2>
            <p className="mt-1 text-purple-100">{student?.email}</p>
            <div className="mt-3 inline-block rounded-lg bg-white/20 px-3 py-1.5 text-sm">
              Student ID: <strong>{student?.studentId}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {profileSections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="mb-5 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
              {section.title}
            </h3>

            <div className="space-y-5">
              {section.fields.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {label}
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-gray-800">
                    {value || "Not available"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Read-only Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <span className="text-xl">🔒</span>
        <div>
          <h3 className="font-semibold text-amber-900">
            Profile is read-only
          </h3>
          <p className="mt-1 text-sm text-amber-800">
            Your profile details are managed by the studio administrator.
            Please contact the administration if any information needs to
            be corrected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
