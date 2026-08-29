import { useCallback, useEffect, useState } from "react";

const boolFromStorage = (key: string, fallback: boolean) => {
  if (typeof localStorage === "undefined") {
    return fallback;
  }
  const stored = localStorage.getItem(key);
  return stored === null ? fallback : stored === "true";
};

export const usePresentationMode = () => {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [progressVisible, setProgressVisible] = useState(() =>
    boolFromStorage("ai-history-progress-visible", true)
  );
  const [soundEnabled, setSoundEnabled] = useState(() =>
    boolFromStorage("ai-history-sound-enabled", false)
  );
  const [ambientEnabled, setAmbientEnabled] = useState(() =>
    boolFromStorage("ai-history-ambient-enabled", true)
  );
  const [animationSpeed, setAnimationSpeed] = useState(() => {
    if (typeof localStorage === "undefined") {
      return 1;
    }
    const stored = localStorage.getItem("ai-history-animation-speed");
    return stored ? Number(stored) : 1;
  });

  useEffect(() => {
    localStorage.setItem("ai-history-progress-visible", String(progressVisible));
    localStorage.setItem("ai-history-sound-enabled", String(soundEnabled));
    localStorage.setItem("ai-history-ambient-enabled", String(ambientEnabled));
    localStorage.setItem("ai-history-animation-speed", String(animationSpeed));
  }, [ambientEnabled, animationSpeed, progressVisible, soundEnabled]);

  const requestFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
    }
  }, []);

  return {
    controlsOpen,
    setControlsOpen,
    notesOpen,
    setNotesOpen,
    progressVisible,
    setProgressVisible,
    soundEnabled,
    setSoundEnabled,
    ambientEnabled,
    setAmbientEnabled,
    animationSpeed,
    setAnimationSpeed,
    requestFullscreen
  };
};
