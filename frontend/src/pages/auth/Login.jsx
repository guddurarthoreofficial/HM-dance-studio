
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

    return (
        <main className="auth-page flex min-h-screen items-center justify-center bg-[#f7f5f0] px-4 py-10">      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

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
                    Welcome Back
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    Sign in to access your studio account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
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
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
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

                {error && (
                    <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
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

            <p className="mt-8 text-center text-xs text-gray-400">
                Secure account access · HM Dance Studio
            </p>
        </div>
        </main>
    );
};

export default Login;
