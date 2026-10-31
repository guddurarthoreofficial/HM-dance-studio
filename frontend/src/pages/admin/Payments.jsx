
import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
    studentId: "",
    packageId: "",
    paymentMethod: "cash",
};

const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

export default function Payments() {
    const [students, setStudents] = useState([]);
    const [packages, setPackages] = useState([]);
    const [payments, setPayments] = useState([]);

    const [form, setForm] = useState(initialForm);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [recording, setRecording] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);

    const fetchStudents = async () => {
        try {
            const response = await api.get("/students");
            setStudents(response.data.students || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to fetch students."
            );
        }
    };

    const fetchPayments = async () => {
        try {
            const response = await api.get("/payments/history");
            setPayments(response.data.payments || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to fetch payment history."
            );
        }
    };

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([fetchStudents(), fetchPayments()]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchStudentPackages = async (studentId) => {
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
                "Unable to fetch student packages."
            );
        }
    };

    const handleStudentChange = async (e) => {
        const studentId = e.target.value;

        setForm((prev) => ({
            ...prev,
            studentId,
            packageId: "",
        }));

        setPackages([]);
        setSuccess(null);
        setError("");

        await fetchStudentPackages(studentId);
    };


    const handleRecordPayment = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess(null);

        if (!form.studentId || !form.packageId) {
            setError("Please select a student and package.");
            return;
        }

        const selectedStudent = students.find(
            (student) => student.studentId === form.studentId
        );

        if (selectedStudent?.user?.isActive === false) {
            setError("This student account is blocked.");
            return;
        }

        const selectedPackage = packages.find(
            (item) => item._id === form.packageId
        );

        if (!selectedPackage) {
            setError("Selected package was not found.");
            return;
        }

        if (selectedPackage.paymentStatus === "paid") {
            setError("Payment has already been recorded.");
            return;
        }

        const confirmed = window.confirm(
            `Confirm payment of ₹${selectedPackage.totalFees} for ${selectedStudent.name}?`
        );

        if (!confirmed) return;

        try {
            setRecording(true);

            const response = await api.post("/payments/record", {
                packageId: form.packageId,
                paymentMode: form.paymentMethod,
                amount: Number(selectedPackage.totalFees),
            });

            setSuccess(response.data);

            setForm((prev) => ({
                ...prev,
                packageId: "",
            }));

            await fetchStudentPackages(form.studentId);
            await fetchPayments();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to record payment."
            );
        } finally {
            setRecording(false);
        }
    };


    const handleReceiptDownload = async (paymentId) => {
        try {
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
        } catch {
            setError("Unable to download receipt.");
        }
    };

    const selectedStudent = students.find(
        (student) => student.studentId === form.studentId
    );

    const selectedPackage = packages.find(
        (item) => item._id === form.packageId
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

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            : "—";

    const totalRevenue = payments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
    );

    const pendingPackages = packages.filter(
        (item) => item.paymentStatus !== "paid"
    ).length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold tracking-wide text-purple-600">
                        FINANCE MANAGEMENT
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        Payments
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Record student payments and manage receipts.
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-5">
                        <h3 className="font-bold text-green-800">
                            Payment recorded successfully!
                        </h3>

                        <p className="mt-2 text-sm text-green-700">
                            {success.message}
                        </p>

                        {success.payment?.receiptNumber && (
                            <p className="mt-2 text-sm text-green-700">
                                Receipt Number:{" "}
                                <strong>{success.payment.receiptNumber}</strong>
                            </p>
                        )}

                        {success.emailSent === true && (
                            <p className="mt-2 text-sm text-green-700">
                                ✓ Receipt emailed successfully.
                            </p>
                        )}

                        {success.emailSent === false && (
                            <p className="mt-2 text-sm text-red-600">
                                Payment saved, but receipt email could not be sent.
                            </p>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
                        Loading payment data...
                    </div>
                ) : (
                    <>
                        {/* Statistics */}
                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-sm text-gray-500">Total Transactions</p>
                                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                    {payments.length}
                                </h2>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-sm text-gray-500">Revenue in Loaded History</p>
                                <h2 className="mt-2 text-2xl font-bold text-green-600">
                                    {formatCurrency(totalRevenue)}
                                </h2>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <p className="text-sm text-gray-500">Pending Packages (Selected Student)</p>
                                <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                                    {pendingPackages}
                                </h2>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
                            <h2 className="mb-2 text-xl font-bold text-gray-900">
                                Record New Payment
                            </h2>

                            <p className="mb-6 text-sm text-gray-500">
                                Select a student and their pending package.
                            </p>

                            <form onSubmit={handleRecordPayment}>
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* Student */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Search Student
                                        </label>

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search name, email or student ID"
                                            className={`${inputClass} mb-2`}
                                        />

                                        <select
                                            value={form.studentId}
                                            onChange={handleStudentChange}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="">Select Student</option>

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

                                    {/* Package */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Select Pending Package
                                        </label>

                                        <select
                                            value={form.packageId}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    packageId: e.target.value,
                                                }))
                                            }
                                            required
                                            disabled={!form.studentId}
                                            className={inputClass}
                                        >
                                            <option value="">Select Package</option>

                                            {packages
                                                .filter(
                                                    (item) => item.paymentStatus !== "paid"
                                                )
                                                .map((item) => (
                                                    <option key={item._id} value={item._id}>
                                                        {item.packageName} - {formatCurrency(item.totalFees)}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Payment Method *
                                        </label>

                                        <select
                                            value={form.paymentMethod}
                                            onChange={(e) =>
                                                setForm((prev) => ({
                                                    ...prev,
                                                    paymentMethod: e.target.value,
                                                }))
                                            }
                                            className={inputClass}
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="upi">UPI</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Payment Summary */}
                                {selectedStudent && selectedPackage && (
                                    <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-5">
                                        <h3 className="font-bold text-purple-900">
                                            Payment Summary
                                        </h3>

                                        <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                            <p>
                                                Student:{" "}
                                                <strong>{selectedStudent.name}</strong>
                                            </p>

                                            <p>
                                                Student ID:{" "}
                                                <strong>{selectedStudent.studentId}</strong>
                                            </p>

                                            <p>
                                                Package:{" "}
                                                <strong>{selectedPackage.packageName}</strong>
                                            </p>

                                            <p>
                                                Duration:{" "}
                                                <strong>
                                                    {selectedPackage.durationMonths} Months
                                                </strong>
                                            </p>

                                            <p className="sm:col-span-2 text-lg">
                                                Total Payable:{" "}
                                                <strong className="text-purple-800">
                                                    {formatCurrency(selectedPackage.totalFees)}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-7 flex justify-end border-t border-gray-100 pt-6">
                                    <button
                                        type="submit"
                                        disabled={
                                            recording ||
                                            !form.studentId ||
                                            !form.packageId
                                        }
                                        className="rounded-lg bg-purple-700 px-6 py-3 font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {recording ? "Recording Payment..." : "Confirm Payment"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Payment History */}
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Payment History
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Recent recorded transactions.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={fetchPayments}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Refresh
                                </button>
                            </div>

                            {payments.length === 0 ? (
                                <div className="p-10 text-center text-sm text-gray-500">
                                    No payments recorded yet.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[850px] text-left">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                            <tr>
                                                <th className="px-5 py-4">Receipt</th>
                                                <th className="px-5 py-4">Student</th>
                                                <th className="px-5 py-4">Amount</th>
                                                <th className="px-5 py-4">Method</th>
                                                <th className="px-5 py-4">Date</th>
                                                <th className="px-5 py-4 text-right">Receipt</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {payments.map((payment) => (
                                                <tr key={payment._id} className="hover:bg-gray-50">
                                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                                                        {payment.receiptNumber || "—"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p className="font-semibold text-gray-900">
                                                            {payment.student?.name || "Student"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {payment.student?.studentId || ""}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                                                        {formatCurrency(payment.amount)}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm capitalize text-gray-600">
                                                        {(payment.paymentMethod || "").replace("_", " ")}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-gray-600">
                                                        {formatDate(payment.paymentDate || payment.createdAt)}
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleReceiptDownload(payment._id)}
                                                            className="rounded-lg border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                                                        >
                                                            Download PDF
                                                        </button>
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
