
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const adminLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "◫" },
  { name: "Students", path: "/admin/students", icon: "♙" },
  { name: "Admissions", path: "/admin/admissions", icon: "+" },
  { name: "Courses", path: "/admin/courses", icon: "▤" },
  { name: "Packages", path: "/admin/packages", icon: "▣" },
  { name: "Payments", path: "/admin/payments", icon: "₹" },
  { name: "Certificates", path: "/admin/certificates", icon: "✧" },
  { name: "Settings", path: "/admin/settings", icon: "⚙" },
];

const studentLinks = [
  { name: "Dashboard", path: "/student/dashboard", icon: "◫" },
  { name: "My Profile", path: "/student/profile", icon: "♙" },
  { name: "My Packages", path: "/student/packages", icon: "▣" },
  { name: "Payments", path: "/student/payments", icon: "₹" },
  { name: "Certificates", path: "/student/certificates", icon: "✧" },
  { name: "Settings", path: "/student/settings", icon: "⚙" },
];

const Sidebar = ({ role, open, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = role === "admin" ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#111827] text-white transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <h2
            className="font-serif text-2xl font-bold"
            style={{
              color: "#d7b46b",
              background: "transparent",
              lineHeight: "1.2",
            }}
          >
            HM Dance Studio
          </h2>

          <p
            className="mt-2 text-xs uppercase tracking-widest"
            style={{
              color: "#9ca3af",
              background: "transparent",
              display: "block",
              opacity: 1,
              visibility: "visible",
              lineHeight: "1.5",
            }}
          >
            {role === "admin" ? "Admin Portal" : "Student Portal"}
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${isActive
                  ? "bg-[#d7b46b] font-semibold text-gray-950"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="w-5 text-center text-lg">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
          >
            ↪ Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
