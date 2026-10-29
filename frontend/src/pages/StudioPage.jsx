
import { Link } from "react-router-dom";

const programs = [
  "Hip Hop",
  "Bollywood",
  "Contemporary",
  "Semi Classical",
  "Free Style",
  "Kids Dance",
  "Yoga",
  "Exercise",
];

const pages = {
  about: {
    number: "01",
    eyebrow: "THE STORY BEHIND THE MOVEMENT",
    title: "A space to move.",
    italic: "A place to grow.",
    description:
      "HM Dance Studio is a place to explore movement, express yourself and build confidence through dance.",
    type: "about",
  },
  programs: {
    number: "02",
    eyebrow: "FIND YOUR SIGNATURE STYLE",
    title: "Move your way.",
    italic: "Own your rhythm.",
    description:
      "Explore our dance and movement classes. Get in touch with the studio to discuss classes and availability.",
    type: "programs",
  },
  achievements: {
    number: "03",
    eyebrow: "EVERY MILESTONE MATTERS",
    title: "The journey.",
    italic: "The moments.",
    description:
      "Every performance has a story. Explore HM Dance Studio's real milestones and share the moments that make them special.",
    type: "achievements",
  },
  gallery: {
    number: "04",
    eyebrow: "BEHIND EVERY PERFORMANCE",
    title: "Made of",
    italic: "movement.",
    description:
      "A growing collection of dance practice, performances and studio memories.",
    type: "gallery",
  },
  videos: {
    number: "05",
    eyebrow: "SEE THE MOVEMENT",
    title: "Watch it.",
    italic: "Feel it.",
    description:
      "Explore our dance content and studio updates on Instagram. More video features can be added with your own YouTube links.",
    type: "videos",
  },
  contact: {
    number: "06",
    eyebrow: "LET'S START SOMETHING",
    title: "Your next step.",
    italic: "Starts here.",
    description:
      "Have a question about classes or admissions? Reach out to HM Dance Studio.",
    type: "contact",
  },
};

const instagram =
  "https://www.instagram.com/happy_moment_dance_studio";

const whatsapp = "https://wa.me/918969664247";

const register =
  "https://docs.google.com/forms/d/e/1FAIpQLSdh3O9bcm18y7ZiPqCA7fYanD7jKLHdoNc9EMPKrKGqaHiHFw/viewform?usp=header";

function ActionLink({ href, children, external = false }) {
  return (
    <a
      className="hm-outline-link"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children} <span>↗</span>
    </a>
  );
}

