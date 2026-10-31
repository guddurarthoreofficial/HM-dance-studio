
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();

    const { login, isAuthenticated, user, loading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Forgot password states
    const [forgotMode, setForgotMode] = useState(false);
    const [step, setStep] = useState(1);
    const [resetEmail, setResetEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <Navigate
                to={user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
                replace
            />
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    // Normal Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            const data = response.data;

            if (!data.token || !data.user) {
                throw new Error("Invalid login response from server.");
            }

            login(data);

            if (data.user.role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else if (data.user.role === "student") {
                navigate("/student/dashboard", { replace: true });
            } else {
                setError("Your account role is not supported.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);

            await api.post("/auth/forgot-password", {
                email: resetEmail.trim().toLowerCase(),
            });

            setStep(2);
            setSuccess("If your email is registered, an OTP has been sent.");
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to send OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!/^\d{6}$/.test(otp)) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/verify-reset-otp", {
                email: resetEmail.trim().toLowerCase(),
                otp,
            });

            setResetToken(response.data.resetToken);
            setStep(3);
            setSuccess("OTP verified successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message || "OTP verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/reset-password", {
                email: resetEmail.trim().toLowerCase(),
                resetToken,
                newPassword,
                confirmPassword,
            });

            setSuccess(response.data.message);

            setTimeout(() => {
                setForgotMode(false);
                setStep(1);
                setFormData({
                    email: resetEmail,
                    password: "",
                });
                setOtp("");
                setResetToken("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setSuccess("");
            }, 1800);

        } catch (err) {
            setError(
                err.response?.data?.message || "Password reset failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const backToLogin = () => {
        setForgotMode(false);
        setStep(1);
        setOtp("");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
    };

    return (
        <main className="auth-page flex min-h-screen items-center justify-center bg-[#f7f5f0] px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

                <Link
                    to="/"
                    className="text-sm font-medium text-gray-500 transition hover:text-black"
                >
                    ← Back to Website
                </Link>

                <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                        HM Dance Studio
                    </p>

                    <h1 className="mt-3 font-serif text-4xl text-gray-900">
                        {forgotMode ? "Reset Password" : "Welcome Back"}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        {forgotMode
                            ? "Recover your account using email verification."
                            : "Sign in to access your studio account."}
                    </p>
                </div>

                {/* LOGIN FORM */}
                {!forgotMode && (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="username"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setResetEmail(formData.email);
                                    setForgotMode(true);
                                    setError("");
                                    setSuccess("");
                                }}
                                style={{ color: "#92400e" }}
                                className="!text-amber-800 text-sm font-semibold underline decoration-transparent underline-offset-4 transition hover:!text-amber-900 hover:decoration-current"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {error && (
                            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                )}

                {/* FORGOT PASSWORD FORM */}
                {forgotMode && (
                    <div className="mt-8">

                        <div className="mb-6 flex items-center gap-2">
                            {[1, 2, 3].map((number) => (
                                <div
                                    key={number}
                                    className={`h-1.5 flex-1 rounded-full ${step >= number ? "bg-amber-700" : "bg-gray-200"
                                        }`}
                                />
                            ))}
                        </div>

                        <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Step {step} of 3
                        </p>

                        {/* STEP 1 */}
                        {step === 1 && (
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Registered Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="Enter registered email"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
                                >
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </form>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOTP} className="space-y-5">
                                <p className="text-sm text-gray-500">
                                    Enter the 6-digit OTP sent to {resetEmail}.
                                </p>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                                    }}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-amber-700"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setOtp("");
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className="w-full text-sm font-medium text-amber-800 hover:underline"
                                >
                                    Change Email
                                </button>
                            </form>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        minLength={8}
                                        autoComplete="new-password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-amber-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        minLength={8}
                                        autoComplete="new-password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-amber-700"
                                        required
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={showPasswords}
                                        onChange={(e) => setShowPasswords(e.target.checked)}
                                    />
                                    Show passwords
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-gray-900 px-4 py-3.5 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
                                >
                                    {loading ? "Resetting Password..." : "Reset Password"}
                                </button>
                            </form>
                        )}

                        {error && (
                            <div role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div role="status" className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={backToLogin}
                            className="mt-6 w-full text-sm font-medium text-gray-500 hover:text-black"
                        >
                            ← Back to Login
                        </button>
                    </div>
                )}

                <p className="mt-8 text-center text-xs text-gray-400">
                    Secure account access · HM Dance Studio
                </p>
            </div>
        </main>
    );
};

export default Login;
