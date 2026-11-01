"use client";

import { useSyncExternalStore } from "react";

// ---- Intro: flips once, when the loader starts to lift (or straight away if skipped).
const LIFT_EVENT = "ds:lift";

export function signalLift() {
  document.documentElement.dataset.dsIntro = "go";
  window.dispatchEvent(new Event(LIFT_EVENT));
}

const introLive = () => document.documentElement.dataset.dsIntro === "go";
const subscribeIntro = (cb: () => void) => {
  window.addEventListener(LIFT_EVENT, cb);
  return () => window.removeEventListener(LIFT_EVENT, cb);
};

export function useIntroLive() {
  return useSyncExternalStore(subscribeIntro, introLive, () => false);
}

// ---- Theme: the <html data-theme> attribute is the single source of truth.
export type Theme = "dark" | "light";

const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};

export function useTheme() {
  return useSyncExternalStore(subscribeTheme, readTheme, () => "dark" as Theme);
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("ds-theme", theme);
  } catch {}
}