export default function StudioPage({ page }) {
  const data = pages[page];

  if (!data) {
    return (
      <section className="hm-page">
        <p className="hm-page-kicker">404 · PAGE NOT FOUND</p>
        <h1 className="hm-page-title">Lost the rhythm?</h1>
        <Link className="hm-outline-link" to="/">
          Return home <span>↗</span>
        </Link>
      </section>
    );
  }

  return (
    <main className={`hm-page hm-page--${data.type}`}>
      <div className="hm-page-orb" aria-hidden="true" />

      <section className="hm-page-hero">
        <div className="hm-page-kicker">
          <span />
          {data.eyebrow}
        </div>

        <div className="hm-page-number">{data.number} / HM STUDIO</div>

        <h1 className="hm-page-title">
          {data.title}
          <br />
          <em>{data.italic}</em>
        </h1>

        <p className="hm-page-description">{data.description}</p>

        <div className="hm-page-actions">
          <ActionLink href={register} external>
            Join the Studio
          </ActionLink>
          <Link to="/" className="hm-page-back">
            ← Back to home
          </Link>
        </div>
      </section>

      {data.type === "about" && (
        <section className="hm-page-content">
          <div className="hm-page-section-heading">
            <span className="hm-page-kicker">WHAT WE BELIEVE</span>
            <h2>Dance is more than a step.</h2>
          </div>

          <div className="hm-info-grid">
            <article className="hm-info-card">
              <span>01</span>
              <h3>Expression</h3>
              <p>
                Discover your own way of expressing energy,
                personality and emotion through movement.
              </p>
            </article>

            <article className="hm-info-card">
              <span>02</span>
              <h3>Confidence</h3>
              <p>
                Build confidence by practising, learning and
                showing up for your dance journey.
              </p>
            </article>

            <article className="hm-info-card">
              <span>03</span>
              <h3>Community</h3>
              <p>
                Be part of a space that celebrates movement,
                learning and the love of dance.
              </p>
            </article>
          </div>

          <div className="hm-about-instructor">
            <img
              src="https://cdn.corenexis.com/f/BZHuoVpv1jM.jpeg"
              alt="HM Dance Studio instructor"
              loading="lazy"
            />
            <div>
              <span className="hm-page-kicker">MEET YOUR INSTRUCTOR</span>
              <h2>Piyush Sir</h2>
              <p>
                Connect with the studio to learn more about
                classes, training and available batches.
              </p>
              <ActionLink href={whatsapp} external>
                Contact the Studio
              </ActionLink>
            </div>
          </div>
        </section>
      )}

      {data.type === "programs" && (
        <section className="hm-page-content">
          <div className="hm-page-section-heading">
            <span className="hm-page-kicker">EXPLORE THE POSSIBILITIES</span>
            <h2>Choose your movement.</h2>
          </div>

          <div className="hm-program-grid">
            {programs.map((program, index) => (
              <article className="hm-program-card" key={program}>
                <span className="hm-program-card__number">
                  0{index + 1}
                </span>
                <h3>{program}</h3>
                <Link
                  to="/contact"
                  className="hm-program-card__link"
                  aria-label={`Ask about ${program} classes`}
                >
                  Ask about classes <span>↗</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {data.type === "achievements" && (
        <section className="hm-page-content">
          <div className="hm-empty-state">
            <span className="hm-empty-state__symbol">✳</span>
            <h2>Every achievement has a story.</h2>
            <p>
              Follow our studio updates and performances. We will
              showcase awards and milestones here as verified
              details and photos are added.
            </p>
            <ActionLink href={instagram} external>
              Explore Instagram
            </ActionLink>
          </div>
        </section>
      )}

      {data.type === "gallery" && (
        <section className="hm-page-content">
          <div className="hm-empty-state">
            <span className="hm-empty-state__symbol">✳</span>
            <h2>More studio moments, coming soon.</h2>
            <p>
              Our dedicated photo gallery will be populated with
              your studio's practice sessions, events and
              performance photos.
            </p>
            <ActionLink href={instagram} external>
              View Studio Photos
            </ActionLink>
          </div>
        </section>
      )}

      {data.type === "videos" && (
        <section className="hm-page-content">
          <div className="hm-video-feature">
            <div className="hm-video-feature__symbol">▶</div>
            <div>
              <span className="hm-page-kicker">STUDIO ON INSTAGRAM</span>
              <h2>Feel the beat. See the moves.</h2>
              <p>
                Open our Instagram profile for dance clips,
                performances and studio updates.
              </p>
              <ActionLink href={instagram} external>
                Watch on Instagram
              </ActionLink>
            </div>
          </div>
        </section>
      )}

      {data.type === "contact" && (
        <section className="hm-page-content">
          <div className="hm-contact-grid">
            <article className="hm-contact-card">
              <span className="hm-page-kicker">VISIT US</span>
              <h3>Come say hello.</h3>
              <p>
                Chandmari Golamber, Near Hanuman Mandir,
                Motihari, Bihar — 845401
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Chandmari+Golamber+Near+Hanuman+Mandir+Motihari+Bihar+845401"
                target="_blank"
                rel="noreferrer"
                className="hm-outline-link"
              >
                Get directions <span>↗</span>
              </a>
            </article>

            <article className="hm-contact-card">
              <span className="hm-page-kicker">CALL THE STUDIO</span>
              <h3>Let's talk dance.</h3>
              <a href="tel:+917488806350">+91 74888 06350</a>
              <a href="tel:+919006002329">+91 90060 02329</a>
              <ActionLink href={whatsapp} external>
                WhatsApp Us
              </ActionLink>
            </article>

            <article className="hm-contact-card">
              <span className="hm-page-kicker">ADMISSIONS</span>
              <h3>Ready to begin?</h3>
              <p>
                Contact the studio or open the registration form
                to get started.
              </p>
              <ActionLink href={register} external>
                Register Now
              </ActionLink>
            </article>
          </div>
        </section>
      )}

      <section className="hm-page-bottom-cta">
        <span className="hm-page-kicker">YOUR STORY STARTS HERE</span>
        <h2>
          Ready to find
          <br />
          <em>your rhythm?</em>
        </h2>
        <ActionLink href={register} external>
          Join HM Dance Studio
        </ActionLink>
      </section>
    </main>
  );
}
