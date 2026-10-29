
import { motion } from "framer-motion";
import "./StudioStory.css";

const instagramUrl =
  "https://www.instagram.com/happy_moment_dance_studio";

const reveal = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function StudioStory() {
  return (
    <section className="hm-story" id="studio-story">
      <div className="hm-story__container">
        {/* Section heading */}
        <motion.div
          className="hm-story__topline"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <span className="hm-story__eyebrow">
            <span className="hm-story__eyebrow-line" />
            THE STORY OF HM
          </span>

          <span className="hm-story__location">
            MOTIHARI, BIHAR · EST. 5 YEARS AGO
          </span>
        </motion.div>

        <div className="hm-story__grid">
          {/* Editorial content */}
          <motion.div
            className="hm-story__content"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="hm-story__overline">
              WHERE PASSION BECOMES PERFORMANCE
            </p>

            <h2 className="hm-story__title">
              Built on passion.
              <br />
              <em>United by dance.</em>
            </h2>

            <div className="hm-story__accent" />

            <p className="hm-story__description">
              For five years, HM Dance Studio has been a place
              where movement brings people together. From
              practice sessions to stage performances, every
              moment is part of a continuing dance journey.
            </p>

            <p className="hm-story__description hm-story__description--muted">
              We believe dance is more than learning steps.
              It is about expression, confidence, creativity
              and the courage to own the stage.
            </p>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="hm-story__link"
            >
              <span>Discover Our Journey</span>
              <span className="hm-story__link-arrow" aria-hidden="true">
                ↗
              </span>
            </a>

            <div className="hm-story__signature">
              <span className="hm-story__signature-number">05</span>
              <span>
                <strong>YEARS OF MOVEMENT</strong>
                <small>One passion. Countless moments.</small>
              </span>
            </div>
          </motion.div>

          {/* Real studio photographs */}
          <motion.div
            className="hm-story__visual"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="hm-story__image-main">
              <img
                src="/images/studio-team-1.jpeg"
                alt="HM Dance Studio team together outdoors"
                loading="lazy"
              />

              <div className="hm-story__image-overlay" />

              <div className="hm-story__image-label">
                <span>THE HM COMMUNITY</span>
                <span aria-hidden="true">✳</span>
              </div>
            </div>

            <motion.div
              className="hm-story__image-secondary"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/images/studio-team-2.jpeg"
                alt="HM Dance Studio team celebrating together"
                loading="lazy"
              />
            </motion.div>

            <div className="hm-story__image-index" aria-hidden="true">
              <span>HM</span>
              <span className="hm-story__image-index-line" />
              <span>OUR STORY</span>
            </div>

            <div className="hm-story__image-note">
              <span className="hm-story__note-dot" />
              PASSION IN EVERY MOVE
            </div>
          </motion.div>
        </div>

        {/* Closing signature */}
        <motion.div
          className="hm-story__bottom"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="hm-story__bottom-star">✳</span>
          <p>
            Every dancer has a story.
            <em> This is ours.</em>
          </p>
          <span className="hm-story__bottom-caption">
            HM DANCE STUDIO
          </span>
        </motion.div>
      </div>
    </section>
  );
}
