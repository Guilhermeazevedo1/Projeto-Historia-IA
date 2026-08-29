export type GlossaryTerm = {
  term: string;
  description: string;
};

export const glossary: GlossaryTerm[] = [
  {
    term: "Peso",
    description: "Numero que controla a influencia de uma entrada ou conexao."
  },
  {
    term: "Erro",
    description: "Diferenca entre previsao e resposta esperada."
  },
  {
    term: "Embedding",
    description: "Representacao numerica que coloca itens em um espaco de relacoes."
  },
  {
    term: "Attention",
    description: "Mecanismo que pondera quais partes do contexto importam para interpretar um token."
  },
  {
    term: "Temperatura",
    description: "Controle que altera quao previsivel ou variada e uma escolha de proximo token."
  }
];
