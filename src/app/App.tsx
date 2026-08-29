import { useCallback, useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "../content/chapters";
import { AmbientParticles } from "../components/AmbientParticles";
import { AnimatedQuestion } from "../components/AnimatedQuestion";
import { ChapterSection } from "../components/ChapterSection";
import { PresentationControls } from "../components/PresentationControls";
import { SpeakerNotes } from "../components/SpeakerNotes";
import { StoryProgress } from "../components/StoryProgress";
import { useChapterProgress } from "../hooks/useChapterProgress";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { usePresentationMode } from "../hooks/usePresentationMode";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  AttentionVisualizer,
  ChineseRoomSimulation,
  DeepLearningScale,
  EmbeddingSpace,
  ErrorRuler,
  GenerativeSystems,
  ImitationGame,
  InterruptionMoment,
  LanguageLab,
  LossLandscape,
  NeuralNetworkFlow,
  NeuronPlayground,
  OpeningStage,
  PerceptronPlayground,
  TemperatureSampler,
  ThawDemo,
  TransformerFlow,
  WinterExpectations
} from "../visualizations/Visualizations";

import "../styles/globals.css";
import "../styles/components.css";

gsap.registerPlugin(ScrollTrigger);

export const App = () => {
  const { activeChapter, activeChapterId, activeIndex, progress } = useChapterProgress();
  const { reducedMotion, setReducedMotion } = useReducedMotion();
  const {
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
  } = usePresentationMode();
  const [returnedToQuestion, setReturnedToQuestion] = useState(false);
  const [reverseFlash, setReverseFlash] = useState(false);

  const ambientTone = useMemo(() => activeChapter.visualTone, [activeChapter.visualTone]);

  useEffect(() => {
    document.documentElement.style.setProperty("--motion-scale", String(animationSpeed));
  }, [animationSpeed]);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const triggers = gsap.utils.toArray<HTMLElement>(".chapter").map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 35%",
        toggleClass: { targets: section, className: "is-current" }
      })
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  const closePanels = useCallback(() => {
    setControlsOpen(false);
    setNotesOpen(false);
  }, [setControlsOpen, setNotesOpen]);

  useKeyboardNavigation({
    activeIndex,
    onClosePanels: closePanels,
    onRequestFullscreen: requestFullscreen,
    onToggleMap: () => setProgressVisible((value) => !value),
    onToggleNotes: () => setNotesOpen((value) => !value)
  });

  const scrollToChapter = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const returnToQuestion = useCallback(() => {
    setReturnedToQuestion(true);
    if (!reducedMotion) {
      setReverseFlash(true);
      window.setTimeout(() => setReverseFlash(false), 1800);
    }
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [reducedMotion]);

  const restartExperience = useCallback(() => {
    setReturnedToQuestion(false);
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [reducedMotion]);

  const renderStage = (id: string) => {
    switch (id) {
      case "turing":
        return <ImitationGame />;
      case "neuron":
        return <NeuronPlayground />;
      case "perceptron":
        return <PerceptronPlayground showModeToggle={false} />;
      case "xor-problem":
        return <PerceptronPlayground initialMode="xor" showModeToggle={false} />;
      case "winter":
        return <WinterExpectations />;
      case "thaw":
        return <ThawDemo />;
      case "error-ruler":
        return <ErrorRuler />;
      case "backprop":
        return <NeuralNetworkFlow />;
      case "gradient":
        return <LossLandscape />;
      case "deep-learning":
        return <DeepLearningScale />;
      case "language":
        return <LanguageLab />;
      case "ngrams":
        return <LanguageLab />;
      case "embeddings":
        return <EmbeddingSpace />;
      case "attention":
        return <AttentionVisualizer />;
      case "transformer":
        return <TransformerFlow />;
      case "llm":
        return <TemperatureSampler />;
      case "generative-ai":
        return <GenerativeSystems />;
      case "interruption":
        return <InterruptionMoment />;
      case "chinese-room":
        return <ChineseRoomSimulation onReturn={returnToQuestion} />;
      case "final":
        return (
          <div className="reflection-panel panel">
            <p className="chapter__kicker">Fechamento</p>
            <h3>A pergunta não desapareceu.</h3>
            <p>
              Agora ela carrega comportamento, aprendizado, representação, atenção, geração e
              compreensão. A resposta continua aberta, mas a pergunta tem contornos mais nítidos.
            </p>
            <button className="primary-button" type="button" onClick={returnToQuestion}>
              Voltar ao início nítido
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#opening">
        Ir para a apresentação
      </a>
      <AmbientParticles enabled={ambientEnabled && !reducedMotion} tone={ambientTone} />
      {reverseFlash ? (
        <div className="reverse-flash" aria-hidden="true">
          {["Sala Chinesa", "IA generativa", "LLM", "Transformer", "Attention", "embeddings", "Deep Learning", "erro", "perceptron", "Turing"].map(
            (item) => (
              <span key={item}>{item}</span>
            )
          )}
        </div>
      ) : null}
      <StoryProgress
        activeChapterId={activeChapterId}
        progress={progress}
        visible={progressVisible}
        onToggle={() => setProgressVisible((value) => !value)}
      />
      <PresentationControls
        ambientEnabled={ambientEnabled}
        animationSpeed={animationSpeed}
        open={controlsOpen}
        progressVisible={progressVisible}
        reducedMotion={reducedMotion}
        soundEnabled={soundEnabled}
        onAnimationSpeedChange={setAnimationSpeed}
        onRestart={restartExperience}
        onToggleAmbient={() => setAmbientEnabled((value) => !value)}
        onToggleOpen={() => setControlsOpen((value) => !value)}
        onToggleProgress={() => setProgressVisible((value) => !value)}
        onToggleReducedMotion={() => setReducedMotion((value) => !value)}
        onToggleSound={() => setSoundEnabled((value) => !value)}
      />
      <SpeakerNotes chapter={activeChapter} open={notesOpen} onClose={() => setNotesOpen(false)} />
      <main className="story-main" id="story">
        <section className="chapter tone-mist opening" id="opening" tabIndex={-1}>
          <div className="chapter__inner opening__inner">
            <div className="chapter__copy">
              <p className="chapter__kicker">01 / Podem pensar?</p>
              <AnimatedQuestion clear={returnedToQuestion}>Podem máquinas pensar?</AnimatedQuestion>
              <br />
              <br />
              <p className="chapter__question">
                {returnedToQuestion
                  ? "A pergunta voltou ao mesmo lugar. Ela não ficou menor, ficou mais precisa."
                  : "A jornada começa com uma pergunta simples demais para ser simples."}
              </p>
              <OpeningStage onStart={() => scrollToChapter("turing")} />
            </div>
          </div>
        </section>

        {chapters.slice(1).map((chapter, index) => (
          <ChapterSection chapter={chapter} index={index + 1} key={chapter.id}>
            {renderStage(chapter.id)}
          </ChapterSection>
        ))}

      </main>
    </div>
  );
};
