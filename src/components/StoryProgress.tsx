import { EyeOff, Map } from "lucide-react";
import { chapters } from "../content/chapters";

type StoryProgressProps = {
  activeChapterId: string;
  progress: number;
  visible: boolean;
  onToggle: () => void;
};

export const StoryProgress = ({
  activeChapterId,
  progress,
  visible,
  onToggle
}: StoryProgressProps) => (
  <aside className="story-progress" data-visible={visible} aria-label="Progresso narrativo">
    <button
      className="icon-button story-progress__toggle"
      type="button"
      onClick={onToggle}
      title={visible ? "Ocultar progresso" : "Mostrar progresso"}
      aria-label={visible ? "Ocultar progresso" : "Mostrar progresso"}
    >
      {visible ? <EyeOff size={17} /> : <Map size={17} />}
    </button>
    {visible ? (
      <>
        <div className="story-progress__rail" aria-hidden="true">
          <i style={{ transform: `scaleY(${progress})` }} />
        </div>
        <nav>
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              className="story-progress__item"
              data-active={chapter.id === activeChapterId}
              type="button"
              onClick={() =>
                document.getElementById(chapter.id)?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{chapter.shortLabel}</b>
            </button>
          ))}
        </nav>
      </>
    ) : null}
  </aside>
);
