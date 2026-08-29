import { useEffect, useMemo, useState } from "react";
import { chapters } from "../content/chapters";

export const useChapterProgress = () => {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0].id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveChapterId(visible.target.id);
        }
      },
      { threshold: [0.25, 0.45, 0.7], rootMargin: "-12% 0px -30% 0px" }
    );

    chapters.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) {
        observer.observe(element);
      }
    });

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable <= 0 ? 0 : window.scrollY / scrollable);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  const activeIndex = useMemo(
    () => chapters.findIndex((chapter) => chapter.id === activeChapterId),
    [activeChapterId]
  );

  return {
    activeChapterId,
    activeIndex: activeIndex < 0 ? 0 : activeIndex,
    activeChapter: chapters[activeIndex < 0 ? 0 : activeIndex],
    progress
  };
};
