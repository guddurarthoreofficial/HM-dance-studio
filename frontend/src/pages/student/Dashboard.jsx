
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not started";

const getDaysRemaining = (expiryDate) => {
  if (!expiryDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );
};

const quickLinks = [
  {
    title: "My Profile",
    description: "View your personal information",
    icon: "👤",
    path: "/student/profile",
    color: "bg-blue-50",
  },
  {
    title: "My Packages",
    description: "Check your dance packages",
    icon: "💃",
    path: "/student/packages",
    color: "bg-purple-50",
  },
  {
    title: "Payments",
    description: "View transactions and receipts",
    icon: "💳",
    path: "/student/payments",
    color: "bg-green-50",
  },
  {
    title: "Certificates",
    description: "View and download certificates",
    icon: "🏆",
    path: "/student/certificates",
    color: "bg-amber-50",
  },
  {
    title: "Settings",
    description: "Manage your account password",
    icon: "⚙️",
    path: "/student/settings",
    color: "bg-gray-100",
  },
];

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([
          api.get("/students/me"),
          api.get("/student-packages/my"),
          api.get("/payments/history"),
          api.get("/certificates/my"),
        ]);

        const [
          profileResult,
          packageResult,
          paymentResult,
          certificateResult,
        ] = results;

        if (profileResult.status === "fulfilled") {
          setStudent(profileResult.value.data.student);
        }

        if (packageResult.status === "fulfilled") {
          setPackages(packageResult.value.data.packages || []);
        }

        if (paymentResult.status === "fulfilled") {
          setPayments(paymentResult.value.data.payments || []);
        }

        if (certificateResult.status === "fulfilled") {
          setCertificates(
            certificateResult.value.data.certificates || []
          );
        }

        if (results.every((result) => result.status === "rejected")) {
          setError(
            "Unable to load dashboard. Please refresh the page."
          );
        }
      } catch {
        setError("Something went wrong while loading dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Calculate package status using expiry date
  const packageStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const active = [];
    const pending = [];
    const expired = [];

    packages.forEach((item) => {
      if (item.status === "pending") {
        pending.push(item);
        return;
      }

      if (item.status === "active") {
        if (item.expiryDate) {
          const expiry = new Date(item.expiryDate);
          expiry.setHours(0, 0, 0, 0);

          if (expiry < today) {
            expired.push(item);
          } else {
            active.push(item);
          }
        } else {
          active.push(item);
        }
      } else if (item.status === "expired") {
        expired.push(item);
      }
    });

    return { active, pending, expired };
  }, [packages]);

  const activePackage = useMemo(() => {
    return [...packageStats.active].sort(
      (a, b) =>
        new Date(a.expiryDate || 0) -
        new Date(b.expiryDate || 0)
    )[0];
  }, [packageStats.active]);

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.paymentDate) - new Date(a.paymentDate)
    )
    .slice(0, 5);

  const recentCertificates = [...certificates]
    .sort(
      (a, b) =>
        new Date(b.completionDate) -
        new Date(a.completionDate)
    )
    .slice(0, 3);

  const handleDownload = async (type, item) => {
    const id = item._id;
    const key = `${type}-${id}`;

    try {
      setDownloading(key);

      const endpoint =
        type === "receipt"
          ? `/payments/${id}/receipt`
          : `/certificates/${id}/download`;

      const response = await api.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;

      const fileNumber =
        type === "receipt"
          ? item.receiptNumber || id
          : item.certificateNumber || id;

      link.download = `HMDS-${type === "receipt" ? "Receipt" : "Certificate"}-${fileNumber}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      let message = `Unable to download ${type}.`;

      if (err.response?.data instanceof Blob) {
        try {
          const errorText = await err.response.data.text();
          const parsed = JSON.parse(errorText);
          message = parsed.message || message;
        } catch {
          // Keep default message.
        }
      } else {
        message = err.response?.data?.message || message;
      }

      console.error("Download Error:", err);
      alert(message);
    } finally {
      setDownloading("");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-shell flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell min-h-screen space-y-8 bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome Section */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-800 p-6 text-white shadow-lg md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-purple-200">
                HM DANCE STUDIO · STUDENT PORTAL
              </p>

              <h1 className="mt-3 text-2xl font-bold md:text-3xl">
                Welcome back, {student?.name || "Student"}!
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100">
                Keep learning, improving and performing.
                Manage your courses, payments and achievements
                from your personal dashboard.
              </p>

              <div className="mt-5 inline-flex rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm">
                Student ID:
                <strong className="ml-2">
                  {student?.studentId || "—"}
                </strong>
              </div>
            </div>

            <div className="hidden text-7xl md:block">
              💃
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active Courses</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-700">
              {packageStats.active.length}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Currently running
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Packages</p>
            <h2 className="mt-2 text-3xl font-bold text-amber-600">
              {packageStats.pending.length}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Awaiting payment
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Amount Paid</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Recorded payments
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Certificates</p>
            <h2 className="mt-2 text-3xl font-bold text-indigo-600">
              {certificates.length}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Achievements earned
            </p>
          </div>
        </section>

        {/* Quick Access */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Quick Access
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Quickly access your student account.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${item.color}`}>
                  {item.icon}
                </div>

                <h3 className="mt-4 font-bold text-gray-900 group-hover:text-purple-700">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {item.description}
                </p>

                <p className="mt-4 text-xs font-semibold text-purple-700">
                  Open page →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Active Course */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My Active Course
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your currently running dance package.
              </p>
            </div>

            <Link
              to="/student/packages"
              className="text-sm font-semibold text-purple-700 hover:underline"
            >
              View All →
            </Link>
          </div>

          {activePackage ? (
            <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>

                  <h3 className="mt-4 text-2xl font-bold text-gray-900">
                    {activePackage.packageName}
                  </h3>

                  <p className="mt-1 text-gray-500">
                    {activePackage.danceStyle}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Package Fee</p>
                  <p className="mt-1 text-2xl font-bold text-purple-700">
                    {formatCurrency(activePackage.totalFees)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {activePackage.durationMonths} Months
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {formatDate(activePackage.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {formatDate(activePackage.expiryDate)}
                  </p>
                </div>
              </div>

              {(() => {
                const days = getDaysRemaining(activePackage.expiryDate);

                return (
                  <div className="mt-5 rounded-lg bg-purple-50 p-4">
                    {days === null ? (
                      <p className="text-sm text-purple-800">
                        Package expiry date is not available.
                      </p>
                    ) : days > 0 ? (
                      <p className="text-sm font-semibold text-purple-800">
                        {days} days remaining in your course.
                      </p>
                    ) : days === 0 ? (
                      <p className="text-sm font-semibold text-orange-700">
                        Your course expires today.
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-red-700">
                        Your package expiry date has passed.
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <div className="text-4xl">💃</div>
              <h3 className="mt-3 font-semibold text-gray-800">
                No active course
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Contact HM Dance Studio to get started with a dance package.
              </p>
              <Link
                to="/student/packages"
                className="mt-4 inline-block text-sm font-semibold text-purple-700 hover:underline"
              >
                View My Packages →
              </Link>
            </div>
          )}
        </section>

        {/* Pending Packages */}
        {packageStats.pending.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Pending Packages
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {packageStats.pending.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm"
                >
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                    Payment Pending
                  </span>

                  <h3 className="mt-4 font-bold text-gray-900">
                    {item.packageName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.danceStyle} · {item.durationMonths} Months
                  </p>

                  <p className="mt-3 text-lg font-bold text-gray-900">
                    {formatCurrency(item.totalFees)}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Please contact the studio to complete your payment.
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Payments */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Payments
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your latest payment transactions.
              </p>
            </div>

            <Link
              to="/student/payments"
              className="text-sm font-semibold text-purple-700 hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No payment history available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Receipt Number</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment Method</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Receipt</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {payment.receiptNumber || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-green-700">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td className="px-5 py-4 text-sm capitalize text-gray-600">
                        {(payment.paymentMode || "").replace("_", " ")}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {formatDate(payment.paymentDate)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          disabled={downloading === `receipt-${payment._id}`}
                          onClick={() => handleDownload("receipt", payment)}
                          className="rounded-lg border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                        >
                          {downloading === `receipt-${payment._id}`
                            ? "Downloading..."
                            : "↓ Download"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent Certificates */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Certificates
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your dance course achievements.
              </p>
            </div>

            <Link
              to="/student/certificates"
              className="text-sm font-semibold text-purple-700 hover:underline"
            >
              View All →
            </Link>
          </div>

          {recentCertificates.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No certificates available yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentCertificates.map((certificate) => (
                <div
                  key={certificate._id}
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {certificate.courseName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {certificate.durationMonths} Months ·{" "}
                      {certificate.certificateNumber}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Completion: {formatDate(certificate.completionDate)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={downloading === `certificate-${certificate._id}`}
                    onClick={() => handleDownload("certificate", certificate)}
                    className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
                  >
                    {downloading === `certificate-${certificate._id}`
                      ? "Downloading..."
                      : "↓ Download Certificate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Profile Summary */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My Profile
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your registered student information.
              </p>
            </div>

            <Link
              to="/student/profile"
              className="text-sm font-semibold text-purple-700 hover:underline"
            >
              View Profile →
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="mt-1 font-semibold text-gray-900">
                {student?.name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="mt-1 break-all font-semibold text-gray-900">
                {student?.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Mobile Number</p>
              <p className="mt-1 font-semibold text-gray-900">
                {student?.phone || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Father's Name</p>
              <p className="mt-1 font-semibold text-gray-900">
                {student?.fatherName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Admission Date</p>
              <p className="mt-1 font-semibold text-gray-900">
                {formatDate(student?.admissionDate)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Permanent Address</p>
              <p className="mt-1 font-semibold text-gray-900">
                {student?.permanentAddress || "—"}
              </p>
            </div>
          </div>

          <p className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-500">
            Profile details are managed by HM Dance Studio administration.
          </p>
        </section>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          HM Dance Studio · Where passion becomes performance.
        </div>
      </div>
    </div>
  );
}
