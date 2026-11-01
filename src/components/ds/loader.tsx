"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TextLoop from "@/components/TextLoop";
import logo from "../../../public/logo-gold.png";
import { signalLift } from "./signals";

const HOLD_MS = 1250; // logo on screen before the lift
const LIFT_MS = 1000; // curved-edge exit; total ≈ 2.25s

// Tape paths live in TextLoop's 1200×520 viewBox. Each box is placed so the
// tape runs off the screen edges, like the reference. The two corners are
// deliberately different: a single violet S-curve top-left, and a crossed pair
// (violet over yellow) bottom-right running the other way.
// Top-left: box rotated 90°, so path x runs down the screen.
const TAPE_TL = "M -140 330 C 140 330, 250 120, 470 140 C 700 160, 770 520, 880 700";
// Bottom-right: one broad arc from the right edge out through the bottom edge.
const TAPE_BR = "M 1360 230 C 1040 200, 860 330, 760 700";

function Tape({ d, className, cross = false, reverse = false }: { d: string; className: string; cross?: boolean; reverse?: boolean }) {
  return (
    <div className={`ds-tape ${className}`} aria-hidden>
      <TextLoop
        text="Delta Scaling"
        separator="///"
        path={d}
        speed={cross ? 55 : 70}
        direction={reverse ? "reverse" : "forward"}
        ribbon
        ribbonColor="#7C4DFF"
        ribbonWidth={cross ? 96 : 112}
        color="#F5F1E8"
        cross={cross}
        crossColor="#FFC400"
        crossAngle={26}
        fontSize={cross ? 42 : 48}
        fontWeight={800}
        letterSpacing={1.5}
        pauseOnHover={false}
      />
    </div>
  );
}

export function Loader() {
  const [state, setState] = useState<"run" | "lift" | "done">("run");
  const lifted = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.dsLoader === "skip") {
      signalLift(); // CSS hides the loader via html[data-ds-loader="skip"]
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      html.dataset.dsLoader = "skip";
      signalLift();
      return;
    }
    const t = window.setTimeout(lift, HOLD_MS);
    return () => window.clearTimeout(t);
  }, []);

  function lift() {
    if (lifted.current) return;
    lifted.current = true;
    setState("lift");
    signalLift();
    window.setTimeout(() => setState("done"), LIFT_MS + 60);
  }

  if (state === "done") return null;

  return (
    <div className="ds-loader" data-state={state} onPointerDown={lift} role="presentation" aria-hidden>
      <div className="ds-loader__clip">
        <Tape d={TAPE_TL} className="ds-tape--tl" />
        <Tape d={TAPE_BR} className="ds-tape--br" cross reverse />
      </div>
      <div className="ds-loader__center">
        <Image src={logo} alt="" priority className="ds-loader__logo" />
        <div className="ds-loader__name ds-wordmark">
          Delta Scaling<span className="ds-loader__reg">®</span>
        </div>
      </div>
    </div>
  );
}
