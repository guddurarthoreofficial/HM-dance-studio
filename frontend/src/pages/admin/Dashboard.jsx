
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

const statCards = [
  {
    key: "totalStudents",
    label: "Total Students",
    icon: "👥",
    color: "blue",
  },
  {
    key: "activeStudents",
    label: "Active Students",
    icon: "✓",
    color: "green",
  },
  {
    key: "activePackages",
    label: "Active Packages",
    icon: "💃",
    color: "purple",
  },
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: "₹",
    color: "amber",
    currency: true,
  },
  {
    key: "totalPayments",
    label: "Total Payments",
    icon: "↗",
    color: "indigo",
  },
  {
    key: "totalCertificates",
    label: "Certificates",
    icon: "🏆",
    color: "pink",
  },
];

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-700",
  indigo: "bg-indigo-50 text-indigo-600",
  pink: "bg-pink-50 text-pink-600",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const response = await api.get("/dashboard/stats");

      setDashboardData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-700">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 rounded-lg bg-gray-900 px-5 py-2 text-sm text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentPayments = dashboardData?.recentPayments || [];
  const recentStudents = dashboardData?.recentStudents || [];

  return (
    <div className="space-y-7">

      {/* Welcome Section */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-700">
            HM DANCE STUDIO
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Welcome back, Admin!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening at your studio.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          ↻ Refresh Data
        </button>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                {card.label}
              </p>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${colorClasses[card.color]}`}
              >
                {card.icon}
              </div>
            </div>

            <h3 className="mt-4 text-2xl font-bold text-gray-900">
              {card.currency
                ? formatCurrency(stats[card.key])
                : stats[card.key] ?? 0}
            </h3>
          </div>
        ))}
      </section>

      {/* Package Overview */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="font-bold text-gray-900">
          Package Overview
        </h3>

        <div className="mt-4 flex flex-wrap gap-8">
          <div>
            <p className="text-sm text-gray-500">Total Packages</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {stats.totalPackages ?? 0}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Active Packages</p>
            <p className="mt-1 text-xl font-bold text-green-600">
              {stats.activePackages ?? 0}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Payments */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Recent Payments
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Latest 5 recorded transactions
          </p>
        </div>

        {recentPayments.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No payments found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Receipt</th>
                  <th className="px-5 py-4">Mode</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {payment.student?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.student?.studentId}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {payment.receiptNumber}
                    </td>

                    <td className="px-5 py-4 capitalize text-gray-600">
                      {payment.paymentMode.replace("_", " ")}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(payment.paymentDate)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-green-700">
                      {formatCurrency(payment.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Students */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h3 className="font-bold text-gray-900">
            Recently Admitted Students
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Latest 5 student admissions
          </p>
        </div>

        {recentStudents.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No students found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Student ID</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Admission Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {student.name}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {student.studentId}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {student.email}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(student.admissionDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;
