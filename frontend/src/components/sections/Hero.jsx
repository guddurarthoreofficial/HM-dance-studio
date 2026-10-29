
import { useEffect, useMemo, useRef } from "react";
import "./Hero.css";

const LOGO = "../../images/logo.png";

const REGISTER_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdh3O9bcm18y7ZiPqCA7fYanD7jKLHdoNc9EMPKrKGqaHiHFw/viewform?usp=header";

const WHATSAPP = "https://wa.me/918969664247";

const danceStyles = [
  "Hip Hop",
  "Bollywood",
  "Contemporary",
  "Freestyle",
  "Semi-Classical",
  "Kids Batch",
  "Wedding Choreography",
];

function StageCurtains() {
  return (
    <div className="hm-stage-curtains" aria-hidden="true">
      <div className="hm-stage-curtain hm-stage-curtain--left" />
      <div className="hm-stage-curtain hm-stage-curtain--right" />
    </div>
  );
}

function StageLights() {
  return (
    <>
      <div className="hm-stage-beams" aria-hidden="true">
        <div className="hm-stage-beam hm-stage-beam--gold" />
        <div className="hm-stage-beam hm-stage-beam--wine" />
        <div className="hm-stage-beam hm-stage-beam--red" />
      </div>

      <div className="hm-stage-floor" aria-hidden="true" />

      <div className="hm-stage-ghost" aria-hidden="true">
        HAPPY
        <br />
        MOMENT
      </div>
    </>
  );
}

function GoldDust() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let particles = [];

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      const count = Math.min(70, Math.floor(width / 16));

      particles = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.5 + 0.4,
        speed: Math.random() * 0.0007 + 0.0002,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!reducedMotion) {
          particle.y -= particle.speed;

          if (particle.y < 0) {
            particle.y = 1;
            particle.x = Math.random();
          }
        }

        const x =
          (particle.x +
            Math.sin(time / 2200 + particle.phase) * 0.012) *
          width;

        const y = particle.y * height;
        const opacity = reducedMotion
          ? 0.45
          : 0.25 +
            0.45 *
              Math.abs(
                Math.sin(time / 900 + particle.phase)
              );

        context.beginPath();
        context.fillStyle = `rgba(244, 220, 160, ${opacity})`;
        context.shadowColor = "#d9b25f";
        context.shadowBlur = 8;
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(draw);
      }
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas, {
      passive: true,
    });

    if (!reducedMotion) {
      frameId = window.requestAnimationFrame(draw);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hm-stage-dust"
      aria-hidden="true"
    />
  );
}

function Equalizer() {
  const bars = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: index,
        height: 40 + Math.random() * 60,
        duration: 0.5 + Math.random() * 1.1,
        delay: -(Math.random() * 2),
      })),
    []
  );

  return (
    <div className="hm-stage-equalizer" aria-hidden="true">
      {bars.map((bar) => (
        <i
          key={bar.id}
          style={{
            "--bar-height": `${bar.height}%`,
            "--bar-duration": `${bar.duration}s`,
            "--bar-delay": `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function DanceMarquee() {
  const repeatedStyles = [...danceStyles, ...danceStyles];

  return (
    <div className="hm-stage-marquee" id="styles">
      <div className="hm-stage-track">
        {repeatedStyles.map((style, index) => (
          <span key={`${style}-${index}`}>
            {style}
            <b aria-hidden="true"> ✳ </b>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const ghostRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const handlePointerMove = (event) => {
      if (window.innerWidth < 721) return;

      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      if (logoRef.current) {
        logoRef.current.style.setProperty(
          "--parallax-x",
          `${x * 8}px`
        );
        logoRef.current.style.setProperty(
          "--parallax-y",
          `${y * 8}px`
        );
      }

      if (ghostRef.current) {
        ghostRef.current.style.setProperty(
          "--parallax-x",
          `${x * -12}px`
        );
        ghostRef.current.style.setProperty(
          "--parallax-y",
          `${y * -12}px`
        );
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <>
      <StageCurtains />

      <main className="hm-cinematic-hero" id="home" ref={heroRef}>
        <StageLights />

        <div className="hm-stage-ghost" ref={ghostRef} aria-hidden="true">
          HAPPY
          <br />
          MOMENT
        </div>

        <GoldDust />

        <section className="hm-stage-scene">
          <div className="hm-stage-content">
            <div
              className="hm-stage-logo-wrap hm-stage-fade"
              ref={logoRef}
              style={{ "--delay": "1.45s" }}
            >
              <img
                src={LOGO}
                alt="HM Dance Studio logo"
                fetchPriority="high"
              />
            </div>

            <h1 className="hm-stage-title">
              <span className="hm-stage-title-line">
                <span style={{ "--delay": "1.8s" }}>
                  Find your rhythm.
                </span>
              </span>

              <span className="hm-stage-title-line">
                <span
                  className="hm-stage-title-gold"
                  style={{ "--delay": "2s" }}
                >
                  Own the moment.
                </span>
              </span>
            </h1>

            <p
              className="hm-stage-subtitle hm-stage-fade"
              style={{ "--delay": "2.9s" }}
            >
              Dance, expression and confidence in Motihari.
              <br />
              <strong>
                Where passion becomes performance.
              </strong>
            </p>

            <div
              className="hm-stage-actions hm-stage-fade"
              style={{ "--delay": "3.2s" }}
            >
              <a
                className="hm-stage-button hm-stage-button--gold"
                href={REGISTER_URL}
                target="_blank"
                rel="noreferrer"
              >
                <span>Book a Trial Class</span>
                <span aria-hidden="true">↗</span>
              </a>

              <a
                className="hm-stage-button hm-stage-button--outline"
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
              >
                <span>Chat on WhatsApp</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <Equalizer />

        <a
          className="hm-stage-scroll hm-stage-fade"
          href="#styles"
          style={{ "--delay": "3.7s" }}
        >
          Scroll to discover
        </a>

        <DanceMarquee />
      </main>
    </>
  );
}
