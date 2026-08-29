Quero que você projete e implemente uma experiência web interativa para uma palestra/aula sobre a história da Inteligência Artificial, redes neurais, Transformers e LLMs.

Não quero um site institucional, uma landing page tradicional nem uma sequência de slides comuns. Quero uma **apresentação web narrativa, imersiva, linear e controlada por rolagem**, semelhante a um documentário interativo.

A interface deve fazer parte da história. Cores, movimentos, desfoque, ritmo, temperatura visual e transições devem ajudar o público a compreender e sentir cada período da evolução da IA.

---

# 1. Objetivo principal

A experiência deve conduzir o público por uma jornada histórica e conceitual que começa e termina com a mesma pergunta:

> As máquinas podem pensar?

O objetivo da apresentação não é afirmar definitivamente se máquinas pensam ou não.

O objetivo é oferecer contexto histórico, técnico e filosófico suficiente para que, ao final, a plateia consiga refletir sobre a pergunta de maneira mais profunda.

A tese narrativa central é:

> A apresentação não precisa tornar a resposta mais clara. Ela deve tornar a pergunta mais clara.

No início, a pergunta deverá aparecer visualmente borrada, nebulosa e imprecisa.

Ao final, depois de toda a jornada, a interface deverá retornar fisicamente à mesma seção inicial. A pergunta deverá estar completamente nítida.

---

# 2. Direção da experiência

A apresentação será usada ao vivo, em tela cheia, por uma pessoa conduzindo uma palestra.

Ela deve funcionar como uma experiência linear.

O apresentador controla o ritmo por meio de:

* rolagem;
* teclado;
* botões narrativos;
* interações pontuais;
* controles de demonstrações.

A navegação não deve parecer a navegação de um site comum.

Evite:

* menus tradicionais;
* barras de navegação corporativas;
* cards genéricos;
* seções com aparência de landing page;
* layouts repetitivos;
* excesso de texto;
* aparência de template pronto.

A experiência deve parecer uma obra visual feita especificamente para contar essa história.

---

# 3. Stack técnica

Antes de implementar, examine a estrutura existente do projeto.

Caso o projeto esteja vazio, utilize:

* Vite;
* React;
* TypeScript;
* CSS Modules, CSS estruturado ou uma solução equivalente;
* Framer Motion para animações de componentes;
* GSAP com ScrollTrigger para animações complexas baseadas em rolagem;
* Canvas ou SVG para visualizações interativas;
* Lucide Icons apenas quando ícones forem realmente necessários.

Não use backend nesta primeira versão.

Não dependa de APIs externas para que a apresentação funcione.

A experiência deve funcionar localmente após:

```bash
npm install
npm run dev
```

E deve gerar uma versão de produção com:

```bash
npm run build
```

Todos os dados, textos e configurações da apresentação devem ficar organizados localmente.

Não coloque todo o código em um único componente.

---

# 4. Estrutura narrativa geral

Organize a experiência como uma jornada em três atos.

## Ato 1 — A pergunta

A experiência começa com:

> As máquinas podem pensar?

A pergunta deve aparecer em uma tela quase vazia.

Ela deve estar:

* levemente desfocada;
* com contraste moderado;
* cercada por uma atmosfera nebulosa;
* visualmente compreensível, mas não totalmente nítida.

O desfoque não deve impedir a leitura.

A sensação deve ser de incerteza conceitual.

Nesta tela, inclua uma interação opcional de votação inicial:

* Sim.
* Não.
* Depende.
* Não sei exatamente o que significa “pensar”.

A votação pode ser local, sem backend.

Armazene os resultados apenas durante a sessão atual.

Depois da votação, deve existir um controle para iniciar a jornada.

Texto sugerido:

> Antes de procurar uma resposta, precisamos entender a pergunta.

Botão:

> Começar a investigação

---

## Ato 2 — A jornada

A parte central será uma sequência cronológica em que cada descoberta nasce como resposta a uma limitação anterior.

A apresentação não deve parecer uma lista de tecnologias.

Cada capítulo deve terminar com uma pergunta que cria a necessidade do próximo capítulo.

Estrutura sugerida:

1. As máquinas podem pensar?
2. Como reconhecer pensamento?
3. Como ensinar uma máquina?
4. Por que as primeiras tentativas falharam?
5. Como uma rede aprende com seus erros?
6. Como representar linguagem?
7. Como decidir no que prestar atenção?
8. Como surgem os LLMs?
9. Produzir respostas é o mesmo que compreender?
10. As máquinas podem pensar?

---

## Ato 3 — A reflexão

Depois de apresentar LLMs e suas capacidades, a experiência deve reduzir drasticamente o ritmo.

A interface deve perder elementos.

As animações devem diminuir.

O excesso visual deve desaparecer.

A apresentação deve introduzir o experimento mental da **Sala Chinesa**, de John Searle.

Depois disso, haverá um botão narrativo:

> Voltar à pergunta

Ao clicar, a página deverá subir automaticamente até o início, percorrendo a jornada em sentido inverso.

Durante essa subida, poderão aparecer flashes ou rastros das principais etapas:

* LLM;
* Transformer;
* Attention;
* embeddings;
* redes neurais;
* perceptron;
* Turing.

Quando a página retornar à primeira seção, a pergunta inicial deverá estar completamente nítida:

> As máquinas podem pensar?

