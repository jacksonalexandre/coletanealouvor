-- Canais: só entram vídeos cujo título bate com o filtro (o Menos Um também tem
-- flash mob, coletâneas "Top 10"…); o que vem depois do título vira "detalhe"
-- (CD Jovem, Playback…), que distingue as versões repetidas.
alter table public.coletanea_colecoes add column filtro_titulo text;
update public.coletanea_colecoes set filtro_titulo = 'menos um' where id = 'menos-um';

alter table public.coletanea_hinos add column detalhe text;

-- Vídeos importados antes do filtro (ainda não usados em nenhuma programação).
delete from public.coletanea_hinos where colecao = 'menos-um' and titulo !~* 'menos um';

create or replace function public.coletanea_hinario()
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'generatedAt', (select atualizado_em from public.coletanea_revisoes where chave = 'hinario'),
    'language', 'pt',
    'collections', (
      select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'sigla', c.sigla, 'name', c.nome) order by c.ordem), '[]'::jsonb)
      from public.coletanea_colecoes c
    ),
    'hymns', coalesce(
      (
        select jsonb_agg(
          jsonb_strip_nulls(jsonb_build_object(
            'id', h.id, 'number', h.numero, 'title', h.titulo, 'search', h.busca,
            'collection', h.colecao, 'detail', h.detalhe
          )) || jsonb_build_object('number', h.numero)
          order by h.numero nulls last, h.titulo
        )
        from public.coletanea_hinos h
      ),
      '[]'::jsonb
    )
  );
$$;
