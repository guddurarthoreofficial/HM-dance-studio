import { useEffect, useMemo, useRef, useState } from "react";
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

/* Curtains open once, then are removed from the DOM */
function StageCurtains() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(true);
      return;
    }
    const timer = setTimeout(() => setDone(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div className="hm-stage-curtains" aria-hidden="true">
      <div className="hm-stage-curtain hm-stage-curtain--left" />
      <div className="hm-stage-curtain hm-stage-curtain--right" />
      <div className="hm-stage-valance" />
    </div>
  );
}

function StageLights() {
  return (
    <>
      <div className="hm-stage-floor" aria-hidden="true" />
      <div className="hm-stage-vignette" aria-hidden="true" />
      <div className="hm-stage-grain" aria-hidden="true" />
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

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let frameId = 0;
    let running = true;
    let particles = [];

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

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
      context.shadowColor = "#d9b25f";
      context.shadowBlur = 8;

      for (const p of particles) {
        if (!reducedMotion) {
          p.y -= p.speed;
          if (p.y < 0) {
            p.y = 1;
            p.x = Math.random();
          }
        }

        const x = (p.x + Math.sin(time / 2200 + p.phase) * 0.012) * width;
        const y = p.y * height;
        const opacity = reducedMotion
          ? 0.45
          : 0.25 + 0.45 * Math.abs(Math.sin(time / 900 + p.phase));

        context.beginPath();
        context.fillStyle = `rgba(244, 220, 160, ${opacity})`;
        context.arc(x, y, p.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const loop = (time) => {
      if (!running) return;
      draw(time);
      frameId = window.requestAnimationFrame(loop);
    };

    resizeCanvas();
    draw();
    if (!reducedMotion) frameId = window.requestAnimationFrame(loop);

    /* Pause the animation when the hero is off-screen */
    const observer = new IntersectionObserver(([entry]) => {
      if (reducedMotion) return;
      if (entry.isIntersecting && !running) {
        running = true;
        frameId = window.requestAnimationFrame(loop);
      } else if (!entry.isIntersecting) {
        running = false;
        window.cancelAnimationFrame(frameId);
      }
    });
    observer.observe(canvas);

    window.addEventListener("resize", resizeCanvas, { passive: true });

    return () => {
      running = false;
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="hm-stage-dust" aria-hidden="true" />;
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
  return (
    <div className="hm-stage-marquee" id="styles" aria-label="Dance styles we teach">
      <div className="hm-stage-track">
        {[0, 1].map((copy) => (
          <div className="hm-stage-track-group" key={copy} aria-hidden={copy === 1}>
            {danceStyles.map((style) => (
              <span key={`${copy}-${style}`}>
                {style}
                <b aria-hidden="true">✳</b>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const logoRef = useRef(null);

  /* Cursor spotlight + subtle logo parallax (desktop only) */
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hero = heroRef.current;
    if (reducedMotion || !hero) return;

    let raf = 0;

    const handlePointerMove = (event) => {
      if (window.innerWidth < 721) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;

        hero.style.setProperty("--spot-x", `${px * 100}%`);
        hero.style.setProperty("--spot-y", `${py * 100}%`);

        if (logoRef.current) {
          logoRef.current.style.setProperty("--parallax-x", `${(px - 0.5) * 16}px`);
          logoRef.current.style.setProperty("--parallax-y", `${(py - 0.5) * 16}px`);
        }
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <>
      <StageCurtains />

      <main className="hm-cinematic-hero" id="home" ref={heroRef}>
        <StageLights />
        <div className="hm-stage-spotlight" aria-hidden="true" />
        <GoldDust />

        <section className="hm-stage-scene">
          <div className="hm-stage-content">
            <div
              className="hm-stage-logo-wrap hm-stage-fade"
              ref={logoRef}
              style={{ "--delay": "1.45s" }}
            >
              <img src={LOGO} alt="HM Dance Studio logo" fetchPriority="high" />
            </div>

            <h1 className="hm-stage-title">
              <span className="hm-stage-title-line">
                <span style={{ "--delay": "1.8s" }}>Find your rhythm.</span>
              </span>
              <span className="hm-stage-title-line">
                <span className="hm-stage-title-gold" style={{ "--delay": "2s" }}>
                  Own the moment.
                </span>
              </span>
            </h1>

            <p className="hm-stage-subtitle hm-stage-fade" style={{ "--delay": "2.9s" }}>
              Dance, expression and confidence in Motihari.
              <br />
              <strong>Where passion becomes performance.</strong>
            </p>

            <div className="hm-stage-actions hm-stage-fade" style={{ "--delay": "3.2s" }}>
              <a
                className="hm-stage-button hm-stage-button--gold"
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Book a Trial Class</span>
                <span aria-hidden="true">↗</span>
              </a>

              <a
                className="hm-stage-button hm-stage-button--outline"
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
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