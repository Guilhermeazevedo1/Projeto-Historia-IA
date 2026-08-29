import { useEffect } from "react";
import { chapters } from "../content/chapters";
import { getNextIndex } from "../utils/navigation";

type KeyboardNavigationOptions = {
  activeIndex: number;
  onToggleMap: () => void;
  onToggleNotes: () => void;
  onRequestFullscreen: () => void;
  onClosePanels: () => void;
};

const scrollToIndex = (index: number) => {
  document.getElementById(chapters[index].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const useKeyboardNavigation = ({
  activeIndex,
  onToggleMap,
  onToggleNotes,
  onRequestFullscreen,
  onClosePanels
}: KeyboardNavigationOptions) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches("input, textarea, select, [contenteditable='true']");
      if (isTyping) {
        return;
      }

      if (event.key === "Escape") {
        onClosePanels();
        return;
      }

      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        onToggleMap();
        return;
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        onToggleNotes();
        return;
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        onRequestFullscreen();
        return;
      }

      const direction = getNextIndex(event.key, activeIndex, chapters.length);
      if (direction !== activeIndex) {
        event.preventDefault();
        scrollToIndex(direction);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onClosePanels, onRequestFullscreen, onToggleMap, onToggleNotes]);
};
