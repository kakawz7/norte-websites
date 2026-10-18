# Norte Studio — sistema visual

Versão de outubro de 2026. Fonte da verdade: as variáveis em `:root` de `assets/css/norte.css`.

## Por que este visual

- **Tom:** preciso, calmo, confiável.
- **Abordagem:** tipográfica. Quase-preto sobre papel quente, hierarquia por tamanho e peso, linhas finas no lugar de caixas e sombras.
- **Posicionamento:** estúdio independente que vende clareza; o site precisa parecer bem resolvido, não chamativo.
- **Referência de origem:** a linguagem do sistema Geist (Vercel), adaptada com fundo mais quente e sem gradientes.

## Cores (papel → valor)

| Papel | Token | Valor |
| --- | --- | --- |
| Fundo | `--bg` | #f7f6f3 |
| Superfície (formulário) | `--surface` | #ffffff |
| Texto principal, botões | `--ink` | #171717 |
| Texto corrido | `--body` | #45443f |
| Texto secundário | `--muted` | #6b6a64 |
| Linhas | `--line` / `--line-strong` | #e4e2dc / #cfccc4 |
| Destaque (só na marca) | `--accent` | #e4572e |
| Erro | `--error` | #b42318 |

O laranja aparece **só** no símbolo da marca. Botões e links são pretos.

## Tipografia

- Uma família: **Geist** (variável, auto-hospedada em `assets/fonts/`). Licença OFL.
- Títulos peso 500, espaçamento negativo (−0,035 a −0,045em), entrelinha 1,02–1,1.
- Corpo 16px, entrelinha 1,6, linhas de até ~65 caracteres.
- Rótulos de seção em texto pequeno e cinza, sem caixa-alta.
- **Instrument Serif** é usada apenas no modelo Forma Arquitetura.

## Layout

- Container de 1200px com margem lateral fluida (`--gutter`).
- Seções abrem com uma linha fina e uma grade 1/3 + 2/3: rótulo à esquerda, conteúdo à direita.
- Espaço entre seções: `--section` (80–136px). Dentro de um grupo, sempre menos espaço do que entre grupos.
- Um botão principal por tela.

## Componentes

- **Botão:** pílula preta (`.btn`), variante contorno (`.btn--ghost`), pequena (`.btn--sm`).
- **Link de ação:** `.link`, com seta que anda 3px no hover.
- **Listas:** itens separados por linha fina (processo, perguntas, estrutura dos modelos).
- **Perguntas:** `<details>` nativo, sem JavaScript.
- **Formulário:** campos de 48px, borda de 1px, foco com borda preta e halo sutil.

## Faça

- Use apenas `var(--...)` nos componentes.
- Mantenha o destaque raro.
- Escreva textos concretos (o que, como, quando) antes de mexer no layout.
- Teste em 390px e 1440px.

## Não faça

- Gradientes, vidro fosco, sombras fortes, emoji como ícone.
- Ícone em círculo colorido + título + texto repetido em toda seção.
- Depoimentos, números ou logos de clientes inventados.
- Animações de entrada em tudo; o movimento fica em hover e foco.

## Miniaturas dos modelos

`assets/images/modelo-*.webp` são capturas (1280×960, reduzidas para 1200×900) do topo de cada página em `/modelos/`. Se um modelo mudar, gere a captura de novo.
