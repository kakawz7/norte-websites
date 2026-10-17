# Norte Studio

Site estático em https://nortestudio.website. Redesenhado em 17/10/2026 com visual claro e minimalista; o sistema visual está em `documentacao/DESIGN.md`.

## Publicação

A raiz do repositório e `public/` contêm as mesmas páginas comerciais. Preserve CNAME e .nojekyll. A hospedagem deve servir 404.html para caminhos inexistentes. Não é necessário instalar dependências.

## Páginas

- `/`: apresentação, modelos, abordagem, processo e perguntas frequentes.
- `/portfolio/`: os três modelos demonstrativos, identificados como fictícios.
- `/modelos/arquitetura/`, `/modelos/servicos/`, `/modelos/landing-page/`: demonstrações navegáveis, cada uma com identidade própria.
- `/reuniao/`: solicitação de reunião, sem reserva automática de horário.
- `/privacidade/` e `/termos/`: transparência sobre o funcionamento (texto inalterado).
- `/404.html`: recuperação de navegação.

Os endereços antigos de orçamento direcionam a `/reuniao/`. Não há tabela de preços no site comercial.

## Arquivos

- `assets/css/norte.css`: estilos do site. Cores, fontes e espaços ficam nas variáveis do topo.
- `assets/css/modelos.css`: estilos das três demonstrações.
- `assets/js/norte.js`: menu do celular.
- `assets/js/reuniao.js`: envio do formulário (inalterado).

## Contatos

O formulário usa a tabela existente public.orcamentos no Supabase. Preserva seus oito campos e a integração de notificação existente. O tipo de pedido e a disponibilidade estão na descrição. Nunca coloque credenciais privadas no JavaScript.

## Ativos

- Fontes Geist e Instrument Serif auto-hospedadas, licença OFL em `assets/fonts/`.
- `forma-interior.webp` é uma imagem conceitual gerada por IA para o modelo fictício Forma Arquitetura.
- `modelo-*.webp` são capturas das próprias páginas de demonstração.
- `og-norte.png` é a imagem de compartilhamento (1200×630).

## Verificação

Links e recursos locais conferidos; páginas revisadas em 1440px e 390px sem rolagem horizontal; menu do celular e formulário testados no navegador com o envio simulado (nenhum dado foi enviado ao Supabase). O painel administrativo legado (`/painel/`) não foi alterado e não faz parte do caminho comercial.
