import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { MagneticButton } from "./Primitives";
import { useScramble } from "../lib/useScramble";


gsap.registerPlugin(ScrollTrigger);


const NAV = [
  { label: "Hardware", href: "#hardware" },
  { label: "Security", href: "#security" },
  { label: "Deploy", href: "#deploy" },
  { label: "Engineers", href: "#engineers" },
];

/* =====================================================================
   NAVBAR — frosted obsidian, single-pixel edge, laser contact CTA
===================================================================== */
export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 py-3 sm:px-5">
      <nav
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl px-4 transition-all duration-500 ease-expo sm:px-6 ${
          scrolled ? "obsidian hw-edge border border-white/[0.06]" : "border border-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
            <picture className="contents">
              <source srcSet="/vaultprint-logo-mark.avif" type="image/avif" />
              <source srcSet="/vaultprint-logo-mark.webp" type="image/webp" />
              <img
                src="/vaultprint-logo-mark.png"
                alt=""
                width="158"
                height="158"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>

          </span>

          <span className="font-display text-lg font-semibold tracking-tight text-white">VaultPrint</span>
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash transition-colors duration-300 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <MagneticButton
          href="#deploy"
          strength={0.5}
          className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-laser/40 hover:text-laser lg:inline-flex"
        >
          Contact Sales
        </MagneticButton>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl obsidian hw-edge border border-white/[0.06] p-4 lg:hidden">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ash hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#deploy"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg border border-laser/30 px-3 py-3 text-center font-mono text-xs uppercase tracking-[0.16em] text-laser"
          >
            Contact Sales
          </a>
        </div>
      )}
    </header>
  );
}

