import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Sigma } from "lucide-react";
import {
  nextTokenProbabilities,
  TemperatureMode
} from "./temperature";
import {
  embeddingGroupLabels,
  embeddingWords,
  formatDidacticVector,
  getEmbeddingNeighbors,
  getEmbeddingWord
} from "./embeddingData";

const EmbeddingExplorer3D = lazy(() => import("./EmbeddingExplorer3D"));

export const OpeningStage = ({ onStart }: { onStart: () => void }) => (
  <div className="opening-stage">
    <p className="opening-stage__line">Antes de procurar uma resposta, precisamos entender a pergunta.</p>
    <p className="opening-stage__pause">O que significa pensar?</p>
    <button className="primary-button" type="button" onClick={onStart}>
      Começar a investigação
      <ArrowRight size={18} />
    </button>
  </div>
);

export const ImitationGame = () => {
  const [turn, setTurn] = useState(0);
  const responses = [
    {
      a: "Quando estou confuso, procuro exemplos antes de responder.",
      b: "Posso calcular uma resposta provável a partir do contexto."
    },
    {
      a: "Eu diria que pensar envolve memória, erro e intenção.",
      b: "A melhor continuação parece depender da palavra intenção."
    },
    {
      a: "Talvez a pergunta esteja pedindo mais de nós do que da máquina.",
      b: "Essa pergunta tem várias interpretações possíveis."
    }
  ];

  return (
    <div className="imitation panel" aria-label="Visualização do jogo da imitação">
      <p className="chapter__kicker">Jogo da imitação</p>
      <div className="imitation-visual">
        <div className="imitation-node imitation-node--judge">
          <span>Avaliador</span>
        </div>
        <div className="imitation-channel imitation-channel--a">
          <span>Canal A</span>
          <p>{responses[turn].a}</p>
        </div>
        <div className="imitation-channel imitation-channel--b">
          <span>Canal B</span>
          <p>{responses[turn].b}</p>
        </div>
        <svg viewBox="0 0 680 300" aria-hidden="true">
          <path d="M340 72 C260 92, 180 118, 130 180" />
          <path d="M340 72 C430 98, 520 120, 555 180" />
          <path d="M130 180 C240 236, 450 236, 555 180" />
        </svg>
      </div>
      <div className="control-row">
        <button className="ghost-button" type="button" onClick={() => setTurn((turn + 1) % responses.length)}>
          Alternar transcrição
        </button>
        <span className="metric">identidades ocultas</span>
      </div>
    </div>
  );
};

export const NeuronPlayground = () => {
  const [pointedEars, setPointedEars] = useState(0.8);
  const [longSnout, setLongSnout] = useState(0.25);
  const [independentBehavior, setIndependentBehavior] = useState(0.75);
  const [weightsVisible, setWeightsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const pulseTimerRef = useRef<number | null>(null);
  const resultTimerRef = useRef<number | null>(null);
  const features = [
    {
      id: "ears",
      label: "orelhas pontudas",
      value: pointedEars,
      weight: 1.15,
      onChange: setPointedEars
    },
    {
      id: "snout",
      label: "focinho alongado",
      value: longSnout,
      weight: -1.35,
      onChange: setLongSnout
    },
    {
      id: "behavior",
      label: "comportamento independente",
      value: independentBehavior,
      weight: 0.95,
      onChange: setIndependentBehavior
    }
  ];
  const bias = -0.28;
  const calculateScore = (nextFeatureId?: string, nextValue?: number) =>
    features.reduce(
      (sum, feature) =>
        sum + (feature.id === nextFeatureId && nextValue !== undefined ? nextValue : feature.value) * feature.weight,
      bias
    );
  const [displayedScore, setDisplayedScore] = useState(() => 0.8 * 1.15 + 0.25 * -1.35 + 0.75 * 0.95 - 0.28);
  const confidence = Math.min(96, Math.max(52, Math.round(52 + Math.abs(displayedScore) * 28)));
  const output = displayedScore >= 0 ? "gato" : "cachorro";
  const updateFeature = (featureId: string, value: number, onChange: (value: number) => void) => {
    setActiveFeature(featureId);
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
    }
    if (resultTimerRef.current !== null) {
      window.clearTimeout(resultTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => setActiveFeature(null), 420);
    resultTimerRef.current = window.setTimeout(() => setDisplayedScore(calculateScore(featureId, value)), 180);
    onChange(value);
  };

  useEffect(
    () => () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
      }
      if (resultTimerRef.current !== null) {
        window.clearTimeout(resultTimerRef.current);
      }
    },
    []
  );

  return (
    <div className="neuron-stage">
      <div className="neuron panel">
      <div className="neuron__header">
        <div>
          <p className="chapter__kicker">Classificação binária</p>
          <h3>Gato ou cachorro?</h3>
        </div>
        <output className="neuron-result" aria-live="polite">
          <span>resultado</span>
          <strong>{output}</strong>
          <b>{confidence}%</b>
        </output>
      </div>

        <div className="neuron-lab">
          <div className="feature-panel">
            <p className="chapter__kicker">Entradas / características</p>
            <div className="feature-list">
              {features.map((feature) => (
                <label key={feature.id}>
                  <span>
                    {feature.label}
                    <b>{feature.value.toFixed(1)}</b>
                  </span>
                  <input
                    min="0"
                    max="1"
                    step="0.1"
                    type="range"
                    value={feature.value}
                    onChange={(event) =>
                      updateFeature(feature.id, Number(event.target.value), feature.onChange)
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          <svg
            className="neuron__svg"
            viewBox="0 0 1200 360"
            role="img"
            aria-label="Características conectadas a um neurônio artificial que decide entre gato e cachorro"
          >
            {features.map((feature, index) => {
              const y = 70 + index * 110;
              const visualWeight = weightsVisible ? Math.abs(feature.weight) : 0.45;
              const connectionClass = [
                feature.weight < 0 ? "negative" : "positive",
                activeFeature === feature.id ? "is-pulsing" : ""
              ].join(" ");
              return (
                <g key={feature.id}>
                  <circle cx="72" cy={y} r="34" className={activeFeature === feature.id ? "is-pulsing" : ""} />
                  <text x="72" y={y + 8} textAnchor="middle" className="input-label">
                    x{index + 1}
                  </text>
                  <line
                    x1="112"
                    y1={y}
                    x2="735"
                    y2="180"
                    className={connectionClass}
                    style={{
                      opacity: weightsVisible ? 0.46 + visualWeight * 0.36 : 0.34,
                      strokeWidth: weightsVisible ? 4 + visualWeight * 9 : 4
                    }}
                  />
                  <text
                    x="365"
                    y={y - 18}
                    className="weight-label"
                    data-visible={weightsVisible}
                  >
                    w{index + 1} = {feature.weight.toFixed(2)}
                  </text>
                </g>
              );
            })}
            <circle className={`neuron__core ${activeFeature ? "is-pulsing" : ""}`} cx="805" cy="180" r="76" />
            <text x="805" y="172" textAnchor="middle" className="neuron-core-label">
              soma
            </text>
            <text x="805" y="204" textAnchor="middle" className="neuron-core-label">
              + limiar
            </text>
            <line x1="882" y1="180" x2="1030" y2="180" className={`output-line ${activeFeature ? "is-pulsing" : ""}`} />
            <rect x="1012" y="126" width="158" height="108" rx="8" />
            <text x="1091" y="174" textAnchor="middle" className="output-label">
              {output}
            </text>
            <text x="1091" y="205" textAnchor="middle" className="output-label output-label--small">
              saída
            </text>
          </svg>

          <div className="weight-panel" data-visible={weightsVisible}>
            <p className="chapter__kicker">Pesos / importância</p>
            <div className="weight-panel__body">
              <p className="weight-panel__hidden" aria-hidden={weightsVisible}>
                Os pesos ficam ocultos no início. Primeiro vemos apenas sinais e decisão.
              </p>
              <div className="weight-list" aria-hidden={!weightsVisible}>
                {features.map((feature) => (
                  <span key={feature.id}>
                    {feature.label}
                    <b>{feature.weight > 0 ? "+" : ""}{feature.weight.toFixed(2)}</b>
                  </span>
                ))}
                <span>
                  viés
                  <b>{bias.toFixed(2)}</b>
                </span>
              </div>
            </div>
            <button
              className="ghost-button"
              type="button"
              onClick={() => setWeightsVisible((visible) => !visible)}
            >
              {weightsVisible ? "Ocultar pesos" : "Revelar pesos"}
            </button>
          </div>
        </div>

        <div className="formula-slot" data-visible={weightsVisible}>
          <pre className="formula" aria-hidden={!weightsVisible}>
            {"z = x₁w₁ + x₂w₂ + x₃w₃ + b\nsaída = ativação(z)"}
          </pre>
        </div>
      </div>
    </div>
  );
};

const linearPoints = [
  { x: 18, y: 28, cls: 0 },
  { x: 26, y: 44, cls: 0 },
  { x: 34, y: 30, cls: 0 },
  { x: 64, y: 58, cls: 1 },
  { x: 72, y: 74, cls: 1 },
  { x: 82, y: 62, cls: 1 }
];

const xorPoints = [
  { x: 25, y: 25, cls: 0 },
  { x: 75, y: 75, cls: 0 },
  { x: 75, y: 25, cls: 1 },
  { x: 25, y: 75, cls: 1 }
];

type PerceptronPlaygroundProps = {
  initialMode?: "linear" | "xor";
  showModeToggle?: boolean;
};

export const PerceptronPlayground = ({
  initialMode = "linear",
  showModeToggle = true
}: PerceptronPlaygroundProps) => {
  const [mode, setMode] = useState<"linear" | "xor">(initialMode);
  const [angle, setAngle] = useState(0.9);
  const [offset, setOffset] = useState(0);
  const [line, setLine] = useState({ leftY: 90, rightY: 100 });
  const [dragHandle, setDragHandle] = useState<"left" | "right" | null>(null);
  const [training, setTraining] = useState(false);
  const [trainingFocus, setTrainingFocus] = useState<string | null>(null);
  const [trainingStatus, setTrainingStatus] = useState("ajuste manual");
  const trainingTimersRef = useRef<number[]>([]);
  const points = mode === "linear" ? linearPoints : xorPoints;
  const legacyErrors = points.filter((point) => {
    const prediction = point.y > point.x * angle + 42 + offset ? 1 : 0;
    return prediction !== point.cls;
  }).length;
  const getBoundaryY = (x: number, candidate = line) =>
    candidate.leftY + (candidate.rightY - candidate.leftY) * (x / 100);
  const getPrediction = (point: (typeof linearPoints)[number], candidate = line) =>
    point.y >= getBoundaryY(point.x, candidate) ? 1 : 0;
  const errors = linearPoints.filter((point) => getPrediction(point) !== point.cls);
  const solved = errors.length === 0;
  const plot = { x: 34, y: 24, width: 452, height: 278 };
  const toSvgX = (x: number) => plot.x + (x / 100) * plot.width;
  const toSvgY = (y: number) => plot.y + (1 - y / 100) * plot.height;
  const fromClientY = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const matrix = svg.getScreenCTM();
    if (!matrix) {
      return dragHandle === "left" ? line.leftY : line.rightY;
    }
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    return Math.min(100, Math.max(0, ((plot.y + plot.height - transformed.y) / plot.height) * 100));
  };
  const lineFromWeights = (weights: [number, number, number]) => ({
    leftY: Math.min(100, Math.max(0, (-(weights[0] * 0 + weights[2]) / weights[1]) * 100)),
    rightY: Math.min(100, Math.max(0, (-(weights[0] * 1 + weights[2]) / weights[1]) * 100))
  });
  const countWeightErrors = (weights: [number, number, number]) =>
    linearPoints.filter((point) => {
      const z = weights[0] * (point.x / 100) + weights[1] * (point.y / 100) + weights[2];
      const prediction = z >= 0 ? 1 : 0;
      return prediction !== point.cls;
    }).length;
  const clearTrainingTimers = () => {
    trainingTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    trainingTimersRef.current = [];
  };
  const buildTrainingSteps = () => {
    const learningRate = 0.15;
    const weights: [number, number, number] = [-0.1, 1, -0.9];
    const steps: Array<{
      weights: [number, number, number];
      focus: string | null;
      status: string;
    }> = [
      {
        weights: [...weights],
        focus: null,
        status: `${countWeightErrors(weights)} erros`
      }
    ];

    for (let epoch = 0; epoch < 8; epoch += 1) {
      for (const point of linearPoints) {
        const label = point.cls === 1 ? 1 : -1;
        const z = weights[0] * (point.x / 100) + weights[1] * (point.y / 100) + weights[2];
        const prediction = z >= 0 ? 1 : -1;

        if (prediction !== label) {
          const focus = `${point.x}-${point.y}`;
          steps.push({
            weights: [...weights],
            focus,
            status: "erro encontrado"
          });
          weights[0] += learningRate * label * (point.x / 100);
          weights[1] += learningRate * label * (point.y / 100);
          weights[2] += learningRate * label;
          steps.push({
            weights: [...weights],
            focus,
            status: `${countWeightErrors(weights)} erros`
          });

          if (countWeightErrors(weights) === 0) {
            steps.push({
              weights: [...weights],
              focus: null,
              status: "Separação encontrada."
            });
            return steps;
          }
        }
      }
    }

    return steps;
  };
  const trainPerceptron = () => {
    clearTrainingTimers();
    const steps = buildTrainingSteps();
    setTraining(true);
    setTrainingFocus(null);

    steps.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        setLine(lineFromWeights(step.weights));
        setTrainingFocus(step.focus);
        setTrainingStatus(step.status);

        if (index === steps.length - 1) {
          setTraining(false);
          setTrainingFocus(null);
        }
      }, index * 680);
      trainingTimersRef.current.push(timer);
    });
  };
  const pointErrors = new Set(errors.map((point) => `${point.x}-${point.y}`));

  useEffect(
    () => () => {
      clearTrainingTimers();
    },
    []
  );

  useEffect(() => {
    const section = document.getElementById("perceptron");
    if (!section || initialMode !== "linear") {
      return;
    }

    if (solved) {
      section.dataset.solved = "true";
    } else {
      delete section.dataset.solved;
    }
  }, [initialMode, solved]);

  if (mode === "xor") {
    return (
      <div className="perceptron panel" data-frustrated="true">
        <div className="control-row">
          {showModeToggle ? (
            <>
              <button className="ghost-button" type="button" onClick={() => setMode("linear")}>Dados lineares</button>
              <button className="ghost-button" type="button" onClick={() => setMode("xor")}>XOR</button>
            </>
          ) : (
            <span className="metric">XOR</span>
          )}
          <span className="metric">erros = {legacyErrors}</span>
        </div>
        <svg viewBox="0 0 420 300" role="img" aria-label="Plano com pontos e linha de decisão">
          <line x1="30" y1={255 - offset} x2="380" y2={255 - 350 * angle - offset} className="decision-line" />
          {points.map((point) => (
            <circle
              key={`${point.x}-${point.y}`}
              cx={point.x * 3.5 + 30}
              cy={260 - point.y * 2.35}
              r="11"
              data-class={point.cls}
            />
          ))}
        </svg>
        <div className="range-row">
          <label>
            inclinação
            <input min="-1.2" max="1.8" step="0.1" type="range" value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
          </label>
          <label>
            deslocamento
            <input min="-80" max="80" step="4" type="range" value={offset} onChange={(e) => setOffset(Number(e.target.value))} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="perceptron perceptron--decision panel" data-solved={solved}>
      <div className="perceptron__header">
        <p>Tente separar gatos e cachorros com uma única linha.</p>
        <output className="perceptron__errors" aria-live="polite">
          {solved ? "Separação encontrada." : `${errors.length} ${errors.length === 1 ? "erro" : "erros"}`}
        </output>
      </div>
      <div className="perceptron__legend" aria-label="Legenda das classes">
        <span><i data-class="0" /> cachorro</span>
        <span><i data-class="1" /> gato</span>
        <span className="metric">fronteira de decisão: z = 0</span>
      </div>
      <svg
        viewBox="0 0 520 330"
        role="img"
        aria-label="Plano com gatos e cachorros separados por uma fronteira de decisão"
        onPointerMove={(event) => {
          if (!dragHandle || training) {
            return;
          }
          const nextY = fromClientY(event);
          setLine((current) =>
            dragHandle === "left" ? { ...current, leftY: nextY } : { ...current, rightY: nextY }
          );
          setTrainingStatus("ajuste manual");
        }}
        onPointerUp={() => setDragHandle(null)}
        onPointerLeave={() => setDragHandle(null)}
      >
        <rect className="perceptron-plane" x={plot.x} y={plot.y} width={plot.width} height={plot.height} />
        <polygon
          className="decision-region decision-region--cat"
          points={`${plot.x},${plot.y} ${plot.x + plot.width},${plot.y} ${toSvgX(100)},${toSvgY(line.rightY)} ${toSvgX(0)},${toSvgY(line.leftY)}`}
        />
        <polygon
          className="decision-region decision-region--dog"
          points={`${plot.x},${plot.y + plot.height} ${toSvgX(0)},${toSvgY(line.leftY)} ${toSvgX(100)},${toSvgY(line.rightY)} ${plot.x + plot.width},${plot.y + plot.height}`}
        />
        <text className="region-label region-label--cat" x={plot.x + plot.width - 74} y={plot.y + 38}>
          GATO
        </text>
        <text className="region-label region-label--dog" x={plot.x + 28} y={plot.y + plot.height - 24}>
          CACHORRO
        </text>
        <line
          x1={toSvgX(0)}
          y1={toSvgY(line.leftY)}
          x2={toSvgX(100)}
          y2={toSvgY(line.rightY)}
          className="decision-line"
        />
        <text
          className="decision-line__label"
          x={(toSvgX(0) + toSvgX(100)) / 2}
          y={(toSvgY(line.leftY) + toSvgY(line.rightY)) / 2 - 12}
          textAnchor="middle"
        >
          z = 0
        </text>
        {[{ id: "left" as const, x: 0, y: line.leftY }, { id: "right" as const, x: 100, y: line.rightY }].map((handle) => (
          <circle
            key={handle.id}
            className="decision-handle"
            cx={toSvgX(handle.x)}
            cy={toSvgY(handle.y)}
            r="9"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragHandle(handle.id);
              setTraining(false);
              clearTrainingTimers();
            }}
          />
        ))}
        {linearPoints.map((point) => {
          const key = `${point.x}-${point.y}`;
          const wrong = pointErrors.has(key);
          return (
            <g key={key} className="perceptron-point-group">
              {wrong ? (
                <circle
                  className="perceptron-error-ring"
                  cx={toSvgX(point.x)}
                  cy={toSvgY(point.y)}
                  r="17"
                />
              ) : null}
              <circle
                className={trainingFocus === key ? "is-training-focus" : ""}
                cx={toSvgX(point.x)}
                cy={toSvgY(point.y)}
                r="11"
                data-class={point.cls}
                data-wrong={wrong}
              />
            </g>
          );
        })}
      </svg>
      <div className="perceptron__footer">
        <span className="metric">{trainingStatus}</span>
        <button className="ghost-button" type="button" onClick={trainPerceptron} disabled={training}>
          Treinar Perceptron
        </button>
        {showModeToggle ? (
          <button className="ghost-button" type="button" onClick={() => setMode("xor")}>XOR</button>
        ) : null}
      </div>
      <p className="perceptron__hint">Arraste os pontos amarelos nas extremidades da linha.</p>
    </div>
  );
};

