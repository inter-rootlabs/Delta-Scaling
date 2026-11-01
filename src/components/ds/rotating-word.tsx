"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useIntroLive } from "./signals";

// The V3 headline device: one word box that cycles through what we install.
export function RotatingWord({ words, className, interval = 2600 }: { words: string[]; className?: string; interval?: number }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const live = useIntroLive();

  useEffect(() => {
    if (reduce || !live) return;
    // First change waits for the entrance to finish.
    let t: number;
    const first = window.setTimeout(() => {
      setI((n) => (n + 1) % words.length);
      t = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    }, interval + 1200);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(t);
    };
  }, [words.length, interval, reduce, live]);

  return (
    <motion.span
      layout
      className={`relative inline-flex overflow-hidden align-bottom ${className ?? ""}`}
      transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
    >
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden
          className="inline-block whitespace-nowrap"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
