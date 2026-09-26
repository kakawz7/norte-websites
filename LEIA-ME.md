# Norte Studio

Site estático em https://nortestudio.website, reformulado em 26/09/2026 para apresentação de modelos e solicitação de reuniões.

## Publicação

A raiz do repositório e public/ contêm as mesmas páginas comerciais. Preserve CNAME e .nojekyll. A hospedagem deve servir 404.html para caminhos inexistentes. Não é necessário instalar dependências.

## Páginas

- /: apresentação, modelos, processo e perguntas frequentes.
- /portfolio/: três modelos demonstrativos identificados como fictícios.
- /modelos/arquitetura/, /modelos/servicos/, /modelos/landing-page/: demonstrações navegáveis.
- /reuniao/: solicitação de reunião, sem reserva automática de horário.
- /privacidade/ e /termos/: transparência sobre o funcionamento.
- /404.html: recuperação de navegação.

Os endereços antigos de orçamento direcionam a /reuniao/. Não há tabela de preços no site comercial.

## Contatos

O formulário usa a tabela existente public.orcamentos no Supabase. Preserva seus oito campos e a integração de notificação existente. O tipo de pedido e a disponibilidade estão na descrição. Nunca coloque credenciais privadas no JavaScript.

## Ativos

Fontes Manrope locais, licença em assets/fonts/OFL.txt. Bússola existente preservada. forma-interior.webp é uma imagem conceitual gerada por IA para o modelo fictício Forma Arquitetura. Prompt: interior contemporâneo brasileiro com materiais naturais, sofá de linho, mesa de travertino, jardim e luz quente; sem pessoas, texto ou marcas. Gerada com a ferramenta integrada de imagens.

## Verificação

Links e recursos locais verificados; responsividade e formulário testados no navegador com servidor de teste isolado. A inserção real no banco foi verificada em transação revertida, sem persistência nem disparo de notificação. Visitantes não podem ler os contatos.

A função de notificação recebeu search_path fixo em migração de segurança. O painel administrativo legado depende de configuração própria de acesso e não faz parte do caminho comercial.