export const XorLimitationPlayground = () => {
  const [line, setLine] = useState({ leftY: 50, rightY: 50 });
  const [dragHandle, setDragHandle] = useState<"left" | "right" | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [movedDuringDrag, setMovedDuringDrag] = useState(false);
  const plot = { x: 34, y: 24, width: 452, height: 278 };
  const discoveryStage = Math.min(4, attempts);
  const toSvgX = (x: number) => plot.x + (x / 100) * plot.width;
  const toSvgY = (y: number) => plot.y + (1 - y / 100) * plot.height;
  const getBoundaryY = (x: number, candidate = line) =>
    candidate.leftY + (candidate.rightY - candidate.leftY) * (x / 100);
  const getPrediction = (point: (typeof xorPoints)[number], candidate = line) =>
    point.y >= getBoundaryY(point.x, candidate) ? 1 : 0;
  const errors = xorPoints.filter((point) => getPrediction(point) !== point.cls);
  const pointErrors = new Set(errors.map((point) => `${point.x}-${point.y}`));
  const fromClientY = (event: ReactPointerEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const matrix = svg.getScreenCTM();
    if (!matrix) {
      return dragHandle === "left" ? line.leftY : line.rightY;
    }
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(matrix.inverse());
    return Math.min(100, Math.max(0, ((plot.y + plot.height - transformed.y) / plot.height) * 100));
  };

  useEffect(() => {
    const section = document.getElementById("xor-problem");
    if (!section) {
      return;
    }

    section.dataset.discoveryStage = String(discoveryStage);

    return () => {
      delete section.dataset.discoveryStage;
    };
  }, [discoveryStage]);

  return (
    <div className="perceptron perceptron--decision perceptron--xor-limit panel" data-discovered={discoveryStage >= 4}>
      <div className="perceptron__header">
        <p>Tente separar os dois grupos com uma única linha.</p>
        <output className="perceptron__errors" aria-live="polite">
          {errors.length} {errors.length === 1 ? "erro" : "erros"}
        </output>
      </div>
      <div className="perceptron__legend" aria-label="Legenda das classes">
        <span><i data-class="0" /> cachorro</span>
        <span><i data-class="1" /> gato</span>
        <span className="metric">fronteira de decisão: z = 0</span>
        {discoveryStage >= 4 ? <span className="metric">padrão conhecido como XOR</span> : null}
      </div>
      <svg
        viewBox="0 0 520 330"
        role="img"
        aria-label="Plano com um padrão que uma única fronteira de decisão não separa totalmente"
        onPointerMove={(event) => {
          if (!dragHandle) {
            return;
          }

          const nextY = fromClientY(event);
          setLine((current) =>
            dragHandle === "left" ? { ...current, leftY: nextY } : { ...current, rightY: nextY }
          );
          setMovedDuringDrag(true);
        }}
        onPointerUp={() => {
          if (movedDuringDrag) {
            setAttempts((count) => Math.min(4, count + 1));
          }
          setDragHandle(null);
          setMovedDuringDrag(false);
        }}
        onPointerLeave={() => {
          setDragHandle(null);
          setMovedDuringDrag(false);
        }}
      >
        <rect className="perceptron-plane" x={plot.x} y={plot.y} width={plot.width} height={plot.height} />
        <polygon
          className="decision-region decision-region--cat"
          points={`${plot.x},${plot.y} ${plot.x + plot.width},${plot.y} ${toSvgX(100)},${toSvgY(line.rightY)} ${toSvgX(0)},${toSvgY(line.leftY)}`}
        />
        <polygon
          className="decision-region decision-region--dog"
          points={`${plot.x},${plot.y + plot.height} ${toSvgX(0)},${toSvgY(line.leftY)} ${toSvgX(100)},${toSvgY(line.rightY)} ${plot.x + plot.width},${plot.y + plot.height}`}
        />
        <text className="region-label region-label--cat" x={plot.x + plot.width - 74} y={plot.y + 38}>
          GATO
        </text>
        <text className="region-label region-label--dog" x={plot.x + 28} y={plot.y + plot.height - 24}>
          CACHORRO
        </text>
        <line
          x1={toSvgX(0)}
          y1={toSvgY(line.leftY)}
          x2={toSvgX(100)}
          y2={toSvgY(line.rightY)}
          className="decision-line"
        />
        <text
          className="decision-line__label"
          x={(toSvgX(0) + toSvgX(100)) / 2}
          y={(toSvgY(line.leftY) + toSvgY(line.rightY)) / 2 - 12}
          textAnchor="middle"
        >
          z = 0
        </text>
        {[{ id: "left" as const, x: 0, y: line.leftY }, { id: "right" as const, x: 100, y: line.rightY }].map((handle) => (
          <circle
            key={handle.id}
            className="decision-handle"
            cx={toSvgX(handle.x)}
            cy={toSvgY(handle.y)}
            r="9"
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragHandle(handle.id);
              setMovedDuringDrag(false);
            }}
          />
        ))}
        {xorPoints.map((point) => {
          const key = `${point.x}-${point.y}`;
          const wrong = pointErrors.has(key);
          return (
            <g key={key} className="perceptron-point-group">
              {wrong ? (
                <circle
                  className="perceptron-error-ring"
                  cx={toSvgX(point.x)}
                  cy={toSvgY(point.y)}
                  r="17"
                />
              ) : null}
              <circle cx={toSvgX(point.x)} cy={toSvgY(point.y)} r="11" data-class={point.cls} data-wrong={wrong} />
            </g>
          );
        })}
      </svg>
      <p className="perceptron__hint">
        {discoveryStage >= 4 ? "A linha continua mudando, mas sempre deixa algum ponto do lado errado." : "Arraste os pontos amarelos nas extremidades da linha."}
      </p>
    </div>
  );
};

