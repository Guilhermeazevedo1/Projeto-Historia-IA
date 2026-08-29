import { useEffect, useState } from "react";

const storageKey = "ai-history-reduced-motion";

export const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return stored === "true";
      }
    }

    return typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(reducedMotion));
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  return { reducedMotion, setReducedMotion };
};
