import { useEffect, useRef, useState } from "react";
import { Fingerprint, ScanLine, Trash2 } from "lucide-react";

const HEX = "0123456789abcdef";

/* Deterministic pseudo-hash so the same input renders a stable stream */
function pseudoHash(input, length = 256) {
  let seed = 0x9e3779b9;
  for (let i = 0; i < input.length; i++) {
    seed = (seed ^ input.charCodeAt(i)) >>> 0;
    seed = Math.imul(seed, 0x85ebca6b) >>> 0;
  }
  let out = "";
  for (let i = 0; i < length; i++) {
    seed = Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) >>> 0;
    out += HEX[seed & 0xf];
  }
  return out;
}

/* =====================================================================
   CELL 1 — Live AES-256 encryption visualiser
===================================================================== */
function EncryptionCell() {
  const [value, setValue] = useState("classified-transcript.pdf");
  const [stream, setStream] = useState("");
  const targetRef = useRef("");

  useEffect(() => {
    const full = pseudoHash(value || " ", 512);
    targetRef.current = full;
    let i = 0;
    setStream("");
    const id = setInterval(() => {
      i += 24;
      setStream(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [value]);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hw-edge lg:col-span-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-laser" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
            AES-256-GCM · Live
          </span>
        </div>
        <span className="h-2 w-2 animate-pulse rounded-full bg-laser" />
      </div>

      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-white">
        Every document is ciphertext before it leaves your hand.
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ash">
        Type below. VaultPrint encrypts payloads at the edge with hardware AES-256 — keys
        never touch disk, and plaintext never touches the network.
      </p>

      <label className="mt-5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
        Plaintext input
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-2.5 focus-within:border-laser/50">
        <span className="text-laser">$</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className="w-full bg-transparent font-mono text-sm text-white outline-none placeholder:text-ash/50"
          placeholder="type a filename or secret…"
          aria-label="Text to encrypt"
        />
      </div>

      <div className="mt-4 flex-1 overflow-hidden rounded-lg border border-white/[0.06] bg-black/60 p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
          Ciphertext · 512-bit view
        </p>
        <p className="mt-2 break-all font-mono text-[11px] leading-relaxed text-laser/80">
          {stream}
          <span className="text-laser">▋</span>
        </p>
      </div>
    </div>
  );
}

/* =====================================================================
   CELL 2 — Zero-Trace: document disintegrates into digital dust
===================================================================== */
function ZeroTraceCell() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], phase: "idle", t: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    const docW = 88;
    const docH = 112;

    const buildParticles = () => {
      const cx = W() / 2 - docW / 2;
      const cy = H() / 2 - docH / 2;
      const arr = [];
      const step = 5;
      for (let x = 0; x < docW; x += step) {
        for (let y = 0; y < docH; y += step) {
          arr.push({
            ox: cx + x,
            oy: cy + y,
            x: cx + x,
            y: cy + y,
            vx: 0,
            vy: 0,
            life: 1,
          });
        }
      }
      stateRef.current.particles = arr;
    };
    buildParticles();

    const s = stateRef.current;
    let cycle = 0;

    const loop = () => {
      ctx.clearRect(0, 0, W(), H());
      s.t += 1;

      // Print bar sweep then disintegrate on a timed cycle
      const period = 260;
      const local = s.t % period;
      if (local === 0) {
        cycle++;
        buildParticles();
      }
      const disintegrating = local > 120;

      // Print laser line
      if (local <= 120) {
        const p = local / 120;
        const lineY = H() / 2 - docH / 2 + p * docH;
        ctx.strokeStyle = "rgba(0,240,255,0.8)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(W() / 2 - docW / 2 - 8, lineY);
        ctx.lineTo(W() / 2 + docW / 2 + 8, lineY);
        ctx.stroke();
      }

      s.particles.forEach((pt) => {
        if (disintegrating) {
          if (pt.vx === 0 && pt.vy === 0) {
            pt.vx = (Math.random() - 0.5) * 2.4;
            pt.vy = -Math.random() * 2.6 - 0.4;
          }
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.02;
          pt.life -= 0.012;
        }
        if (pt.life > 0) {
          const alpha = disintegrating ? pt.life : 0.85;
          ctx.fillStyle = `rgba(${disintegrating ? "0,240,255" : "220,220,228"},${alpha})`;
          ctx.fillRect(pt.x, pt.y, 3, 3);
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) loop();
    else {
      s.particles.forEach((pt) => {
        ctx.fillStyle = "rgba(220,220,228,0.85)";
        ctx.fillRect(pt.x, pt.y, 3, 3);
      });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hw-edge">
      <div className="flex items-center gap-2">
        <Trash2 className="h-4 w-4 text-laser" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          Zero-Trace
        </span>
      </div>
      <div className="relative my-4 h-40 w-full overflow-hidden rounded-lg border border-white/[0.06] bg-black/50">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight text-white">
        Printed, then permanently wiped.
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ash">
        The instant a job completes, its buffer is zeroized in hardware — no cache, no
        spool, no recoverable trace.
      </p>
    </div>
  );
}

/* =====================================================================
   CELL 3 — Hardware token scanner (macro-loop stand-in)
===================================================================== */
function ScannerCell() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 hw-edge">
      <div className="flex items-center gap-2">
        <ScanLine className="h-4 w-4 text-laser" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ash">
          Token Pickup
        </span>
      </div>

      {/* Macro scanner visual — animated laser rake over a phone token */}
      <div className="relative my-4 h-40 w-full overflow-hidden rounded-lg border border-white/[0.06] bg-gradient-to-br from-[#101014] to-black">
        <div className="absolute left-1/2 top-1/2 h-24 w-14 -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/15 bg-black">
          <div className="absolute inset-x-2 top-3 grid grid-cols-4 gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="h-1.5 rounded-sm bg-white/20" />
            ))}
          </div>
        </div>
        <div className="scanner-rake absolute inset-x-0 h-8 bg-[linear-gradient(to_bottom,transparent,rgba(0,240,255,0.35),transparent)]" />
        <style>{`.scanner-rake{animation:rake 2.6s ease-in-out infinite}@keyframes rake{0%,100%{top:-10%}50%{top:80%}}`}</style>
      </div>

      <h3 className="font-display text-lg font-semibold tracking-tight text-white">
        Verified fulfillment, every time.
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ash">
        A one-time pickup token on the user's phone is optically scanned at release —
        documents only surface for the right hands.
      </p>
    </div>
  );
}

/* =====================================================================
   SCENE 5 — SECURITY ARCHITECTURE / INTERACTIVE BENTO
===================================================================== */
export function Security() {
  return (
    <section id="security" className="relative bg-black py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-laser">
            [ 03 — The security architecture ]
          </p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-hero text-white sm:text-5xl">
            Privacy isn't a feature. It's the substrate.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ash">
            VaultPrint is built for environments where documents are sensitive and trust is
            auditable — academic records, contracts, filings, and internal paperwork.
          </p>
        </div>

        <div className="mt-14 grid auto-rows-fr gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <EncryptionCell />
          <ZeroTraceCell />
          <ScannerCell />
        </div>
      </div>
    </section>
  );
}
