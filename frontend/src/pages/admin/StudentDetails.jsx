import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialForm = {
  name: "",
  fatherName: "",
  motherName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  parentPhone: "",
  email: "",
  presentAddress: "",
  permanentAddress: "",
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const statusClass = (status) => {
  if (status === "active" || status === "paid") {
    return "bg-green-100 text-green-700";
  }

  if (status === "expired") {
    return "bg-gray-100 text-gray-700";
  }

  if (status === "pending" || status === "unpaid") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-gray-100 text-gray-700";
};

const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);

  const [loading, setLoading] = useState(true);
  const [academicLoading, setAcademicLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [downloadingReceipt, setDownloadingReceipt] = useState("");
  const [downloadingCertificate, setDownloadingCertificate] = useState("");

  const [editing, setEditing] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  const [certificateForm, setCertificateForm] = useState({
    packageId: "",
    completionDate: new Date().toLocaleDateString("en-CA"),
  });

  const [error, setError] = useState("");
  const [academicError, setAcademicError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch Student Profile
  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/students/${studentId}`);
      const data = response.data.student;

      setStudent(data);

      setForm({
        name: data.name || "",
        fatherName: data.fatherName || "",
        motherName: data.motherName || "",
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
          : "",
        gender: data.gender || "",
        phone: data.phone || "",
        parentPhone: data.parentPhone || "",
        email: data.email || "",
        presentAddress: data.presentAddress || "",
        permanentAddress: data.permanentAddress || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load student profile."
      );
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  // Fetch Packages, Payments and Certificates
  const fetchAcademicData = useCallback(async () => {
    try {
      setAcademicLoading(true);
      setAcademicError("");

      const [
        packageResponse,
        paymentResponse,
        certificateResponse,
      ] = await Promise.all([
        api.get(`/student-packages/student/${studentId}`),
        api.get(`/payments/student/${studentId}`),
        api.get(`/certificates/student/${studentId}`),
      ]);

      setPackages(packageResponse.data.packages || []);
      setPayments(paymentResponse.data.payments || []);
      setTotalPaid(paymentResponse.data.totalPaid || 0);
      setCertificates(certificateResponse.data.certificates || []);
    } catch (err) {
      setAcademicError(
        err.response?.data?.message ||
          "Unable to load student academic records."
      );
    } finally {
      setAcademicLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudent();
    fetchAcademicData();
  }, [fetchStudent, fetchAcademicData]);

  // Handle Form Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cancel Editing
  const handleCancel = () => {
    setEditing(false);
    setMessage("");

    if (!student) return;

    setForm({
      name: student.name || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().slice(0, 10)
        : "",
      gender: student.gender || "",
      phone: student.phone || "",
      parentPhone: student.parentPhone || "",
      email: student.email || "",
      presentAddress: student.presentAddress || "",
      permanentAddress: student.permanentAddress || "",
    });
  };

  // Update Student Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.put(`/students/${studentId}`, form);
      await fetchStudent();

      setEditing(false);
      setMessage("Student profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update student profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Download Payment Receipt
  const handleDownloadReceipt = async (payment) => {
    try {
      setDownloadingReceipt(payment._id);
      setError("");

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
      link.download = `${payment.receiptNumber || "payment-receipt"}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to download payment receipt."
      );
    } finally {
      setDownloadingReceipt("");
    }
  };

  // Download Certificate
  const handleDownloadCertificate = async (certificate) => {
    try {
      setDownloadingCertificate(certificate._id);
      setError("");

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
      link.download = `${certificate.certificateNumber}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to download certificate."
      );
    } finally {
      setDownloadingCertificate("");
    }
  };

  // Generate Certificate
  const handleGenerateCertificate = async (e) => {
    e.preventDefault();

    if (!certificateForm.packageId) {
      setError("Please select a course package.");
      return;
    }

    if (!certificateForm.completionDate) {
      setError("Please select completion date.");
      return;
    }

    try {
      setGeneratingCertificate(true);
      setError("");
      setMessage("");

      const response = await api.post("/certificates/generate", {
        studentId: student._id,
        packageId: certificateForm.packageId,
        completionDate: certificateForm.completionDate,
      });

      setShowCertificateForm(false);

      setCertificateForm({
        packageId: "",
        completionDate: new Date().toLocaleDateString("en-CA"),
      });

      await fetchAcademicData();

      setMessage(
        response.data.emailSent
          ? "Certificate generated successfully and emailed to the student."
          : response.data.emailError ||
              "Certificate generated successfully, but email could not be sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate certificate."
      );
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100";

  const fields = [
    { name: "name", label: "Student Name", required: true },
    { name: "fatherName", label: "Father's Name", required: true },
    { name: "motherName", label: "Mother's Name", required: true },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      required: true,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
    },
    { name: "phone", label: "Student Mobile", required: true },
    { name: "parentPhone", label: "Parent Mobile", required: true },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
    },
    {
      name: "presentAddress",
      label: "Present Address",
      type: "textarea",
      required: true,
    },
    {
      name: "permanentAddress",
      label: "Permanent Address",
      type: "textarea",
      required: true,
    },
  ];

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center p-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-600" />
      </div>
    );
  }

  // Student Not Found
  if (!student) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <p className="font-semibold text-red-600">
          {error || "Student not found."}
        </p>

        <button
          onClick={() => navigate("/admin/students")}
          className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white"
        >
          Back to Students
        </button>
      </div>
    );
  }

  const active = student.user?.isActive !== false;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/admin/students")}
            className="mb-3 text-sm font-semibold text-amber-700 hover:text-amber-900"
          >
            ← Back to Students
          </button>

          <p className="text-sm font-medium text-amber-700">
            STUDENT MANAGEMENT
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Student Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage student information, packages and payments.
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => {
              setMessage("");
              setEditing(true);
            }}
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Student Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {student.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {student.studentId}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {student.email}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {active ? "Active Account" : "Blocked Account"}
          </span>
        </div>
      </div>

      {/* Personal Information */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="font-bold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Student ID: {student.studentId}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={
                field.type === "textarea"
                  ? "md:col-span-2"
                  : ""
              }
            >
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={!editing}
                  required={field.required}
                  rows={3}
                  className={inputClass}
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={!editing}
                  required={field.required}
                  className={inputClass}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={!editing}
                  required={field.required}
                  maxLength={
                    field.name === "phone" ||
                    field.name === "parentPhone"
                      ? 10
                      : undefined
                  }
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>

        {/* Admission Information */}
        <div className="mt-8 grid gap-5 border-t border-gray-100 pt-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="mt-1 font-semibold text-gray-900">
              {student.studentId}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Admission Date</p>
            <p className="mt-1 font-semibold text-gray-900">
              {formatDate(student.admissionDate)}
            </p>
          </div>
        </div>

        {editing && (
          <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber-700 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>

      {/* Assigned Packages */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Assigned Packages
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Courses and package validity for this student.
            </p>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
            {packages.length} package{packages.length === 1 ? "" : "s"}
          </span>
        </div>

        {academicLoading ? (
          <p className="py-6 text-center text-sm text-gray-500">
            Loading package history...
          </p>
        ) : packages.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-5 text-center text-sm text-gray-500">
            No packages assigned to this student yet.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {packages.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {item.packageName || item.course?.packageName || "Dance Package"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.danceStyle || item.course?.danceStyle || "—"} ·{" "}
                      {item.durationMonths || item.course?.durationMonths || "—"} months
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(item.status)}`}
                  >
                    {item.status || "unknown"}
                  </span>
                </div>

                <p className="mt-4 text-xl font-bold text-gray-900">
                  {formatCurrency(item.totalFees)}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Payment</p>
                    <p
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(item.paymentStatus)}`}
                    >
                      {item.paymentStatus || "unpaid"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(item.startDate)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Expiry Date</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(item.expiryDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Payment History */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Payment History
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              All recorded payments and downloadable receipts.
            </p>
          </div>

          <div className="rounded-lg bg-green-50 px-4 py-2">
            <p className="text-xs text-green-700">Total Paid</p>
            <p className="text-lg font-bold text-green-800">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </div>

        {academicLoading ? (
          <p className="py-6 text-center text-sm text-gray-500">
            Loading payment history...
          </p>
        ) : payments.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-5 text-center text-sm text-gray-500">
            No payments recorded for this student yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Package</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Mode</th>
                  <th className="px-3 py-3">Receipt Number</th>
                  <th className="px-3 py-3 text-right">Receipt</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-gray-700">
                      {formatDate(payment.paymentDate)}
                    </td>

                    <td className="px-3 py-4 font-medium text-gray-800">
                      {payment.studentPackage?.packageName || "Dance Package"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>

                    <td className="px-3 py-4 capitalize text-gray-700">
                      {payment.paymentMode?.replace("_", " ") || "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-gray-600">
                      {payment.receiptNumber || "—"}
                    </td>

                    <td className="px-3 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(payment)}
                        disabled={downloadingReceipt === payment._id}
                        className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {downloadingReceipt === payment._id
                          ? "Downloading..."
                          : "Download PDF"}
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
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Certificates
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Generate, manage and download student certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
              {certificates.length} Certificates
            </span>

            <button
              type="button"
              onClick={() => {
                setError("");
                setMessage("");
                setShowCertificateForm((prev) => !prev);
              }}
              disabled={packages.length === 0}
              className="rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showCertificateForm ? "Cancel" : "+ Generate Certificate"}
            </button>
          </div>
        </div>

        {/* Generate Certificate Form */}
        {showCertificateForm && (
          <form
            onSubmit={handleGenerateCertificate}
            className="mb-6 rounded-xl border border-amber-200 bg-amber-50/50 p-5"
          >
            <h3 className="mb-4 font-bold text-gray-900">
              Generate New Certificate
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Course Package
                </label>

                <select
                  value={certificateForm.packageId}
                  onChange={(e) =>
                    setCertificateForm((prev) => ({
                      ...prev,
                      packageId: e.target.value,
                    }))
                  }
                  required
                  className={inputClass}
                >
                  <option value="">Choose Package</option>

                  {packages.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.packageName} - {item.durationMonths} Months
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Completion Date
                </label>

                <input
                  type="date"
                  value={certificateForm.completionDate}
                  onChange={(e) =>
                    setCertificateForm((prev) => ({
                      ...prev,
                      completionDate: e.target.value,
                    }))
                  }
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCertificateForm(false)}
                disabled={generatingCertificate}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={generatingCertificate}
                className="rounded-lg bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
              >
                {generatingCertificate
                  ? "Generating..."
                  : "Generate Certificate"}
              </button>
            </div>
          </form>
        )}

        {academicLoading ? (
          <p className="py-6 text-center text-sm text-gray-500">
            Loading certificates...
          </p>
        ) : certificates.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="font-medium text-gray-700">
              No certificates generated yet.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Generate a certificate using the button above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {certificates.map((certificate) => (
              <div
                key={certificate._id}
                className="rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {certificate.courseName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {certificate.durationMonths} Months Course
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Generated
                  </span>
                </div>

                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">
                      Certificate Number
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {certificate.certificateNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Completion Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(certificate.completionDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Generated On
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {formatDate(certificate.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadCertificate(certificate)}
                  disabled={downloadingCertificate === certificate._id}
                  className="mt-5 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {downloadingCertificate === certificate._id
                    ? "Downloading..."
                    : "Download Certificate PDF"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Academic Data Error */}
      {academicError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {academicError}

          <button
            type="button"
            onClick={fetchAcademicData}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;