export const ErrorRuler = () => {
  const [prediction, setPrediction] = useState(0.4);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const target = 1;
  const error = target - prediction;
  const loss = error * error;
  const scaleMax = 1.4;
  const targetX = 80 + (target / scaleMax) * 430;
  const predictionX = 80 + (prediction / scaleMax) * 430;
  const observedX = 390;
  const predictedX = 262;
  const lossLabel = loss === 0 ? "0" : loss.toFixed(2);
  const isPerfectPrediction = loss === 0;
  const distanceLabelX = (predictionX + targetX) / 2;

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 4200),
      window.setTimeout(() => setPhase(2), 7600)
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div className="error-ruler panel">
      <div className="error-ruler__stage" data-phase={phase}>
        <div
          className="error-state error-state--ceres"
          data-active={phase === 0}
          aria-hidden={phase !== 0}
          aria-label="Cena conceitual sobre Ceres e observações imperfeitas"
        >
          <div className="ceres-scene__header">
            <span>1801</span>
            <b>Ceres desaparece do céu.</b>
          </div>
          <svg viewBox="0 0 560 230" role="img" aria-label="Órbita simplificada com poucos pontos de observação">
            <ellipse className="ceres-orbit" cx="280" cy="122" rx="190" ry="68" />
            <path className="ceres-hidden-arc" d="M352 62 C438 76 478 113 452 151" />
            <circle className="ceres-sun" cx="280" cy="122" r="9" />
            {[182, 222, 262, 304].map((x, index) => (
              <circle
                key={x}
                className="ceres-observation"
                cx={x}
                cy={index % 2 === 0 ? 72 + index * 10 : 78 + index * 8}
                r="5"
              />
            ))}
            <path className="ceres-prediction" d="M318 72 C370 69 418 92 444 128" />
            <circle className="ceres-expected" cx="444" cy="128" r="6" />
          </svg>
          <p>Qual previsão está mais próxima das observações?</p>
          <strong>Não basta saber que erramos. Precisamos medir quanto erramos.</strong>
        </div>

        <div
          className="error-state error-state--distance"
          data-active={phase === 1}
          aria-hidden={phase !== 1}
          aria-label="Erro representado como distância entre valor observado e previsto"
        >
          <svg viewBox="0 0 560 150" role="img" aria-label="Distância entre valor previsto e observado">
            <line className="distance-axis" x1="80" y1="84" x2="500" y2="84" />
            <line className="distance-gap" x1={predictedX} y1="84" x2={observedX} y2="84" />
            <circle className="distance-dot distance-dot--predicted" cx={predictedX} cy="84" r="8" />
            <circle className="distance-dot distance-dot--observed" cx={observedX} cy="84" r="8" />
            <text x={predictedX} y="122" textAnchor="middle">valor previsto</text>
            <text x={observedX} y="56" textAnchor="middle">valor observado</text>
          </svg>
          <div className="error-formulas">
            <span>erro = observado - previsto</span>
            <span>erro² = (observado - previsto)²</span>
          </div>
        </div>

        <div
          className="error-state error-state--loss"
          data-active={phase === 2}
          aria-hidden={phase !== 2}
          aria-label="Comparação entre alvo e previsão de uma rede neural"
        >
          <div className="loss-scene__morph">
            <span>DA PREVISÃO À PERDA</span>
          </div>
          <svg viewBox="0 0 560 170" role="img" aria-label="Distância entre alvo 1.0 e previsão ajustável da rede">
            <line className="distance-axis" x1="80" y1="82" x2="510" y2="82" />
            <line
              className="distance-gap distance-gap--live"
              x1={predictionX}
              y1="82"
              x2={targetX}
              y2="82"
              data-zero={isPerfectPrediction}
            />
            <text className="distance-label" x={distanceLabelX} y="68" textAnchor="middle" data-zero={isPerfectPrediction}>
              distância
            </text>
            <circle className="distance-dot distance-dot--predicted" cx={predictionX} cy="82" r="9" />
            <circle className="distance-dot distance-dot--observed" cx={targetX} cy="82" r="9" />
            <text x={predictionX} y="122" textAnchor="middle">previsão {prediction.toFixed(1)}</text>
            <text x={targetX} y="52" textAnchor="middle">alvo {target.toFixed(1)}</text>
          </svg>
          <div className="loss-readout" data-zero={isPerfectPrediction}>
            <strong>FUNÇÃO DE PERDA</strong>
            <span>(1.0 - {prediction.toFixed(1)})²</span>
            <b>{lossLabel}</b>
          </div>
          {loss === 0 ? <p className="loss-match">previsão coincidiu com o alvo</p> : null}
          <label className="loss-slider">
            Ajuste a previsão da rede
            <input
              min="0"
              max="1.4"
              step="0.1"
              type="range"
              value={prediction}
              onChange={(event) => setPrediction(Number(event.target.value))}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export const WinterExpectations = () => (
  <div className="winter-demo panel" aria-label="Expectativa subindo mais rapido que resultados e depois retraindo">
    <div className="winter-demo__period">
      <span>Décadas de 1970 e 1980</span>
      <span>períodos de retração</span>
    </div>
    <svg viewBox="0 0 640 360" role="img" aria-label="Curva de expectativa cresce, resultados ficam abaixo e interesse recua">
      <line className="winter-axis" x1="70" y1="300" x2="570" y2="300" />
      <line className="winter-axis" x1="70" y1="54" x2="70" y2="300" />
      <path className="winter-capacity" d="M86 270 C185 254 270 230 350 212 C430 196 500 184 556 170" />
      <path className="winter-expectation" d="M86 268 C160 228 218 156 282 88 C318 54 348 58 374 98 C426 176 480 235 556 282" />
      <circle className="winter-peak" cx="312" cy="70" r="8" />
      <line className="winter-gap" x1="312" y1="70" x2="312" y2="220" />
      <text x="112" y="92" className="winter-label winter-label--warm">expectativa</text>
      <text x="402" y="188" className="winter-label">resultados aquém</text>
      <text x="410" y="276" className="winter-label">retração</text>
      <text x="286" y="48" className="winter-label winter-label--peak">pico</text>
      <text x="88" y="324" className="winter-label winter-label--muted">entusiasmo</text>
      <text x="412" y="324" className="winter-label winter-label--muted">interesse / financiamento</text>
    </svg>
    <p className="winter-demo__note">Expectativas e promessas sintetizadas de uma época, não um único evento.</p>
  </div>
);

const thawPillars = [
  {
    title: "DADOS",
    text: "mais exemplos para aprender",
    visual: "dots"
  },
  {
    title: "COMPUTAÇÃO",
    text: "mais cálculos em menos tempo",
    visual: "pulses"
  },
  {
    title: "ARQUITETURAS",
    text: "modelos capazes de representar padrões mais complexos",
    visual: "layers"
  },
  {
    title: "TREINAMENTO",
    text: "formas melhores de ajustar muitos parâmetros",
    visual: "weights"
  }
];

