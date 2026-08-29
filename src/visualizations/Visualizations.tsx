import { useMemo, useState } from "react";
import { ArrowRight, Brain, Pause, Play, RotateCcw, StepForward } from "lucide-react";
import {
  buildTemperatureText,
  nextTokenProbabilities,
  TemperatureMode
} from "./temperature";

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
  const [size, setSize] = useState(0.7);
  const [legs, setLegs] = useState(0.4);
  const [wings, setWings] = useState(0.2);
  const [bias, setBias] = useState(-0.45);
  const weights = [0.9, 0.65, -0.8];
  const z = size * weights[0] + legs * weights[1] + wings * weights[2] + bias;
  const output = z > 0 ? "animal terrestre" : "outro padrão";

  return (
    <div className="neuron panel">
      <div className="range-row">
        <label>
          tamanho {size.toFixed(1)}
          <input min="0" max="1" step="0.1" type="range" value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </label>
        <label>
          patas {legs.toFixed(1)}
          <input min="0" max="1" step="0.1" type="range" value={legs} onChange={(e) => setLegs(Number(e.target.value))} />
        </label>
        <label>
          asas {wings.toFixed(1)}
          <input min="0" max="1" step="0.1" type="range" value={wings} onChange={(e) => setWings(Number(e.target.value))} />
        </label>
        <label>
          viés {bias.toFixed(1)}
          <input min="-1" max="1" step="0.1" type="range" value={bias} onChange={(e) => setBias(Number(e.target.value))} />
        </label>
      </div>
      <svg className="neuron__svg" viewBox="0 0 640 260" role="img" aria-label="Entradas conectadas a um neuronio artificial">
        {[62, 130, 198].map((y, index) => (
          <g key={y}>
            <circle cx="80" cy={y} r="22" />
            <line x1="105" y1={y} x2="340" y2="130" style={{ strokeWidth: Math.abs(weights[index]) * 5 + 1 }} />
          </g>
        ))}
        <circle className="neuron__core" cx="390" cy="130" r="54" />
        <line x1="444" y1="130" x2="560" y2="130" />
        <rect x="548" y="104" width="74" height="52" rx="6" />
      </svg>
      <div className="control-row">
        <span className="metric">z = {z.toFixed(2)}</span>
        <span className="metric">saída = {output}</span>
      </div>
      <pre className="formula">z = x1w1 + x2w2 + x3w3 + b{"\n"}saída = função_de_ativação(z)</pre>
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
  const points = mode === "linear" ? linearPoints : xorPoints;
  const errors = points.filter((point) => {
    const prediction = point.y > point.x * angle + 42 + offset ? 1 : 0;
    return prediction !== point.cls;
  }).length;

  return (
    <div className="perceptron panel" data-frustrated={mode === "xor"}>
      <div className="control-row">
        {showModeToggle ? (
          <>
            <button className="ghost-button" type="button" onClick={() => setMode("linear")}>Dados lineares</button>
            <button className="ghost-button" type="button" onClick={() => setMode("xor")}>XOR</button>
          </>
        ) : (
          <span className="metric">{mode === "linear" ? "dados lineares" : "XOR"}</span>
        )}
        <span className="metric">erros = {errors}</span>
      </div>
      <svg viewBox="0 0 420 300" role="img" aria-label="Plano com pontos e linha de decisao">
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
};

export const ErrorRuler = () => {
  const [prediction, setPrediction] = useState(0.2);
  const target = 1;
  const error = target - prediction;
  const loss = error * error;

  return (
    <div className="error-ruler panel">
      <div className="ruler-readout">
        <span>
          resposta correta
          <b>{target.toFixed(1)}</b>
        </span>
        <span>
          rede respondeu
          <b>{prediction.toFixed(1)}</b>
        </span>
        <span>
          perda
          <b>{loss.toFixed(2)}</b>
        </span>
      </div>
      <label className="loss-slider">
        Ajuste a previsão
        <input
          min="0"
          max="1.4"
          step="0.1"
          type="range"
          value={prediction}
          onChange={(event) => setPrediction(Number(event.target.value))}
        />
      </label>
      <div className="ruler-line" aria-hidden="true">
        <i style={{ left: `${(prediction / 1.4) * 100}%` }} />
        <b style={{ left: `${(target / 1.4) * 100}%` }} />
      </div>
      <p className="microcopy">
        A função de perda transforma uma sensação qualitativa, "está errado", em uma quantidade que a rede pode tentar reduzir.
      </p>
    </div>
  );
};

export const WinterExpectations = () => (
  <div className="winter-demo panel">
    {[
      "Máquinas inteligentes em poucos anos.",
      "A linguagem será resolvida em breve.",
      "O raciocínio humano poderá ser reproduzido.",
      "Os sistemas aprenderão como pessoas."
    ].map((text, index) => (
      <p key={text} style={{ animationDelay: `${index * 160}ms` }}>
        {text}
      </p>
    ))}
  </div>
);

export const ThawDemo = () => (
  <div className="thaw-demo panel">
    {["camadas", "otimização", "backprop", "dados", "GPUs", "arquiteturas"].map((item, index) => (
      <span key={item} style={{ animationDelay: `${index * 140}ms` }}>
        {item}
      </span>
    ))}
  </div>
);

export const NeuralNetworkFlow = () => {
  const [step, setStep] = useState(0);
  const labels = ["entrada", "previsão", "erro", "retorno", "nova tentativa"];
  const loss = Math.max(0.12, 0.88 - step * 0.16);

  return (
    <div className="network panel">
      <svg viewBox="0 0 640 320" role="img" aria-label="Rede neural pequena com fluxo para frente e erro voltando">
        {[80, 160, 240].map((y) => <circle key={`i-${y}`} cx="90" cy={y} r="19" />)}
        {[105, 215].map((y) => <circle key={`h-${y}`} cx="310" cy={y} r="24" />)}
        <circle cx="540" cy="160" r="28" />
        {[80, 160, 240].map((y1) =>
          [105, 215].map((y2) => (
            <line key={`${y1}-${y2}`} x1="110" y1={y1} x2="286" y2={y2} className={step >= 1 ? "active" : ""} />
          ))
        )}
        {[105, 215].map((y) => (
          <line key={`out-${y}`} x1="334" y1={y} x2="512" y2="160" className={step >= 3 ? "returning" : step >= 1 ? "active" : ""} />
        ))}
      </svg>
      <div className="control-row">
        <button className="primary-button" type="button" onClick={() => setStep((step + 1) % labels.length)}>
          Próximo passo
        </button>
        <span className="metric">{labels[step]}</span>
        <span className="metric">perda = {loss.toFixed(2)}</span>
      </div>
      <p className="microcopy">Quanto cada conexão contribuiu para o erro? A regra da cadeia distribui essa responsabilidade.</p>
    </div>
  );
};

export const LossLandscape = () => {
  const [mode, setMode] = useState<TemperatureMode>("media");
  const path = {
    baixa: "M55 72 C95 90, 110 112, 135 126 C160 141, 174 152, 190 162",
    media: "M55 72 C112 118, 175 170, 240 205 C286 228, 326 216, 352 188",
    alta: "M55 72 C158 230, 308 22, 368 236 C410 306, 452 108, 510 232"
  }[mode];
  const loss = mode === "baixa" ? "0.41" : mode === "media" ? "0.12" : "oscila";

  return (
    <div className="landscape panel">
      <div className="control-row">
        <button className="ghost-button" type="button" onClick={() => setMode("baixa")}>taxa pequena</button>
        <button className="ghost-button" type="button" onClick={() => setMode("media")}>taxa adequada</button>
        <button className="ghost-button" type="button" onClick={() => setMode("alta")}>taxa grande</button>
        <span className="metric">perda: {loss}</span>
      </div>
      <svg viewBox="0 0 600 340" role="img" aria-label="Paisagem de perda com caminho de descida">
        <path className="contour" d="M70 260 C180 90, 400 90, 520 260" />
        <path className="contour" d="M120 260 C210 150, 370 150, 470 260" />
        <path className="contour" d="M190 260 C250 205, 330 205, 390 260" />
        <path className="loss-path" d={path} />
        <circle cx="352" cy="188" r="13" className="loss-dot" />
      </svg>
    </div>
  );
};

export const DeepLearningScale = () => (
  <div className="deep-scale panel">
    {[
      ["neurônio", "decisão simples"],
      ["camada", "combinação de sinais"],
      ["várias camadas", "representações intermediárias"],
      ["muitas camadas", "abstrações em escala"]
    ].map(([label, detail], index) => (
      <div key={label} style={{ animationDelay: `${index * 120}ms` }}>
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
    ))}
    <p className="microcopy">Uma intuição útil: sinais simples podem sustentar padrões cada vez mais abstratos.</p>
  </div>
);

export const LanguageLab = () => {
  const [context, setContext] = useState<"unigram" | "bigram" | "trigram">("bigram");
  const [phrase, setPhrase] = useState("O gato subiu no telhado");
  const probs = {
    unigram: [["de", 28], ["que", 24], ["telhado", 9], ["muro", 6]],
    bigram: [["telhado", 38], ["sofá", 26], ["muro", 20], ["carro", 16]],
    trigram: [["telhado", 52], ["muro", 24], ["sofá", 16], ["carro", 8]]
  }[context];
  const tokens = phrase.trim().split(/\s+/).filter(Boolean);

  return (
    <div className="language panel">
      <div className="control-row">
        {(["unigram", "bigram", "trigram"] as const).map((item) => (
          <button className="ghost-button" type="button" key={item} onClick={() => setContext(item)}>
            {item}
          </button>
        ))}
      </div>
      <p className="prompt">O gato subiu no...</p>
      <div className="probabilities">
        {probs.map(([token, probability]) => (
          <span key={token}>
            {token}
            <i style={{ width: `${probability}%` }} />
            <b>{probability}%</b>
          </span>
        ))}
      </div>
      <label className="tokenizer">
        Tokenização didática
        <input value={phrase} onChange={(event) => setPhrase(event.target.value)} />
      </label>
      <div className="tokens">
        {tokens.map((token, index) => (
          <span key={`${token}-${index}`}>
            {token}
            <b>#{token.length * 97 + index}</b>
          </span>
        ))}
      </div>
      <p className="microcopy">Demonstração simplificada: não reproduz o tokenizer de um modelo específico.</p>
    </div>
  );
};

const embeddingWords = [
  { word: "gato", x: 24, y: 32, group: "animal" },
  { word: "cachorro", x: 32, y: 40, group: "animal" },
  { word: "animal", x: 22, y: 48, group: "animal" },
  { word: "rei", x: 66, y: 28, group: "monarquia" },
  { word: "rainha", x: 75, y: 34, group: "monarquia" },
  { word: "príncipe", x: 70, y: 44, group: "monarquia" },
  { word: "carro", x: 42, y: 72, group: "transporte" },
  { word: "ônibus", x: 52, y: 78, group: "transporte" },
  { word: "música", x: 78, y: 68, group: "arte" },
  { word: "melodia", x: 86, y: 76, group: "arte" },
  { word: "Recife", x: 18, y: 76, group: "cidade" },
  { word: "Lisboa", x: 24, y: 84, group: "cidade" }
];

export const EmbeddingSpace = () => {
  const [selected, setSelected] = useState("gato");
  const selectedWord = embeddingWords.find((item) => item.word === selected) ?? embeddingWords[0];

  return (
    <div className="embedding panel">
      <svg viewBox="0 0 620 420" role="img" aria-label="Espaco vetorial de palavras agrupadas">
        {embeddingWords
          .filter((item) => item.group === selectedWord.group && item.word !== selectedWord.word)
          .map((item) => (
            <line
              key={`${selectedWord.word}-${item.word}`}
              x1={selectedWord.x * 6}
              y1={selectedWord.y * 4}
              x2={item.x * 6}
              y2={item.y * 4}
              className="similarity"
            />
          ))}
        {embeddingWords.map((item) => (
          <g key={item.word} onClick={() => setSelected(item.word)} tabIndex={0} role="button" aria-label={`Selecionar ${item.word}`}>
            <circle cx={item.x * 6} cy={item.y * 4} r={item.word === selected ? 16 : 10} data-group={item.group} />
            <text x={item.x * 6 + 14} y={item.y * 4 + 5}>{item.word}</text>
          </g>
        ))}
      </svg>
      <p className="microcopy">
        Selecionada: {selected}. Palavras em contextos semelhantes tendem a ficar próximas.
      </p>
      <pre className="formula">rei - homem + mulher ≈ rainha</pre>
    </div>
  );
};

const sentence = ["O", "cachorro", "perseguiu", "o", "gato", "porque", "ele", "estava", "assustado"];

export const AttentionVisualizer = () => {
  const [selectedIndex, setSelectedIndex] = useState(6);
  const selected = sentence[selectedIndex];
  const weights = useMemo(
    () =>
      sentence.map((word, index) => {
        if (index === selectedIndex) return 0.9;
        if (selected === "ele" && ["cachorro", "gato", "assustado"].includes(word)) return word === "gato" ? 0.82 : 0.55;
        if (selected === "assustado" && ["ele", "gato"].includes(word)) return 0.72;
        return 0.16;
      }),
    [selected, selectedIndex]
  );

  return (
    <div className="attention panel">
      <div className="attention__sentence">
        {sentence.map((word, index) => (
          <button
            key={`${word}-${index}`}
            type="button"
            className="ghost-button"
            data-active={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          >
            {word}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 760 220" role="img" aria-label="Conexoes de atencao entre palavras">
        {sentence.map((word, index) => {
          const x = 55 + index * 82;
          return (
            <g key={`${word}-${index}`}>
              <circle cx={x} cy="160" r={12 + weights[index] * 10} />
              <path
                d={`M${55 + selectedIndex * 82} 150 C${x} 20, ${x} 20, ${x} 150`}
                style={{ opacity: weights[index], strokeWidth: 1 + weights[index] * 9 }}
              />
              <text x={x - 26} y="198">{word}</text>
            </g>
          );
        })}
      </svg>
      <div className="qkv">
        <span><b>Query</b> procura</span>
        <span><b>Key</b> oferece referência</span>
        <span><b>Value</b> transporta informação</span>
      </div>
      <pre className="formula">Attention(Q, K, V) = softmax(QKᵀ / √dₖ)V</pre>
    </div>
  );
};

const transformerSteps = [
  "frase entra",
  "tokens",
  "vetores",
  "posição",
  "attention",
  "camadas",
  "probabilidades",
  "próximo token"
];

export const TransformerFlow = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="transformer panel">
      <div className="control-row">
        <button className="icon-button" type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pausar" : "Reproduzir"}>
          {playing ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <button className="icon-button" type="button" onClick={() => setStep((step + 1) % transformerSteps.length)} aria-label="Avançar">
          <StepForward size={17} />
        </button>
        <button className="icon-button" type="button" onClick={() => setStep(0)} aria-label="Reiniciar">
          <RotateCcw size={17} />
        </button>
        <span className="metric">{transformerSteps[step]}</span>
      </div>
      <div className="transformer__track" data-playing={playing}>
        {transformerSteps.map((label, index) => (
          <div key={label} data-active={index <= step}>
            <Brain size={18} />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="model-types">
        <span>encoder: compreende contexto</span>
        <span>decoder: gera sequência</span>
        <span>encoder-decoder: transforma entrada em saída</span>
      </div>
    </div>
  );
};

export const TemperatureSampler = () => {
  const [mode, setMode] = useState<TemperatureMode>("media");

  return (
    <div className="temperature panel">
      <div className="control-row">
        {(["baixa", "media", "alta"] as const).map((item) => (
          <button className="ghost-button" type="button" key={item} onClick={() => setMode(item)}>
            temperatura {item}
          </button>
        ))}
      </div>
      <p className="generated">{buildTemperatureText(mode)}</p>
      <div className="probabilities">
        {nextTokenProbabilities[mode].map(([token, probability]) => (
          <span key={token}>
            {token}
            <i style={{ width: `${probability}%` }} />
            <b>{probability}%</b>
          </span>
        ))}
      </div>
    </div>
  );
};

export const GenerativeSystems = () => (
  <div className="systems-demo panel">
    <div className="systems-core">LLM</div>
    {["contexto", "RAG", "ferramentas", "memória", "código", "imagem", "áudio"].map((item, index) => (
      <span key={item} style={{ animationDelay: `${index * 110}ms` }}>
        {item}
      </span>
    ))}
    <p className="microcopy">
      A capacidade aparente cresce quando o modelo é combinado com contexto, ferramentas e outras modalidades.
    </p>
  </div>
);

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
