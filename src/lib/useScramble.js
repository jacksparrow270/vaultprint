import { useEffect, useRef, useState } from "react";

const GLYPHS = "01ABCDEF#$%&/<>=+*■□▲△▼◇";

/**
 * Typographic scramble: cycles each character through random binary/hex
 * glyphs before it resolves left-to-right into the final string.
 * Fires when `start` becomes true (e.g. on mount or in-view).
 */
export function useScramble(text, { start = true, speed = 26, revealEvery = 2 } = {}) {
  const [output, setOutput] = useState(text.replace(/[^\s]/g, " "));
  const frame = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!start) return;
    let mounted = true;
    frame.current = 0;
    const chars = text.split("");

    const tick = () => {
      if (!mounted) return;
      const revealed = Math.floor(frame.current / revealEvery);
      const next = chars
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealed) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setOutput(next);
      frame.current += 1;
      if (revealed <= chars.length) {
        raf.current = window.setTimeout(tick, 1000 / speed);
      } else {
        setOutput(text);
      }
    };
    tick();

    return () => {
      mounted = false;
      window.clearTimeout(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, text]);

  return output;
}
