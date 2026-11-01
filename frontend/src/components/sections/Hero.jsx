
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const LOGO = "../../images/logo.png";

const WHATSAPP = "https://wa.me/918969664247";

const GOLD = [244, 206, 120];

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;

const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function Hero() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  const [stage, setStage] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!section || !pin || !ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let last = performance.now();
    let t = 0;
    let target = 0;
    let p = 0;

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const cur = { stage: 1 };
    const ring = { x: 0, y: 0 };

    const ribbons = Array.from({ length: 6 }, (_, i) => ({
      a: 0.55 + i * 0.17,
      b: 0.7 + i * 0.13,
      c: 0.9 + i * 0.11,
      ph: i * 1.07,
      w: 2.8 - i * 0.24,
      pts: [],
    }));

    const TAIL = 90;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      w = rect.width;
      h = rect.height;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      readScroll();

      if (reduced) draw();
    };

    const readScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(rect.height - window.innerHeight, 1);

      target = clamp(-rect.top / total);
    };

    /* Writes scroll-driven CSS variables + stage state */
    const apply = () => {
      const s1 = clamp(p / 0.4);
      const v3 = smooth(0.4, 0.7, p);

      pin.style.setProperty("--s1", s1.toFixed(4));
      pin.style.setProperty("--v3", v3.toFixed(4));

      const st = p < 0.5 ? 1 : 3;

      if (st !== cur.stage) {
        cur.stage = st;
        setStage(st);
      }
    };

    const step = (dt) => {
      mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3);
      mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3);

      const s2 =
        smooth(0.1, 0.4, p) * (1 - smooth(0.5, 0.75, p));

      const k = smooth(0.5, 0.85, p);

      t += dt * (0.8 + 0.9 * s2);

      if (k > 0.01 && logoRef.current) {
        const lr = logoRef.current.getBoundingClientRect();
        const pr = pin.getBoundingClientRect();

        ring.x = lr.left - pr.left + lr.width / 2;
        ring.y = lr.top - pr.top + lr.height / 2;
      }

      const R0 = Math.min(w * 0.46, 175);

      ribbons.forEach((r, i) => {
        const fx =
          Math.sin(t * r.a + r.ph) * w * (0.42 + 0.06 * s2);

        const fy =
          Math.sin(t * r.b + r.ph * 1.7) * h * (0.3 + 0.12 * s2);

        const ang = t * r.c + r.ph;
        const R = R0 + i * 7;

        const rx = Math.cos(ang) * R * 1.12;
        const ry = Math.sin(ang) * R * 0.92;

        const px = (mouse.x - 0.5) * w * 0.12 * (1 - k);
        const py = (mouse.y - 0.5) * h * 0.1 * (1 - k);

        const x = lerp(w / 2 + fx + px, ring.x + rx, k);
        const y = lerp(h / 2 + fy + py, ring.y + ry, k);

        r.pts.push({ x, y });

        if (r.pts.length > TAIL) r.pts.shift();
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const a = GOLD.join(",");
      const palette = [
        a,
        "255,236,190",
        a,
        "205,62,84",
        "255,248,230",
        a,
      ];

      ribbons.forEach((r, i) => {
        const n = r.pts.length;
        const col = palette[i];

        for (let j = 1; j < n; j++) {
          const f = j / n;
          const al = f * f;

          const p0 = r.pts[j - 1];
          const p1 = r.pts[j];

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);

          ctx.strokeStyle = `rgba(${col},${al * 0.16})`;
          ctx.lineWidth = r.w * 7 * f;
          ctx.stroke();

          ctx.strokeStyle = `rgba(${col},${al * 0.9})`;
          ctx.lineWidth = r.w * f + 0.3;
          ctx.stroke();
        }
      });

      ctx.globalCompositeOperation = "source-over";
    };

    const frame = (now) => {
      if (!running) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      p += (target - p) * Math.min(1, dt * 7);

      apply();
      step(dt);
      draw();

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced) return;

      running = true;
      last = performance.now();

      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e) => {
      if (window.innerWidth < 721) return;

      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;

      pin.style.setProperty("--mx", `${mouse.tx * 100}%`);
      pin.style.setProperty("--my", `${mouse.ty * 100}%`);
    };

    resize();

    p = target;
    apply();

    for (let i = 0; i < TAIL + 10; i++) {
      step(0.016);
    }

    if (reduced) {
      draw();
    } else {
      window.addEventListener("scroll", readScroll, {
        passive: true,
      });

      window.addEventListener("pointermove", onPointer, {
        passive: true,
      });
    }

    window.addEventListener("resize", resize, {
      passive: true,
    });

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });

    io.observe(section);

    return () => {
      stop();
      io.disconnect();

      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="hmx" id="home" ref={sectionRef}>
      <div className="hmx-pin" ref={pinRef} data-stage={stage}>
        {/* Atmosphere */}
        <div className="hmx-beam hmx-beam--l" aria-hidden="true" />
        <div className="hmx-beam hmx-beam--r" aria-hidden="true" />
        <div className="hmx-floor" aria-hidden="true" />
        <div className="hmx-cursor" aria-hidden="true" />
        <canvas className="hmx-trails" ref={canvasRef} aria-hidden="true" />
        <div className="hmx-vignette" aria-hidden="true" />
        <div className="hmx-grain" aria-hidden="true" />

        {/* Intro */}
        <div className="hmx-stage hmx-intro">
          <div className="hmx-intro-inner">
            <h1 className="hmx-title">
              <span className="hmx-line hmx-line--l">
                <span className="hmx-mask">
                  <span style={{ "--d": "0.4s" }}>
                    Find your rhythm.
                  </span>
                </span>
              </span>

              <span className="hmx-line hmx-line--r">
                <span className="hmx-mask">
                  <span
                    className="hmx-gold"
                    style={{ "--d": "0.65s" }}
                  >
                    Own the stage.
                  </span>
                </span>
              </span>
            </h1>

            <div className="hmx-intro-copy">
              <p className="hmx-sub" style={{ "--d": "1.3s" }}>
                HM Dance Studio, Motihari. Hip hop, Bollywood,
                contemporary and more, taught by people who love to move.
              </p>

              <div className="hmx-actions" style={{ "--d": "1.55s" }}>
                <Link
                  className="hmx-btn hmx-btn--gold"
                  to="/register"
                >
                  <span>Book a trial class</span>
                  <span aria-hidden="true">↗</span>
                </Link>

                <a
                  className="hmx-btn hmx-btn--ghost"
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Chat on WhatsApp</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

          <div
            className="hmx-cue"
            style={{ "--d": "2.1s" }}
            aria-hidden="true"
          >
            <span>Scroll</span>
            <i />
          </div>
        </div>

        {/* Outro */}
        <div className="hmx-stage hmx-outro">
          <div className="hmx-outro-inner">
            <div className="hmx-logo" ref={logoRef}>
              <img src={LOGO} alt="HM Dance Studio logo" />
            </div>

            <h2 className="hmx-outro-title">
              Ready when you are.
            </h2>

            <p className="hmx-sub">
              Book a trial class and see where the music takes you.
            </p>

            <div className="hmx-actions">
              <Link
                className="hmx-btn hmx-btn--gold"
                to="/register"
              >
                <span>Book a trial class</span>
                <span aria-hidden="true">↗</span>
              </Link>

              <a
                className="hmx-btn hmx-btn--ghost"
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Chat on WhatsApp</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
