
import { useEffect, useState } from "react";
import api from "../../services/api";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/certificates/my");

        setCertificates(response.data.certificates || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load certificates."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleDownload = async (certificate) => {
    try {
      setDownloading(certificate._id);

      const response = await api.get(
        `/certificates/${certificate._id}/download`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `HMDS-Certificate-${certificate.certificateNumber || certificate._id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      let message = "Unable to download certificate.";

      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          message = parsed.message || message;
        } catch {
          // Keep default message.
        }
      } else {
        message = err.response?.data?.message || message;
      }

      console.error("Certificate Download Error:", err);
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
            Loading certificates...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Certificates
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and download your dance course completion certificates.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Certificates
              </p>
              <h2 className="mt-2 text-3xl font-bold text-purple-700">
                {certificates.length}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
              🏆
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Latest Certificate
              </p>
              <h2 className="mt-2 text-lg font-bold text-gray-900">
                {certificates.length > 0
                  ? formatDate(
                      [...certificates].sort(
                        (a, b) =>
                          new Date(b.completionDate) -
                          new Date(a.completionDate)
                      )[0].completionDate
                    )
                  : "Not available"}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
              📜
            </div>
          </div>
        </div>
      </div>

      {/* Certificate List */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-900">
            All Certificates
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your achievements at HM Dance Studio.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl">🏆</div>
            <h3 className="mt-4 font-semibold text-gray-900">
              No certificates yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Your certificates will appear here once they are generated by the studio administration.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {certificates.map((certificate) => (
              <div
                key={certificate._id}
                className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                    🏅
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      {certificate.courseName || "Dance Course"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      Duration: {certificate.durationMonths}{" "}
                      {Number(certificate.durationMonths) === 1
                        ? "Month"
                        : "Months"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Certificate No:{" "}
                      {certificate.certificateNumber || "—"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Completion Date:{" "}
                      {formatDate(certificate.completionDate)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={downloading === certificate._id}
                  onClick={() => handleDownload(certificate)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {downloading === certificate._id ? (
                    "Downloading..."
                  ) : (
                    <>
                      <span>↓</span>
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Information */}
      <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
        <h3 className="font-semibold text-purple-900">
          Certificate Information
        </h3>
        <p className="mt-1 text-sm text-purple-800">
          Certificates are generated and verified by HM Dance Studio.
          Contact the administration if you find any incorrect details.
        </p>
      </div>
    </div>
  );
}