O apresentador poderá então repetir a votação.

---

# 5. Capítulos detalhados

## Capítulo 1 — Alan Turing e a pergunta

Tema:

> As máquinas podem pensar?

Objetivos:

* apresentar Alan Turing;
* contextualizar a pergunta;
* explicar que “pensar” é difícil de definir;
* apresentar o jogo da imitação;
* mostrar que Turing transforma uma pergunta filosófica em um teste observável de comportamento.

Direção visual:

* estética de máquina de escrever;
* papel, terminal ou comunicação textual;
* tipografia monoespaçada em elementos específicos;
* ruído sutil de transmissão;
* mensagens aparecendo como se fossem digitadas;
* tons ainda neutros e nebulosos.

Interação:

Criar uma pequena simulação do jogo da imitação.

Mostrar duas entidades:

* Pessoa A;
* Pessoa B.

Uma pode ser apresentada como humana e outra como máquina, sem revelar inicialmente qual é qual.

O apresentador poderá alternar entre algumas respostas predefinidas.

A plateia escolhe:

> Qual delas parece humana?

Depois, a interface revela que comportamento convincente não resolve necessariamente a questão da compreensão.

Pergunta de transição:

> Se não conseguimos observar o pensamento diretamente, poderíamos ensinar uma máquina a reconhecer padrões?

---

## Capítulo 2 — O neurônio artificial

Apresentar de forma intuitiva a ideia de um neurônio artificial.

Antes de mostrar fórmulas, apresente:

* entradas;
* pesos;
* soma;
* limiar;
* saída.

Criar uma visualização interativa com três entradas.

Exemplo:

* tamanho;
* número de patas;
* presença de asas.

A saída pode tentar classificar algo simples.

Permitir ao apresentador:

* alterar valores das entradas;
* alterar pesos;
* observar a soma;
* observar a decisão final.

A fórmula deve aparecer apenas depois da interação:

```text
z = x₁w₁ + x₂w₂ + x₃w₃ + b
```

Depois:

```text
saída = função_de_ativação(z)
```

Direção visual:

* formas geométricas;
* conexões mecânicas;
* sensação de descoberta;
* cores discretamente mais vivas;
* movimento preciso e otimista.

Mensagem central:

> Aprender, nessa visão inicial, significa ajustar números até que a resposta fique melhor.

Pergunta de transição:

> Mas quem ajusta esses números?

---

## Capítulo 3 — Perceptron e limitações

Apresentar o perceptron como uma promessa inicial.

Mostrar uma separação linear de pontos.

Criar uma demonstração interativa:

* pontos de duas classes em um plano;
* uma linha de decisão;
* controles que movem a linha;
* classificação visual dos pontos;
* contador de erros.

Depois, apresentar um problema que não pode ser separado por uma única linha, como XOR.

A linha tenta resolver, mas nunca consegue classificar todos os pontos corretamente.

A própria interface deve começar a demonstrar frustração:

* pequenos travamentos;
* conexões interrompidas;
* saturação diminuindo;
* elementos falhando;
* movimentos ficando mais lentos.

Não apresente a história como “o perceptron era inútil”.

Apresente como:

> A ideia era importante, mas uma única camada possuía limitações profundas.

Pergunta de transição:

> Se uma camada não era suficiente, por que não usar várias?

---

## Capítulo 4 — O inverno da IA

Esta seção deve ter uma transformação ambiental significativa.

A transição para o inverno deve começar gradualmente antes do título aparecer.

Direção visual:

* redução de saturação;
* tons azulados, cinzentos e brancos;
* partículas lentas;
* névoa;
* animações que parecem congelar;
* conexões interrompidas;
* menor velocidade;
* maior sensação de espaço vazio;
* tipografia mais rígida.

Evite um cenário infantil ou literal demais.

Não transforme a tela em um desenho de neve.

A estética deve ser abstrata e sofisticada.

Mostrar expectativas ou promessas históricas que aparecem e depois congelam.

Exemplos de mensagens:

* “Máquinas inteligentes em poucos anos.”
* “A linguagem será resolvida em breve.”
* “O raciocínio humano poderá ser reproduzido.”
* “Os sistemas aprenderão como pessoas.”

Essas frases devem aparecer como expectativas, não como citações históricas exatas, a menos que sejam posteriormente verificadas e referenciadas.

Mensagem central:

> O inverno da IA não foi apenas uma falha técnica. Foi o resultado de expectativas crescendo mais rápido do que a capacidade real da tecnologia.

Pergunta de transição:

> O que precisaria mudar para essas ideias voltarem a funcionar?

---

## Capítulo 5 — O descongelamento

A saída do inverno deve ser gradual.

Não troque instantaneamente o azul pelo laranja.

Primeiro:

* um pequeno pulso;
* uma conexão volta a acender;
* um ponto começa a se mover;
* uma rachadura surge no gelo;
* um dado percorre novamente a rede.

Depois, apresentar os elementos que ajudaram a recuperar as redes neurais:

* múltiplas camadas;
* métodos de otimização;
* backpropagation;
* maior quantidade de dados;
* maior capacidade computacional;
* GPUs;
* melhorias em arquiteturas e treinamento.

Não sugira que esses elementos surgiram todos no mesmo momento.

A apresentação deverá deixar claro que foi uma evolução acumulativa.

A temperatura visual deverá aumentar progressivamente.

---

