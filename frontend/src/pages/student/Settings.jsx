
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setMessage("");
    setError("");
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (form.newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.put("/auth/change-password", form);

      setMessage(response.data.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Give the user a moment to read the success message.
      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    {
      name: "currentPassword",
      label: "Current Password",
      field: "current",
    },
    {
      name: "newPassword",
      label: "New Password",
      field: "new",
    },
    {
      name: "confirmPassword",
      label: "Confirm New Password",
      field: "confirm",
    },
  ];

  return (
    <div className="dashboard-shell mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and password.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
            🔐
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>
            <p className="text-sm text-gray-500">
              Update your account password securely.
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message} Redirecting to login...
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {passwordFields.map((item) => (
            <div key={item.name}>
              <label
                htmlFor={item.name}
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {item.label}
              </label>

              <div className="relative">
                <input
                  id={item.name}
                  type={
                    showPasswords[item.field] ? "text" : "password"
                  }
                  name={item.name}
                  value={form[item.name]}
                  onChange={handleChange}
                  required
                  minLength={item.name === "currentPassword" ? undefined : 8}
                  autoComplete="new-password"
                  disabled={loading}
                  placeholder={`Enter ${item.label.toLowerCase()}`}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-16 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => togglePassword(item.field)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-purple-700 hover:text-purple-900"
                >
                  {showPasswords[item.field] ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-lg bg-purple-50 p-4 text-sm text-purple-800">
            <p className="font-semibold">Password requirements</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Minimum 8 characters</li>
              <li>New password must be different from current password</li>
              <li>Both new password fields must match</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="font-semibold text-amber-900">
          Security Reminder
        </h3>
        <p className="mt-1 text-sm text-amber-800">
          Never share your password with anyone. After changing your
          password, you will be logged out and asked to sign in again.
        </p>
      </div>
    </div>
  );
};

export default Settings;