/* =====================================================================
   SCENE 1 — HERO / THE UNVEILING
===================================================================== */
export function Hero() {
  const headline = useScramble("Printing infrastructure, finally in the 21st century.", {
    speed: 32,
    revealEvery: 1,
  });

  const sceneRef = useRef(null);
  const imgRef = useRef(null);
  const ringsRef = useRef(null);
  const glowRef = useRef(null);

  // Interactive parallax + tilt driven by pointer position.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    const state = { tx: 0, ty: 0, rx: 0, ry: 0, cx: 0, cy: 0 };
    const target = { tx: 0, ty: 0, rx: 0, ry: 0, cx: 0, cy: 0 };

    // Cache the scene rect (batched READ) instead of measuring every mousemove.
    // This eliminates layout thrashing / forced reflows on the pointer path.
    let rect = scene.getBoundingClientRect();
    const measure = () => { rect = scene.getBoundingClientRect(); };
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });

    const onMove = (e) => {
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      target.tx = px * 40; // image drift px
      target.ty = py * 26;
      target.ry = px * 10; // tilt deg
      target.rx = -py * 8;
      target.cx = px * -60; // rings counter-drift
      target.cy = py * -40;
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    };

    const onLeave = () => {
      target.tx = target.ty = target.rx = target.ry = target.cx = target.cy = 0;
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    };

    // Pure WRITE loop — only transforms, never reads layout. Auto-parks when idle.
    const tick = () => {
      const k = 0.08;
      let moving = false;
      for (const key of Object.keys(state)) {
        state[key] += (target[key] - state[key]) * k;
        if (Math.abs(target[key] - state[key]) > 0.01) moving = true;
      }
      if (imgRef.current) {
        imgRef.current.style.transform = `translate3d(${state.tx}px, ${state.ty}px, 0) rotateX(${state.rx}deg) rotateY(${state.ry}deg)`;
      }
      if (ringsRef.current) {
        ringsRef.current.style.transform = `translate3d(${state.cx}px, ${state.cy}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${state.tx * 0.6}px, ${state.ty * 0.6}px, 0)`;
      }
      if (moving) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false; // park the loop when settled — saves battery/CPU
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    scene.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      scene.removeEventListener("mouseleave", onLeave);
    };
  }, []);


  return (
    <section
      id="top"
      ref={sceneRef}
      className="relative flex h-[100svh] max-h-[100svh] flex-col items-center overflow-hidden bg-[#02060b] [perspective:1400px]"
    >
      {/* Cool cyan ambient glow — ties the hero to the laser accent + logo */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(0,240,255,0.12)_0%,transparent_55%)]" />

      {/* Concentric glowing rings that cradle the printer */}
      <div
        ref={ringsRef}
        className="pointer-events-none absolute left-1/2 top-[72%] z-[1] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        {[420, 620, 840, 1080].map((d, i) => (
          <span
            key={d}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{
              width: `${d}px`,
              height: `${d}px`,
              borderColor: `rgba(0,240,255,${0.35 - i * 0.06})`,
              boxShadow:
                i === 0
                  ? "0 0 80px rgba(0,240,255,0.30), inset 0 0 50px rgba(0,240,255,0.14)"
                  : "0 0 40px rgba(0,240,255,0.08)",
            }}
          />
        ))}
        {/* Soft cyan bloom behind the unit */}
        <span
          ref={glowRef}
          className="absolute left-1/2 top-1/2 h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-laser/[0.12] blur-[120px] will-change-transform"
        />
      </div>

      {/* -------- Content -------- */}
      <div className="relative z-20 mx-auto w-full max-w-5xl px-4 pt-24 text-center sm:px-6 lg:pt-28">

        <h1 className="mx-auto max-w-4xl font-display text-[2.3rem] font-semibold leading-[0.98] tracking-hero text-white sm:text-5xl lg:text-[4.2rem]">
          {headline}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ash sm:text-base lg:text-lg">
          VaultPrint deploys AES-256 encrypted, zero-trace self-service print kiosks for campuses, workspaces,
          and enterprises. Hardware you own. Security you can audit. Zero maintenance overhead.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticButton
            href="#hardware"
            sweep
            strength={0.45}
            className="group inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-tight text-black transition-transform duration-500 ease-spring hover:scale-[1.02]"
          >
            Inspect the Hardware
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>
          <MagneticButton
            href="#security"
            strength={0.35}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold tracking-tight text-white transition-colors duration-300 hover:border-laser/40 hover:text-laser"
          >
            Review Security Model
          </MagneticButton>
        </div>
      </div>

      {/* -------- Interactive printer — height-constrained so it fits without page overflow -------- */}
      <div className="pointer-events-none relative z-10 -mt-8 flex w-full min-h-0 flex-1 items-center justify-center overflow-hidden [transform-style:preserve-3d]">
        <picture className="contents">
          <source srcSet="/vaultprint-kiosk.avif" type="image/avif" />
          <source srcSet="/vaultprint-kiosk.webp" type="image/webp" />
          <img
            ref={imgRef}
            src="/vaultprint-kiosk.png"

            alt="VaultPrint secure print kiosk"
            width="1536"
            height="1024"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            className="h-full w-auto min-w-[640px] max-w-none select-none object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.65)] will-change-transform"
            draggable={false}
          />
        </picture>

      </div>



      {/* -------- Live spec ticker docked at the base -------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
        {/* Blend the base of the image into the section */}
        <div className="h-20 bg-gradient-to-b from-transparent to-[#02060b]" />
        <div className="mx-auto w-full max-w-4xl px-4 pb-6 sm:px-6">

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] font-mono backdrop-blur-md sm:grid-cols-4">
            {[
              ["ENCRYPTION", "AES-256"],
              ["TRACE", "ZERO"],
              ["UPTIME", "99.98%"],
              ["DEPLOY", "< 30 MIN"],
            ].map(([k, v]) => (
              <div key={k} className="bg-black/50 px-4 py-3.5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-ash">{k}</p>
                <p className="mt-1 text-base font-medium tracking-tight text-white sm:text-lg">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



/* =====================================================================
   SCENE 2 — SOCIAL PROOF / THE SILENT ENDORSEMENT
===================================================================== */
const DEPLOYMENTS = [
  "BIT MESRA",
  "LAUNCHPAD",
  "NORTHGATE WORKSPACES",
  "MERIDIAN CAMPUS",
  "AXIOM LABS",
  "STATION F",
  "CIVIC LIBRARY NETWORK",
  "HELIX BUSINESS PARK",
];

export function Marquee() {
  return (
    <section className="relative border-y border-white/[0.05] bg-black py-14">
      <div className="mx-auto mb-8 max-w-6xl px-4 sm:px-6">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.28em] text-ash">
          Trusted to secure document output across
        </p>
      </div>
      <div className="mask-x relative flex overflow-hidden">
        <div className="flex shrink-0 animate-none" style={{ animation: "vp-marquee 38s linear infinite" }}>
          {[...DEPLOYMENTS, ...DEPLOYMENTS].map((name, i) => (
            <span
              key={i}
              className="mx-10 whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-white/25 transition-colors duration-500 hover:text-white/60 sm:text-3xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes vp-marquee{to{transform:translateX(-50%)}}`}</style>
    </section>
  );
}

/* =====================================================================
   SCENE 3 — THE PROBLEM / HIGH CONTRAST REALITY
===================================================================== */
const GLITCH_WORDS = ["Broken.", "Unsecure.", "Expensive.", "Obsolete."];

export function Problem() {
  const root = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      wordsRef.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -40, skewX: 8 },
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            ease: "power4.out",
            duration: 0.7,
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
            },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-[#eef3f7] py-28 text-[#0a1420] md:py-36"
    >
      {/* Cool blue wash so the section reads on-brand rather than stark white */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_-10%,rgba(0,157,180,0.14)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-[55vh] w-[55vh] rounded-full bg-laser/[0.10] blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#0a1420]/50">
          [ 01 — The legacy reality ]
        </p>
        <h2 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-hero sm:text-6xl lg:text-7xl">
          Institutional printing is a headache no one signed up for.
        </h2>


        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {GLITCH_WORDS.map((w, i) => (
              <span
                key={w}
                ref={(n) => (wordsRef.current[i] = n)}
                className="chromatic font-display text-5xl font-black tracking-hero sm:text-7xl lg:text-8xl"
              >
                {w}
              </span>
            ))}
          </div>

          <div className="space-y-6 border-l border-[#0a1420]/15 pl-6">

            {[
              [
                "Jammed queues, dead toner",
                "Shared printers fail at peak load. Students and staff lose hours to hardware that was obsolete a decade ago.",
              ],
              [
                "Documents on open networks",
                "Legacy print servers cache sensitive files in plaintext, exposing records, contracts, and IDs to anyone on the LAN.",
              ],
              [
                "Uncapped maintenance spend",
                "Toner contracts, service calls, and staff supervision quietly compound into one of the least-audited line items on campus.",
              ],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 className="font-display text-xl font-bold tracking-tight">{t}</h3>
                <p className="mt-2 max-w-md text-base leading-relaxed text-[#0a1420]/60">{d}</p>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