## Capítulo 6 — Erro, aprendizado e backpropagation

Criar uma visualização didática de uma rede neural pequena.

Estrutura:

* camada de entrada;
* camada oculta;
* camada de saída.

Primeiro, mostrar o fluxo para frente:

```text
entrada → cálculo → previsão
```

Depois comparar:

```text
previsão → resposta correta → erro
```

Em seguida, mostrar o erro retornando pela rede:

```text
erro → atualização das conexões → nova tentativa
```

Mensagem central:

> A rede avança para tentar responder. O erro retorna para ensiná-la.

Criar animação em que:

* valores viajam da esquerda para a direita;
* a previsão aparece;
* um erro é calculado;
* o erro percorre as conexões no sentido inverso;
* os pesos mudam visualmente;
* uma nova previsão é realizada;
* o erro diminui.

Não é necessário calcular uma rede complexa real.

Uma simulação numericamente coerente é suficiente.

Também apresente, de forma visual e curta, a regra da cadeia.

Evite começar pela derivada.

Comece pela ideia de responsabilidade:

> Quanto cada conexão contribuiu para o erro?

Depois mostre que a regra da cadeia permite distribuir essa responsabilidade.

Pergunta de transição:

> Mas como sabemos em qual direção alterar cada peso?

---

## Capítulo 7 — Gradient descent

Criar uma paisagem tridimensional ou pseudo-3D representando uma função de erro.

Pode usar Canvas, SVG ou WebGL apenas se necessário.

Mostrar uma esfera ou ponto sobre a paisagem.

Permitir escolher:

* taxa de aprendizado pequena;
* taxa de aprendizado adequada;
* taxa de aprendizado muito grande.

Com taxa pequena:

* o ponto avança lentamente;
* converge, mas demora.

Com taxa adequada:

* o ponto chega ao vale de forma eficiente.

Com taxa muito grande:

* o ponto ultrapassa o vale;
* oscila;
* pode divergir.

Mostrar o valor da perda diminuindo ou oscilando.

Mensagem central:

> Aprender é procurar uma configuração de pesos que produza menos erro.

Evite transformar a visualização em uma aula excessivamente matemática.

A matemática pode estar disponível em uma camada opcional.

Pergunta de transição:

> Redes conseguiam aprender padrões. Mas como representar algo tão ambíguo quanto a linguagem?

---

## Capítulo 8 — Linguagem antes dos LLMs

Mostrar que a história da linguagem computacional não começou com Transformers.

Criar uma progressão visual:

1. regras escritas manualmente;
2. contagem de palavras;
3. n-gramas;
4. modelos probabilísticos;
5. representações vetoriais;
6. embeddings.

### Demonstração de n-gramas

Apresentar uma frase incompleta:

> O gato subiu no...

Mostrar próximas palavras possíveis e probabilidades simuladas.

Exemplo:

* telhado;
* sofá;
* muro;
* carro.

Permitir alterar o tamanho do contexto:

* unigram;
* bigram;
* trigram.

Mostrar que contextos maiores capturam mais informação, mas trazem dificuldades de escala e generalização.

### Demonstração de tokenização

Criar um campo no qual o apresentador pode digitar uma frase.

Não é necessário implementar um tokenizer real de um modelo específico.

Pode usar uma tokenização didática local.

Mostrar:

* frase original;
* segmentos;
* identificadores numéricos simulados;
* quantidade de tokens.

Deixar claro que é uma demonstração simplificada.

---

## Capítulo 9 — Embeddings e espaço vetorial

Esta seção deve introduzir profundidade visual.

As palavras deixam de existir apenas em linhas e passam a ocupar um espaço.

Criar uma visualização interativa em 2D ou pseudo-3D com palavras agrupadas por proximidade semântica.

Exemplos de grupos:

* gato, cachorro, animal, pet;
* rei, rainha, príncipe, monarquia;
* carro, ônibus, caminhão, transporte;
* música, canção, melodia, ritmo;
* Recife, São Paulo, Lisboa, cidade.

Permitir:

* arrastar o espaço;
* aproximar;
* selecionar uma palavra;
* visualizar palavras próximas;
* mostrar linhas de similaridade.

A visualização deve lembrar uma exploração espacial, mas não deve se tornar um jogo complicado.

A ideia central é:

> Palavras utilizadas em contextos semelhantes tendem a adquirir representações semelhantes.

Apresentar analogias vetoriais apenas como intuição, evitando sugerir que sempre funcionam perfeitamente.

Exemplo:

```text
rei - homem + mulher ≈ rainha
```

Pergunta de transição:

> Ter representações das palavras é suficiente para compreender como elas se relacionam dentro de uma frase?

---

## Capítulo 10 — Attention

Esta deve ser uma das demonstrações mais claras e memoráveis.

Apresentar uma frase.

Exemplo:

> O cachorro perseguiu o gato porque ele estava assustado.

Permitir selecionar uma palavra, como:

> ele

Ao selecionar, criar conexões visuais com outras palavras da frase.

A espessura ou intensidade das conexões representa atenção.

Criar outros exemplos para mostrar que o contexto pode alterar as relações.

Pergunta intuitiva:

> Para interpretar esta palavra, para onde o modelo precisa olhar?

Depois da intuição, apresentar gradualmente:

* Query;
* Key;
* Value.

Não começar com matrizes.

Usar uma metáfora visual:

