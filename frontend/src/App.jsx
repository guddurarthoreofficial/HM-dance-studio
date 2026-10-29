
import { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import StudioPage from "./pages/StudioPage";

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

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<StudioPage page="about" />} />
        <Route path="/programs" element={<StudioPage page="programs" />} />
        <Route
          path="/achievements"
          element={<StudioPage page="achievements" />}
        />
        <Route path="/gallery" element={<StudioPage page="gallery" />} />
        <Route path="/videos" element={<StudioPage page="videos" />} />
        <Route path="/contact" element={<StudioPage page="contact" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
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
