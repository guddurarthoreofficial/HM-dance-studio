
import { Link } from "react-router-dom";
import "./Footer.css";

const links = [
  ["About", "/about"],
  ["Programs", "/programs"],
  ["Achievements", "/achievements"],
  ["Gallery", "/gallery"],
  ["Videos", "/videos"],
  ["Contact", "/contact"],
];

export default function Footer() {
  return (
    <footer className="hm-footer">
      <div className="hm-footer__main">
        <div className="hm-footer__brand">
          <Link to="/" className="hm-footer__logo">
            <img
              src="https://cdn.corenexis.com/f/ksZssilhH2u.png"
              alt="HM Dance Studio logo"
              loading="lazy"
            />
            <span>
              <strong>HM</strong>
              <small>DANCE STUDIO</small>
            </span>
          </Link>

          <p>
            Feel the rhythm. Express yourself.
            <br />
            Let every movement tell your story.
          </p>

          <a
            href="https://www.instagram.com/hm_dance_studio_"
            target="_blank"
            rel="noreferrer"
            className="hm-footer__social"
          >
            Instagram <span>↗</span>
          </a>
         <br />
           <a
            href="https://www.youtube.com/@hm_dance_studio"
            target="_blank"
            rel="noreferrer"
            className="hm-footer__social"
          >
            Youtube <span>↗</span>
          </a>
        </div>

        <div className="hm-footer__navigation">
          <h3>EXPLORE</h3>
          {links.map(([label, to]) => (
            <Link to={to} key={to}>
              {label}
            </Link>
          ))}
        </div>

        <div className="hm-footer__contact">
          <h3>FIND YOUR WAY HERE</h3>
          <p>
            Chandmari Golamber,
            <br />
            Near Hanuman Mandir,
            <br />
            Motihari, Bihar — 845401
          </p>
          <a href="tel:+917488806350">+91 74888 06350</a>
          <a href="tel:+919006002329">+91 90060 02329</a>
          <a
            href="https://wa.me/918969664247"
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp ↗
          </a>
        </div>
      </div>

      <div className="hm-footer__bottom">
        <span>© {new Date().getFullYear()} HM Dance Studio</span>
        <span>MADE FOR THE LOVE OF DANCE</span>
        <Link to="/">BACK TO TOP ↑</Link>
      </div>
    </footer>
  );
}