* Query: o que esta palavra está procurando;
* Key: o que cada palavra oferece como referência;
* Value: a informação que será transportada.

Depois, em um nível opcional, mostrar:

```text
Attention(Q, K, V) = softmax(QKᵀ / √dₖ)V
```

A fórmula não deve dominar a tela.

A atenção deve ser visualmente representada como luz revelando relações anteriormente invisíveis.

Pergunta de transição:

> O que acontece quando repetimos esse mecanismo muitas vezes, em várias camadas e com vários tipos de atenção?

---

## Capítulo 11 — Transformer

Construir uma animação progressiva.

Não mostrar a arquitetura inteira de uma vez.

A sequência deve ser:

1. uma frase entra;
2. a frase é dividida em tokens;
3. os tokens se tornam vetores;
4. informação de posição é adicionada;
5. os tokens passam pela atenção;
6. passam por transformações;
7. atravessam várias camadas;
8. o sistema produz probabilidades para o próximo token;
9. um novo token é escolhido;
10. o ciclo se repete.

Criar um modo de execução passo a passo.

Controles:

* reproduzir;
* pausar;
* avançar;
* reiniciar;
* velocidade.

A animação deve acompanhar um token específico durante o processo.

Evite um diagrama excessivamente acadêmico.

A prioridade é mostrar transformação sequencial de informação.

Também apresente a diferença básica entre:

* encoder;
* decoder;
* encoder-decoder.

Mas mantenha o foco nos modelos autoregressivos usados para geração de texto.

---

## Capítulo 12 — LLMs e geração

Mostrar que um LLM gera texto selecionando repetidamente possibilidades para o próximo token.

Criar uma demonstração local e simulada.

Prompt:

> Era uma vez uma máquina que...

Mostrar possíveis próximos tokens com probabilidades.

Exemplo:

* aprendeu;
* desejava;
* observava;
* descobriu;
* não.

Permitir selecionar temperatura:

* baixa;
* média;
* alta.

Com temperatura baixa:

* escolhas mais previsíveis;
* texto mais conservador.

Com temperatura alta:

* escolhas mais variadas;
* maior risco de incoerência.

A demonstração não precisa usar um modelo real.

Ela deve ser uma simulação didática coerente.

Deixar claro na interface:

> Demonstração simplificada do processo de amostragem.

Apresentar brevemente:

* pré-treinamento;
* previsão do próximo token;
* ajuste fino;
* alinhamento;
* contexto;
* geração;
* limitações.

Evitar transformar essa seção em uma descrição de produto específico.

---

## Capítulo 13 — Do modelo ao sistema

Apresentar, brevemente, que um LLM isolado é diferente de um sistema baseado em LLM.

Mostrar uma progressão visual:

```text
LLM
↓
LLM + contexto
↓
LLM + recuperação de informações
↓
LLM + ferramentas
↓
LLM + memória
↓
LLM + planejamento
↓
agentes e sistemas compostos
```

Explicar visualmente:

* RAG;
* ferramentas;
* chamadas de função;
* memória;
* agentes;
* avaliação;
* observabilidade.

Não aprofundar demais.

Esta seção serve para mostrar como os modelos passaram de geradores de texto para componentes de sistemas maiores.

Pergunta de transição:

> Um sistema capaz de responder, utilizar ferramentas e planejar está compreendendo ou apenas executando processos cada vez mais sofisticados?

---

## Capítulo 14 — O ápice e a interrupção

Antes de entrar na reflexão filosófica, a interface deverá atingir seu maior nível visual.

Mostrar rapidamente:

* textos;
* código;
* imagens;
* ferramentas;
* planejamento;
* múltiplas modalidades;
* respostas complexas.

A sensação deve ser de capacidade crescente.

Depois, interromper tudo.

A animação para.

O som, caso exista, desaparece.

A tela perde elementos.

O espaço fica vazio.

A mudança de ritmo deve ser perceptível.

---

## Capítulo 15 — A Sala Chinesa

Apresentar o experimento mental da Sala Chinesa, de John Searle.

Não chamar esse experimento de “cartesiano”.

Representação visual:

* uma sala;
* uma pessoa dentro;
* símbolos chineses entrando por uma abertura;
* um grande manual de regras;
* a pessoa consultando o manual;
* símbolos de resposta saindo;
* alguém do lado de fora interpretando as respostas como compreensão.

Texto narrativo resumido:

> Imagine uma pessoa trancada em uma sala. Ela não sabe chinês. Pela porta, recebe símbolos escritos em chinês. Dentro da sala há um manual extremamente detalhado dizendo quais símbolos devem ser devolvidos para cada combinação recebida. A pessoa segue as regras e produz respostas perfeitas. Para quem está fora, parece que a sala entende chinês. Mas a pessoa dentro dela apenas manipulou símbolos.

Perguntas na tela:

> Produzir a resposta correta significa compreender?

> Seguir regras suficientemente complexas pode se tornar entendimento?

> Onde estaria a compreensão: na pessoa, no manual, na sala ou no sistema completo?

> Existe diferença entre simular entendimento e entender?

Não apresente uma resposta definitiva.

Apresente também, de maneira breve e equilibrada, que existem críticas à Sala Chinesa.

Exemplo:

> Alguns argumentam que a pessoa isoladamente não entende chinês, mas o sistema completo poderia entender.

Não transforme essa parte em um debate filosófico longo.

