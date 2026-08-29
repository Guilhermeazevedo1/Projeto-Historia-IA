export type InteractionSpec = {
  id: string;
  title: string;
  purpose: string;
  limitation: string;
};

export const interactions: InteractionSpec[] = [
  {
    id: "imitation-game",
    title: "Jogo da imitacao",
    purpose: "Mostrar comportamento convincente e seus limites.",
    limitation: "As respostas sao predefinidas para fins didaticos."
  },
  {
    id: "perceptron",
    title: "Neuronio e perceptron",
    purpose: "Tornar pesos, soma, limiar e erro manipulaveis.",
    limitation: "A classificacao usa exemplos sinteticos simples."
  },
  {
    id: "backprop",
    title: "Backpropagation",
    purpose: "Visualizar o erro retornando pela rede.",
    limitation: "A rede e uma simulacao coerente, nao um treinamento completo."
  },
  {
    id: "attention",
    title: "Attention",
    purpose: "Iluminar relacoes contextuais entre palavras.",
    limitation: "Os pesos de atencao sao simulados localmente."
  }
];
