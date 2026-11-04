
import { useEffect } from "react";

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import StudioPage from "./pages/StudioPage";
import Registration from "./pages/public/Registration";

import Login from "./pages/auth/Login";

import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";

import AdminDashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import StudentDetails from "./pages/admin/StudentDetails";
import Admissions from "./pages/admin/Admissions";
import Courses from "./pages/admin/Courses";
import Packages from "./pages/admin/Packages";
import Payments from "./pages/admin/Payments";

import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentSettings from "./pages/student/Settings";
import StudentPackages from "./pages/student/Packages";
import StudentPayments from "./pages/student/Payments";
import StudentCertificates from "./pages/student/Certificates";

import ProtectedRoute from "./components/common/ProtectedRoute";

import "./styles/Site.css";

// Floating Social Buttons
function FloatingSocialButtons() {
  return (
    <div className="hm-floating-social">

      {/* WhatsApp */}
      <a
        href="https://wa.me/918969664247"
        className="hm-social-btn hm-social-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with HM Dance Studio on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.45 0 .08 5.37.08 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.9 11.9 0 0 0 5.85 1.49h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.2-3.51-8.41ZM12.05 21.8h-.01a9.88 9.88 0 0 1-5.03-1.37l-.36-.21-3.68.97.98-3.59-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.9-9.89a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.89-9.94 9.89Zm5.43-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
          />
        </svg>
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/hm_dance_studio_/"
        className="hm-social-btn hm-social-instagram"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow HM Dance Studio on Instagram"
        title="Follow on Instagram"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
          />
        </svg>
      </a>

    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

// Public Website Layout
function PublicLayout() {
  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />

      <FloatingSocialButtons />
    </>
  );
}

// 404 Page
function NotFound() {
  return (
    <main className="hm-page">
      <section className="hm-page-hero">
        <p className="hm-page-kicker">404 · WRONG STEP</p>

        <h1 className="hm-page-title">
          Lost the
          <br />
          <em>rhythm?</em>
        </h1>

        <p className="hm-page-description">
          This page does not exist. Let's get you back to the studio.
        </p>

        <div className="hm-page-actions">
          <Link className="hm-outline-link" to="/">
            Back to Home <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

// Application Routes
function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<StudioPage page="about" />} />
          <Route path="/programs" element={<StudioPage page="programs" />} />
          <Route path="/achievements" element={<StudioPage page="achievements" />} />
          <Route path="/gallery" element={<StudioPage page="gallery" />} />
          <Route path="/videos" element={<StudioPage page="videos" />} />
          <Route path="/contact" element={<StudioPage page="contact" />} />
          <Route path="/register" element={<Registration />} />
        </Route>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/:studentId" element={<StudentDetails />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="courses" element={<Courses />} />
            <Route path="packages" element={<Packages />} />
            <Route path="payments" element={<Payments />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="settings" element={<StudentSettings />} />
            <Route path="packages" element={<StudentPackages />} />
            <Route path="payments" element={<StudentPayments />} />
            <Route path="certificates" element={<StudentCertificates />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// Main App
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
