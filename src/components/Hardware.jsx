import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 4 — Exploded View Scroll-Jack.
 * The kiosk is pinned center-stage. As the user scrolls, its component
 * layers separate along the Z-axis while single-pixel leader lines draw
 * out to crisp monospace technical specs.
 */
const LAYERS = [
  {
    id: "tray",
    name: "Secure Output Tray",
    code: "VP-TRAY-04",
    specs: [
      ["Access", "Token-gated release"],
      ["Capacity", "500-sheet secure bin"],
      ["Sensor", "Optical jam + tamper"],
    ],
    color: "#3a3a40",
  },
  {
    id: "compute",
    name: "Compute Module",
    code: "VP-CM-11",
    specs: [
      ["SoC", "ARM Cortex-A78 · 6-core"],
      ["Memory", "8 GB LPDDR5 ECC"],
      ["OS", "Hardened Linux · signed boot"],
    ],
    color: "#4a4a52",
  },
  {
    id: "aes",
    name: "AES Security Chip",
    code: "VP-SEC-256",
    specs: [
      ["Cipher", "AES-256-GCM hardware"],
      ["Keys", "TPM 2.0 · secure element"],
      ["Wipe", "Instant zeroization"],
    ],
    color: "#00323a",
  },
];

export function Hardware() {
  const root = useRef(null);
  const pin = useRef(null);
  const layerRefs = useRef([]);
  const specRefs = useRef([]);
  const progressRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Initial stacked state
      gsap.set(layerRefs.current, { yPercent: 0, z: 0 });
      gsap.set(specRefs.current, { autoAlpha: 0, x: (i) => (i % 2 === 0 ? -30 : 30) });

      if (prefersReduced) {
        gsap.set(layerRefs.current, {
          yPercent: (i) => (i - 1) * -46,
          scale: 0.9,
        });
        gsap.set(specRefs.current, { autoAlpha: 1, x: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=2600",
          scrub: 1,
          pin: pin.current,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // Explode layers apart on the Z / Y axis
      tl.to(
        layerRefs.current,
        {
          yPercent: (i) => (i - 1) * -52,
          scale: 0.86,
          rotateX: 6,
          ease: "power2.inOut",
          stagger: 0.08,
          duration: 1,
        },
        0,
      );

      // Reveal each spec block + leader line as its layer arrives
      specRefs.current.forEach((el, i) => {
        tl.to(
          el,
          { autoAlpha: 1, x: 0, ease: "power3.out", duration: 0.5 },
          0.25 + i * 0.22,
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hardware" ref={root} className="relative bg-titanium">
      <div ref={pin} className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* Grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(circle at 50% 50%, black, transparent 78%)",
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
          {/* Left specs */}
          <div className="order-2 space-y-10 lg:order-1">
            <div
              ref={(n) => (specRefs.current[0] = n)}
              className="ml-auto max-w-xs text-right"
            >
              <SpecBlock layer={LAYERS[0]} side="left" />
            </div>
            <div
              ref={(n) => (specRefs.current[2] = n)}
              className="ml-auto max-w-xs text-right"
            >
              <SpecBlock layer={LAYERS[2]} side="left" />
            </div>
          </div>

          {/* Exploded stack */}
          <div className="order-1 flex flex-col items-center justify-center gap-1 py-6 lg:order-2 [perspective:1200px]">
            {LAYERS.map((layer, i) => (
              <div
                key={layer.id}
                ref={(n) => (layerRefs.current[i] = n)}
                className="relative flex h-24 w-56 items-center justify-center rounded-xl border border-white/10 hw-edge sm:h-28 sm:w-72"
                style={{
                  background: `linear-gradient(145deg, ${layer.color}, #0a0a0c)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
                  {layer.code}
                </span>
                {layer.id === "aes" && (
                  <span className="absolute inset-x-6 bottom-3 h-px bg-laser/70" />
                )}
              </div>
            ))}
          </div>

          {/* Right spec (compute) + heading */}
          <div className="order-3 space-y-10">
            <div className="max-w-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-laser">
                [ 02 — The hardware ]
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.02] tracking-hero text-white sm:text-4xl">
                Engineered layer by layer.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ash">
                Scroll to separate the VaultPrint kiosk into its three security-critical
                subsystems. Every layer is field-serviceable and cryptographically attested.
              </p>
            </div>
            <div ref={(n) => (specRefs.current[1] = n)} className="max-w-xs">
              <SpecBlock layer={LAYERS[1]} side="right" />
            </div>
          </div>
        </div>

        {/* Progress rail */}
        <div className="absolute bottom-8 left-1/2 h-px w-40 -translate-x-1/2 overflow-hidden bg-white/10">
          <div ref={progressRef} className="h-full w-0 bg-laser" />
        </div>
      </div>
    </section>
  );
}

function SpecBlock({ layer, side }) {
  return (
    <div
      className={`rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 ${
        side === "left" ? "text-right" : "text-left"
      }`}
    >
      <div className={`flex items-center gap-2 ${side === "left" ? "justify-end" : ""}`}>
        <span className="h-1 w-1 rounded-full bg-laser" />
        <h3 className="font-display text-base font-semibold tracking-tight text-white">
          {layer.name}
        </h3>
      </div>
      <dl className="mt-3 space-y-1.5 font-mono text-[11px]">
        {layer.specs.map(([k, v]) => (
          <div
            key={k}
            className={`flex gap-3 ${side === "left" ? "justify-end" : "justify-between"}`}
          >
            <dt className="uppercase tracking-[0.14em] text-ash">{k}</dt>
            <dd className="text-white/80">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
