-- Executar somente depois de revisar as políticas existentes e criar o usuário
-- em Authentication > Users. Substitua SEU_EMAIL_AQUI pelo e-mail desse usuário.
-- O login do dashboard do Supabase não é o usuário de Authentication do projeto.
-- Este arquivo não foi aplicado ao projeto remoto.
begin;

create schema if not exists norte_private;
revoke all on schema norte_private from public, anon, authenticated;
create table if not exists norte_private.painel_proprietario (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users(id)
);
revoke all on table norte_private.painel_proprietario from public, anon, authenticated;

do $$
declare
  email_proprietario text := 'SEU_EMAIL_AQUI';
  proprietario uuid;
begin
  if email_proprietario = 'SEU_EMAIL_AQUI' then
    raise exception 'Preencha o e-mail do proprietário antes de executar.';
  end if;
  select id into strict proprietario from auth.users
    where lower(email) = lower(email_proprietario)
      and email_confirmed_at is not null;
  insert into norte_private.painel_proprietario(singleton,user_id)
    values (true,proprietario)
    on conflict (singleton) do update set user_id = excluded.user_id;
end $$;

-- O RPC abaixo é o único caminho de leitura usado pelo painel.
-- A política restritiva impede leitura direta por visitantes e outros usuários,
-- mesmo se já houver uma política SELECT permissiva. Não altera políticas INSERT.
-- Revisar possíveis consumidores existentes de SELECT antes de aplicar.
alter table public.orcamentos enable row level security;
drop policy if exists norte_painel_bloquear_leitura_direta on public.orcamentos;
create policy norte_painel_bloquear_leitura_direta on public.orcamentos
  as restrictive for select to anon, authenticated using (false);

create or replace function public.norte_painel_orcamentos(busca text default '', pagina integer default 0)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  termo text := left(coalesce(busca,''),200);
  resultado jsonb;
begin
  if auth.uid() is null or not exists (
    select 1 from norte_private.painel_proprietario where user_id = auth.uid()
  ) then
    raise exception 'Acesso restrito ao proprietário' using errcode = '42501';
  end if;
  if pagina is null or pagina < 0 or pagina > 1000000 then
    raise exception 'Página inválida' using errcode = '22023';
  end if;
  with encontrados as materialized (
    select jsonb_build_object(
      'nome',o.nome,'whatsapp',o.whatsapp,'email ou instagram',o."email ou instagram",
      'tipo_site',o.tipo_site,'estilo',o.estilo,'orcamento',o.orcamento,
      'prazo',o.prazo,'descricao',o.descricao
    ) as pedido,
    to_jsonb(o)->>'created_at' as criado,
    to_jsonb(o)->>'id' as identificador,
    o.ctid as desempate
    from public.orcamentos o
    where termo = '' or strpos(lower(concat_ws(' ',o.nome,o.whatsapp,o."email ou instagram",
      o.tipo_site,o.estilo,o.orcamento,o.prazo,o.descricao)),lower(termo)) > 0
  ), recorte as (
    select * from encontrados order by criado desc nulls last, identificador desc nulls last, desempate
    limit 30 offset (pagina::bigint * 30)
  )
  select jsonb_build_object(
    'total',(select count(*) from encontrados),
    'pedidos',coalesce((select jsonb_agg(pedido order by criado desc nulls last,
      identificador desc nulls last, desempate) from recorte),'[]'::jsonb)
  ) into resultado;
  return resultado;
end $$;

revoke all on function public.norte_painel_orcamentos(text,integer) from public, anon, authenticated;
grant execute on function public.norte_painel_orcamentos(text,integer) to authenticated;
commit;
