"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import HalftoneReveal from "@/components/HalftoneReveal";
import heroBust from "@/assets/hero-bust.webp";
import { useIntroLive, useTheme } from "./signals";

// Halftone statue at rest; under the cursor (or a tap) the real photo shows through.
// Dots use the theme accent: violet on dark, cobalt on light.
const THEMES = {
  dark: { ink: "#7c4dff", lumaDots: true, contrast: 1.45, brightness: -0.2 },
  light: { ink: "#0047ab", lumaDots: false, contrast: 1.35, brightness: -0.12 },
} as const;

const smallQuery = "(max-width: 767px)";
const subscribeSize = (cb: () => void) => {
  const mq = window.matchMedia(smallQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useSmall = () => useSyncExternalStore(subscribeSize, () => window.matchMedia(smallQuery).matches, () => false);

export function HeroFigure() {
  const theme = useTheme();
  const live = useIntroLive();
  const small = useSmall();
  const [ready, setReady] = useState(false);
  const t = THEMES[theme];

  return (
    <div
      className="ds-figure"
      data-ready={ready || undefined}
      role="img"
      aria-label="Halftone print of a statue wrapped in yellow ADVERTISEMENT tape. Hover or tap to reveal the photograph."
    >
      {/* Real image for no-JS and crawlers; hidden once the canvas is drawing. */}
      <Image
        src={heroBust}
        alt="A sculpted human bust wrapped head to shoulders in glossy yellow tape printed with the word ADVERTISEMENT."
        priority
        unoptimized
        className="ds-figure__img"
      />
      <HalftoneReveal
        src={heroBust.src}
        fit="contain"
        mode="mono"
        shape="dot"
        cellSize={small ? 13 : 11}
        angle={45}
        inkColor={t.ink}
        paperColor="#000000"
        transparent
        contrast={t.contrast}
        brightness={t.brightness}
        lumaDots={t.lumaDots}
        revealRadius={small ? 80 : 120}
        softness={0.7}
        linger={0.9}
        clickBurst={false}
        wander={false}
        intro
        play={live}
        sweep
        holdMs={1400}
        toggle
        maxDpr={1.5}
        onReady={() => setReady(true)}
        className="absolute! inset-0"
      />
    </div>
  );
}