Ela deve funcionar como contraponto ao início da apresentação.

---

# 6. Retorno à pergunta inicial

Após a Sala Chinesa, mostrar uma tela com pouco conteúdo.

Texto sugerido:

> Depois de tudo o que vimos, eu não espero que a resposta esteja mais fácil.

Depois:

> Espero que a pergunta esteja mais clara.

Mostrar o botão:

> Voltar à pergunta

Ao clicar:

1. bloquear temporariamente interações;
2. iniciar uma rolagem automática suave até o topo;
3. passar rapidamente pelas seções anteriores;
4. mostrar flashes dos capítulos;
5. reduzir as cores e elementos durante a subida;
6. retornar à tela inicial.

A subida não deve demorar demais.

Ela deve transmitir retrospectiva, não repetição integral.

Ao chegar ao topo:

* remover o desfoque da pergunta;
* aumentar ligeiramente o contraste;
* eliminar a névoa;
* deixar a tipografia completamente nítida;
* manter o mesmo texto;
* preservar a composição visual original.

A frase não deve mudar.

A percepção sobre ela é que deve mudar.

Mostrar novamente:

> As máquinas podem pensar?

Depois, permitir uma votação final com as mesmas opções da votação inicial.

Exibir uma comparação visual entre os dois momentos.

Não apresentar a mudança como acerto ou erro.

Texto sugerido:

> Talvez o aprendizado não esteja em escolher uma resposta diferente, mas em perceber tudo o que essa resposta precisa considerar.

---

# 7. Identidade visual

A identidade visual deve evoluir ao longo da história.

## Estado inicial — incerteza

* fundo escuro ou neutro;
* névoa sutil;
* baixo contraste;
* desfoque controlado;
* movimentos lentos;
* bastante espaço negativo.

## Turing — lógica e comunicação

* estética textual;
* máquina de escrever;
* linhas;
* sinais;
* terminais;
* cartões de comunicação;
* tons neutros.

## Perceptron — geometria e promessa

* linhas;
* pontos;
* nós;
* formas geométricas;
* movimento mecânico;
* cores discretamente mais vivas.

## Inverno da IA — estagnação

* azul;
* cinza;
* branco;
* baixa saturação;
* partículas;
* lentidão;
* rigidez;
* silêncio visual.

## Descongelamento — retomada

* pequenos pontos quentes;
* pulsos;
* rachaduras;
* retorno gradual do movimento;
* transição do azul para tons mais vivos.

## Deep Learning — crescimento

* redes maiores;
* profundidade;
* luz percorrendo conexões;
* ritmo mais rápido;
* maior sensação de escala.

## Linguagem e embeddings — espaço semântico

* profundidade;
* palavras flutuantes;
* agrupamentos;
* movimento espacial;
* relações visuais.

## Attention — iluminação

* feixes;
* conexões;
* foco;
* contraste;
* palavras destacadas;
* relações iluminadas.

## Transformers e LLMs — complexidade organizada

* fluxo;
* camadas;
* tokens;
* sequências;
* grandes volumes;
* movimento coordenado;
* energia visual.

## Sala Chinesa — redução e reflexão

* quase ausência de movimento;
* composição minimalista;
* silêncio;
* símbolos;
* ambiente fechado;
* paleta reduzida.

## Final — clareza

* mesma composição inicial;
* nenhuma névoa;
* pergunta perfeitamente legível;
* sensação de estabilidade;
* ausência de uma resposta final explícita.

---

# 8. Sistema de rolagem

A rolagem deverá ser suave e previsível.

Utilize técnicas de scrollytelling.

Algumas seções poderão ocupar várias alturas de viewport enquanto elementos permanecem fixos.

Exemplo:

* texto muda durante a rolagem;
* elementos entram e saem;
* um diagrama permanece no centro;
* cada passo revela uma nova camada.

Não transforme toda a página em um scroll horizontal.

O fluxo principal deve ser vertical.

Permita também navegação por teclado:

* seta para baixo: próxima etapa;
* seta para cima: etapa anterior;
* espaço: avançar;
* Page Down: avançar;
* Page Up: voltar;
* Home: início;
* End: final;
* Esc: fechar modais ou sair de demonstrações;
* tecla `M`: abrir ou fechar mapa da jornada;
* tecla `F`: solicitar tela cheia, quando permitido pelo navegador.

Não force tela cheia automaticamente.

---

# 9. Barra de progresso narrativa

Criar uma barra de progresso discreta.

Ela não deve apresentar apenas percentuais.

Pode apresentar perguntas resumidas:

* Podem pensar?
* Como reconhecer?
* Como aprender?
* Por que falhou?
* Como corrigir?
* Como representar linguagem?
* Para onde olhar?
* Como gerar?
* Isso é compreender?
* Podem pensar?

Em telas menores, usar apenas pontos ou números.

A barra deve indicar:

* capítulo atual;
* progresso geral;
* possibilidade de navegação opcional.

Durante a apresentação, o apresentador deve conseguir ocultá-la.

---

# 10. Modo apresentação

Criar um modo específico para apresentação.

Controles discretos:

* entrar em modo apresentação;
* ocultar interface auxiliar;
* mostrar mapa de capítulos;
* reiniciar a experiência;
* ir para capítulo específico;
* ativar ou desativar animações ambientais;
* ativar ou desativar áudio;
* escolher velocidade das animações;
* restaurar votação;
* limpar dados da sessão.

