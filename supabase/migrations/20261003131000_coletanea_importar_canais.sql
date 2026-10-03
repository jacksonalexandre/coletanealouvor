-- Importação ganha o alvo "canais" (coleções do tipo canal, ex: Menos Um).
create or replace function public.coletanea_importar(p_alvo text default 'tudo', p_versoes text[] default null)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token text;
begin
  if p_alvo not in ('hinario', 'biblia', 'videos', 'canais', 'tudo') then
    raise exception 'alvo inválido: % (use hinario, biblia, videos, canais ou tudo)', p_alvo;
  end if;
  select token into v_token from public.coletanea_importar_tokens order by criado_em desc limit 1;
  return net.http_post(
    url := 'https://foeileysntdheuklakqs.supabase.co/functions/v1/coletanea-importar',
    body := jsonb_build_object('alvo', p_alvo, 'versoes', to_jsonb(p_versoes)),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-importar-token', v_token),
    timeout_milliseconds := 300000
  );
end;
$$;
revoke all on function public.coletanea_importar(text, text[]) from public, anon, authenticated;
