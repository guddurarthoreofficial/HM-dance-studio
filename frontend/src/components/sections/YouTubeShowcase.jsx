
import { useState } from "react";
import { motion } from "framer-motion";
import "./YouTubeShowcase.css";

const VIDEO_ID = "Co3A_WvKJU8";
const CHANNEL_URL = "https://www.youtube.com/@hm_dance_studio";

export default function YouTubeShowcase() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="hm-youtube" id="performances">
      <div className="hm-youtube__container">
        <motion.div
          className="hm-youtube__heading"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hm-youtube__eyebrow">
            <span />
            FROM THE STUDIO TO THE STAGE
          </span>

          <div className="hm-youtube__heading-row">
            <h2 className="hm-youtube__title">
              Feel the beat.
              <br />
              <em>Watch the moves.</em>
            </h2>

            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="hm-youtube__channel-link"
            >
              <span className="hm-youtube__youtube-icon">▶</span>
              <span>
                <strong>HM Dance Studio</strong>
                <small>VISIT OUR YOUTUBE CHANNEL ↗</small>
              </span>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hm-youtube__feature"
          initial={{ opacity: 0, y: 38 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hm-youtube__player">
            {playing ? (
              <iframe
                className="hm-youtube__iframe"
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                title="HM Dance Studio performance video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className="hm-youtube__poster"
                onClick={() => setPlaying(true)}
                aria-label="Play HM Dance Studio performance video"
              >
                <img
                  src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
                  alt="Preview of HM Dance Studio's YouTube performance"
                  loading="lazy"
                />

                <span className="hm-youtube__poster-shade" />

                <span className="hm-youtube__play">
                  <span aria-hidden="true">▶</span>
                </span>

                <span className="hm-youtube__poster-label">
                  <span className="hm-youtube__live-dot" />
                  WATCH THE PERFORMANCE
                </span>

                <span className="hm-youtube__poster-corner">
                  HM / FILM 001
                </span>
              </button>
            )}
          </div>

          <div className="hm-youtube__caption">
            <div className="hm-youtube__caption-copy">
              <span className="hm-youtube__caption-eyebrow">
                FEATURED PERFORMANCE
              </span>
              <h3>A moment from our dance journey.</h3>
              <p>
                Watch our performance, feel the energy and explore
                more videos from HM Dance Studio.
              </p>
            </div>

            <a
              href={`https://youtu.be/${VIDEO_ID}`}
              target="_blank"
              rel="noreferrer"
              className="hm-youtube__watch-link"
            >
              Watch on YouTube <span aria-hidden="true">↗</span>
            </a>
          </div>
        </motion.div>

        <div className="hm-youtube__bottom">
          <span>REAL PEOPLE. REAL PERFORMANCES.</span>
          <span className="hm-youtube__bottom-star">✳</span>
          <a href={CHANNEL_URL} target="_blank" rel="noreferrer">
            EXPLORE THE CHANNEL ↗
          </a>
        </div>
      </div>
    </section>
  );
}
