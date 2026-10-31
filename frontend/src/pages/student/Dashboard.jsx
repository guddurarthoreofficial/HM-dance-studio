
import { useEffect, useState } from "react";
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

  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

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
      setLoading(true);
      setError("");

      const results = await Promise.allSettled([
        api.get("/students/me"),
        api.get("/student-packages/my"),
        api.get("/payments/history"),
        api.get("/certificates/my"),
      ]);

      const [profileResult, packageResult, paymentResult, certificateResult] =
        results;

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
        setError("Unable to load dashboard. Please refresh the page.");
      }

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const handleReceiptDownload = async (paymentId) => {
    try {
      setDownloading(paymentId);

      const response = await api.get(
        `/payments/${paymentId}/receipt`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `HMDS-Receipt-${paymentId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Unable to download payment receipt.");
    } finally {
      setDownloading("");
    }
  };

  const handleCertificateDownload = async (certificateId) => {
    try {
      setDownloading(certificateId);

      const response = await api.get(
        `/certificates/${certificateId}/download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `HMDS-Certificate-${certificateId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Unable to download certificate.");
    } finally {
      setDownloading("");
    }
  };

  const activePackages = packages.filter(
    (item) => item.status === "active"
  );

  const pendingPackages = packages.filter(
    (item) => item.status === "pending"
  );

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const activePackage = activePackages[0];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
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
    <div className="dashboard-shell min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-700 p-6 text-white shadow-lg md:p-8">
          <p className="text-sm font-medium text-purple-200">
            STUDENT PORTAL
          </p>

          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            Welcome back, {student?.name || "Student"}!
          </h1>

          <p className="mt-2 text-sm text-purple-100">
            Welcome to HM Dance Studio. Track your courses, payments
            and certificates here.
          </p>

          <div className="mt-5 inline-flex rounded-lg bg-white/15 px-4 py-2 text-sm">
            Student ID:{" "}
            <strong className="ml-2">
              {student?.studentId || "—"}
            </strong>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active Courses</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-700">
              {activePackages.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Packages</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingPackages.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Paid</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Certificates</p>
            <h2 className="mt-2 text-3xl font-bold text-indigo-600">
              {certificates.length}
            </h2>
          </div>
        </div>

        {/* Active Course */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              My Active Course
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your currently running dance package.
            </p>
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

                <div className="text-left sm:text-right">
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
                    {days > 0 ? (
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
              <h3 className="font-semibold text-gray-800">
                No active course
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Contact HM Dance Studio to get started with a dance package.
              </p>
            </div>
          )}
        </section>

        {/* Pending Packages */}
        {pendingPackages.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Pending Packages
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pendingPackages.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-yellow-200 bg-white p-5 shadow-sm"
                >
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
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

        {/* Payment History */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Payments
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your latest payment transactions.
            </p>
          </div>

          {payments.length === 0 ? (
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
                  {payments.slice(0, 5).map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {payment.receiptNumber}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
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
                          disabled={downloading === payment._id}
                          onClick={() =>
                            handleReceiptDownload(payment._id)
                          }
                          className="rounded-lg border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                        >
                          {downloading === payment._id
                            ? "Downloading..."
                            : "Download"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Certificates */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-xl font-bold text-gray-900">
              My Certificates
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your dance course completion certificates.
            </p>
          </div>

          {certificates.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No certificates available yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {certificates.map((certificate) => (
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
                    disabled={downloading === certificate._id}
                    onClick={() =>
                      handleCertificateDownload(certificate._id)
                    }
                    className="rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
                  >
                    {downloading === certificate._id
                      ? "Downloading..."
                      : "Download Certificate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Profile Summary */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            My Profile
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="mt-1 font-semibold text-gray-900">
                {student?.name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="mt-1 font-semibold text-gray-900">
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
      </div>
    </div>
  );
}
