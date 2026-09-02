export type LossPoint = {
  w1: number;
  w2: number;
  loss: number;
};

export type LearningRateMode = "pequena" | "adequada" | "grande";

export const lossMinimum = {
  w1: 0.15,
  w2: -0.05
} as const;

export const lossDomain = {
  min: -1.5,
  max: 1.5
} as const;

export const learningRateOptions: Record<
  LearningRateMode,
  { label: string; eta: number; steps: number; conclusion: string }
> = {
  pequena: {
    label: "taxa pequena",
    eta: 0.16,
    steps: 10,
    conclusion: "Passos pequenos descem com estabilidade, mas avançam devagar."
  },
  adequada: {
    label: "taxa adequada",
    eta: 0.75,
    steps: 8,
    conclusion: "Um passo adequado chega rapidamente à região de menor perda."
  },
  grande: {
    label: "taxa grande",
    eta: 1.65,
    steps: 9,
    conclusion: "Passos grandes atravessam o vale e oscilam antes de se aproximar."
  }
};

const clampWeight = (value: number) => Math.max(lossDomain.min, Math.min(lossDomain.max, value));

export const lossForWeights = (w1: number, w2: number) => {
  const dx = w1 - lossMinimum.w1;
  const dz = w2 - lossMinimum.w2;
  return Math.max(0, 0.24 * dx * dx + 0.44 * dz * dz + 0.12 * dx * dz);
};

export const gradientForWeights = (w1: number, w2: number) => {
  const dx = w1 - lossMinimum.w1;
  const dz = w2 - lossMinimum.w2;

  return {
    w1: 0.48 * dx + 0.12 * dz,
    w2: 0.88 * dz + 0.12 * dx
  };
};

export const makeLossPoint = (w1: number, w2: number): LossPoint => ({
  w1,
  w2,
  loss: lossForWeights(w1, w2)
});

export const initialLossPoint = makeLossPoint(1.25, -1.05);

export const takeGradientStep = (point: LossPoint, eta: number): LossPoint => {
  const gradient = gradientForWeights(point.w1, point.w2);
  const w1 = clampWeight(point.w1 - eta * gradient.w1);
  const w2 = clampWeight(point.w2 - eta * gradient.w2);
  return makeLossPoint(Number(w1.toFixed(4)), Number(w2.toFixed(4)));
};
