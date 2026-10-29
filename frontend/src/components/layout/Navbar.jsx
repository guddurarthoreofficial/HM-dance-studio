import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const LOGO = "../../images/logo.png";

const links = [
  { label: "Home", to: "/", end: true },
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Achievements", to: "/achievements" },
  { label: "Gallery", to: "/gallery" },
  { label: "Videos", to: "/videos" },
  { label: "Contact", to: "/contact" },
];

const REGISTER_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdh3O9bcm18y7ZiPqCA7fYanD7jKLHdoNc9EMPKrKGqaHiHFw/viewform?usp=header";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close the drawer if the screen grows to desktop size */
  useEffect(() => {
    const query = window.matchMedia("(min-width: 901px)");
    const handleChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={[
        "hm-nav",
        scrolled ? "hm-nav--scrolled" : "",
        menuOpen ? "hm-nav--menu-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Tap outside the drawer to close it (mobile only) */}
      <button
        type="button"
        className={`hm-nav__backdrop ${menuOpen ? "is-visible" : ""}`}
        aria-label="Close navigation menu"
        tabIndex={-1}
        onClick={closeMenu}
      />

      <div className="hm-nav__inner">
        <Link
          to="/"
          className="hm-nav__brand"
          aria-label="HM Dance Studio home"
          onClick={closeMenu}
        >
          <span className="hm-nav__logo-frame">
            <img src={LOGO} alt="" />
          </span>

          <span className="hm-nav__brand-text">
            <span className="hm-nav__brand-overline">WHERE PASSION MEETS ART</span>
            <strong>
              HM <span>Dance Studio</span>
            </strong>
          </span>
        </Link>

        <nav
          id="hm-navigation-links"
          className={`hm-nav__links ${menuOpen ? "hm-nav__links--open" : ""}`}
          aria-label="Main navigation"
        >
          <span className="hm-nav__mobile-heading">Explore the studio</span>

          {links.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={{ "--nav-index": index }}
              className={({ isActive }) =>
                `hm-nav__link ${isActive ? "is-active" : ""}`
              }
              onClick={closeMenu}
            >
              <span className="hm-nav__link-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{link.label}</span>
              <span className="hm-nav__link-arrow" aria-hidden="true">
                ↗
              </span>
            </NavLink>
          ))}

          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hm-nav__mobile-join"
            onClick={closeMenu}
          >
            Book your trial class <span>↗</span>
          </a>

          <span className="hm-nav__mobile-note">
            Where passion becomes performance.
          </span>
        </nav>

        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hm-nav__join"
        >
          <span className="hm-nav__join-label">START YOUR JOURNEY</span>
          <span className="hm-nav__join-text">Join the Studio</span>
          <span className="hm-nav__join-arrow" aria-hidden="true">
            ↗
          </span>
        </a>

        <button
          type="button"
          className={`hm-nav__toggle ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="hm-navigation-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="hm-nav__bottom-line" aria-hidden="true" />
    </header>
  );
}