import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="navbar__brand-hm" style={{ fontSize: 24 }}>HM DANCE STUDIO</p>
          <p className="footer__tag">Dance Nothing Without Passion.</p>
        </div>

        <div className="footer__col">
          <p className="footer__heading">Visit</p>
          <p className="footer__text">Chandmari Glomber, Near Hanuman Mandir</p>
          <p className="footer__text">Motihari, Bihar</p>
        </div>

        <div className="footer__col">
          <p className="footer__heading">Call</p>
          <p className="footer__text"><a href="tel:7488806350">7488806350</a></p>
          <p className="footer__text"><a href="tel:9006002329">9006002329</a></p>
        </div>

        <div className="footer__col">
          <p className="footer__heading">Explore</p>
          <Link className="footer__text" to="/rentals">Studio &amp; Rentals</Link>
          <Link className="footer__text" to="/contact">Contact</Link>
          <Link className="footer__text" to="/login">Studio Login</Link>
        </div>
      </div>
      <div className="container">
        <p className="footer__copy">© {new Date().getFullYear()} HM Dance Studio, Motihari. Come, dance with us.</p>
      </div>
    </footer>
  )
}
