import { lazy, Suspense, useState } from "react";
import { useLenis } from "./lib/useLenis";
import { Cursor, NoiseOverlay } from "./components/Primitives";
import { NavBar, Hero, Marquee } from "./components/Sections";

// Below-fold sections: lazy-loaded so the hero paints before they parse.
const Problem   = lazy(() => import("./components/Sections").then(m => ({ default: m.Problem })));
const Hardware  = lazy(() => import("./components/Hardware").then(m => ({ default: m.Hardware })));
const Security  = lazy(() => import("./components/Security").then(m => ({ default: m.Security })));
const Deploy    = lazy(() => import("./components/Closing").then(m => ({ default: m.Deploy })));
const Engineers = lazy(() => import("./components/Closing").then(m => ({ default: m.Engineers })));
const Footer    = lazy(() => import("./components/Closing").then(m => ({ default: m.Footer })));

// Minimal skeleton that preserves layout space during lazy load
const SectionFallback = () => <div className="min-h-[60vh] bg-black" aria-hidden="true" />;

export default function App() {
  const [energized, setEnergized] = useState(false);
  useLenis();

  return (
    <div className="relative min-h-screen bg-black font-sans text-white antialiased">
      <NoiseOverlay energized={energized} />
      <Cursor />

      <NavBar />

      <main>
        {/* Hero + Marquee are above-fold — imported eagerly */}
        <Hero />
        <Marquee />

        {/* Everything below the fold is lazy */}
        <Suspense fallback={<SectionFallback />}>
          <Problem />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Hardware />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Security />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Deploy />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Engineers />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer onEnergize={setEnergized} />
      </Suspense>
    </div>
  );
}
