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
    summary: "Entradas, pesos e limiares transformam sinais em uma decisão simples.",
    beats: [
      "Uma máquina pode combinar sinais e produzir uma saída.",
      "Os pesos dizem quais sinais importam mais.",
      "Aprender, nessa visão inicial, significa ajustar números até que a resposta fique melhor."
    ],
    speakerNotes: [
      "Comece pela manipulação dos controles antes de revelar a fórmula.",
      "Mostre que a saída muda quando o peso muda, mesmo com a mesma entrada."
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
    question: "Nem tudo pode ser separado por uma linha.",
    summary: "A promessa encontra um limite simples e teimoso: há padrões que uma única fronteira linear não consegue separar.",
    beats: [
      "A demonstração deixa de parecer obediente.",
      "A linha se move, mas o erro não desaparece.",
      "A pergunta muda: se uma camada não basta, por que não conectar várias?"
    ],
    speakerNotes: [
      "Use XOR como frustração visual antes da explicação formal.",
      "Não apresente como fim da IA; apresente como uma limitação que cria a próxima necessidade."
    ],
    transitionQuestion: "Se conectarmos vários neurônios, quem ajusta todos esses pesos?",
    visualTone: "machine"
  },
  {
    id: "winter",
    act: "journey",
    shortLabel: "Inverno",
    title: "O inverno da IA",
    question: "O que acontece quando a promessa corre mais rápido que a tecnologia?",
    summary: "Expectativas crescem, financiamento recua e a tela desacelera.",
    beats: [
      "Máquinas inteligentes em poucos anos.",
      "A linguagem será resolvida em breve.",
      "O inverno da IA foi também um choque entre ambição pública e capacidade real."
    ],
    speakerNotes: [
      "As frases são expectativas sintetizadas, não citações literais.",
      "Destaque que o inverno não apaga as ideias; ele diminui o ritmo."
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
    summary: "Dados, computação, arquiteturas e métodos se acumulam até reacender redes neurais.",
    beats: [
      "Nada volta por um único motivo.",
      "Múltiplas camadas, backpropagation, dados e GPUs criam uma evolução acumulativa.",
      "A temperatura visual sobe aos poucos."
    ],
    speakerNotes: [
      "Evite sugerir que todos os avanços aconteceram de uma vez.",
      "Use esta seção como ponte emocional e técnica."
    ],
    transitionQuestion: "Antes de corrigir uma rede, como medimos o quão errada ela está?",
    visualTone: "thaw"
  },
  {
    id: "error-ruler",
    act: "journey",
    shortLabel: "Medir erro",
    title: "Medir o erro",
    question: "Como medir o quão errado estamos?",
    summary: "Antes de corrigir uma rede, precisamos transformar 'está errado' em uma quantidade manipulável.",
    beats: [
      "Resposta correta: 1.",
      "A rede respondeu: 0.2.",
      "Uma função de perda vira a régua que mede a distância entre tentativa e alvo."
    ],
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
    shortLabel: "Erro",
    title: "Erro e back-propagation",
    question: "Como uma rede aprende com seus erros?",
    summary: "A previsão avança; o erro retorna distribuindo responsabilidade pelas conexões.",
    beats: [
      "Entrada vira previsão.",
      "Previsão encontra resposta correta e produz erro.",
      "O erro volta pela rede para ajustar pesos."
    ],
    speakerNotes: [
      "Explique regra da cadeia como responsabilidade distribuída.",
      "A simulação é numérica e didática, não uma rede real completa."
    ],
    transitionQuestion: "Mas como sabemos em qual direção alterar cada peso?",
    visualTone: "flow"
  },
  {
    id: "gradient",
    act: "journey",
    shortLabel: "Direção",
    title: "Gradient descent",
    question: "Como reduzir o erro?",
    summary: "Aprender é procurar uma configuração de pesos que produza menos perda.",
    beats: [
      "Uma taxa pequena aprende devagar.",
      "Uma taxa adequada chega ao vale com eficiência.",
      "Uma taxa grande demais oscila e pode divergir."
    ],
    speakerNotes: [
      "Use a paisagem como intuição, não como aula formal de cálculo.",
      "Compare perda decrescente e oscilante."
    ],
    transitionQuestion:
      "Redes conseguiam aprender padrões. Mas como representar algo tão ambíguo quanto a linguagem?",
    visualTone: "flow"
  },
  {
    id: "deep-learning",
    act: "journey",
    shortLabel: "Escala",
    title: "Deep Learning",
    question: "O que acontece quando empilhamos muitas camadas?",
    summary: "A rede deixa de ser uma única decisão e passa a construir representações em níveis sucessivos.",
    beats: [
      "Um neurônio vira uma camada.",
      "Camadas viram profundidade.",
      "Padrões simples podem sustentar representações cada vez mais abstratas."
    ],
    speakerNotes: [
      "Use a escala como ponte: agora máquinas reconhecem padrões complexos.",
      "Não apresente pixels, bordas e objetos como regra absoluta; trate como intuição."
    ],
    transitionQuestion: "Mas como fazer tudo isso com linguagem?",
    visualTone: "space"
  },
  {
    id: "language",
    act: "journey",
    shortLabel: "Linguagem",
    title: "Linguagem",
    question: "Como representar linguagem?",
    summary: "Regras, contagens, n-gramas e tokens mostram que texto também vira estrutura.",
    beats: [
      "A história da linguagem computacional não começa com Transformers.",
      "Contextos maiores capturam mais informação, mas escalam pior.",
      "Tokenizar é transformar texto em unidades manipuláveis."
    ],
    speakerNotes: [
      "Reforce que o tokenizer é local e simplificado.",
      "Mostre unigram, bigram e trigram antes de avançar."
    ],
    transitionQuestion:
      "Ter representações das palavras é suficiente para compreender como elas se relacionam dentro de uma frase?",
    visualTone: "flow"
  },
  {
    id: "ngrams",
    act: "journey",
    shortLabel: "N-gramas",
    title: "N-gramas",
    question: "Podemos prever linguagem olhando para o passado?",
    summary: "Antes dos LLMs, uma intuição já aparecia: talvez a próxima palavra dependa das anteriores.",
    beats: [
      "Contextos pequenos capturam pouco.",
      "Contextos maiores ajudam, mas aumentam combinações.",
      "Palavras semelhantes ainda parecem objetos separados demais."
    ],
    speakerNotes: [
      "Use o seletor unigram, bigram e trigram.",
      "Prepare a pergunta que leva a embeddings: e se significado pudesse virar posição?"
    ],
    transitionQuestion: "E se pudéssemos representar significado como posição?",
    visualTone: "flow"
  },
  {
    id: "embeddings",
    act: "journey",
    shortLabel: "Espaço",
    title: "Embeddings",
    question: "Como palavras viram posições?",
    summary: "Palavras usadas em contextos semelhantes passam a ocupar regiões próximas.",
    beats: [
      "A linguagem deixa de ser uma linha e passa a ocupar um espaço.",
      "Proximidade sugere relação semântica, mas não é garantia perfeita.",
      "Analogias vetoriais são intuições úteis, não leis universais."
    ],
    speakerNotes: [
      "Selecione uma palavra e destaque vizinhas.",
      "Apresente rei - homem + mulher como aproximação cautelosa."
    ],
    transitionQuestion:
      "Ter palavras em espaço vetorial basta para saber para onde olhar dentro de uma frase?",
    visualTone: "space"
  },
  {
    id: "attention",
    act: "journey",
    shortLabel: "Para onde olhar?",
    title: "Attention",
    question: "Como decidir no que prestar atenção?",
    summary: "Atenção ilumina relações entre palavras que antes estavam invisíveis.",
    beats: [
      "Para interpretar uma palavra, o modelo precisa olhar para outras.",
      "Query é o que uma palavra procura.",
      "Key é o que cada palavra oferece; Value é a informação transportada."
    ],
    speakerNotes: [
      "Clique em 'ele' e pergunte para onde a frase aponta.",
      "Só depois revele Q, K e V."
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
    summary: "Tokens viram vetores, atravessam camadas e produzem probabilidades para o próximo token.",
    beats: [
      "A arquitetura não aparece inteira de uma vez.",
      "Acompanhe um token atravessando posição, atenção e camadas.",
      "Modelos autoregressivos repetem o ciclo para gerar texto."
    ],
    speakerNotes: [
      "Use o modo passo a passo.",
      "Mencione encoder, decoder e encoder-decoder sem perder o foco na geração."
    ],
    transitionQuestion: "Como surgem respostas longas a partir de escolhas de próximo token?",
    visualTone: "system"
  },
  {
    id: "llm",
    act: "journey",
    shortLabel: "Como gerar?",
    title: "LLMs e geração",
    question: "Como surgem os LLMs?",
    summary: "Um LLM gera texto escolhendo possibilidades para o próximo token, repetidamente.",
    beats: [
      "Temperatura baixa favorece escolhas previsíveis.",
      "Temperatura alta amplia variação e risco de incoerência.",
      "A geração pode soar fluente sem encerrar a questão da compreensão."
    ],
    speakerNotes: [
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
    summary: "Texto, imagem, áudio, código, ferramentas e contexto ampliam a sensação de capacidade.",
    beats: [
      "O LLM deixa de aparecer isolado.",
      "Contexto, RAG, ferramentas e memória criam sistemas mais úteis.",
      "No ápice da complexidade, a pergunta filosófica fica mais urgente."
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
