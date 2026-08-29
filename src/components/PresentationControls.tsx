import {
  Gauge,
  Map,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  Settings2,
  Volume2,
  VolumeX
} from "lucide-react";
import { chapters } from "../content/chapters";

type PresentationControlsProps = {
  open: boolean;
  progressVisible: boolean;
  soundEnabled: boolean;
  ambientEnabled: boolean;
  reducedMotion: boolean;
  animationSpeed: number;
  onToggleOpen: () => void;
  onToggleProgress: () => void;
  onToggleSound: () => void;
  onToggleAmbient: () => void;
  onToggleReducedMotion: () => void;
  onAnimationSpeedChange: (value: number) => void;
  onRestart: () => void;
};

export const PresentationControls = ({
  open,
  progressVisible,
  soundEnabled,
  ambientEnabled,
  reducedMotion,
  animationSpeed,
  onToggleOpen,
  onToggleProgress,
  onToggleSound,
  onToggleAmbient,
  onToggleReducedMotion,
  onAnimationSpeedChange,
  onRestart
}: PresentationControlsProps) => (
  <div className="presentation-controls" data-open={open}>
    <button
      className="icon-button"
      type="button"
      onClick={onToggleOpen}
      aria-expanded={open}
      aria-label="Abrir controles de apresentação"
      title="Controles"
    >
      <Settings2 size={18} />
    </button>
    {open ? (
      <div className="presentation-controls__panel panel" role="dialog" aria-label="Modo apresentação">
        <div className="control-row">
          <button className="ghost-button" type="button" onClick={onToggleProgress}>
            <Map size={16} />
            {progressVisible ? "Ocultar mapa" : "Mostrar mapa"}
          </button>
          <button className="ghost-button" type="button" onClick={onToggleAmbient}>
            {ambientEnabled ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
            Ambiente
          </button>
          <button className="ghost-button" type="button" onClick={onToggleSound}>
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            Som
          </button>
          <button className="ghost-button" type="button" onClick={onToggleReducedMotion}>
            <Gauge size={16} />
            {reducedMotion ? "Movimento reduzido" : "Movimento normal"}
          </button>
        </div>
        <label className="speed-control">
          Velocidade das animações
          <input
            aria-label="Velocidade das animações"
            max="1.5"
            min="0.5"
            step="0.1"
            type="range"
            value={animationSpeed}
            onChange={(event) => onAnimationSpeedChange(Number(event.target.value))}
          />
        </label>
        <div className="chapter-jump">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() =>
                document.getElementById(chapter.id)?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="control-row">
          <button className="ghost-button" type="button" onClick={onRestart}>
            <RotateCcw size={16} />
            Reiniciar
          </button>
        </div>
      </div>
    ) : null}
  </div>
);
