import { useState } from "react";
import { useLenis } from "./lib/useLenis";
import { Cursor, NoiseOverlay } from "./components/Primitives";
import { NavBar, Hero, Marquee, Problem } from "./components/Sections";
import { Hardware } from "./components/Hardware";
import { Security } from "./components/Security";
import { Deploy, Engineers, Footer } from "./components/Closing";

/**
 * VaultPrint — Awwwards-grade landing page.
 * True Black canvas · Titanium hardware · Electric Cyan laser accent.
 * Lenis smooth scroll · GSAP ScrollTrigger · Three.js hero · Canvas physics.
 */
export default function App() {
  const [energized, setEnergized] = useState(false);
  useLenis();

  return (
    <div className="relative min-h-screen bg-black font-sans text-white antialiased">
      <NoiseOverlay energized={energized} />
      <Cursor />

      <NavBar />

      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Hardware />
        <Security />
        <Deploy />
        <Engineers />
      </main>

      <Footer onEnergize={setEnergized} />
    </div>
  );
}
