export type EmbeddingGroup = "animal" | "transporte" | "musica" | "realeza" | "lugares";

export type EmbeddingWord = {
  word: string;
  group: EmbeddingGroup;
  x: number;
  y: number;
  position: readonly [number, number, number];
};

export type EmbeddingNeighbor = {
  word: string;
  similarity: number;
};

export const embeddingGroupLabels: Record<EmbeddingGroup, string> = {
  animal: "animais",
  transporte: "transporte",
  musica: "música",
  realeza: "realeza",
  lugares: "lugares"
};

export const embeddingGroupColors: Record<EmbeddingGroup, string> = {
  animal: "#8fd6a4",
  transporte: "#9fd1ff",
  musica: "#bba0ff",
  realeza: "#f2e66d",
  lugares: "#e7a95f"
};

export const embeddingWords: readonly EmbeddingWord[] = [
  { word: "gato", group: "animal", x: 20, y: 24, position: [-4.8, 1.5, 0.4] },
  { word: "cachorro", group: "animal", x: 30, y: 33, position: [-3.6, 1, -0.2] },
  { word: "animal", group: "animal", x: 18, y: 42, position: [-4.4, 2.4, -1] },
  { word: "felino", group: "animal", x: 11, y: 31, position: [-5.6, 1.9, -0.5] },
  { word: "pet", group: "animal", x: 31, y: 20, position: [-3.8, 2.1, -1.5] },

  { word: "carro", group: "transporte", x: 39, y: 72, position: [-2.4, -2.4, -1] },
  { word: "ônibus", group: "transporte", x: 50, y: 82, position: [-1.2, -2.8, -2] },
  { word: "veículo", group: "transporte", x: 54, y: 68, position: [-1.7, -1.8, -1.7] },
  { word: "moto", group: "transporte", x: 61, y: 79, position: [-0.3, -2.2, -2.6] },

  { word: "música", group: "musica", x: 72, y: 69, position: [2.4, -1.7, -1] },
  { word: "melodia", group: "musica", x: 82, y: 79, position: [3.3, -2.4, -0.3] },
  { word: "canção", group: "musica", x: 90, y: 68, position: [4.1, -1.5, -1.2] },
  { word: "ritmo", group: "musica", x: 73, y: 86, position: [3.6, -2.8, -1.6] },

  { word: "rei", group: "realeza", x: 69, y: 21, position: [3.5, 2.3, -1] },
  { word: "rainha", group: "realeza", x: 80, y: 30, position: [4.6, 2.1, -1.8] },
  { word: "príncipe", group: "realeza", x: 72, y: 42, position: [3.9, 3.2, -2.3] },
  { word: "monarca", group: "realeza", x: 88, y: 19, position: [5.1, 3, -3] },
  { word: "homem", group: "realeza", x: 60, y: 34, position: [2.7, 1.3, -2] },
  { word: "mulher", group: "realeza", x: 89, y: 42, position: [5.4, 1.1, -2.4] },

  { word: "Recife", group: "lugares", x: 12, y: 73, position: [-1.5, 3, -4] },
  { word: "Lisboa", group: "lugares", x: 20, y: 84, position: [-0.3, 3.5, -5] },
  { word: "cidade", group: "lugares", x: 28, y: 75, position: [-0.6, 2.2, -4.3] }
];

const explicitRelations: Record<string, readonly EmbeddingNeighbor[]> = {
  gato: [
    { word: "felino", similarity: 0.91 },
    { word: "cachorro", similarity: 0.86 },
    { word: "animal", similarity: 0.82 },
    { word: "pet", similarity: 0.79 }
  ],
  rei: [
    { word: "rainha", similarity: 0.9 },
    { word: "monarca", similarity: 0.87 },
    { word: "príncipe", similarity: 0.83 },
    { word: "homem", similarity: 0.72 },
    { word: "mulher", similarity: 0.68 }
  ]
};

export const embeddingAmbientEdges: readonly (readonly [string, string])[] = [
  ["gato", "felino"],
  ["gato", "animal"],
  ["cachorro", "pet"],
  ["carro", "veículo"],
  ["ônibus", "veículo"],
  ["moto", "veículo"],
  ["música", "melodia"],
  ["música", "canção"],
  ["ritmo", "melodia"],
  ["rei", "monarca"],
  ["rainha", "príncipe"],
  ["Recife", "cidade"],
  ["Lisboa", "cidade"]
];

export const getEmbeddingWord = (word: string) =>
  embeddingWords.find((item) => item.word === word) ?? embeddingWords[0];

export const getEmbeddingNeighbors = (word: string): readonly EmbeddingNeighbor[] => {
  if (explicitRelations[word]) {
    return explicitRelations[word];
  }

  const selected = getEmbeddingWord(word);
  return embeddingWords
    .filter((item) => item.group === selected.group && item.word !== selected.word)
    .slice(0, 4)
    .map((item, index) => ({ word: item.word, similarity: 0.88 - index * 0.05 }));
};

export const formatDidacticVector = (word: EmbeddingWord) => {
  const [x, y, z] = word.position;
  return `[${(x / 6).toFixed(2)}, ${(y / 4).toFixed(2)}, ${(z / 6).toFixed(2)}, …]`;
};