O modo apresentação não deve abrir uma área administrativa complexa.

Pode ser um painel minimalista acionado por teclado.

---

# 11. Áudio

A experiência deve funcionar perfeitamente sem áudio.

Deixe a arquitetura preparada para áudio opcional.

Possíveis usos:

* ruído de máquina de escrever;
* pulso eletrônico;
* vento sutil no inverno;
* som de descongelamento;
* transição para attention;
* silêncio intencional antes da Sala Chinesa.

Não adicione músicas protegidas por direitos autorais.

Não dependa de áudio remoto.

Inclua um botão claro para ativar e desativar som.

Respeite as políticas de autoplay do navegador.

---

# 12. Conteúdo e textos

Organize os textos em arquivos de conteúdo separados dos componentes.

Exemplo:

```text
src/content/chapters.ts
src/content/timeline.ts
src/content/interactions.ts
src/content/glossary.ts
```

Cada capítulo deve possuir algo semelhante a:

```ts
type Chapter = {
  id: string;
  title: string;
  question: string;
  summary: string;
  speakerNotes?: string[];
  transitionQuestion?: string;
  references?: Reference[];
};
```

Inclua textos iniciais suficientes para a experiência funcionar.

Evite blocos longos na tela.

O texto deve ser distribuído entre:

* títulos;
* frases curtas;
* perguntas;
* destaques;
* legendas;
* notas do apresentador.

Crie um modo de notas do apresentador separado do conteúdo exibido à plateia.

As notas não precisam ser sofisticadas.

Podem ser acessadas por uma tecla e exibidas em um painel lateral.

---

# 13. Precisão histórica

Não invente datas, citações ou atribuições.

Quando o conteúdo histórico não estiver verificado:

* marque como conteúdo que precisa de revisão;
* use comentários;
* coloque a informação em arquivos fáceis de editar;
* evite apresentar frases como citações literais.

Crie uma área de referências no final do projeto, sem interromper a experiência principal.

Inclua placeholders para referências de:

* Alan Turing;
* jogo da imitação;
* McCulloch e Pitts;
* perceptron;
* Frank Rosenblatt;
* Minsky e Papert;
* backpropagation;
* gradient descent;
* redes neurais profundas;
* n-gramas;
* word embeddings;
* Word2Vec;
* artigo “Attention Is All You Need”;
* Transformers;
* GPT e modelos autoregressivos;
* John Searle;
* Sala Chinesa.

Não atribua a invenção do método dos mínimos quadrados de forma simplificada ou imprecisa.

Caso esse conteúdo seja incluído, deixe explícito que a história envolve desenvolvimentos associados a Legendre e Gauss e requer revisão histórica cuidadosa.

---

# 14. Componentes sugeridos

Estruture componentes reutilizáveis.

Exemplo:

```text
src/
  app/
    App.tsx
    routes.ts
  components/
    ChapterSection/
    StoryProgress/
    PresentationControls/
    SpeakerNotes/
    AmbientParticles/
    AnimatedQuestion/
    VotingPanel/
    TransitionQuestion/
    FullscreenButton/
  chapters/
    OpeningQuestion/
    TuringChapter/
    PerceptronChapter/
    AIWinterChapter/
    BackpropagationChapter/
    GradientDescentChapter/
    LanguageChapter/
    EmbeddingsChapter/
    AttentionChapter/
    TransformerChapter/
    LLMChapter/
    SystemsChapter/
    ChineseRoomChapter/
    FinalQuestion/
  visualizations/
    ImitationGame/
    PerceptronPlayground/
    LinearSeparation/
    NeuralNetworkFlow/
    LossLandscape/
    NgramPredictor/
    TokenizerDemo/
    EmbeddingSpace/
    AttentionVisualizer/
    TransformerFlow/
    TemperatureSampler/
    ChineseRoomSimulation/
  content/
    chapters.ts
    glossary.ts
    references.ts
  hooks/
    usePresentationMode.ts
    useChapterProgress.ts
    useReducedMotion.ts
    useKeyboardNavigation.ts
    useSessionVoting.ts
  styles/
    tokens.css
    globals.css
    animations.css
```

Adapte a estrutura quando necessário, mas preserve separação de responsabilidades.

---

# 15. Estado e dados

Utilize estado local.

Para votações e preferências da sessão, use:

* React state;
* sessionStorage;
* localStorage apenas para configurações persistentes, como som e preferência de animação.

Não use Redux sem necessidade.

Crie dados simulados para as demonstrações.

Não faça requisições externas obrigatórias.

---

# 16. Acessibilidade

A experiência deverá ser acessível.

Requisitos:

* contraste suficiente;
* navegação por teclado;
* foco visível;
* descrições para elementos interativos;
* textos alternativos;
* suporte a leitores de tela quando possível;
* controles com rótulos claros;
* não depender apenas de cor;
* não usar flashes intensos;
* respeitar `prefers-reduced-motion`;
* fornecer modo com animações reduzidas;
* permitir pausar animações contínuas;
* evitar desfoque que torne o texto ilegível;
* evitar rolagem que cause desconforto;
* permitir que as demonstrações sejam compreendidas sem áudio.

Quando `prefers-reduced-motion` estiver ativo:

* remover efeitos intensos;
* substituir movimentos longos por transições simples;
* evitar parallax forte;
* manter toda a informação disponível.

