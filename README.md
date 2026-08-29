# As maquinas podem pensar?

Apresentacao web narrativa, imersiva e controlada por rolagem sobre a historia da Inteligencia Artificial, redes neurais, Transformers e LLMs.

O arco principal comeca e termina na pergunta:

> As maquinas podem pensar?

A primeira versao prioriza uma experiencia completa e navegavel, com simulacoes locais simplificadas e conteudo editavel.

## Stack

- Vite
- React
- TypeScript
- Framer Motion
- GSAP com ScrollTrigger
- SVG/HTML para visualizacoes interativas
- Vitest e React Testing Library
- ESLint e Prettier

## Como executar

```bash
npm install
npm run dev
```

Build de producao:

```bash
npm run build
```

Validacoes:

```bash
npm run lint
npm run typecheck
npm run test
```

## Estrutura

- `src/app`: composicao principal da experiencia.
- `src/content`: capitulos, glossario e especificacoes das interacoes.
- `src/components`: moldura narrativa, progresso, controles e notas.
- `src/hooks`: progresso, teclado, modo apresentacao e movimento reduzido.
- `src/state`: regras puras de estado.
- `src/visualizations`: demonstracoes locais.
- `src/styles`: tokens, animacoes e CSS de componentes.
- `docs`: documentacao narrativa, visual e pedagogica.

## Editar conteudo

Altere `src/content/chapters.ts` para mudar titulos, perguntas, resumo, frases de apoio e notas do apresentador.

Para adicionar um capitulo:

1. Inclua um item em `chapters`.
2. Crie ou reaproveite uma visualizacao em `src/visualizations`.
3. Conecte o `id` no `renderStage` de `src/app/App.tsx`.

## Notas do apresentador

As notas ficam em `speakerNotes` dentro de cada capitulo. Pressione `N` durante a apresentacao para abrir ou fechar o painel.

## Paleta e movimento

Tokens globais ficam em `src/styles/tokens.css`. Estados visuais por periodo ficam em `src/styles/globals.css` e `src/styles/components.css`.

## Atalhos

- `ArrowDown`, `PageDown`, `Espaco`: proxima etapa.
- `ArrowUp`, `PageUp`: etapa anterior.
- `Home`: inicio.
- `End`: final.
- `Esc`: fecha paineis.
- `M`: mostra ou oculta mapa.
- `N`: mostra ou oculta notas.
- `F`: solicita tela cheia.

## Limitacoes atuais

- As simulacoes sao didaticas e locais, nao modelos reais.
- Audio esta preparado como preferencia de interface, mas ainda sem trilhas locais.
- A verificacao visual em navegadores deve ser repetida apos refinamentos de design.

## Proximos passos

- Refinar transicoes com mais ScrollTrigger por capitulo.
- Adicionar sons locais opcionais com controle de autoplay.
- Criar variacoes visuais mais ricas para telas 1920x1080.
- Evoluir as simulacoes de backpropagation e Transformer com mais granularidade.