export const ThawDemo = () => (
  <div className="thaw-demo panel" aria-label="Quatro condições amadurecem e reativam redes neurais">
    <div className="thaw-map">
      {thawPillars.map(({ title, text, visual }) => (
        <div className="thaw-pillar" key={title}>
          <div className={`thaw-pillar__visual thaw-pillar__visual--${visual}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <b>{title}</b>
          <span>{text}</span>
        </div>
      ))}
      <svg className="thaw-network" viewBox="0 0 620 360" role="img" aria-label="Rede neural pequena crescendo com mais pesos">
        <text className="thaw-network-title" x="310" y="58" textAnchor="middle">UMA IDEIA QUE AGORA PODE ESCALAR</text>
        {[112, 180, 248].map((y, index) => (
          <g className="thaw-signal" key={`signal-${y}`} style={{ animationDelay: `${1.25 + index * 0.28}s` }}>
            <circle cx="122" cy={y} r="4" />
            <circle cx="146" cy={y} r="3" />
          </g>
        ))}
        {[132, 180, 228].map((y1) =>
          [150, 210].map((y2) => (
            <line key={`early-${y1}-${y2}`} className="thaw-weight thaw-weight--early" x1="232" y1={y1} x2="306" y2={y2} />
          ))
        )}
        {[150, 210].map((y) => (
          <line key={`early-out-${y}`} className="thaw-weight thaw-weight--early" x1="338" y1={y} x2="412" y2="180" />
        ))}
        {[150, 210].map((y1) =>
          [126, 178, 230].map((y2) => (
            <line key={`late-a-${y1}-${y2}`} className="thaw-weight thaw-weight--late" x1="338" y1={y1} x2="414" y2={y2} />
          ))
        )}
        {[126, 178, 230].map((y) => (
          <line key={`late-b-${y}`} className="thaw-weight thaw-weight--late" x1="442" y1={y} x2="510" y2="180" />
        ))}
        {[132, 180, 228].map((y) => (
          <circle key={`input-${y}`} className="thaw-node thaw-node--input" cx="218" cy={y} r="13" />
        ))}
        {[150, 210].map((y) => (
          <circle key={`hidden-a-${y}`} className="thaw-node thaw-node--early" cx="322" cy={y} r="16" />
        ))}
        {[126, 178, 230].map((y) => (
          <circle key={`hidden-b-${y}`} className="thaw-node thaw-node--late" cx="428" cy={y} r="13" />
        ))}
        <circle className="thaw-node thaw-node--early" cx="526" cy="180" r="18" />
        <circle className="thaw-pulse thaw-pulse--one" cx="260" cy="142" r="4" />
        <circle className="thaw-pulse thaw-pulse--two" cx="374" cy="193" r="4" />
        <circle className="thaw-pulse thaw-pulse--three" cx="474" cy="204" r="4" />
        <text className="thaw-weight-label thaw-weight-label--one" x="260" y="130">w₁</text>
        <text className="thaw-weight-label thaw-weight-label--two" x="370" y="224">w₂</text>
        <text className="thaw-weight-label thaw-weight-label--three" x="460" y="136">w₃</text>
        <text className="thaw-weight-label thaw-weight-label--four" x="480" y="246">wₙ</text>
      </svg>
      <div className="thaw-scale" aria-label="Escala conceitual de pesos">
        <span>3 pesos</span>
        <i />
        <span>dezenas</span>
        <i />
        <span>centenas</span>
        <i />
        <span>milhares...</span>
      </div>
    </div>
    <p className="thaw-insight">Quanto maior a rede, mais pesos precisam ser ajustados.</p>
    <p className="thaw-question">Se agora temos tantos pesos, como ajustamos todos eles?</p>
  </div>
);

const backpropSteps = [
  {
    label: "Previsão",
    title: "PREVISÃO",
    text: "A informação avança pela rede."
  },
  {
    label: "Erro",
    title: "ERRO",
    text: "Comparamos a previsão com o alvo."
  },
  {
    label: "Responsabilidade",
    title: "RESPONSABILIDADE",
    text: "O cálculo retorna pela rede para descobrir como cada peso influenciou a perda."
  },
  {
    label: "Gradientes",
    title: "GRADIENTES",
    text: "Backpropagation calcula como cada peso influencia a perda."
  }
];

const backpropInputNodes = [
  { id: "x1", x: 88, y: 82, label: "x₁" },
  { id: "x2", x: 88, y: 164, label: "x₂" },
  { id: "x3", x: 88, y: 246, label: "x₃" }
];

const backpropHiddenNodes = [
  { id: "h1", x: 308, y: 112 },
  { id: "h2", x: 308, y: 216 }
];

const backpropConnections = [
  { id: "w1", display: "w₁", from: backpropInputNodes[0], to: backpropHiddenNodes[0], layer: 1, influence: 0.95, offset: -24 },
  { id: "w2", display: "w₂", from: backpropInputNodes[0], to: backpropHiddenNodes[1], layer: 1, influence: 0.48, offset: -42 },
  { id: "w3", display: "w₃", from: backpropInputNodes[1], to: backpropHiddenNodes[0], layer: 1, influence: 0.68, offset: 38 },
  { id: "w4", display: "w₄", from: backpropInputNodes[1], to: backpropHiddenNodes[1], layer: 1, influence: 0.82, offset: 34 },
  { id: "w5", display: "w₅", from: backpropInputNodes[2], to: backpropHiddenNodes[0], layer: 1, influence: 0.38, offset: -38 },
  { id: "w6", display: "w₆", from: backpropInputNodes[2], to: backpropHiddenNodes[1], layer: 1, influence: 0.58, offset: 34 },
  { id: "w7", display: "w₇", from: backpropHiddenNodes[0], to: { x: 540, y: 164 }, layer: 2, influence: 0.88, offset: -24 },
  { id: "w8", display: "w₈", from: backpropHiddenNodes[1], to: { x: 540, y: 164 }, layer: 2, influence: 0.62, offset: 24 }
];

const getBackpropWeightLabelPosition = (connection: (typeof backpropConnections)[number]) => {
  const dx = connection.to.x - connection.from.x;
  const dy = connection.to.y - connection.from.y;
  const length = Math.hypot(dx, dy) || 1;
  const midX = (connection.from.x + connection.to.x) / 2;
  const midY = (connection.from.y + connection.to.y) / 2;

  return {
    x: midX + (-dy / length) * connection.offset,
    y: midY + (dx / length) * connection.offset
  };
};

export const NeuralNetworkFlow = () => {
  const [step, setStep] = useState(0);
  const currentStep = backpropSteps[step];
  const isPrediction = step === 0;
  const showsLoss = step >= 1;
  const isResponsibility = step === 2;
  const showsGradients = step === 3;
  const focusedGradient = backpropConnections.find((connection) => connection.id === "w3") ?? backpropConnections[2];
  const focusedGradientLabel = getBackpropWeightLabelPosition(focusedGradient);
  const getBackwardDelay = (connection: (typeof backpropConnections)[number], index: number) =>
    connection.layer === 2 ? (index - 6) * 190 : 620 + index * 100;

  useEffect(() => {
    const section = document.getElementById("backprop");
    if (!section) {
      return;
    }

    section.dataset.backpropComplete = String(showsGradients);

    return () => {
      delete section.dataset.backpropComplete;
    };
  }, [showsGradients]);

  return (
    <div className="network panel" data-step={step}>
      <div className="network__header">
        <span className="network__counter">{step + 1} / 4 — {currentStep.label}</span>
        <b>{currentStep.title}</b>
      </div>

      <div className="network__stage">
        <svg viewBox="0 0 740 330" role="img" aria-label="Rede neural mostrando previsão, erro, responsabilidade e gradientes">
          <text className="network-layer-label network-layer-label--input" x="88" y="36" textAnchor="middle">ENTRADA</text>
          <text className="network-layer-label" x="308" y="36" textAnchor="middle">CAMADA</text>
          <text className="network-layer-label" x="540" y="36" textAnchor="middle">SAÍDA</text>

          {backpropConnections.map((connection) => {
            const style = {
              opacity: isResponsibility ? 0.22 + connection.influence * 0.46 : undefined,
              strokeWidth: isResponsibility ? 1.8 + connection.influence * 2.7 : undefined
            };
            const isMainGradient = connection.id === "w3";

            return (
              <line
                key={connection.id}
                className={[
                  "network-link",
                  isResponsibility ? "has-responsibility" : "",
                  showsGradients ? "has-gradient" : "",
                  showsGradients && isMainGradient ? "is-gradient-focus" : ""
                ].filter(Boolean).join(" ")}
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                style={style}
              />
            );
          })}

          {isPrediction
            ? backpropConnections.map((connection, index) => {
                const forwardDelay = connection.layer === 1 ? index * 95 : 620 + (index - 6) * 150;
                return (
                  <line
                    key={`forward-${connection.id}`}
                    className="network-pulse network-pulse--forward"
                    x1={connection.from.x}
                    y1={connection.from.y}
                    x2={connection.to.x}
                    y2={connection.to.y}
                    style={{ animationDelay: `${forwardDelay}ms` }}
                  />
                );
              })
            : null}

          {isResponsibility
            ? backpropConnections.map((connection, index) => {
                return (
                  <line
                    key={`backward-${connection.id}`}
                    className="network-pulse network-pulse--backward"
                    x1={connection.from.x}
                    y1={connection.from.y}
                    x2={connection.to.x}
                    y2={connection.to.y}
                    style={{ animationDelay: `${getBackwardDelay(connection, index)}ms` }}
                  />
                );
              })
            : null}

          {backpropInputNodes.map((node) => (
            <g key={node.id} className="network-node network-node--input">
              <circle cx={node.x} cy={node.y} r="21" />
              <text x={node.x - 44} y={node.y + 5} textAnchor="middle">{node.label}</text>
            </g>
          ))}

          {backpropHiddenNodes.map((node) => (
            <g key={node.id} className="network-node">
              <circle cx={node.x} cy={node.y} r="25" />
            </g>
          ))}

          <g className="network-node network-node--output">
            <circle cx="540" cy="164" r="30" />
          </g>

          <g className="network-prediction" data-visible={true}>
            <text x="602" y="142">PREVISÃO</text>
            <text x="602" y="171" className="network-prediction__value">0.4</text>
          </g>

          <g className="network-loss-meter" data-visible={showsLoss} data-muted={showsGradients}>
            <text x="602" y="211">ALVO</text>
            <text x="602" y="238" className="network-loss-meter__target">1.0</text>
            <line x1="602" y1="252" x2="656" y2="252" />
            <text x="602" y="279">(1.0 - 0.4)²</text>
            <text x="602" y="307" className="network-loss-meter__value">PERDA 0.36</text>
          </g>

          <g className="network-weight-labels" data-visible={isResponsibility || showsGradients}>
            {backpropConnections.map((connection, index) => {
              const label = getBackpropWeightLabelPosition(connection);

              return (
                <g
                  key={`weight-${connection.id}`}
                  className={connection.id === focusedGradient.id ? "is-focus-weight" : ""}
                  style={{ animationDelay: `${isResponsibility ? getBackwardDelay(connection, index) + 260 : 0}ms` }}
                >
                  <rect x={label.x - 15} y={label.y - 13} width="30" height="20" rx="5" />
                  <text x={label.x} y={label.y + 2} textAnchor="middle">
                    {connection.display}
                  </text>
                </g>
              );
            })}
          </g>

          <g className="network-gradient-focus" data-visible={showsGradients}>
            <text x={focusedGradientLabel.x + 28} y={focusedGradientLabel.y - 26}>∂L/∂w₃</text>
            <text x={focusedGradientLabel.x + 28} y={focusedGradientLabel.y + 6}>Se eu mudar este peso,</text>
            <text x={focusedGradientLabel.x + 28} y={focusedGradientLabel.y + 28}>quanto a perda muda?</text>
          </g>
        </svg>
      </div>

      <div className="network__footer">
        <div className="network__copy">
          <p>{currentStep.text}</p>
          {step === 1 ? (
            <p className="network__question">Sabemos quanto erramos. Mas quais pesos contribuíram para esse erro?</p>
          ) : null}
          {showsGradients ? (
            <>
              <p className="network__detail">A rede avança para responder. O cálculo retorna para ensiná-la.</p>
              <p className="network__chain"><b>REGRA DA CADEIA</b> Partimos da perda e seguimos as dependências de volta até os pesos.</p>
              <p className="network__mini-gradients">O mesmo cálculo é feito para os outros pesos: ∂L/∂w₁ · ∂L/∂w₂ · ∂L/∂w₃ · ...</p>
            </>
          ) : null}
        </div>
        <div className="control-row">
          <button className="ghost-button" type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Anterior
          </button>
          <button className="primary-button" type="button" onClick={() => setStep(step === backpropSteps.length - 1 ? 0 : step + 1)}>
            {step === backpropSteps.length - 1 ? "Recomeçar" : "Próximo passo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const LossLandscape = () => {
  const initialWeight = 0.8;
  const minimumWeight = 0.2;
  const learningRates = {
    pequena: { label: "taxa pequena", eta: 0.08, steps: 10 },
    adequada: { label: "taxa adequada", eta: 0.32, steps: 7 },
    grande: { label: "taxa grande", eta: 1.08, steps: 8 }
  };
  const [weights, setWeights] = useState([initialWeight]);
  const [gradientVisible, setGradientVisible] = useState(false);
  const [rateMode, setRateMode] = useState<keyof typeof learningRates | null>(null);
  const [running, setRunning] = useState(false);
  const animationRef = useRef<number | null>(null);
  const plot = { x: 70, y: 38, width: 500, height: 250 };
  const domain = { min: -0.35, max: 1.05 };
  const maxLoss = 0.72;
  const currentWeight = weights[weights.length - 1];
  const currentLoss = (currentWeight - minimumWeight) ** 2;
  const gradient = 2 * (currentWeight - minimumWeight);
  const stepCount = Math.max(0, weights.length - 1);
  const hasStepped = stepCount > 0;
  const showRateControls = stepCount >= 3 || rateMode !== null;
  const completed = rateMode !== null && !running && stepCount > 0;
  const xForWeight = (weight: number) => plot.x + ((weight - domain.min) / (domain.max - domain.min)) * plot.width;
  const yForLoss = (loss: number) => plot.y + plot.height - (Math.min(maxLoss, loss) / maxLoss) * plot.height;
  const pointForWeight = (weight: number) => ({
    x: xForWeight(weight),
    y: yForLoss((weight - minimumWeight) ** 2)
  });
  const currentPoint = pointForWeight(currentWeight);
  const previousPoint = weights.length > 1 ? pointForWeight(weights[weights.length - 2]) : null;
  const curvePath = Array.from({ length: 64 }, (_, index) => {
    const weight = domain.min + (index / 63) * (domain.max - domain.min);
    const point = pointForWeight(weight);
    return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }).join(" ");
  const tangentLength = 70;
  const tangentScale = 0.38;
  const tangentStart = {
    x: currentPoint.x - tangentLength / 2,
    y: currentPoint.y + (gradient * tangentLength * tangentScale) / 2
  };
  const tangentEnd = {
    x: currentPoint.x + tangentLength / 2,
    y: currentPoint.y - (gradient * tangentLength * tangentScale) / 2
  };
  const oppositeX = currentPoint.x - Math.sign(gradient || 1) * 56;
  const rateConclusion =
    rateMode === "pequena"
      ? "Passos pequenos são estáveis, mas lentos."
      : rateMode === "adequada"
        ? "Passos adequados reduzem a perda com eficiência."
        : rateMode === "grande"
          ? "Passos grandes podem ultrapassar o mínimo e oscilar."
          : "";

  const takeStep = (eta = 0.32) => {
    setGradientVisible(true);
    setWeights((current) => {
      const weight = current[current.length - 1];
      const nextWeight = weight - eta * 2 * (weight - minimumWeight);
      return [...current, Math.max(domain.min, Math.min(domain.max, Number(nextWeight.toFixed(4))))];
    });
  };

  const runRateDemo = (mode: keyof typeof learningRates) => {
    if (animationRef.current !== null) {
      window.clearInterval(animationRef.current);
    }

    const { eta, steps } = learningRates[mode];
    let nextWeights = [initialWeight];
    let current = initialWeight;
    setRateMode(mode);
    setGradientVisible(true);
    setWeights(nextWeights);
    setRunning(true);

    animationRef.current = window.setInterval(() => {
      current = current - eta * 2 * (current - minimumWeight);
      current = Math.max(domain.min, Math.min(domain.max, Number(current.toFixed(4))));
      nextWeights = [...nextWeights, current];
      setWeights(nextWeights);

      if (nextWeights.length > steps) {
        if (animationRef.current !== null) {
          window.clearInterval(animationRef.current);
          animationRef.current = null;
        }
        setRunning(false);
      }
    }, 520);
  };

  useEffect(() => {
    const section = document.getElementById("gradient");
    if (!section) {
      return;
    }

    section.dataset.gradientComplete = String(completed);

    return () => {
      delete section.dataset.gradientComplete;
    };
  }, [completed]);

  useEffect(
    () => () => {
      if (animationRef.current !== null) {
        window.clearInterval(animationRef.current);
      }
    },
    []
  );

  return (
    <div className="landscape panel" data-complete={completed}>
      <div className="landscape__header">
        <span>Vamos acompanhar apenas um peso.</span>
        <b>passo {stepCount}</b>
      </div>

      <svg viewBox="0 0 660 340" role="img" aria-label="Curva de perda em U mostrando gradient descent em um peso">
        <line className="landscape-axis" x1={plot.x} y1={plot.y + plot.height} x2={plot.x + plot.width + 35} y2={plot.y + plot.height} />
        <line className="landscape-axis" x1={plot.x} y1={plot.y - 6} x2={plot.x} y2={plot.y + plot.height} />
        <text className="landscape-axis-label" x={plot.x - 40} y={plot.y + 16}>PERDA L</text>
        <text className="landscape-axis-label" x={plot.x + plot.width - 12} y={plot.y + plot.height + 32}>PESO w</text>
        <path className="landscape-curve" d={curvePath} />
        <line className="landscape-minimum" x1={xForWeight(minimumWeight)} y1={plot.y + plot.height - 44} x2={xForWeight(minimumWeight)} y2={plot.y + plot.height + 4} />
        <text className="landscape-minimum-label" x={xForWeight(minimumWeight)} y={plot.y + plot.height - 54} textAnchor="middle">menor perda</text>

        {weights.slice(0, -1).map((weight, index) => {
          const point = pointForWeight(weight);
          return (
            <circle
              key={`${weight}-${index}`}
              className="landscape-trace"
              cx={point.x}
              cy={point.y}
              r={Math.max(3.2, 7 - index * 0.35)}
              style={{ opacity: Math.max(0.16, 0.45 - index * 0.035) }}
            />
          );
        })}

        {previousPoint ? (
          <line className="landscape-step-arrow" x1={previousPoint.x} y1={previousPoint.y} x2={currentPoint.x} y2={currentPoint.y} />
        ) : null}

        {gradientVisible ? (
          <>
            <line className="landscape-tangent" x1={tangentStart.x} y1={tangentStart.y} x2={tangentEnd.x} y2={tangentEnd.y} />
            <text className="landscape-gradient-label" x={currentPoint.x + 34} y={currentPoint.y - 44}>gradiente</text>
            <line className="landscape-gradient-arrow" x1={currentPoint.x + 8} y1={currentPoint.y - 10} x2={currentPoint.x + 58} y2={currentPoint.y - 46} />
            <line className="landscape-descent-arrow" x1={currentPoint.x - 8} y1={currentPoint.y + 12} x2={oppositeX} y2={currentPoint.y + 46} />
            <text className="landscape-descent-note" x={oppositeX - 28} y={currentPoint.y + 58}>descida</text>
          </>
        ) : null}

        <circle className="landscape-current" cx={currentPoint.x} cy={currentPoint.y} r="12" />
        <g className="landscape-point-label" transform={`translate(${Math.min(currentPoint.x + 18, 548)} ${Math.max(currentPoint.y - 30, 58)})`}>
          <rect x="0" y="0" width="82" height="42" rx="6" />
          <text x="10" y="17">w = {currentWeight.toFixed(2)}</text>
          <text x="10" y="34">L = {currentLoss.toFixed(2)}</text>
        </g>
      </svg>

      <div className="landscape__explain">
        {completed ? (
          <div className="landscape-closing">
            <b>TREINAR É REPETIR</b>
            <span>calcular gradientes → ajustar pesos → calcular novamente → ...</span>
            <span>w → w₁  w₂  w₃  ...  wₙ</span>
            <em>Estamos vendo apenas um peso. Uma rede ajusta muitos deles.</em>
          </div>
        ) : showRateControls ? (
          <div className="landscape-didactic landscape-didactic--rate">
            <b>TAMANHO DO PASSO</b>
            <span>η controla quanto o peso muda em cada atualização.</span>
            {rateConclusion ? <strong>{rateConclusion}</strong> : null}
          </div>
        ) : hasStepped ? (
          <div className="landscape-didactic landscape-didactic--formula">
            <b>AJUSTE DO PESO</b>
            <strong>w novo = w atual − η × ∂L/∂w</strong>
            <span><em>∂L/∂w</em> direção</span>
            <span><em>η</em> tamanho do passo</span>
          </div>
        ) : gradientVisible ? (
          <div className="landscape-didactic landscape-didactic--gradient">
            <div>
              <b>GRADIENTE</b>
              <strong>∂L/∂w</strong>
              <span>Mostra para onde a perda aumenta.</span>
            </div>
            <div>
              <b>GRADIENT DESCENT</b>
              <strong>movimento ←</strong>
              <span>Movemos o peso na direção contrária.</span>
            </div>
          </div>
        ) : (
          <p>Para cada valor do peso, existe uma perda.</p>
        )}
      </div>

      <div className="landscape__controls">
        {!gradientVisible ? (
          <button className="primary-button" type="button" onClick={() => setGradientVisible(true)}>
            Mostrar gradiente
          </button>
        ) : !showRateControls ? (
          <button className="primary-button" type="button" onClick={() => takeStep()}>
            {hasStepped ? "Dar outro passo" : "Dar um passo"}
          </button>
        ) : (
          <>
            {Object.entries(learningRates).map(([key, option]) => (
              <button
                key={key}
                className={rateMode === key ? "primary-button" : "ghost-button"}
                type="button"
                onClick={() => runRateDemo(key as keyof typeof learningRates)}
                disabled={running}
              >
                {option.label}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const deepLearningSteps = [
  {
    label: "Entrada",
    title: "ENTRADA",
    text: "Como muitos sinais simples podem virar uma decisão?"
  },
  {
    label: "Padrões simples",
    title: "PADRÕES SIMPLES",
    text: "As primeiras camadas podem responder a características simples da entrada."
  },
  {
    label: "Combinações",
    title: "COMBINAÇÕES",
    text: "A próxima camada recebe o que a anterior construiu e pode combinar esses sinais."
  },
  {
    label: "Representação",
    title: "REPRESENTAÇÃO",
    text: "À medida que avançamos, a rede pode construir representações cada vez mais complexas."
  },
  {
    label: "Profundidade",
    title: "PROFUNDIDADE",
    text: "Cada camada trabalha sobre o que a anterior construiu."
  }
];

const deepColumns = {
  input: 72,
  patterns: 218,
  combinations: 365,
  representation: 512,
  decision: 642
};

type DeepNetworkState = "future" | "past" | "current" | "complete";

type DeepNetworkNode = {
  id: string;
  x: number;
  y: number;
  r: number;
  stage: number;
};

type DeepNetworkEdge = {
  from: string;
  to: string;
  stage: number;
};

const deepNodes: DeepNetworkNode[] = [
  { id: "input", x: deepColumns.input, y: 162, r: 25, stage: 0 },
  { id: "p1", x: deepColumns.patterns, y: 106, r: 14, stage: 1 },
  { id: "p2", x: deepColumns.patterns, y: 156, r: 14, stage: 1 },
  { id: "p3", x: deepColumns.patterns, y: 206, r: 14, stage: 1 },
  { id: "p4", x: deepColumns.patterns, y: 256, r: 14, stage: 1 },
  { id: "c1", x: deepColumns.combinations, y: 124, r: 15, stage: 2 },
  { id: "c2", x: deepColumns.combinations, y: 190, r: 15, stage: 2 },
  { id: "c3", x: deepColumns.combinations, y: 256, r: 15, stage: 2 },
  { id: "r1", x: deepColumns.representation, y: 140, r: 14, stage: 3 },
  { id: "r2", x: deepColumns.representation, y: 190, r: 14, stage: 3 },
  { id: "r3", x: deepColumns.representation, y: 240, r: 14, stage: 3 },
  { id: "decision", x: deepColumns.decision, y: 190, r: 14, stage: 4 }
];

const deepNodeById = Object.fromEntries(deepNodes.map((node) => [node.id, node])) as Record<string, DeepNetworkNode>;

const deepEdges: DeepNetworkEdge[] = [
  { from: "input", to: "p1", stage: 1 },
  { from: "input", to: "p2", stage: 1 },
  { from: "input", to: "p3", stage: 1 },
  { from: "input", to: "p4", stage: 1 },
  { from: "p1", to: "c1", stage: 2 },
  { from: "p2", to: "c1", stage: 2 },
  { from: "p3", to: "c2", stage: 2 },
  { from: "p4", to: "c3", stage: 2 },
  { from: "c1", to: "r1", stage: 3 },
  { from: "c2", to: "r2", stage: 3 },
  { from: "c3", to: "r3", stage: 3 },
  { from: "r1", to: "decision", stage: 4 },
  { from: "r2", to: "decision", stage: 4 },
  { from: "r3", to: "decision", stage: 4 }
];

const getDeepEdgeState = (edge: DeepNetworkEdge, step: number): DeepNetworkState => {
  if (step === deepLearningSteps.length - 1) {
    return "complete";
  }

  if (step === 0) {
    return edge.stage === 1 ? "current" : "future";
  }

  if (edge.stage < step) {
    return "past";
  }

  if (edge.stage === step) {
    return "current";
  }

  return "future";
};

const getDeepNodeState = (node: DeepNetworkNode, step: number): DeepNetworkState => {
  if (step === deepLearningSteps.length - 1) {
    return "complete";
  }

  if (node.stage < step) {
    return "past";
  }

  if (node.stage === step) {
    return "current";
  }

  return "future";
};

export const DeepLearningScale = () => {
  const [step, setStep] = useState(0);
  const currentStep = deepLearningSteps[step];
  const showsTrainingRecap = step === deepLearningSteps.length - 1;

  useEffect(() => {
    const section = document.getElementById("deep-learning");
    if (!section) {
      return;
    }

    section.dataset.deepComplete = String(showsTrainingRecap);

    return () => {
      delete section.dataset.deepComplete;
    };
  }, [showsTrainingRecap]);

  return (
    <div className="deep-scale panel" data-step={step}>
      <div className="deep-scale__header">
        <span>{step + 1} / 5 — {currentStep.label}</span>
        <b>{currentStep.title}</b>
      </div>

      <div className="deep-scale__stage">
        <svg viewBox="0 0 760 360" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Rede profunda construindo representações em etapas sucessivas">
          <text className="deep-scale__stage-label" x={deepColumns.input} y="42" textAnchor="middle">ENTRADA</text>
          <text className="deep-scale__stage-label" x={deepColumns.patterns} y="42" textAnchor="middle">PADRÕES</text>
          <text className="deep-scale__stage-label" x={deepColumns.combinations} y="42" textAnchor="middle">COMBINAÇÕES</text>
          <text className="deep-scale__stage-label" x={deepColumns.representation} y="42" textAnchor="middle">REPRESENTAÇÃO</text>
          <text className="deep-scale__stage-label" x={deepColumns.decision} y="42" textAnchor="middle">DECISÃO</text>

          <g className="deep-edges">
            {deepEdges.map((connection, index) => {
              const from = deepNodeById[connection.from];
              const to = deepNodeById[connection.to];

              return (
                <line
                  key={`deep-link-${connection.from}-${connection.to}`}
                  className="deep-link"
                  data-state={getDeepEdgeState(connection, step)}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  style={{ animationDelay: `${index * 28}ms` }}
                />
              );
            })}
          </g>

          <g className="deep-input-frame">
            <rect x="30" y="104" width="84" height="126" rx="10" />
          </g>

          <g className="deep-nodes">
            {deepNodes.map((node) => (
              <circle
                key={`${node.id}-mask`}
                className="deep-node-mask"
                cx={node.x}
                cy={node.y}
                r={node.r + 1.5}
              />
            ))}
            {deepNodes.map((node) => (
              <circle
                key={node.id}
                className="deep-node"
                data-state={getDeepNodeState(node, step)}
                cx={node.x}
                cy={node.y}
                r={node.r}
              />
            ))}
          </g>

          <g className="deep-input-glyph" data-visible={step >= 0}>
            <path d="M53 140 L60 124 L72 140 L84 124 L91 140" />
            <circle className="deep-input-glyph__eye" cx="63" cy="159" r="2.6" />
            <circle className="deep-input-glyph__eye" cx="81" cy="159" r="2.6" />
            <path d="M61 176 C68 182 76 182 83 176" />
          </g>

          <g className="deep-patterns deep-concept" data-visible={step >= 1}>
              <text x={deepColumns.patterns} y="314" textAnchor="middle">Exemplo conceitual.</text>
              <line x1="198" y1="72" x2="215" y2="72" />
              <line x1="230" y1="64" x2="230" y2="82" />
              <line x1="198" y1="288" x2="215" y2="304" />
              <path d="M230 302 C238 290 249 290 257 302" />
          </g>

          <g className="deep-combinations deep-concept" data-visible={step >= 2}>
              <text x={deepColumns.combinations} y="308" textAnchor="middle">
                <tspan x={deepColumns.combinations} dy="0">traços + curvas</tspan>
                <tspan x={deepColumns.combinations} dy="15">→ formas</tspan>
              </text>
              <path d="M340 108 L365 94 L390 108" />
              <rect x="342" y="172" width="46" height="32" rx="10" />
              <path d="M342 244 C354 230 376 230 388 244" />
          </g>

          <g className="deep-abstraction deep-concept" data-visible={step >= 3}>
              <text x={deepColumns.representation} y="314" textAnchor="middle">hierarquia aprendida</text>
              <circle cx="512" cy="170" r="22" />
              <path d="M494 159 C504 147 520 147 530 159" />
              <path d="M493 178 C505 190 520 190 532 178" />
              <line x1="512" y1="192" x2="512" y2="224" />
              <path d="M492 212 C504 204 520 204 532 212" />
          </g>

          <g className="deep-output deep-concept" data-visible={step >= 4}>
              <line className="deep-output-line" x1="656" y1="190" x2="660" y2="190" />
              <rect x="660" y="158" width="70" height="64" rx="8" />
              <text x="695" y="196" textAnchor="middle">GATO</text>
              <text x="380" y="342" textAnchor="middle">Isso é profundidade.</text>
          </g>
        </svg>
      </div>

      <div className="deep-scale__explain">
        <p>{currentStep.text}</p>
        {step === 4 ? (
          <>
            <strong>Não é apenas ter muitos neurônios. É organizar transformações em várias camadas sucessivas.</strong>
            <div className="deep-recap" aria-label="Processos de treinamento que continuam valendo">
              <span>forward pass → previsão</span>
              <span>perda → mede o erro</span>
              <span>backpropagation → calcula gradientes</span>
              <span>gradient descent → ajusta pesos</span>
            </div>
          </>
        ) : null}
      </div>

      <div className="deep-scale__controls">
        <button className="ghost-button" type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Anterior
        </button>
        <button className="primary-button" type="button" onClick={() => setStep(step === deepLearningSteps.length - 1 ? 0 : step + 1)}>
          {step === deepLearningSteps.length - 1 ? "Recomeçar" : "Próximo passo"}
        </button>
      </div>
    </div>
  );
};

const languageProbabilities = {
  unigram: [
    ["casa", 18],
    ["gato", 14],
    ["telhado", 11],
    ["muro", 9]
  ],
  bigram: [
    ["telhado", 31],
    ["carro", 22],
    ["chão", 18],
    ["muro", 14]
  ],
  trigram: [
    ["telhado", 52],
    ["muro", 24],
    ["sofá", 16],
    ["carro", 8]
  ]
} as const;

const languageContexts: Record<"unigram" | "bigram" | "trigram", readonly string[]> = {
  unigram: [] as string[],
  bigram: ["no"],
  trigram: ["subiu", "no"]
};

const tokenLabSteps = [
  "FRASE",
  "UNIDADES",
  "PARTES",
  "IDS"
] as const;

export const LanguageLab = () => {
  const [context, setContext] = useState<"unigram" | "bigram" | "trigram">("bigram");
  const [seenContexts, setSeenContexts] = useState(new Set<"unigram" | "bigram" | "trigram">(["bigram"]));
  const probs = languageProbabilities[context];
  const consideredContext = languageContexts[context];
  const contextComplete = seenContexts.size === 3;

  useEffect(() => {
    const section = document.getElementById("language");
    if (!section) {
      return;
    }

    section.dataset.languageComplete = String(contextComplete);

    return () => {
      delete section.dataset.languageComplete;
    };
  }, [contextComplete]);

  const chooseContext = (item: "unigram" | "bigram" | "trigram") => {
    setContext(item);
    setSeenContexts((current) => new Set(current).add(item));
  };

  return (
    <div className="language language--sequenced language--context-only panel">
      <div className="language__header">
        <span>CONTEXTO</span>
        <b>Mais contexto muda a previsão</b>
      </div>

      <div className="language-stage">
        <section className="language-step language-step--context" data-active={true}>
          <p className="language-prompt" aria-label="Frase para completar">
            {["O", "gato", "subiu", "no"].map((word) => (
              <span key={word} data-considered={consideredContext.includes(word)}>
                {word}
              </span>
            ))}
            <strong>______</strong>
          </p>

          <div className="control-row language-context-controls" aria-label="Tipo de contexto considerado">
            {(["unigram", "bigram", "trigram"] as const).map((item) => (
              <button
                className={context === item ? "primary-button" : "ghost-button"}
                type="button"
                key={item}
                onClick={() => chooseContext(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="context-window">
            <span>CONTEXTO CONSIDERADO</span>
            <div>
              {consideredContext.length === 0 ? (
                <em>nenhum contexto anterior</em>
              ) : (
                consideredContext.map((word) => <b key={word}>{word}</b>)
              )}
            </div>
          </div>

          <div className="probabilities language-probabilities">
            {probs.map(([token, probability]) => (
              <span key={token}>
                {token}
                <i style={{ width: `${probability}%` }} />
                <b>{probability}%</b>
              </span>
            ))}
          </div>

          <div className="language-note">
            <span>Exemplo simplificado.</span>
            {contextComplete ? (
              <strong>Mais contexto pode mudar a previsão.</strong>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export const TokensLab = () => {
  const [step, setStep] = useState(0);
  const complete = step === tokenLabSteps.length - 1;

  useEffect(() => {
    const section = document.getElementById("ngrams");
    if (!section) {
      return;
    }

    section.dataset.tokensComplete = String(complete);

    return () => {
      delete section.dataset.tokensComplete;
    };
  }, [complete]);

  return (
    <div className="tokens-lab panel" data-step={step}>
      <div className="tokens-lab__header">
        <span>{step + 1} / 4 — {tokenLabSteps[step]}</span>
        <b>{step < 3 ? "Texto vira unidades" : "IDs ainda não são significado"}</b>
      </div>

      <div className="tokens-lab__stage">
        <section className="tokens-step" data-active={step === 0}>
          <p className="tokens-phrase">O gato subiu no telhado</p>
        </section>

        <section className="tokens-step" data-active={step === 1}>
          <div className="token-transform">
            <span>TOKENIZAR</span>
            <div className="token-transform__items">
              {["O", "gato", "subiu", "no", "telhado"].map((token) => (
                <b key={token} data-kind="tokens">[{token}]</b>
              ))}
            </div>
          </div>
          <p className="tokens-lab__note">Tokenizar é transformar texto em unidades manipuláveis.</p>
        </section>

        <section className="tokens-step" data-active={step === 2}>
          <div className="token-transform">
            <span>EXEMPLO DIDÁTICO</span>
            <p className="tokens-phrase tokens-phrase--word">telhadinho</p>
            <div className="token-transform__items token-transform__items--split">
              {["telhado", "inho"].map((token) => (
                <b key={token} data-kind="tokens">[{token}]</b>
              ))}
            </div>
          </div>
          <p className="tokens-lab__note">Exemplo didático: um token não precisa corresponder exatamente a uma palavra.</p>
        </section>

        <section className="tokens-step" data-active={step === 3}>
          <div className="token-id-map">
            {[
              ["gato", "389"],
              ["subiu", "487"],
              ["telhado", "683"]
            ].map(([token, id]) => (
              <span key={token}>
                <b>{token}</b>
                <i>→</i>
                <strong>{id}</strong>
              </span>
            ))}
          </div>

          <strong className="tokens-reveal">Esses números são identificadores, não significados.</strong>

          <div className="token-meaning-check">
            <span><b>gato</b><strong>389</strong></span>
            <span><b>cachorro</b><strong>742</strong></span>
          </div>
          <p className="tokens-lab__question">O 389 nos diz que “gato” se parece com “cachorro”?</p>
        </section>
      </div>

      <div className="tokens-lab__controls">
        <button className="ghost-button" type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Anterior
        </button>
        <button className="primary-button" type="button" onClick={() => setStep(Math.min(tokenLabSteps.length - 1, step + 1))} disabled={complete}>
          Próximo passo
        </button>
      </div>
    </div>
  );
};

type EmbeddingPhase = "map" | "explore" | "returning" | "phrase";

const embeddingClusterLabels = [
  { label: "ANIMAIS", x: 64, y: 56 },
  { label: "REALEZA", x: 414, y: 52 },
  { label: "LUGARES", x: 40, y: 276 },
  { label: "TRANSPORTE", x: 260, y: 276 },
  { label: "MÚSICA", x: 486, y: 276 }
];

export const EmbeddingSpace = ({ reducedMotion = false }: { reducedMotion?: boolean }) => {
  const [selected, setSelected] = useState("gato");
  const [phase, setPhase] = useState<EmbeddingPhase>("map");
  const returnTimerRef = useRef<number | null>(null);
  const selectedWord = getEmbeddingWord(selected);
  const selectedNeighbors = useMemo(() => getEmbeddingNeighbors(selected), [selected]);
  const relatedWords = useMemo(
    () => new Set(selectedNeighbors.map((neighbor) => neighbor.word)),
    [selectedNeighbors]
  );
  const explorerVisible = phase === "explore" || phase === "returning";

  const handleSelect = useCallback((word: string) => setSelected(word), []);

  const enterSpace = useCallback(() => {
    setPhase("explore");
  }, []);

  const returnToPhrase = useCallback(() => {
    if (returnTimerRef.current !== null) {
      return;
    }
    setPhase("returning");
    returnTimerRef.current = window.setTimeout(
      () => {
        setPhase("phrase");
        returnTimerRef.current = null;
      },
      reducedMotion ? 40 : 760
    );
  }, [reducedMotion]);

  useEffect(() => {
    const section = document.getElementById("embeddings");
    if (section) {
      section.dataset.embeddingPhase = phase;
    }
  }, [phase]);

  useEffect(() => {
    if (!explorerVisible) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [explorerVisible]);

  useEffect(() => {
    if (phase !== "explore") {
      return undefined;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        returnToPhrase();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [phase, returnToPhrase]);

  useEffect(
    () => () => {
      if (returnTimerRef.current !== null) {
        window.clearTimeout(returnTimerRef.current);
      }
    },
    []
  );

  const map = (
    <div className="embedding embedding--map panel">
      <div className="embedding-concept-path" aria-label="Token vira vetor, posição, proximidade e relações">
        <span data-active="true">token</span>
        <i>→</i>
        <span data-active="true">vetor</span>
        <i>→</i>
        <span data-active="true">posição</span>
        <i>→</i>
        <span>proximidade</span>
        <i>→</i>
        <span>relações</span>
      </div>

      <div className="embedding-map-stage">
        <svg viewBox="0 0 680 430" role="img" aria-label="Projeção bidimensional de palavras agrupadas">
          {selectedNeighbors.map((neighbor) => {
            const item = getEmbeddingWord(neighbor.word);
            return (
              <line
                key={`${selectedWord.word}-${item.word}`}
                x1={selectedWord.x * 6.8}
                y1={selectedWord.y * 4.3}
                x2={item.x * 6.8}
                y2={item.y * 4.3}
                className="embedding-similarity"
              />
            );
          })}

          {embeddingClusterLabels.map((cluster) => (
            <text key={cluster.label} className="embedding-cluster-label" x={cluster.x} y={cluster.y}>
              {cluster.label}
            </text>
          ))}

          {embeddingWords.map((item) => {
            const isSelected = item.word === selected;
            const isRelated = relatedWords.has(item.word);
            return (
              <g
                key={item.word}
                className="embedding-map-point"
                data-selected={isSelected}
                data-related={isRelated}
                onClick={() => setSelected(item.word)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(item.word);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Selecionar ${item.word}`}
                aria-pressed={isSelected}
              >
                <circle
                  cx={item.x * 6.8}
                  cy={item.y * 4.3}
                  r={isSelected ? 10 : isRelated ? 7 : 5}
                  data-group={item.group}
                />
                <text x={item.x * 6.8 + 11} y={item.y * 4.3 + 4}>
                  {item.word}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="embedding-map__footer">
        <div className="embedding-vector-readout" aria-live="polite">
          <strong>{selected}</strong>
          <span>→</span>
          <code>{formatDidacticVector(selectedWord)}</code>
          <span>→</span>
          <em>uma posição</em>
        </div>
        <p>Projeção didática de um espaço com muitas dimensões.</p>
      </div>

      <button className="primary-button embedding-enter" type="button" onClick={enterSpace}>
        Entrar no espaço
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <>
      {phase === "phrase" ? (
        <motion.div
          className="embedding embedding--phrase panel"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.55 }}
        >
          <p className="chapter__kicker">De volta à frase</p>
          <p className="embedding-return-sentence">
            O cachorro perseguiu o gato porque <mark>ele</mark> estava assustado.
          </p>
          <motion.p
            className="embedding-pronoun-question"
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.35, duration: reducedMotion ? 0 : 0.45 }}
          >
            Onde está o significado de “ele”?
          </motion.p>
          <motion.p
            className="embedding-context-reveal"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0 : 0.85, duration: reducedMotion ? 0 : 0.55 }}
          >
            Representar uma palavra não basta. Precisamos descobrir quais outras palavras importam naquele contexto.
          </motion.p>
        </motion.div>
      ) : (
        map
      )}

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {explorerVisible ? (
                <motion.div
                  className="embedding-explorer"
                  data-returning={phase === "returning"}
                  initial={
                    reducedMotion
                      ? false
                      : {
                          opacity: 0,
                          clipPath: "inset(11vh 4vw 11vh 42vw round 8px)"
                        }
                  }
                  animate={{
                    opacity: phase === "returning" ? 0.78 : 1,
                    clipPath: "inset(0 0 0 0 round 0px)"
                  }}
                  exit={
                    reducedMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          clipPath: "inset(12vh 4vw 12vh 42vw round 8px)"
                        }
                  }
                  transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Exploração do espaço vetorial"
                >
                  <div className="embedding-explorer__topbar">
                    <div>
                      <span>PROJEÇÃO DIDÁTICA</span>
                      <strong>Um espaço com muitas dimensões</strong>
                    </div>
                    <button className="ghost-button" type="button" onClick={returnToPhrase}>
                      <ArrowLeft size={18} aria-hidden="true" />
                      Voltar à frase
                    </button>
                  </div>

                  <Suspense fallback={<div className="embedding-explorer__loading">Entrando no espaço…</div>}>
                    <EmbeddingExplorer3D
                      selected={selected}
                      reducedMotion={reducedMotion}
                      returning={phase === "returning"}
                      onSelect={handleSelect}
                    />
                  </Suspense>

                  <div className="embedding-explorer__selection" data-group={selectedWord.group} aria-live="polite">
                    <p>
                      {embeddingGroupLabels[selectedWord.group]} <span>· palavra selecionada</span>
                    </p>
                    <strong>{selected}</strong>
                    <div className="embedding-neighbors">
                      {selectedNeighbors.map((neighbor) => (
                        <button key={neighbor.word} type="button" onClick={() => setSelected(neighbor.word)}>
                          {neighbor.word} <small>{neighbor.similarity.toFixed(2)}</small>
                        </button>
                      ))}
                    </div>
                    <small>Similaridades ilustrativas, não calculadas por um modelo real.</small>
                  </div>

                  <AnimatePresence>
                    {selected === "rei" ? (
                      <motion.div
                        className="embedding-analogy"
                        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                      >
                        <code>rei − homem + mulher ≈ rainha</code>
                        <span>Analogia ilustrativa — relações vetoriais não são leis universais.</span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <p className="embedding-explorer__controls">
                    <kbd>WASD</kbd> mover · arraste para olhar · <kbd>Shift</kbd> acelerar · <kbd>Esc</kbd> sair
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
};

const sentence = ["O", "cachorro", "perseguiu", "o", "gato", "porque", "ele", "estava", "assustado"];

const attentionProfiles = [
  [0.08, 0.58, 0.08, 0.03, 0.05, 0.04, 0.04, 0.05, 0.05],
  [0.14, 0.08, 0.34, 0.04, 0.18, 0.05, 0.08, 0.04, 0.05],
  [0.05, 0.34, 0.06, 0.05, 0.32, 0.06, 0.05, 0.03, 0.04],
  [0.03, 0.06, 0.05, 0.08, 0.59, 0.04, 0.05, 0.04, 0.06],
  [0.03, 0.17, 0.31, 0.15, 0.07, 0.05, 0.11, 0.04, 0.07],
  [0.03, 0.06, 0.18, 0.03, 0.09, 0.07, 0.17, 0.2, 0.17],
  [0.02, 0.27, 0.08, 0.02, 0.31, 0.04, 0.04, 0.08, 0.14],
  [0.02, 0.05, 0.06, 0.02, 0.08, 0.08, 0.39, 0.09, 0.21],
  [0.02, 0.09, 0.05, 0.02, 0.14, 0.06, 0.36, 0.22, 0.04]
] as const;

const attentionSteps = [
  {
    label: "QUERY",
    title: "Uma palavra faz uma pergunta.",
    description: "“ele” procura no contexto pistas sobre o que representa."
  },
  {
    label: "KEY",
    title: "A pergunta é comparada com cada posição.",
    description: "Cada palavra oferece uma referência diferente para essa busca."
  },
  {
    label: "PESOS",
    title: "O foco é distribuído.",
    description: "As relações recebem pesos: mais atenção aqui significa menos em outro lugar."
  },
  {
    label: "VALUE",
    title: "As informações relevantes voltam para a palavra.",
    description: "Os valores são combinados e “ele” ganha uma representação informada pelo contexto."
  }
] as const;

const attentionInsights = [
  "O determinante procura o substantivo que acompanha.",
  "“cachorro” se relaciona com a ação e com os outros participantes.",
  "“perseguiu” conecta quem realizou a ação e quem a recebeu.",
  "Este “o” procura o substantivo que determina: “gato”.",
  "“gato” se relaciona com a ação, seu determinante e o pronome.",
  "“porque” conecta a primeira ação à explicação que vem depois.",
  "“ele” distribui atenção entre possíveis referentes e pistas do predicado.",
  "“estava” procura seu sujeito e a característica que completa a expressão.",
  "“assustado” se relaciona principalmente com “ele” e “estava”."
] as const;

const attentionX = (index: number) => 50 + index * 100;
const attentionPath = (fromIndex: number, toIndex: number) => {
  const fromX = attentionX(fromIndex);
  const toX = attentionX(toIndex);
  const distance = Math.abs(toX - fromX);
  const controlY = Math.max(32, 172 - distance * 0.2);
  return `M ${fromX} 218 Q ${(fromX + toX) / 2} ${controlY} ${toX} 218`;
};

export const AttentionVisualizer = ({ reducedMotion = false }: { reducedMotion?: boolean }) => {
  const [selectedIndex, setSelectedIndex] = useState(6);
  const [mode, setMode] = useState<"guided" | "free">("guided");
  const [step, setStep] = useState(0);
  const [scanCursor, setScanCursor] = useState(0);
  const [formulaVisible, setFormulaVisible] = useState(false);
  const selected = sentence[selectedIndex];
  const weights = attentionProfiles[selectedIndex];
  const comparisonCandidates = useMemo(
    () => sentence.map((_, index) => index).filter((index) => index !== selectedIndex),
    [selectedIndex]
  );
  const scannedIndex = comparisonCandidates[scanCursor % comparisonCandidates.length];
  const strongestIndices = useMemo(
    () =>
      weights
        .map((weight, index) => ({ weight, index }))
        .filter((item) => item.index !== selectedIndex)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 4)
        .map((item) => item.index),
    [selectedIndex, weights]
  );
  const weightsVisible = mode === "free" || step >= 2;
  const valuesVisible = mode === "free" || step >= 3;
  const comparisonVisible = mode === "guided" && step === 1;
  const activeLinks = comparisonVisible ? [scannedIndex] : weightsVisible ? strongestIndices : [];
  const content =
    mode === "free"
      ? {
          label: "EXPLORAÇÃO LIVRE",
          title: `“${selected}” agora é a Query.`,
          description: attentionInsights[selectedIndex]
        }
      : attentionSteps[step];

  useEffect(() => {
    if (!comparisonVisible) {
      return undefined;
    }

    setScanCursor(0);
    if (reducedMotion) {
      return undefined;
    }

    const interval = window.setInterval(
      () => setScanCursor((current) => (current + 1) % comparisonCandidates.length),
      560
    );
    return () => window.clearInterval(interval);
  }, [comparisonCandidates.length, comparisonVisible, reducedMotion]);

  useEffect(() => {
    const section = document.getElementById("attention");
    if (section) {
      section.dataset.attentionComplete = String(mode === "free");
    }
  }, [mode]);

  useEffect(() => {
    if (!valuesVisible) {
      setFormulaVisible(false);
    }
  }, [valuesVisible]);

  const enterFreeMode = () => {
    setMode("free");
    setSelectedIndex(6);
    setFormulaVisible(false);
  };

  const restartGuidedMode = () => {
    setMode("guided");
    setStep(0);
    setSelectedIndex(6);
    setFormulaVisible(false);
  };

  return (
    <div className="attention attention--sequenced panel" data-mode={mode} data-step={step}>
      <header className="attention__header">
        <p>
          {mode === "guided" ? `PASSO ${step + 1}/4` : "QUALQUER PALAVRA PODE PERGUNTAR"}
          <span>{content.label}</span>
        </p>
        <strong>{content.title}</strong>
        <span>{content.description}</span>
      </header>

      <div className="attention-stage">
        <svg
          className="attention-stage__links"
          viewBox="0 0 900 260"
          role="img"
          aria-label={`Relações de atenção partindo da palavra ${selected}`}
          preserveAspectRatio="none"
        >
          <defs>
            <marker id="attention-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          {activeLinks.map((index) => {
            const weight = weights[index];
            return (
              <path
                key={`attention-${selectedIndex}-${index}`}
                className="attention-link"
                data-comparing={comparisonVisible}
                d={attentionPath(selectedIndex, index)}
                markerEnd={comparisonVisible ? "url(#attention-arrow)" : undefined}
                style={{ "--attention-weight": weight } as CSSProperties}
              />
            );
          })}

          {valuesVisible && !reducedMotion
            ? strongestIndices.map((index, particleIndex) => (
                <circle key={`value-${selectedIndex}-${index}`} className="attention-value-particle" r="4">
                  <animateMotion
                    dur={`${1.35 + particleIndex * 0.12}s`}
                    begin={`${particleIndex * 0.16}s`}
                    repeatCount="indefinite"
                    path={attentionPath(index, selectedIndex)}
                  />
                </circle>
              ))
            : null}
        </svg>

        {valuesVisible ? (
          <div className="attention-context-result" aria-live="polite">
            <span>{selected}</span>
            <i>+</i>
            <strong>contexto</strong>
          </div>
        ) : null}

        <div className="attention-token-grid" aria-label="Tokens da frase">
          {sentence.map((word, index) => {
            const isSelected = index === selectedIndex;
            const isScanned = comparisonVisible && index === scannedIndex;
            const isStrong = strongestIndices.includes(index);
            const intensity = weightsVisible ? weights[index] : isSelected ? 1 : isScanned ? 0.72 : 0.08;

            return (
              <button
                key={`${word}-${index}`}
                type="button"
                className="attention-token"
                data-query={isSelected}
                data-scanned={isScanned}
                data-strong={weightsVisible && isStrong}
                disabled={mode === "guided"}
                onClick={() => {
                  setSelectedIndex(index);
                  setFormulaVisible(false);
                }}
                aria-pressed={mode === "free" ? isSelected : undefined}
                aria-label={weightsVisible ? `${word}: ${Math.round(weights[index] * 100)} por cento de atenção` : word}
                style={{ "--attention-weight": intensity } as CSSProperties}
              >
                <span>{word}</span>
                <small>
                  {weightsVisible
                    ? `${Math.round(weights[index] * 100)}%`
                    : isSelected
                      ? "QUERY"
                      : isScanned
                        ? "KEY"
                        : "\u00A0"}
                </small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="attention-mechanism" data-formula={formulaVisible}>
        {formulaVisible ? (
          <code>Attention(Q, K, V) = softmax(QKᵀ / √dₖ)V</code>
        ) : valuesVisible ? (
          <div className="attention-qkv-summary">
            <span><b>Query</b> pergunta</span>
            <i>→</i>
            <span><b>Key</b> oferece referência</span>
            <i>→</i>
            <span><b>Value</b> transporta informação</span>
          </div>
        ) : (
          <p>
            {step === 0
              ? "Query = a palavra que procura contexto."
              : step === 1
                ? "Key = a referência oferecida por cada posição."
                : "Pesos normalizados: juntos, eles somam 100%."}
          </p>
        )}

        {valuesVisible ? (
          <button className="ghost-button" type="button" onClick={() => setFormulaVisible((visible) => !visible)}>
            <Sigma size={16} aria-hidden="true" />
            {formulaVisible ? "Voltar à intuição" : "Ver fórmula"}
          </button>
        ) : null}
      </div>

      <div className="attention-controls">
        {mode === "guided" ? (
          <>
            <button className="ghost-button" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
              <ArrowLeft size={17} aria-hidden="true" />
              Anterior
            </button>
            <div className="attention-progress" aria-hidden="true">
              {attentionSteps.map((item, index) => (
                <i key={item.label} data-active={index <= step} />
              ))}
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={() => (step < attentionSteps.length - 1 ? setStep((current) => current + 1) : enterFreeMode())}
            >
              {step < attentionSteps.length - 1 ? "Próximo passo" : "Explorar livremente"}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button className="ghost-button" type="button" onClick={restartGuidedMode}>
              <RotateCcw size={16} aria-hidden="true" />
              Rever demonstração
            </button>
            <span>Selecione qualquer palavra para torná-la a Query.</span>
          </>
        )}
      </div>

      <p className="attention-disclaimer">Pesos ilustrativos de uma única cabeça de atenção. A frase permite mais de uma interpretação.</p>
    </div>
  );
};

const transformerSentence = ["O", "cachorro", "perseguiu", "o", "gato", "porque", "ele", "estava", "assustado"];

const transformerSteps = [
  {
    label: "ENTRADA + POSIÇÃO",
    title: "Todas as posições entram juntas.",
    description: "Cada token começa como embedding somado à informação de posição."
  },
  {
    label: "MULTI-HEAD ATTENTION",
    title: "A mesma frase pode ser observada de vários modos.",
    description: "Cabeças diferentes podem reunir relações diferentes ao mesmo tempo."
  },
  {
    label: "RESIDUAL + NORM",
    title: "O contexto é incorporado sem apagar o ponto de partida.",
    description: "A saída da atenção se combina com a representação que já existia."
  },
  {
    label: "FEED-FORWARD",
    title: "Depois da troca, cada posição é transformada.",
    description: "A mesma pequena rede processa cada token separadamente e em paralelo."
  },
  {
    label: "BLOCO TRANSFORMER",
    title: "As operações formam uma unidade repetível.",
    description: "Attention, atalhos residuais, normalização e feed-forward trabalham em conjunto."
  },
  {
    label: "PROFUNDIDADE",
    title: "O mesmo bloco se repete em muitas camadas.",
    description: "A representação de cada token é refinada sucessivamente pelo contexto."
  },
  {
    label: "MÁSCARA CAUSAL",
    title: "Ao gerar, o futuro ainda não existe.",
    description: "Um decoder só pode usar os tokens que já apareceram."
  },
  {
    label: "PRÓXIMO TOKEN",
    title: "Uma escolha atualiza o contexto e inicia outro ciclo.",
    description: "O Transformer repete as mesmas camadas para continuar a sequência."
  }
] as const;

const transformerHeads = [
  {
    id: "A",
    label: "possíveis referências",
    active: [1, 4, 6],
    relation: "ele ↔ cachorro / gato"
  },
  {
    id: "B",
    label: "estrutura da ação",
    active: [1, 2, 4],
    relation: "cachorro ↔ perseguiu ↔ gato"
  },
  {
    id: "C",
    label: "contexto próximo",
    active: [6, 7, 8],
    relation: "ele ↔ estava ↔ assustado"
  }
] as const;

const transformerFamilies = {
  encoder: "Lê o contexto disponível nas duas direções e produz representações.",
  decoder: "Usa máscara causal e gera a sequência um token por vez.",
  "encoder-decoder": "O decoder também consulta as representações produzidas pelo encoder."
} as const;

type TransformerFamily = keyof typeof transformerFamilies;

export const TransformerFlow = ({ reducedMotion = false }: { reducedMotion?: boolean }) => {
  const [step, setStep] = useState(0);
  const [family, setFamily] = useState<TransformerFamily>("decoder");
  const [generationRound, setGenerationRound] = useState(0);
  const [selectingToken, setSelectingToken] = useState(false);
  const generationTimerRef = useRef<number | null>(null);
  const currentStep = transformerSteps[step];
  const complete = step === transformerSteps.length - 1 && generationRound > 0;
  const generationPrompt = transformerSentence.slice(0, -1);
  const generatedTokens = generationRound === 0 ? [] : generationRound === 1 ? ["assustado"] : ["assustado", "."];
  const generationCandidates =
    generationRound === 0
      ? [
          ["assustado", 52],
          ["cansado", 21],
          ["longe", 11]
        ]
      : [
          [".", 63],
          ["e", 18],
          ["mas", 7]
        ];

  useEffect(() => {
    const section = document.getElementById("transformer");
    if (section) {
      section.dataset.transformerComplete = String(complete);
    }
  }, [complete]);

  useEffect(
    () => () => {
      if (generationTimerRef.current !== null) {
        window.clearTimeout(generationTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (step === transformerSteps.length - 1 || generationTimerRef.current === null) {
      return;
    }

    window.clearTimeout(generationTimerRef.current);
    generationTimerRef.current = null;
    setSelectingToken(false);
  }, [step]);

  const restart = () => {
    if (generationTimerRef.current !== null) {
      window.clearTimeout(generationTimerRef.current);
      generationTimerRef.current = null;
    }
    setStep(0);
    setFamily("decoder");
    setGenerationRound(0);
    setSelectingToken(false);
  };

  const generateNextToken = () => {
    if (selectingToken || generationRound >= 2) {
      return;
    }

    const finishSelection = () => {
      setGenerationRound((round) => Math.min(2, round + 1));
      setSelectingToken(false);
      generationTimerRef.current = null;
    };

    setSelectingToken(true);
    if (reducedMotion) {
      finishSelection();
      return;
    }

    generationTimerRef.current = window.setTimeout(finishSelection, 680);
  };

  const renderScene = () => {
    switch (step) {
      case 0:
        return (
          <div className="transformer-scene transformer-scene--input">
            <div className="transformer-token-strip" aria-label="Tokens processados em paralelo">
              {transformerSentence.map((token, index) => (
                <span key={`${token}-${index}`} style={{ "--token-index": index } as CSSProperties}>
                  {token}
                </span>
              ))}
            </div>
            <div className="transformer-input-equation" aria-label="Embedding somado à posição forma a representação inicial">
              <span>embedding</span>
              <i>+</i>
              <span>posição</span>
              <ArrowRight size={18} aria-hidden="true" />
              <strong>representação inicial</strong>
            </div>
            <div className="transformer-parallel-flow" aria-hidden="true">
              {transformerSentence.map((_, index) => (
                <i key={index} style={{ "--token-index": index } as CSSProperties} />
              ))}
            </div>
            <p>Não é uma esteira: todas as posições são atualizadas em paralelo.</p>
          </div>
        );
      case 1:
        return (
          <div className="transformer-scene transformer-scene--heads">
            <p className="transformer-scene__eyebrow">RELAÇÕES ILUSTRATIVAS, NÃO FUNÇÕES FIXAS</p>
            <div className="transformer-heads">
              {transformerHeads.map((head, headIndex) => (
                <div className="transformer-head" key={head.id} style={{ "--head-index": headIndex } as CSSProperties}>
                  <p>
                    <b>CABEÇA {head.id}</b>
                    <span>{head.label}</span>
                  </p>
                  <div className="transformer-head__tokens" aria-label={`Cabeça ${head.id}: ${head.relation}`}>
                    {transformerSentence.map((token, index) => (
                      <i key={`${token}-${index}`} data-active={(head.active as readonly number[]).includes(index)}>
                        {token}
                      </i>
                    ))}
                  </div>
                  <strong>{head.relation}</strong>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="transformer-scene transformer-scene--merge">
            <div className="transformer-merge-heads" aria-label="Resultados de três cabeças de atenção">
              <span>A</span>
              <span>B</span>
              <span>C</span>
            </div>
            <svg className="transformer-merge-flow" viewBox="0 0 240 76" aria-hidden="true" focusable="false">
              <line x1="20" y1="6" x2="120" y2="70" />
              <line x1="120" y1="6" x2="120" y2="70" />
              <line x1="220" y1="6" x2="120" y2="70" />
            </svg>
            <div className="transformer-merged-context">atenção combinada</div>
            <div className="transformer-residual-path">
              <span><b>ele</b> original</span>
              <i />
              <strong>+</strong>
            </div>
            <div className="transformer-context-result">
              <b>ele</b>
              <i>+</i>
              <strong>contexto</strong>
              <small>normalizar</small>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="transformer-scene transformer-scene--ffn">
            <p className="transformer-scene__eyebrow">MESMA REDE · MESMOS PESOS · CADA POSIÇÃO SEPARADAMENTE</p>
            <div className="transformer-ffn-lanes">
              {["cachorro", "perseguiu", "gato", "ele", "assustado"].map((token, index) => (
                <div className="transformer-ffn-lane" key={token} style={{ "--token-index": index } as CSSProperties}>
                  <span>{token}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                  <div className="transformer-mini-network" aria-hidden="true"><i /><i /><i /><i /></div>
                  <ArrowRight size={14} aria-hidden="true" />
                  <strong>{token}<sup>′</sup></strong>
                </div>
              ))}
            </div>
            <p>Attention troca informação entre posições. A feed-forward transforma cada posição.</p>
          </div>
        );
      case 4:
        return (
          <div className="transformer-scene transformer-scene--block">
            <p className="transformer-scene__eyebrow">1 BLOCO TRANSFORMER</p>
            <div className="transformer-block-diagram">
              <span className="transformer-block-port">entrada</span>
              <ArrowRight size={16} aria-hidden="true" />
              <div className="transformer-block-module">
                <small>mistura contexto</small>
                <strong>Multi-head attention</strong>
              </div>
              <div className="transformer-block-join"><b>+</b><span>residual<br />norm</span></div>
              <div className="transformer-block-module">
                <small>transforma posições</small>
                <strong>Feed-forward</strong>
              </div>
              <div className="transformer-block-join"><b>+</b><span>residual<br />norm</span></div>
              <ArrowRight size={16} aria-hidden="true" />
              <span className="transformer-block-port">saída</span>
              <svg className="transformer-residual-guides" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M 132 48 V 16 H 492 V 48" />
                <path d="M 558 48 V 16 H 872 V 48" />
              </svg>
            </div>
            <p>O bloco inteiro pode ser aplicado novamente sem mudar sua estrutura.</p>
          </div>
        );
      case 5:
        return (
          <div className="transformer-scene transformer-scene--stack">
            <p className="transformer-scene__eyebrow">O MESMO PADRÃO, REPETIDO EM PROFUNDIDADE</p>
            <div className="transformer-stack">
              {["BLOCO 1", "BLOCO 2", "BLOCO 3", "BLOCO N"].map((label, index) => (
                <div className="transformer-stack-block" key={label} style={{ "--block-index": index } as CSSProperties}>
                  <span>{label}</span>
                  <i>attention</i>
                  <i>feed-forward</i>
                  <strong>ele<sup>{index + 1}</sup></strong>
                </div>
              ))}
            </div>
            <div className="transformer-representation-flow">
              <span>ele<sup>0</sup></span><i>→</i><span>mais relações</span><i>→</i><span>contexto refinado</span><i>→</i><strong>ele<sup>N</sup></strong>
            </div>
            <p>As camadas refinam representações; não recebem papéis humanos fixos.</p>
          </div>
        );
      case 6:
        return (
          <div className="transformer-scene transformer-scene--mask">
            <p className="transformer-scene__eyebrow">VISÃO DISPONÍVEL PARA “ELE”</p>
            <div className="transformer-mask-strip" aria-label="Ele pode observar os tokens anteriores, mas não os tokens futuros">
              {transformerSentence.map((token, index) => (
                <span key={`${token}-${index}`} data-query={index === 6} data-masked={index > 6}>
                  {token}
                  {index > 6 ? <small>bloqueado</small> : null}
                </span>
              ))}
              <i className="transformer-mask-curtain" aria-hidden="true" />
            </div>
            <div className="transformer-mask-legend">
              <span>← contexto disponível</span>
              <strong>posição atual</strong>
              <span>futuro bloqueado →</span>
            </div>
            <p>Sem ver a resposta futura, o decoder aprende a prever o que vem depois.</p>
          </div>
        );
      default:
        return (
          <div className="transformer-scene transformer-scene--generation">
            <div className="transformer-generation-main">
              <div className="transformer-generation-context">
                <small>CONTEXTO ATUAL</small>
                <p>
                  {generationPrompt.map((token, index) => <span key={`${token}-${index}`}>{token}</span>)}
                  {generatedTokens.map((token, index) => <strong key={`${token}-${index}`}>{token}</strong>)}
                  <i aria-hidden="true" />
                </p>
                <div className="transformer-loop-line"><span>contexto</span><i>→</i><span>camadas</span><i>→</i><span>probabilidades</span></div>
              </div>
              <div className="transformer-probabilities" aria-label="Probabilidades ilustrativas para o próximo token">
                <small>PRÓXIMO TOKEN</small>
                {generationCandidates.map(([token, probability], index) => (
                  <div key={token} data-selecting={selectingToken && index === 0} data-selected={generationRound === 2 && index === 0}>
                    <span>{token}</span>
                    <i><b style={{ width: `${probability}%` }} /></i>
                    <strong>{probability}%</strong>
                  </div>
                ))}
                <button className="primary-button" type="button" onClick={generateNextToken} disabled={selectingToken || generationRound >= 2}>
                  {selectingToken ? "Escolhendo…" : generationRound === 0 ? "Gerar próximo token" : generationRound === 1 ? "Repetir o ciclo" : "Ciclo concluído"}
                  {generationRound < 2 ? <ArrowRight size={16} aria-hidden="true" /> : null}
                </button>
              </div>
            </div>
            <div className="transformer-family-switch">
              <div role="tablist" aria-label="Famílias de Transformer">
                {(Object.keys(transformerFamilies) as TransformerFamily[]).map((item) => (
                  <button type="button" role="tab" aria-selected={family === item} key={item} onClick={() => setFamily(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <p><b>{family}</b> — {transformerFamilies[family]}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="transformer transformer--guided panel" data-step={step} data-reduced-motion={reducedMotion}>
      <header className="transformer__header">
        <p>PASSO {step + 1}/{transformerSteps.length} <span>{currentStep.label}</span></p>
        <strong>{currentStep.title}</strong>
        <span>{currentStep.description}</span>
      </header>

      <div className="transformer-stage" aria-live="polite">
        {reducedMotion ? (
          <div className="transformer-scene-shell" key={step}>{renderScene()}</div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="transformer-scene-shell"
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32 }}
            >
              {renderScene()}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="transformer-controls">
        <button className="ghost-button" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
          <ArrowLeft size={17} aria-hidden="true" />
          Anterior
        </button>
        <div className="transformer-progress" aria-hidden="true">
          {transformerSteps.map((item, index) => <i key={item.label} data-active={index <= step} />)}
        </div>
        {step < transformerSteps.length - 1 ? (
          <button className="primary-button" type="button" onClick={() => setStep((current) => current + 1)}>
            Próximo passo
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        ) : (
          <button className="ghost-button" type="button" onClick={restart}>
            <RotateCcw size={16} aria-hidden="true" />
            Rever construção
          </button>
        )}
      </div>

      <p className="transformer-disclaimer">Arquitetura simplificada para explicação. As relações e probabilidades exibidas são ilustrativas.</p>
    </div>
  );
};

const llmSeedTokens = ["Era", "uma", "vez", "uma", "máquina", "que"];

const llmGenerationChoices = {
  baixa: [
    [
      ["aprendeu", 62],
      ["observava", 18],
      ["desejava", 12],
      ["inventou", 8]
    ],
    [
      ["a", 71],
      ["como", 13],
      ["sobre", 9],
      ["lentamente", 7]
    ],
    [
      ["responder", 68],
      ["calcular", 16],
      ["seguir", 10],
      ["imaginar", 6]
    ],
    [
      ["com cuidado", 74],
      ["em silêncio", 12],
      ["outra vez", 8],
      ["sem pressa", 6]
    ]
  ],
  media: [
    [
      ["observava", 34],
      ["aprendeu", 28],
      ["descobriu", 22],
      ["desejava", 16]
    ],
    [
      ["o", 39],
      ["cada", 24],
      ["um", 21],
      ["seu", 16]
    ],
    [
      ["mundo", 36],
      ["padrão", 25],
      ["texto", 22],
      ["sinal", 17]
    ],
    [
      ["em silêncio", 38],
      ["com curiosidade", 27],
      ["por partes", 21],
      ["de longe", 14]
    ]
  ],
  alta: [
    [
      ["sonhava", 27],
      ["dobrava", 24],
      ["cantava", 21],
      ["desaprendeu", 18],
      ["azul", 10]
    ],
    [
      ["com", 29],
      ["entre", 22],
      ["sem", 19],
      ["contra", 16],
      ["debaixo", 14]
    ],
    [
      ["mapas", 26],
      ["ecos", 23],
      ["relâmpagos", 20],
      ["parágrafos", 17],
      ["espelhos", 14]
    ],
    [
      ["impossíveis", 28],
      ["de vidro", 23],
      ["em looping", 20],
      ["sem chão", 17],
      ["azuis", 12]
    ]
  ]
} satisfies Record<TemperatureMode, [string, number][][]>;

export const TemperatureSampler = () => {
  const [mode, setMode] = useState<TemperatureMode>("media");
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);
  const [isChoosing, setIsChoosing] = useState(false);
  const choiceTimerRef = useRef<number | null>(null);
  const currentStep = Math.min(generatedTokens.length, llmGenerationChoices[mode].length - 1);
  const currentChoices = llmGenerationChoices[mode][currentStep] ?? nextTokenProbabilities[mode];
  const isComplete = generatedTokens.length >= llmGenerationChoices[mode].length;

  useEffect(
    () => () => {
      if (choiceTimerRef.current !== null) {
        window.clearTimeout(choiceTimerRef.current);
      }
    },
    []
  );

  const changeMode = (item: TemperatureMode) => {
    if (choiceTimerRef.current !== null) {
      window.clearTimeout(choiceTimerRef.current);
      choiceTimerRef.current = null;
    }
    setMode(item);
    setGeneratedTokens([]);
    setIsChoosing(false);
  };

  const generateToken = () => {
    if (isComplete) {
      setGeneratedTokens([]);
      setIsChoosing(false);
      return;
    }

    setIsChoosing(true);
    choiceTimerRef.current = window.setTimeout(() => {
      const [token] = currentChoices[0];
      setGeneratedTokens((tokens) => [...tokens, token]);
      setIsChoosing(false);
      choiceTimerRef.current = null;
    }, 320);
  };

  return (
    <div className="temperature temperature--generation panel" data-mode={mode} data-complete={isComplete}>
      <div className="temperature__modes" role="tablist" aria-label="Temperatura da geração">
        {(["baixa", "media", "alta"] as const).map((item) => (
          <button className="ghost-button" type="button" role="tab" aria-selected={mode === item} key={item} onClick={() => changeMode(item)}>
            temperatura {item}
          </button>
        ))}
      </div>
      <div className="temperature__sentence" aria-live="polite">
        <small>CONTEXTO</small>
        <p>
          {llmSeedTokens.map((token, index) => <span key={`${token}-${index}`}>{token}</span>)}
          {generatedTokens.map((token, index) => <strong key={`${token}-${index}`}>{token}</strong>)}
          {!isComplete ? <em>[ ? ]</em> : <i>.</i>}
        </p>
      </div>
      <div className="temperature__loop">
        <span>contexto</span>
        <ArrowRight size={14} aria-hidden="true" />
        <span>probabilidades</span>
        <ArrowRight size={14} aria-hidden="true" />
        <span>escolha</span>
        <ArrowRight size={14} aria-hidden="true" />
        <span>novo contexto</span>
      </div>
      <div className="temperature__probabilities" aria-label="Possibilidades para o próximo token">
        <small>PRÓXIMO TOKEN</small>
        {currentChoices.map(([token, probability], index) => (
          <button className="temperature__choice" type="button" key={token} data-selected={isChoosing && index === 0} disabled>
            <span>{token}</span>
            <i><b style={{ width: `${probability}%` }} /></i>
            <strong>{probability}%</strong>
          </button>
        ))}
      </div>
      <div className="temperature__footer">
        <p>
          {isComplete
            ? "O texto parece fluente, mas foi construído por escolhas locais repetidas."
            : mode === "baixa"
              ? "Baixa temperatura concentra a escolha no token mais provável."
              : mode === "alta"
                ? "Alta temperatura espalha a chance e aumenta a variação."
                : "Temperatura média mantém alguma previsibilidade com variação."}
        </p>
        <button className="primary-button" type="button" onClick={generateToken} disabled={isChoosing}>
          {isChoosing ? "Escolhendo..." : isComplete ? "Recomeçar" : generatedTokens.length === 0 ? "Gerar próximo token" : "Repetir ciclo"}
          {isComplete ? <RotateCcw size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
};

const generativeSystemSteps = [
  {
    label: "LLM isolado",
    title: "O modelo responde com o que já carrega.",
    prompt: "Explique este contrato.",
    response: "Posso explicar em termos gerais, mas não vejo o documento.",
    active: [] as string[]
  },
  {
    label: "+ contexto",
    title: "O sistema entrega informação junto da pergunta.",
    prompt: "Explique este trecho selecionado.",
    response: "Agora posso usar o trecho fornecido para responder com mais precisão.",
    active: ["contexto"]
  },
  {
    label: "+ RAG",
    title: "A resposta pode consultar materiais externos.",
    prompt: "Procure a política mais recente e responda.",
    response: "Busquei um trecho relevante, li o conteúdo e usei isso na resposta.",
    active: ["contexto", "RAG"]
  },
  {
    label: "+ ferramentas",
    title: "O modelo pode pedir ações fora dele.",
    prompt: "Calcule, compare e me dê o resultado.",
    response: "Usei uma ferramenta para calcular antes de formular a resposta.",
    active: ["contexto", "RAG", "ferramentas"]
  },
  {
    label: "+ memória",
    title: "O sistema pode manter continuidade.",
    prompt: "Adapte para o meu estilo de apresentação.",
    response: "Levei em conta preferências e escolhas anteriores da conversa.",
    active: ["contexto", "RAG", "ferramentas", "memória"]
  },
  {
    label: "sistema completo",
    title: "A capacidade aparente vem da combinação.",
    prompt: "Analise texto, imagem e gere uma resposta útil.",
    response: "O resultado parece mais capaz porque o LLM deixou de atuar sozinho.",
    active: ["contexto", "RAG", "ferramentas", "memória", "código", "imagem", "áudio"]
  }
] as const;

const generativeSystemModules = [
  ["contexto", "documentos e instruções entram na conversa"],
  ["RAG", "busca recupera trechos relevantes"],
  ["ferramentas", "ações externas produzem fatos novos"],
  ["memória", "preferências dão continuidade"],
  ["código", "execução transforma dados"],
  ["imagem", "outra modalidade vira entrada"],
  ["áudio", "sinais sonoros também entram"]
] as const;

export const GenerativeSystems = () => {
  const [step, setStep] = useState(0);
  const current = generativeSystemSteps[step];

  return (
    <div className="systems-demo systems-demo--sequenced panel" data-step={step}>
      <header className="systems-demo__header">
        <p>PASSO {step + 1}/{generativeSystemSteps.length} <span>{current.label}</span></p>
        <strong>{current.title}</strong>
      </header>
      <div className="systems-flow" aria-label="Sistema generativo em camadas">
        <div className="systems-prompt">
          <small>ENTRADA</small>
          <p>{current.prompt}</p>
        </div>
        <ArrowRight size={18} aria-hidden="true" />
        <div className="systems-hub">
          <div className="systems-core">LLM</div>
          <div className="systems-modules">
            {generativeSystemModules.map(([module, description], index) => (
              <span
                key={module}
                data-active={(current.active as readonly string[]).includes(module)}
                style={{ "--module-index": index } as CSSProperties}
              >
                <b>{module}</b>
                <small>{description}</small>
              </span>
            ))}
          </div>
        </div>
        <ArrowRight size={18} aria-hidden="true" />
        <div className="systems-response">
          <small>RESPOSTA</small>
          <p>{current.response}</p>
        </div>
      </div>
      <div className="systems-demo__controls">
        <button className="ghost-button" type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}>
          <ArrowLeft size={16} aria-hidden="true" />
          Anterior
        </button>
        <div className="systems-demo__progress" aria-hidden="true">
          {generativeSystemSteps.map((item, index) => <i key={item.label} data-active={index <= step} />)}
        </div>
        <button
          className={step === generativeSystemSteps.length - 1 ? "ghost-button" : "primary-button"}
          type="button"
          onClick={() => (step === generativeSystemSteps.length - 1 ? setStep(0) : setStep((value) => value + 1))}
        >
          {step === generativeSystemSteps.length - 1 ? "Rever sistema" : "Próximo passo"}
          {step === generativeSystemSteps.length - 1 ? <RotateCcw size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
        </button>
      </div>
      <p className="microcopy">
        {step === generativeSystemSteps.length - 1
          ? "A resposta pode melhorar muito. A pergunta sobre compreensão ainda continua aberta."
          : "Cada camada muda o que chega ao modelo, o que ele pode consultar ou o que ele pode fazer."}
      </p>
    </div>
  );
};

export const InterruptionMoment = () => (
  <div className="interruption panel panel--flat">
    <p>Ela respondeu corretamente.</p>
    <strong>Mas ela entendeu?</strong>
  </div>
);

export const ChineseRoomSimulation = ({ onReturn }: { onReturn: () => void }) => (
  <div className="chinese-room panel">
    <div className="symbol-room" aria-hidden="true">
      <span>符</span>
      <span>?</span>
      <span>規</span>
      <span>→</span>
      <span>答</span>
    </div>
    <p>
      Uma pessoa segue regras para manipular símbolos que não compreende. Do lado de fora, a resposta pode
      parecer correta. Por dentro, resta a pergunta: processamento formal é compreensão?
    </p>
    <button className="primary-button" type="button" onClick={onReturn}>
      Voltar à pergunta
    </button>
  </div>
);