---

# 17. Responsividade

A prioridade será desktop e projeção em tela grande.

Também deve funcionar em:

* notebooks;
* tablets;
* celulares.

No desktop:

* usar espaço visual;
* permitir visualizações maiores;
* manter controles discretos.

No celular:

* simplificar animações;
* reduzir densidade;
* adaptar visualizações complexas;
* evitar textos minúsculos;
* oferecer controles por toque;
* não depender de hover.

Crie breakpoints consistentes.

Teste especialmente:

* 1920×1080;
* 1366×768;
* 1280×720;
* 1024×768;
* 390×844.

---

# 18. Performance

A experiência deve permanecer fluida.

Requisitos:

* evitar animações que recalculam layout continuamente;
* priorizar `transform` e `opacity`;
* usar `requestAnimationFrame` quando necessário;
* carregar componentes pesados sob demanda;
* pausar animações fora da viewport;
* limitar quantidade de partículas;
* otimizar SVGs;
* evitar dependências excessivas;
* não usar vídeos pesados como fundo;
* não usar imagens gigantes sem otimização;
* evitar WebGL quando Canvas ou SVG forem suficientes.

Meta:

* boa experiência em notebook intermediário;
* animações próximas de 60 FPS;
* carregamento inicial razoável;
* build sem erros;
* ausência de vazamentos de memória perceptíveis.

---

# 19. Design system

Crie tokens globais para:

* cores;
* tipografia;
* espaçamento;
* raios;
* sombras;
* velocidades;
* curvas de animação;
* níveis de profundidade;
* intensidade ambiental.

Exemplo:

```css
:root {
  --color-bg-primary: ...;
  --color-text-primary: ...;
  --color-cold: ...;
  --color-warm: ...;
  --color-attention: ...;

  --duration-fast: 180ms;
  --duration-medium: 420ms;
  --duration-slow: 900ms;

  --ease-standard: cubic-bezier(...);
  --ease-dramatic: cubic-bezier(...);
}
```

Não use cores aleatórias em cada componente.

A paleta deve evoluir de forma controlada ao longo da narrativa.

---

# 20. Tipografia

Escolha uma combinação de fontes legíveis e expressivas.

Preferências:

* uma fonte principal moderna e humanista;
* uma fonte monoespaçada para código, terminais e partes históricas;
* títulos grandes;
* textos curtos;
* excelente legibilidade em projetor.

Evite usar muitas famílias tipográficas.

Não dependa obrigatoriamente de fontes remotas.

Utilize fontes locais do sistema ou pacotes devidamente incluídos no projeto.

Não inclua arquivos de fonte sem licença apropriada.

---

# 21. Animações e princípios de movimento

Toda animação deve cumprir pelo menos uma função:

1. explicar algo;
2. representar uma mudança histórica;
3. direcionar atenção;
4. criar contraste emocional;
5. reforçar uma transição narrativa.

Evite animações apenas decorativas.

Princípios:

* movimentos lentos em momentos de incerteza;
* movimentos mecânicos no perceptron;
* movimentos congelados no inverno;
* pulsos durante o descongelamento;
* movimentos em fluxo no backpropagation;
* movimento espacial nos embeddings;
* iluminação na attention;
* movimento coordenado e complexo nos Transformers;
* quase ausência de movimento na Sala Chinesa;
* estabilidade e nitidez no final.

---

# 22. Comentários no código

Comente partes importantes, especialmente:

* lógica de ScrollTrigger;
* animações complexas;
* Canvas;
* simulações matemáticas;
* teclado;
* modo apresentação;
* retorno automático ao topo;
* acessibilidade;
* tratamento de `prefers-reduced-motion`.

Não escreva comentários óbvios em todas as linhas.

Explique decisões arquiteturais e narrativas relevantes.

---

# 23. Documentação

Crie um `README.md` completo.

Ele deve incluir:

* visão geral do projeto;
* objetivo narrativo;
* stack;
* instalação;
* execução;
* build;
* estrutura de pastas;
* como editar conteúdos;
* como adicionar capítulos;
* como editar notas do apresentador;
* como alterar a paleta;
* como trocar textos;
* como controlar animações;
* atalhos de teclado;
* limitações atuais;
* próximos passos;
* pontos históricos que precisam de revisão.

Crie também:

```text
docs/NARRATIVE.md
docs/DESIGN_SYSTEM.md
docs/CONTENT_REVIEW.md
docs/INTERACTIONS.md
```

`NARRATIVE.md`:

* explica o arco narrativo;
* descreve a função de cada capítulo;
* documenta as perguntas de transição.

`DESIGN_SYSTEM.md`:

* paletas;
* tipografia;
* estados visuais;
* movimento;
* responsividade.

`CONTENT_REVIEW.md`:

* fatos históricos;
* pontos que precisam de fonte;
* citações;
* observações de precisão.

`INTERACTIONS.md`:

* descrição de cada demonstração;
* funcionamento;
* objetivo pedagógico;
* limitações da simulação.

---

# 24. Qualidade do código

Requisitos:

* TypeScript com tipos bem definidos;
* componentes pequenos e reutilizáveis;
* ausência de `any` desnecessário;
* tratamento de erros;
* sem warnings importantes;
* sem código morto;
* sem arquivos enormes sem necessidade;
* sem repetição excessiva;
* nomes claros;
* constantes em arquivos adequados;
* dados separados da apresentação;
* hooks reutilizáveis;
* animações devidamente limpas ao desmontar componentes.

