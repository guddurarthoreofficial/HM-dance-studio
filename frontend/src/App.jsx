
import { useEffect } from "react";

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import StudioPage from "./pages/StudioPage";

import Login from "./pages/auth/Login";

import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";

import AdminDashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";

import "./styles/Site.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

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

function PublicLayout() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<StudioPage page="about" />} />
        <Route path="/programs" element={<StudioPage page="programs" />} />
        <Route path="/achievements" element={<StudioPage page="achievements" />} />
        <Route path="/gallery" element={<StudioPage page="gallery" />} />
        <Route path="/videos" element={<StudioPage page="videos" />} />
        <Route path="/contact" element={<StudioPage page="contact" />} />
      </Routes>

      <Footer />
    </>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route
              index
              element={<Navigate to="dashboard" replace />}
            />
            <Route path="dashboard" element={<StudentDashboard />} />
          </Route>
        </Route>

        {/* Existing Public Pages */}
        <Route path="/about" element={<><Navbar /><StudioPage page="about" /><Footer /></>} />
        <Route path="/programs" element={<><Navbar /><StudioPage page="programs" /><Footer /></>} />
        <Route path="/achievements" element={<><Navbar /><StudioPage page="achievements" /><Footer /></>} />
        <Route path="/gallery" element={<><Navbar /><StudioPage page="gallery" /><Footer /></>} />
        <Route path="/videos" element={<><Navbar /><StudioPage page="videos" /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><StudioPage page="contact" /><Footer /></>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
