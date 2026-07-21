import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMagnetic } from "../lib/useMagnetic";

/* ----------------------------------------------------------------
   NoiseOverlay — animated SVG film grain across the whole site.
   mix-blend-mode: overlay at low opacity gives physical grit.
   Grain speeds up when `energized` is true (footer urgency).
---------------------------------------------------------------- */
export function NoiseOverlay({ energized = false }) {
  return (
    <div className="grain-overlay" aria-hidden="true">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="vp-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          >
            <animate
              attributeName="baseFrequency"
              dur={energized ? "0.35s" : "1.1s"}
              values="0.82;0.92;0.82"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#vp-grain)" />
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------
   Cursor — laser dot + spring-lagged ring. Difference blend so it
   reads on both black and the harsh white Problem scene.
---------------------------------------------------------------- */
export function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    const move = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const over = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover']")) {
        gsap.to(ring.current, { width: 56, height: 56, borderColor: "rgba(0,240,255,0.9)", duration: 0.3 });
      }
    };
    const out = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover']")) {
        gsap.to(ring.current, { width: 34, height: 34, borderColor: "rgba(0,240,255,0.4)", duration: 0.3 });
      }
    };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/* ----------------------------------------------------------------
   MagneticButton — cursor-pulled button with optional conic sweep.
---------------------------------------------------------------- */
export function MagneticButton({
  as = "a",
  children,
  className = "",
  sweep = false,
  strength = 0.4,
  ...props
}) {
  const ref = useMagnetic(strength);
  const Comp = as;
  return (
    <Comp
      ref={ref}
      data-cursor="hover"
      className={`${sweep ? "cta-sweep " : ""}${className}`}
      {...props}
    >
      <span className="pointer-events-none inline-flex items-center gap-2">{children}</span>
    </Comp>
  );
}
