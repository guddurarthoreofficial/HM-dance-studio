import { Link } from "react-router-dom";
import Hero from "../components/sections/Hero";
import StudioStory from "../components/sections/StudioStory";
import AchievementsShowcase from "../components/sections/AchievementsShowcase";
import YouTubeShowcase from "../components/sections/YouTubeShowcase";
import CinematicGallery from "../components/sections/CinematicGallery";

const styles = [
  "Hip Hop",
  "Bollywood",
  "Contemporary",
  "Semi Classical",
  "Free Style",
  "Kids Dance",
  "Yoga",
  "Exercise",
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Module 1: Studio Story & Community */}
      <StudioStory />

      {/* Existing Module: Dance Styles */}
      <section className="hm-home-more" id="dance-styles">
        <div className="hm-home-more__top">
          <span className="hm-page-kicker">
            <span /> FIND YOUR MOVEMENT
          </span>

          <span className="hm-home-more__index">01 — 08</span>
        </div>

        <div className="hm-home-more__layout">
          <div>
            <h2>
              Every style.
              <br />
              <em>Your expression.</em>
            </h2>
          </div>

          <div className="hm-home-more__right">
            <p>
              Discover a style that fits your energy, find your
              confidence and make every move count.
            </p>

            <Link to="/programs" className="hm-outline-link">
              Explore all classes <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="hm-style-list">
          {styles.map((style, index) => (
            <Link
              to="/programs"
              className="hm-style-list__item"
              key={style}
            >
              <span className="hm-style-list__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="hm-style-list__name">{style}</span>
              <span className="hm-style-list__arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>
      {/* Module 2: Achievements & Trophy Showcase */}
      <AchievementsShowcase />
      {/* Module 3: YouTube Performance Showcase */}
      <YouTubeShowcase />

      <CinematicGallery />
    </>
  );
}