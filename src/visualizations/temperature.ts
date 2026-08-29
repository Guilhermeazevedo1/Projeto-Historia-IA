export type TemperatureMode = "baixa" | "media" | "alta";

export const temperatureOptions: Record<TemperatureMode, string[]> = {
  baixa: ["aprendeu", "a", "responder", "com", "cuidado"],
  media: ["observava", "o", "mundo", "em", "silencio"],
  alta: ["sonhava", "com", "mapas", "de", "relampagos"]
};

export const nextTokenProbabilities = {
  baixa: [
    ["aprendeu", 62],
    ["observava", 18],
    ["desejava", 12],
    ["inventou", 8]
  ],
  media: [
    ["observava", 34],
    ["aprendeu", 28],
    ["descobriu", 22],
    ["desejava", 16]
  ],
  alta: [
    ["sonhava", 27],
    ["dobrava", 24],
    ["cantava", 21],
    ["desaprendeu", 18],
    ["azul", 10]
  ]
} satisfies Record<TemperatureMode, [string, number][]>;

export const buildTemperatureText = (mode: TemperatureMode) =>
  `Era uma vez uma máquina que ${temperatureOptions[mode].join(" ")}.`;