Configure:

* ESLint;
* Prettier;
* scripts de lint;
* script de typecheck.

Scripts sugeridos:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "preview": "vite preview"
}
```

---

# 25. Testes

Crie testes para partes importantes.

Utilize Vitest e React Testing Library.

Testar pelo menos:

* votação inicial;
* votação final;
* comparação de resultados;
* navegação por teclado;
* mudança de capítulo;
* modo de animação reduzida;
* persistência da sessão;
* controle de temperatura da demonstração;
* reinicialização da experiência;
* botão de retorno à pergunta;
* componentes de conteúdo essenciais.

Não é necessário testar cada detalhe visual.

---

# 26. Etapas de implementação

Implemente o projeto em fases.

## Fase 1 — Fundação

* configurar projeto;
* criar design system;
* criar estrutura de conteúdo;
* criar navegação;
* criar barra de progresso;
* criar modo apresentação;
* criar acessibilidade básica.

## Fase 2 — Arco narrativo

* implementar abertura;
* implementar capítulos como seções;
* criar transições;
* criar inverno da IA;
* criar descongelamento;
* criar final;
* criar retorno ao topo.

## Fase 3 — Interações essenciais

Prioridade:

1. votação inicial e final;
2. perceptron;
3. separação linear e XOR;
4. backpropagation;
5. gradient descent;
6. tokenização;
7. embeddings;
8. attention;
9. Transformer;
10. temperatura;
11. Sala Chinesa.

## Fase 4 — Polimento

* responsividade;
* performance;
* reduced motion;
* teclado;
* notas do apresentador;
* documentação;
* testes;
* revisão visual.

---

# 27. Priorização

Caso não seja possível implementar tudo com o mesmo nível de profundidade, priorize:

1. arco narrativo completo;
2. abertura e fechamento;
3. inverno da IA;
4. retorno ao topo;
5. votação inicial e final;
6. perceptron;
7. backpropagation;
8. embeddings;
9. attention;
10. Transformer;
11. Sala Chinesa;
12. demais refinamentos.

É melhor ter uma experiência completa e coerente com algumas simulações simplificadas do que várias simulações complexas sem uma narrativa funcional.

---

# 28. Critérios de aceitação

O projeto será considerado funcional quando:

* abrir com a pergunta “As máquinas podem pensar?”;
* a pergunta inicial estiver levemente borrada;
* existir uma votação inicial;
* a história puder ser percorrida por rolagem;
* os capítulos seguirem uma ordem cronológica e causal;
* cada capítulo conduzir ao próximo por meio de uma pergunta;
* existir uma transformação visual para o inverno da IA;
* existir um descongelamento gradual;
* existir pelo menos uma demonstração do perceptron;
* existir uma demonstração de erro e backpropagation;
* existir uma demonstração de gradient descent;
* existir uma demonstração de embeddings;
* existir uma demonstração de attention;
* existir uma explicação visual do Transformer;
* existir uma demonstração simplificada de geração;
* existir uma apresentação da Sala Chinesa;
* existir o botão “Voltar à pergunta”;
* o botão fizer a página voltar automaticamente ao início;
* a pergunta final aparecer nítida;
* existir uma votação final;
* existir uma comparação entre as votações;
* funcionar com teclado;
* respeitar reduced motion;
* funcionar em desktop;
* gerar build sem erros;
* possuir documentação.

---

# 29. Resultado esperado

Quero que o resultado pareça:

* uma palestra;
* um documentário interativo;
* uma aula visual;
* uma investigação filosófica;
* uma linha do tempo viva;
* uma experiência feita com intenção.

Não quero que pareça:

* uma landing page;
* um dashboard;
* um portfólio;
* um template genérico;
* uma apresentação corporativa;
* uma coleção de cards;
* um site excessivamente gamificado;
* uma demonstração técnica sem narrativa.

A experiência deve ensinar conceitos técnicos sem perder a história.

Ela deve emocionar sem sacrificar clareza.

Ela deve impressionar pelo significado das interações, não pela quantidade de efeitos.

---

# 30. Instruções de execução para você

Antes de escrever código:

1. examine todos os arquivos existentes;
2. explique brevemente a arquitetura que será utilizada;
3. identifique riscos técnicos;
4. crie um plano de implementação;
5. preserve arquivos existentes que não precisem ser alterados.

Depois:

1. implemente a fundação;
2. execute o projeto;
3. corrija erros;
4. execute lint e typecheck;
5. execute os testes;
6. gere o build;
7. verifique a experiência em diferentes tamanhos de tela;
8. atualize a documentação.

Não encerre o trabalho apenas criando arquivos iniciais ou placeholders vazios.

Entregue uma primeira versão completa e navegável.

Quando uma interação avançada ainda não puder ser finalizada, implemente uma versão simplificada, funcional e claramente documentada.

Ao final, apresente:

* resumo das decisões;
* arquivos criados;
* principais componentes;
* interações implementadas;
* comandos para executar;
* pendências;
* sugestões de próximos incrementos.

O elemento mais importante de toda a experiência é o fechamento do arco:

No início, a pergunta é nebulosa.

No final, a pergunta é nítida.

A resposta continua sendo responsabilidade da plateia.
