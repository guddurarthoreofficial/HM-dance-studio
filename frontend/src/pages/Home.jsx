
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Hero from "../components/sections/Hero";
import StudioStory from "../components/sections/StudioStory";
import AchievementsShowcase from "../components/sections/AchievementsShowcase";
import YouTubeShowcase from "../components/sections/YouTubeShowcase";
import CinematicGallery from "../components/sections/CinematicGallery";

// Dance styles offered by HM Dance Studio
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

// HM Dance Studio structured data for search engines
const studioSchema = {
  "@context": "https://schema.org",
  "@type": "DanceSchool",
  "@id": "https://hmdance.shiulitech.in/#business",
  name: "HM Dance Studio",
  description:
    "HM Dance Studio offers Hip Hop, Bollywood, Contemporary, Semi Classical, Freestyle, Kids Dance, Yoga and Exercise classes in Motihari, Bihar.",
  url: "https://hmdance.shiulitech.in/",
  logo: "https://cdn.corenexis.com/f/ksZssilhH2u.png",
  image: "https://cdn.corenexis.com/f/ksZssilhH2u.png",

  telephone: [
    "+917488806350",
    "+919006002329",
  ],

  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Chandmari Golamber, Near Hanuman Mandir",
    addressLocality: "Motihari",
    addressRegion: "Bihar",
    postalCode: "845401",
    addressCountry: "IN",
  },

  sameAs: [
    "https://www.instagram.com/happy_moment_dance_studio",
    "https://www.youtube.com/@hm_dance_studio",
  ],
};

export default function Home() {
  return (
    <>
      {/* Homepage SEO */}
      <Helmet>
        <title>
          HM Dance Studio Motihari | Dance Classes in Motihari
        </title>

        <meta
          name="description"
          content="Join HM Dance Studio in Motihari, Bihar. Learn Hip Hop, Bollywood, Contemporary, Semi Classical, Freestyle and Kids Dance. Discover your passion for dance and book your free trial class!"
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href="https://hmdance.shiulitech.in/"
        />

        {/* Open Graph SEO */}
        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:site_name"
          content="HM Dance Studio"
        />

        <meta
          property="og:title"
          content="HM Dance Studio Motihari | Dance Classes"
        />

        <meta
          property="og:description"
          content="Where passion becomes performance. Explore dance classes at HM Dance Studio, Motihari, Bihar."
        />

        <meta
          property="og:url"
          content="https://hmdance.shiulitech.in/"
        />

        <meta
          property="og:image"
          content="https://cdn.corenexis.com/f/ksZssilhH2u.png"
        />

        {/* Twitter SEO */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="HM Dance Studio Motihari"
        />

        <meta
          name="twitter:description"
          content="Explore dance classes at HM Dance Studio in Motihari, Bihar."
        />

        <meta
          name="twitter:image"
          content="https://cdn.corenexis.com/f/ksZssilhH2u.png"
        />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(studioSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <Hero />

      {/* Studio Story & Community */}
      <StudioStory />

      {/* Dance Styles Section */}
      <section
        className="hm-home-more"
        id="dance-styles"
      >
        <div className="hm-home-more__top">
          <span className="hm-page-kicker">
            <span /> FIND YOUR MOVEMENT
          </span>

          <span className="hm-home-more__index">
            01 — 08
          </span>
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

            <Link
              to="/programs"
              className="hm-outline-link"
            >
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

              <span className="hm-style-list__name">
                {style}
              </span>

              <span className="hm-style-list__arrow">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Achievements & Trophy Showcase */}
      <AchievementsShowcase />

      {/* YouTube Performance Showcase */}
      <YouTubeShowcase />

      {/* Cinematic Gallery */}
      <CinematicGallery />
    </>
  );
}
