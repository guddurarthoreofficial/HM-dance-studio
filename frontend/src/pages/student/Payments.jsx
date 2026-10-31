
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
    : "—";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/payments/history");

        setPayments(response.data.payments || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load payment history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);


  const handleDownload = async (payment) => {
    try {
      setDownloading(payment._id);

      const response = await api.get(
        `/payments/${payment._id}/receipt`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `HMDS-Receipt-${payment.receiptNumber || payment._id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Give the browser time to start downloading.
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

    } catch (err) {
      let message = "Unable to download payment receipt.";

      if (err.response?.data instanceof Blob) {
        try {
          const errorData = await err.response.data.text();
          const parsedError = JSON.parse(errorData);
          message = parsedError.message || message;
        } catch {
          message = "Receipt API returned an invalid PDF or error response.";
        }
      } else {
        message = err.response?.data?.message || err.message || message;
      }

      console.error("Receipt Download Error:", {
        status: err.response?.status,
        message,
      });

      alert(message);
    } finally {
      setDownloading("");
    }
  };


  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const paymentModes = [...new Set(
    payments.map((payment) => payment.paymentMode)
  )].filter(Boolean).length;

  if (loading) {
    return (
      <div className="dashboard-shell flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-700" />
          <p className="mt-4 text-sm text-gray-500">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Payment History
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View your payment transactions and download receipts.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Amount Paid</p>
          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h2 className="mt-2 text-3xl font-bold text-purple-700">
            {payments.length}
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Payment Methods Used</p>
          <h2 className="mt-2 text-3xl font-bold text-indigo-600">
            {paymentModes}
          </h2>
        </div>
      </div>

      {/* Payment Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-900">
            All Transactions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your complete payment records.
          </p>
        </div>

        {payments.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-4xl">💳</div>
            <h3 className="mt-4 font-semibold text-gray-900">
              No payments found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your payment records will appear here after completing a payment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Receipt Number</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment Method</th>
                  <th className="px-5 py-4">Payment Date</th>
                  <th className="px-5 py-4">Receipt</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
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
                        disabled={downloading === payment._id}
                        onClick={() => handleDownload(payment)}
                        className="rounded-lg border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 disabled:opacity-50"
                      >
                        {downloading === payment._id
                          ? "Downloading..."
                          : "↓ Download PDF"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
        <h3 className="font-semibold text-purple-900">
          Payment Information
        </h3>
        <p className="mt-1 text-sm text-purple-800">
          All payments are manually recorded by HM Dance Studio administration.
          Contact the studio if you find any discrepancy in your payment records.
        </p>
      </div>
    </div>
  );
}
