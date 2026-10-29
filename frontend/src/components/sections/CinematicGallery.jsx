
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./CinematicGallery.css";

const INSTAGRAM_POST = "https://www.instagram.com/p/DeebDmFPpFQ/";
const INSTAGRAM_CHANNEL =
  "https://www.instagram.com/happy_moment_dance_studio";

const galleryItems = [
  {
    src: "/images/studio-team-1.jpeg",
    alt: "HM Dance Studio team together outdoors",
    category: "THE COMMUNITY",
    title: "One team. One passion.",
    shape: "landscape",
  },
  {
    src: "/images/award-trophy.png",
    alt: "Dance team member holding a trophy and certificate",
    category: "RECOGNITION",
    title: "Moments worth remembering.",
    shape: "portrait",
  },
  {
    src: "/images/studio-team-2.jpeg",
    alt: "HM Dance Studio team celebrating together",
    category: "TEAM SPIRIT",
    title: "The energy we share.",
    shape: "landscape",
  },
  {
    src: "/images/award-cheque.jpeg",
    alt: "HM Dance Studio team at an award presentation",
    category: "A PROUD MOMENT",
    title: "A journey in motion.",
    shape: "portrait",
  },
  {
    src: "/images/award-team.jpeg",
    alt: "Dance team with trophies and certificates",
    category: "THE JOURNEY",
    title: "Together, we rise.",
    shape: "landscape",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CinematicGallery() {
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!activeImage) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveImage(null);
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  return (
    <section className="hm-gallery" id="gallery">
      <div className="hm-gallery__container">
        <motion.div
          className="hm-gallery__header"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div>
            <span className="hm-gallery__eyebrow">
              <span />
              THROUGH OUR LENS
            </span>

            <h2 className="hm-gallery__title">
              Not just pictures.
              <br />
              <em>Memories in motion.</em>
            </h2>
          </div>

          <p className="hm-gallery__intro">
            From team moments to the stage, every photograph
            captures a little piece of the HM Dance Studio journey.
          </p>
        </motion.div>

        <div className="hm-gallery__grid">
          {galleryItems.map((item, index) => (
            <motion.button
              key={item.src}
              type="button"
              className={`hm-gallery__item hm-gallery__item--${item.shape}`}
              onClick={() => setActiveImage(item)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: 0.65,
                delay: (index % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-label={`View photo: ${item.title}`}
            >
              <img src={item.src} alt={item.alt} loading="lazy" />

              <span className="hm-gallery__image-overlay" />

              <span className="hm-gallery__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="hm-gallery__expand" aria-hidden="true">
                ↗
              </span>

              <span className="hm-gallery__caption">
                <span>{item.category}</span>
                <strong>{item.title}</strong>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Instagram classroom highlight */}
        <motion.div
          className="hm-gallery__instagram"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="hm-gallery__instagram-mark" aria-hidden="true">
            ◎
          </div>

          <div className="hm-gallery__instagram-copy">
            <span>MORE FROM THE STUDIO</span>
            <h3>Real classes. Real energy.</h3>
            <p>
              See our classroom moments, behind-the-scenes clips
              and updates on Instagram.
            </p>
          </div>

          <a
            href={INSTAGRAM_POST}
            target="_blank"
            rel="noreferrer"
            className="hm-gallery__instagram-link"
          >
            View Classroom Post <span>↗</span>
          </a>

          <a
            href={INSTAGRAM_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="hm-gallery__instagram-profile"
          >
            @happy_moment_dance_studio
          </a>
        </motion.div>
      </div>

      {/* Accessible image lightbox */}
      {activeImage && (
        <div
          className="hm-gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded gallery photo"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            className="hm-gallery__close"
            onClick={() => setActiveImage(null)}
            aria-label="Close image"
          >
            ×
          </button>

          <figure
            className="hm-gallery__lightbox-figure"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={activeImage.src} alt={activeImage.alt} />
            <figcaption>
              <span>{activeImage.category}</span>
              <strong>{activeImage.title}</strong>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
