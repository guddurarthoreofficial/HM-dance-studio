
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const LOGO = "https://cdn.corenexis.com/f/ksZssilhH2u.png";

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

  return (
    <header
      className={`hm-nav ${scrolled ? "hm-nav--scrolled" : ""}`}
    >
      <div className="hm-nav__inner">
        <Link
          to="/"
          className="hm-nav__brand"
          aria-label="HM Dance Studio home"
          onClick={() => setMenuOpen(false)}
        >
          <img src={LOGO} alt="HM Dance Studio logo" />
          <span className="hm-nav__brand-text">
            <strong>HM</strong>
            <small>DANCE STUDIO</small>
          </span>
        </Link>

        <nav
          className={`hm-nav__links ${menuOpen ? "hm-nav__links--open" : ""}`}
          aria-label="Main navigation"
        >
          {links.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={{ "--nav-index": index }}
              className={({ isActive }) =>
                `hm-nav__link ${isActive ? "is-active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noreferrer"
            className="hm-nav__mobile-join"
            onClick={() => setMenuOpen(false)}
          >
            Join the Studio <span>↗</span>
          </a>
        </nav>

        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noreferrer"
          className="hm-nav__join"
        >
          <span>Join the Studio</span>
          <span className="hm-nav__join-arrow">↗</span>
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
    </header>
  );
}
