# Painel particular Norte Studio

Página preparada em `/painel/`, usando o projeto Supabase já configurado nos formulários. Permite consultar os pedidos, buscar em todos os campos, paginar e abrir os detalhes. Não altera os formulários existentes. As credenciais ficam somente na memória desta página; recarregar ou fechar exige entrar novamente.

## Ativação pendente

1. No projeto Supabase, crie ou identifique seu usuário em **Authentication > Users**, com e-mail confirmado e senha. Sua conta do dashboard Supabase é diferente desse usuário. Não coloque senha ou chave `service_role` no repositório.
2. Revise as políticas, permissões e eventuais views da tabela `public.orcamentos`. O arquivo `supabase/painel.sql` ativa RLS e bloqueia SELECT direto de `anon` e `authenticated`, preservando as políticas INSERT existentes. Se houver outra aplicação que lê diretamente essa tabela, adapte-a antes. Se RLS estava desativado, confirme a existência de política INSERT para o formulário público antes de ativar.
3. Substitua `SEU_EMAIL_AQUI` no SQL pelo e-mail confirmado do passo 1. Execute no SQL Editor como proprietário do banco. A transação falha sem alterar nada se o usuário não existir ou o e-mail não estiver confirmado. O procedimento não foi executado remotamente.
4. Antes da publicação, verifique no projeto: visitante não consegue ler a tabela nem executar o RPC; outro usuário autenticado não consegue consultar pedidos; somente o proprietário consegue executar o RPC. Verifique também eventuais views e outros RPCs que possam expor os mesmos dados. Teste ambos os formulários com dados fictícios e confirme o recebimento no painel.
5. Publique os três arquivos de `painel/` com o site, no processo já usado pelo repositório. A página ficará em `https://nortestudio.website/painel/`. Não é necessário acrescentar um link no site público.

O arquivo SQL concede consulta somente ao usuário indicado, por meio de uma função que verifica a identidade no servidor. Esconder a URL ou a tela não substitui essa configuração. A publicação e a proteção do banco ainda precisam ser verificadas no ambiente real.

## Validação

Os testes locais usam respostas fictícias e não acessam registros reais. A configuração SQL e o login com a conta real precisam de validação no Supabase antes de considerar o painel pronto para uso.

Referência: https://supabase.com/docs/guides/database/postgres/row-level-security
