import { useState } from 'react'
import './StaticPage.css'
import './Contact.css'

export default function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="static-page container page-fade">
      <p className="eyebrow">Get in touch</p>
      <h1 className="static-page__title">Come, dance with us.</h1>
      <div className="stroke-divider" style={{ maxWidth: 220 }} />
      <p className="static-page__lead">
        Questions about a class, a package, or booking the studio? Send a message, or call us directly.
      </p>

      <div className="contact-grid">
        <div className="card contact-info">
          <div>
            <p className="eyebrow">Location</p>
            <p className="contact-info__text">Chandmari Glomber, Near Hanuman Mandir, Motihari, Bihar</p>
          </div>
          <div>
            <p className="eyebrow">Phone</p>
            <p className="contact-info__text"><a href="tel:7488806350">7488806350</a></p>
            <p className="contact-info__text"><a href="tel:9006002329">9006002329</a></p>
          </div>
          <div>
            <p className="eyebrow">Classes</p>
            <p className="contact-info__text">Hip Hop · Bollywood · Contemporary · Free Style · Wedding Choreography · Singing · Guitar</p>
          </div>
        </div>

        <form className="card contact-form" onSubmit={handleSubmit}>
          {sent ? (
            <div className="contact-form__success">
              <h3>Message sent.</h3>
              <p>We'll call you back shortly — or ring us directly at 7488806350.</p>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" placeholder="Enter your full name" required />
              </div>
              <div>
                <label htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" placeholder="10-digit mobile number" required />
              </div>
              <div>
                <label htmlFor="interest">Interested in</label>
                <select id="interest" name="interest" defaultValue="">
                  <option value="" disabled>Select a class</option>
                  <option>Hip Hop</option>
                  <option>Bollywood</option>
                  <option>Contemporary</option>
                  <option>Free Style</option>
                  <option>Wedding Choreography</option>
                  <option>Singing Class</option>
                  <option>Guitar Class</option>
                </select>
              </div>
              <div>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} placeholder="Tell us a little about what you're looking for" />
              </div>
              <button type="submit" className="btn btn-primary contact-form__submit">Send Message</button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
