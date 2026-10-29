
import { motion } from "framer-motion";
import "./AchievementsShowcase.css";

const photos = [
  {
    image: "/images/award-trophy.png",
    alt: "HM Dance Studio team member with trophy and certificate",
    label: "TROPHY & CERTIFICATE",
    number: "01",
    featured: true,
  },
  {
    image: "/images/award-cheque.jpeg",
    alt: "HM Dance Studio team at an award presentation",
    label: "A MOMENT OF RECOGNITION",
    number: "02",
  },
  {
    image: "/images/award-team.jpeg",
    alt: "HM Dance Studio team celebrating with trophies and certificates",
    label: "TOGETHER ON STAGE",
    number: "03",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function AchievementsShowcase() {
  return (
    <section className="hm-awards" id="achievements">
      <div className="hm-awards__container">
        <motion.div
          className="hm-awards__heading"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div>
            <span className="hm-awards__eyebrow">
              <span />
              THE JOURNEY. THE RECOGNITION.
            </span>

            <h2 className="hm-awards__title">
              Moments that
              <br />
              <em>mean more.</em>
            </h2>
          </div>

          <p className="hm-awards__intro">
            Every stage brings a new experience. Every
            achievement becomes a memory worth celebrating.
            Here are a few moments from our journey.
          </p>
        </motion.div>

        <div className="hm-awards__grid">
          {photos.map((photo, index) => (
            <motion.article
              key={photo.image}
              className={`hm-awards__card ${
                photo.featured ? "hm-awards__card--featured" : ""
              }`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="hm-awards__image">
                <img
                  src={photo.image}
                  alt={photo.alt}
                  loading="lazy"
                />

                <div className="hm-awards__image-shade" />

                <span className="hm-awards__photo-number">
                  {photo.number}
                </span>

                <span className="hm-awards__photo-symbol">
                  ✳
                </span>
              </div>

              <div className="hm-awards__card-caption">
                <span>{photo.label}</span>
                <span aria-hidden="true">↗</span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="hm-awards__footer"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="hm-awards__footer-copy">
            <span className="hm-awards__eyebrow">
              OUR STORY CONTINUES
            </span>

            <p>
              The best part of the journey is
              <em> what comes next.</em>
            </p>
          </div>

          <a
            href="https://www.instagram.com/happy_moment_dance_studio"
            target="_blank"
            rel="noreferrer"
            className="hm-awards__link"
          >
            <span>More Studio Moments</span>
            <span className="hm-awards__link-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
