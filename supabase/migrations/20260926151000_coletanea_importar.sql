-- Importação do acervo pela Edge Function coletanea-importar, disparada pelo
-- próprio banco (pg_net). O token nunca sai do banco: a tabela não tem política
-- de leitura e a função coletanea_importar não é exposta à chave pública.
--
-- Uso (SQL Editor do Supabase):
--   select public.coletanea_importar('tudo');
--   select public.coletanea_importar('videos');
--   select public.coletanea_importar('biblia', array['ara']);
--   select * from public.coletanea_importacoes order by id desc limit 5;

create extension if not exists pg_net with schema extensions;

create table public.coletanea_importar_tokens (
  token text primary key default gen_random_uuid()::text,
  criado_em timestamptz not null default now()
);
alter table public.coletanea_importar_tokens enable row level security;
revoke all on public.coletanea_importar_tokens from anon, authenticated;
insert into public.coletanea_importar_tokens default values;

create table public.coletanea_importacoes (
  id bigint generated always as identity primary key,
  alvo text not null,
  iniciado_em timestamptz not null default now(),
  terminado_em timestamptz,
  ok boolean,
  erro text,
  log jsonb
);
alter table public.coletanea_importacoes enable row level security;
revoke all on public.coletanea_importacoes from anon, authenticated;

create function public.coletanea_importar(p_alvo text default 'tudo', p_versoes text[] default null)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token text;
begin
  if p_alvo not in ('hinario', 'biblia', 'videos', 'tudo') then
    raise exception 'alvo inválido: % (use hinario, biblia, videos ou tudo)', p_alvo;
  end if;
  select token into v_token from public.coletanea_importar_tokens order by criado_em desc limit 1;
  -- Assíncrono: devolve o id do pedido no pg_net; o resultado aparece em
  -- coletanea_importacoes quando a função terminar.
  return net.http_post(
    url := 'https://foeileysntdheuklakqs.supabase.co/functions/v1/coletanea-importar',
    body := jsonb_build_object('alvo', p_alvo, 'versoes', to_jsonb(p_versoes)),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-importar-token', v_token),
    timeout_milliseconds := 300000
  );
end;
$$;
revoke all on function public.coletanea_importar(text, text[]) from public, anon, authenticated;
