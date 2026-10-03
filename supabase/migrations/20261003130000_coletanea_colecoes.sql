-- Coleções de hinos: o Hinário Adventista (HASD) e canais do YouTube (ex: Menos Um).
-- O mesmo hino pode aparecer em mais de uma coleção, cada um com seu vídeo.

create table public.coletanea_colecoes (
  id text primary key,
  sigla text not null,
  nome text not null,
  ordem integer not null,
  -- hinario: itens vêm do LouvorJá e os vídeos das playlists; canal: cada vídeo do canal é um item.
  tipo text not null check (tipo in ('hinario', 'canal')),
  fonte_url text
);
alter table public.coletanea_colecoes enable row level security;
create policy "leitura pública" on public.coletanea_colecoes for select to anon, authenticated using (true);
grant select on public.coletanea_colecoes to anon, authenticated;

insert into public.coletanea_colecoes (id, sigla, nome, ordem, tipo, fonte_url) values
  ('hasd', 'HASD', 'Hinário Adventista do Sétimo Dia', 1, 'hinario', null),
  ('menos-um', 'Menos Um', 'Menos Um (canal do YouTube)', 2, 'canal', 'https://www.youtube.com/@menosum7/videos');

-- Cada hino pertence a uma coleção; "chave" é o id na origem (HASD: id do LouvorJá;
-- canal: id do vídeo), para a reimportação manter o mesmo id do app.
alter table public.coletanea_hinos
  add column colecao text not null default 'hasd' references public.coletanea_colecoes (id),
  add column chave text;
update public.coletanea_hinos set chave = id::text where chave is null;
alter table public.coletanea_hinos alter column chave set not null;
alter table public.coletanea_hinos add constraint coletanea_hinos_colecao_chave_key unique (colecao, chave);
-- Vídeo de canal nem sempre traz número.
alter table public.coletanea_hinos alter column numero drop not null;
create index coletanea_hinos_colecao_idx on public.coletanea_hinos (colecao);

-- Ids dos hinos do HASD são os do LouvorJá (até alguns milhares); os de canal
-- começam em 1.000.000 para nunca colidir.
create sequence public.coletanea_hinos_extra_id_seq start 1000000 owned by public.coletanea_hinos.id;
alter table public.coletanea_hinos alter column id set default nextval('public.coletanea_hinos_extra_id_seq');

alter table public.coletanea_playlists
  add column colecao text not null default 'hasd' references public.coletanea_colecoes (id);

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
          jsonb_build_object(
            'id', h.id, 'number', h.numero, 'title', h.titulo, 'search', h.busca, 'collection', h.colecao
          )
          order by h.numero nulls last, h.titulo
        )
        from public.coletanea_hinos h
      ),
      '[]'::jsonb
    )
  );
$$;
