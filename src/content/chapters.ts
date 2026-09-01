export type Act = "question" | "journey" | "reflection";

export type Chapter = {
  id: string;
  act: Act;
  shortLabel: string;
  title: string;
  question: string;
  summary: string;
  beats: string[];
  speakerNotes: string[];
  transitionQuestion?: string;
  visualTone: "mist" | "paper" | "machine" | "winter" | "thaw" | "flow" | "space" | "light" | "system" | "quiet" | "clear";
};

export const chapters: Chapter[] = [
  {
    id: "opening",
    act: "question",
    shortLabel: "Podem pensar?",
    title: "A pergunta",
    question: "As máquinas podem pensar?",
    summary: "A jornada começa com uma pergunta simples demais para ser simples.",
    beats: [
      "Antes de procurar uma resposta, precisamos entender a pergunta.",
      "A plateia observa a própria intuição antes da história entrar em cena.",
      "A pergunta aparece nebulosa porque ainda não sabemos exatamente o que ela pede."
    ],
    speakerNotes: [
      "Convide a plateia a guardar uma resposta provisória, sem tentar resolver a questão.",
      "Reforce que o objetivo da aula é clarear a pergunta, não encerrar a filosofia."
    ],
    transitionQuestion: "Como reconhecer pensamento se não conseguimos observá-lo diretamente?",
    visualTone: "mist"
  },
  {
    id: "turing",
    act: "journey",
    shortLabel: "Como reconhecer?",
    title: "Alan Turing e o jogo da imitação",
    question: "O que é pensar?",
    summary: "Turing troca uma pergunta metafísica por um teste observável de comportamento.",
    beats: [
      "A palavra pensar é difícil de definir.",
      "O jogo da imitação desloca a discussão para uma conversa mediada por texto.",
      "A interface esconde identidades e deixa o comportamento aparecer primeiro."
    ],
    speakerNotes: [
      "Não apresente o teste como a definição final de inteligência.",
      "Use a simulação para mostrar a força e a limitação do critério comportamental."
    ],
    transitionQuestion:
      "Se não conseguimos observar o pensamento diretamente, uma máquina aprender um comportamento?",
    visualTone: "paper"
  },
  {
    id: "neuron",
    act: "journey",
    shortLabel: "Como aprender?",
    title: "O neurônio artificial",
    question: "Como ensinar uma máquina?",
    summary: "Características simples podem ser combinadas para produzir uma decisão binária: gato ou cachorro.",
    beats: [
      "Primeiro observamos características do animal.",
      "Depois revelamos que cada característica possui uma importância diferente.",
      "Aprender, nessa visão inicial, significa ajustar esses números até que a resposta fique melhor."
    ],
    speakerNotes: [
      "Comece manipulando apenas as características, sem mostrar pesos nem fórmula.",
      "Revele os pesos depois que a plateia já entendeu a intuição visual."
    ],
    transitionQuestion: "Mas quem ajusta esses números?",
    visualTone: "machine"
  },
  {
    id: "perceptron",
    act: "journey",
    shortLabel: "Promessa",
    title: "Perceptron",
    question: "Será que uma máquina pode ajustar seus próprios pesos?",
    summary: "O perceptron transforma a ideia de aprender em uma promessa visível: pesos mudam, comportamento muda.",
    beats: [
      "O perceptron foi uma promessa real para sua época.",
      "Quando os dados são linearmente separáveis, a decisão parece elegante.",
      "Alterar pesos altera o comportamento; aprender passa a significar encontrar pesos melhores."
    ],
    speakerNotes: [
      "Mova a linha até reduzir erros no conjunto linear.",
      "Faça a plateia sentir que a ideia parece prestes a escalar."
    ],
    transitionQuestion: "Mas será que todo padrão pode ser resolvido por uma única linha?",
    visualTone: "machine"
  },
  {
    id: "xor-problem",
    act: "journey",
    shortLabel: "Linha falha",
    title: "O problema",
    question: "Mas será que uma linha resolve qualquer padrão?",
    summary: "",
    beats: [
      "A linha se move.",
      "O erro muda de lugar.",
      "Mas nunca desaparece.",
      "Nem todo problema é linearmente separável."
    ],
    speakerNotes: [
      "Deixe a plateia tentar antes de nomear o padrão.",
      "Não apresente a solução ainda; a seção deve terminar em quebra de expectativa."
    ],
    transitionQuestion: "E esse não era o único problema.",
    visualTone: "machine"
  },
  {
    id: "winter",
    act: "journey",
    shortLabel: "Inverno",
    title: "O inverno da IA",
    question: "O que acontece quando a promessa corre mais rápido que a tecnologia?",
    summary: "A expectativa cresceu mais rápido que os resultados.",
    beats: [
      "PROMESSAS ↑",
      "RESULTADOS aquém do esperado",
      "FINANCIAMENTO ↓"
    ],
    speakerNotes: [
      "Mostre como um conjunto de expectativas não correspondidas reduziu o entusiasmo.",
      "Não atribua o inverno a uma única limitação técnica."
    ],
    transitionQuestion: "O que precisaria mudar para essas ideias voltarem a funcionar?",
    visualTone: "winter"
  },
  {
    id: "thaw",
    act: "journey",
    shortLabel: "Descongelar",
    title: "Descongelar",
    question: "O que precisou mudar?",
    summary: "Não foi uma única descoberta. Várias peças amadureceram juntas.",
    beats: [],
    speakerNotes: [
      "Evite sugerir que todos os avanços aconteceram de uma vez.",
      "Use esta seção como ponte emocional e técnica."
    ],
    transitionQuestion: "Antes de descobrir como corrigir a rede, precisamos responder uma pergunta: quanto ela errou?",
    visualTone: "thaw"
  },
  {
    id: "error-ruler",
    act: "journey",
    shortLabel: "Medir erro",
    title: "Medir o erro",
    question: "Como medir o quão errado estamos?",
    summary: "Não basta saber que erramos. Precisamos medir quanto erramos.",
    beats: [],
    speakerNotes: [
      "Introduza erro antes de backpropagation.",
      "Evite aprofundar em história de mínimos quadrados sem revisão específica."
    ],
    transitionQuestion: "Sabemos o tamanho do erro. Mas qual peso deve mudar?",
    visualTone: "flow"
  },
  {
    id: "backprop",
    act: "journey",
    shortLabel: "Backpropagation",
    title: "Back\npropagation",
    question: "Como uma rede aprende com seus erros?",
    summary: "A rede respondeu. Sabemos quanto ela errou. Agora precisamos descobrir por quê.",
    beats: [],
    speakerNotes: [
      "Explique que backpropagation calcula gradientes, sem dizer que ele atualiza os pesos sozinho.",
      "Use a regra da cadeia como dependências encadeadas, não como uma aula de cálculo."
    ],
    transitionQuestion: "Como usamos essa informação para diminuir a perda?",
    visualTone: "flow"
  },
  {
    id: "gradient",
    act: "journey",
    shortLabel: "Direção",
    title: "Gradient\ndescent",
    question: "Sabemos a direção. Quanto devemos andar?",
    summary: "Aprender é procurar uma configuração de pesos que produza menos perda.",
    beats: [],
    speakerNotes: [
      "Use a paisagem como intuição, não como aula formal de cálculo.",
      "Compare perda decrescente e oscilante."
    ],
    transitionQuestion:
      "Agora as redes podiam ajustar milhares — e depois milhões — de parâmetros. Mas havia outro problema: como transformar palavras em algo que uma rede pudesse processar?",
    visualTone: "flow"
  },
  {
    id: "deep-learning",
    act: "journey",
    shortLabel: "Profundidade",
    title: "Deep\nLearning",
    question: "Como uma rede constrói representações cada vez mais complexas?",
    summary: "Uma camada transforma a informação e entrega uma nova representação para a próxima.",
    beats: [],
    speakerNotes: [
      "Trate bordas, formas e partes como exemplo conceitual, não como regra universal.",
      "Reforce que deep learning usa os mesmos mecanismos de treino em redes mais profundas."
    ],
    transitionQuestion:
      "Agora essas redes podiam construir representações cada vez mais complexas. Mas o próximo salto exigiria muito mais: dados, computação e novas arquiteturas.",
    visualTone: "space"
  },
  {
    id: "language",
    act: "journey",
    shortLabel: "Linguagem",
    title: "Linguagem",
    question: "Como representar linguagem?",
    summary: "Aumentar o contexto considerado pode alterar a previsão da próxima palavra.",
    beats: [],
    speakerNotes: [
      "Mostre unigram, bigram e trigram antes de avançar.",
      "Reforce que os valores são didáticos e servem apenas para visualizar a mudança de contexto."
    ],
    transitionQuestion:
      "Mas existe um problema mais básico: como uma máquina opera sobre palavras?",
    visualTone: "flow"
  },
  {
    id: "ngrams",
    act: "journey",
    shortLabel: "Tokens",
    title: "Tokens",
    question: "Como uma máquina opera sobre palavras?",
    summary: "Texto precisa virar unidades manipuláveis antes de ser processado.",
    beats: [],
    speakerNotes: [
      "Avance passo a passo: frase, unidades, divisão didática e IDs.",
      "Reforce que IDs são identificadores, não significado."
    ],
    transitionQuestion: "Se IDs não carregam significado, como representamos relações entre tokens?",
    visualTone: "flow"
  },
  {
    id: "embeddings",
    act: "journey",
    shortLabel: "Espaço",
    title: "Embeddings",
    question: "Como palavras viram posições?",
    summary: "Um embedding transforma cada token em um vetor com muitas dimensões.",
    beats: [],
    speakerNotes: [
      "Comece no mapa 2D e entre no espaço somente depois da ideia de proximidade.",
      "Selecione gato para mostrar vizinhança e rei para revelar a analogia ilustrativa.",
      "Volte à frase para preparar a pergunta sobre atenção."
    ],
    transitionQuestion: "Para onde devemos olhar?",
    visualTone: "space"
  },
  {
    id: "attention",
    act: "journey",
    shortLabel: "Para onde olhar?",
    title: "Attention",
    question: "Como decidir no que prestar atenção?",
    summary: "Atenção permite que cada palavra reúna informações relevantes de outras posições.",
    beats: [],
    speakerNotes: [
      "Avance por Query, Key, pesos e Value antes de liberar a exploração.",
      "Reforce que os pesos são ilustrativos e que a frase permanece ambígua.",
      "No modo livre, compare como cada palavra procura relações diferentes."
    ],
    transitionQuestion:
      "O que acontece quando repetimos esse mecanismo muitas vezes, em várias camadas?",
    visualTone: "light"
  },
  {
    id: "transformer",
    act: "journey",
    shortLabel: "Transformer",
    title: "Transformer",
    question: "Como organizar atenção em escala?",
    summary: "Um Transformer organiza atenção, preserva informação e repete o mesmo bloco em muitas camadas.",
    beats: [
      "A atenção é apenas uma parte do bloco.",
      "Todas as posições são atualizadas em paralelo.",
      "Na geração, o ciclo escolhe um token por vez."
    ],
    speakerNotes: [
      "Construa o bloco passo a passo antes de mostrar sua repetição em profundidade.",
      "Os papéis das cabeças são exemplos didáticos, não funções fixas aprendidas por toda cabeça.",
      "Mantenha o foco no decoder e compare as três famílias somente no último passo."
    ],
    transitionQuestion: "Como surgem respostas longas a partir de escolhas de próximo token?",
    visualTone: "system"
  },
  {
    id: "llm",
    act: "journey",
    shortLabel: "Como gerar?",
    title: "LLMs e geração",
    question: "Como um LLM gera texto?",
    summary: "Um LLM gera texto escolhendo possibilidades para o próximo token, repetidamente.",
    beats: [
      "O contexto produz uma distribuição de próximos tokens.",
      "Temperatura baixa favorece escolhas previsíveis.",
      "Temperatura alta amplia variação e risco de incoerência.",
      "A resposta cresce quando esse ciclo se repete."
    ],
    speakerNotes: [
      "Mostre que a frase não aparece inteira de uma vez: ela cresce token por token.",
      "Gere algumas continuações com temperaturas diferentes.",
      "Evite antropomorfizar o sistema durante a demonstração."
    ],
    transitionQuestion: "Produzir respostas é o mesmo que compreender?",
    visualTone: "system"
  },
  {
    id: "generative-ai",
    act: "journey",
    shortLabel: "Sistemas",
    title: "IA generativa",
    question: "O que acontece quando o modelo vira parte de um sistema maior?",
    summary: "A capacidade aparente cresce quando o LLM passa a operar com contexto, busca, ferramentas e outras modalidades.",
    beats: [
      "O LLM deixa de aparecer isolado.",
      "Cada camada muda o que chega ao modelo ou o que ele pode fazer.",
      "Responder melhor ainda não encerra a pergunta sobre compreensão."
    ],
    speakerNotes: [
      "Mostre como a capacidade aparente cresce quando modelos são combinados a ferramentas.",
      "Use como preparação para a interrupção: responder melhor ainda não resolve compreensão."
    ],
    transitionQuestion: "Ela respondeu corretamente. Mas ela entendeu?",
    visualTone: "system"
  },
  {
    id: "interruption",
    act: "reflection",
    shortLabel: "Pausa",
    title: "Interrupção",
    question: "Ela respondeu corretamente.",
    summary: "Depois do ápice visual, tudo para. A pergunta deixa de ser técnica e volta a ser filosófica.",
    beats: [
      "A resposta está certa.",
      "O comportamento impressiona.",
      "Mas comportamento correto e compreensão talvez não sejam a mesma pergunta."
    ],
    speakerNotes: [
      "Faça uma pausa real antes de avançar.",
      "Este contraste prepara a Sala Chinesa."
    ],
    transitionQuestion: "Responder é compreender?",
    visualTone: "quiet"
  },
  {
    id: "chinese-room",
    act: "reflection",
    shortLabel: "Compreender?",
    title: "A Sala Chinesa",
    question: "Produzir respostas é o mesmo que compreender?",
    summary: "Searle propõe uma sala que manipula símbolos corretamente sem compreender chinês.",
    beats: [
      "A interface reduz movimento e informação.",
      "Regras podem produzir respostas convincentes.",
      "A pergunta volta: comportamento, processamento e compreensão são a mesma coisa?"
    ],
    speakerNotes: [
      "Apresente como experimento mental, não como prova universal.",
      "Depois use o botão para retornar fisicamente à pergunta inicial."
    ],
    transitionQuestion: "Voltar à pergunta",
    visualTone: "quiet"
  },
  {
    id: "final",
    act: "reflection",
    shortLabel: "Podem pensar?",
    title: "A pergunta, \nagora nítida",
    question: "As máquinas podem pensar?",
    summary: "A resposta continua aberta, mas a pergunta agora está mais precisa.",
    beats: [
      "A composição volta ao início.",
      "A névoa desaparece.",
      "A plateia reencontra a pergunta com mais contexto."
    ],
    speakerNotes: [
      "Convide uma reflexão final sem transformar a questão em enquete.",
      "Feche com a tese: tornar a pergunta mais clara."
    ],
    visualTone: "clear"
  }
];

export const chapterIds = chapters.map((chapter) => chapter.id);
