
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
        month: "long",
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

const getStatus = (item) => {
  if (item.status === "pending") return "Pending";

  if (
    item.expiryDate &&
    getDaysRemaining(item.expiryDate) < 0
  ) {
    return "Expired";
  }

  return item.status
    ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
    : "Unknown";
};

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-800",
  Expired: "bg-red-100 text-red-700",
};

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/student-packages/my");

        setPackages(response.data.packages || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your packages."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const activeCount = packages.filter(
    (item) => getStatus(item) === "Active"
  ).length;

  const pendingCount = packages.filter(
    (item) => getStatus(item) === "Pending"
  ).length;

  const expiredCount = packages.filter(
    (item) => getStatus(item) === "Expired"
  ).length;

  const filteredPackages =
    filter === "All"
      ? packages
      : packages.filter((item) => getStatus(item) === filter);

  if (loading) {
    return (
      <div className="dashboard-shell flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your packages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Packages
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View all your assigned dance courses and package details.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Packages",
            value: packages.length,
            color: "text-purple-700",
          },
          {
            label: "Active Packages",
            value: activeCount,
            color: "text-green-600",
          },
          {
            label: "Pending Packages",
            value: pendingCount,
            color: "text-yellow-600",
          },
          {
            label: "Expired Packages",
            value: expiredCount,
            color: "text-red-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <h2 className={`mt-2 text-3xl font-bold ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {["All", "Active", "Pending", "Expired"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filter === item
                ? "bg-purple-700 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-purple-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Package Cards */}
      {filteredPackages.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="text-4xl">💃</div>
          <h3 className="mt-4 font-semibold text-gray-900">
            No packages found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {packages.length === 0
              ? "Your assigned dance packages will appear here."
              : `You don't have any ${filter.toLowerCase()} packages.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredPackages.map((item) => {
            const status = getStatus(item);
            const days = getDaysRemaining(item.expiryDate);

            return (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {status}
                      </span>

                      <h2 className="mt-4 text-xl font-bold text-gray-900">
                        {item.packageName}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.danceStyle}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Package Fee
                      </p>
                      <p className="mt-1 text-xl font-bold text-purple-700">
                        {formatCurrency(item.totalFees)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 p-6">
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {item.durationMonths} Months
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <p className="mt-1 font-semibold capitalize text-gray-900">
                      {item.paymentStatus || "Unpaid"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatDate(item.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Expiry Date</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatDate(item.expiryDate)}
                    </p>
                  </div>
                </div>

                {status === "Active" && days !== null && (
                  <div className="mx-6 mb-6 rounded-lg bg-purple-50 p-4">
                    {days > 0 ? (
                      <p className="text-sm font-semibold text-purple-800">
                        {days} days remaining in your package.
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-orange-700">
                        Your package expires today.
                      </p>
                    )}
                  </div>
                )}

                {status === "Pending" && (
                  <div className="mx-6 mb-6 rounded-lg bg-yellow-50 p-4">
                    <p className="text-sm font-medium text-yellow-800">
                      Please contact HM Dance Studio to complete your payment.
                    </p>
                  </div>
                )}

                {status === "Expired" && (
                  <div className="mx-6 mb-6 rounded-lg bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700">
                      This package has expired. Contact the studio for renewal.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
