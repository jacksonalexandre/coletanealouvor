-- Coletânea de Louvor: acervo (hinário, vídeos, Bíblia) no Supabase.
-- Tudo com prefixo coletanea_ para conviver com as tabelas de outros sistemas
-- no mesmo banco. Leitura pública (chave anon) via RLS; escrita só pela Edge
-- Function coletanea-importar (service role).

create table public.coletanea_hinos (
  id integer primary key,
  numero integer not null,
  titulo text not null,
  -- Título sem acento e em minúsculas, para a busca.
  busca text not null
);
create index coletanea_hinos_numero_idx on public.coletanea_hinos (numero);

create table public.coletanea_videos (
  hino_id integer primary key references public.coletanea_hinos (id) on delete cascade,
  video_id text not null check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  atualizado_em timestamptz not null default now()
);

-- Playlists do YouTube lidas pela importação de vídeos (antes scripts/playlists.json).
create table public.coletanea_playlists (
  id bigint generated always as identity primary key,
  url text not null unique,
  faixa text,
  ordem integer not null default 0
);

create table public.coletanea_biblia_versoes (
  id text primary key,
  sigla text not null,
  nome text not null,
  ordem integer not null
);

-- Ordem canônica dos 66 livros e o número de capítulos esperado de cada um.
create table public.coletanea_biblia_livros (
  abrev text primary key,
  nome text not null,
  busca text not null,
  testamento text not null check (testamento in ('at', 'nt')),
  ordem integer not null unique,
  capitulos integer not null check (capitulos > 0)
);

create table public.coletanea_versiculos (
  versao text not null references public.coletanea_biblia_versoes (id) on delete cascade,
  livro text not null references public.coletanea_biblia_livros (abrev),
  capitulo integer not null check (capitulo > 0),
  versiculo integer not null check (versiculo > 0),
  texto text not null,
  primary key (versao, livro, capitulo, versiculo)
);

-- Quando cada parte do acervo mudou; o app compara com o cache e só baixa o que mudou.
create table public.coletanea_revisoes (
  chave text primary key,
  atualizado_em timestamptz not null default now()
);

alter table public.coletanea_hinos enable row level security;
alter table public.coletanea_videos enable row level security;
alter table public.coletanea_playlists enable row level security;
alter table public.coletanea_biblia_versoes enable row level security;
alter table public.coletanea_biblia_livros enable row level security;
alter table public.coletanea_versiculos enable row level security;
alter table public.coletanea_revisoes enable row level security;

create policy "leitura pública" on public.coletanea_hinos for select to anon, authenticated using (true);
create policy "leitura pública" on public.coletanea_videos for select to anon, authenticated using (true);
create policy "leitura pública" on public.coletanea_playlists for select to anon, authenticated using (true);
create policy "leitura pública" on public.coletanea_biblia_versoes for select to anon, authenticated using (true);
create policy "leitura pública" on public.coletanea_biblia_livros for select to anon, authenticated using (true);
create policy "leitura pública" on public.coletanea_versiculos for select to anon, authenticated using (true);
create policy "leitura pública" on public.coletanea_revisoes for select to anon, authenticated using (true);

insert into public.coletanea_biblia_versoes (id, sigla, nome, ordem) values
  ('ara', 'ARA', 'Almeida Revista e Atualizada', 1),
  ('arc', 'ARC', 'Almeida Revista e Corrigida', 2),
  ('ntlh', 'NTLH', 'Nova Tradução na Linguagem de Hoje', 3),
  ('nvi', 'NVI', 'Nova Versão Internacional', 4);

insert into public.coletanea_biblia_livros (abrev, nome, busca, testamento, ordem, capitulos) values
  ('gn', 'Gênesis', 'genesis', 'at', 1, 50),
  ('ex', 'Êxodo', 'exodo', 'at', 2, 40),
  ('lv', 'Levítico', 'levitico', 'at', 3, 27),
  ('nm', 'Números', 'numeros', 'at', 4, 36),
  ('dt', 'Deuteronômio', 'deuteronomio', 'at', 5, 34),
  ('js', 'Josué', 'josue', 'at', 6, 24),
  ('jz', 'Juízes', 'juizes', 'at', 7, 21),
  ('rt', 'Rute', 'rute', 'at', 8, 4),
  ('1sm', '1 Samuel', '1 samuel', 'at', 9, 31),
  ('2sm', '2 Samuel', '2 samuel', 'at', 10, 24),
  ('1rs', '1 Reis', '1 reis', 'at', 11, 22),
  ('2rs', '2 Reis', '2 reis', 'at', 12, 25),
  ('1cr', '1 Crônicas', '1 cronicas', 'at', 13, 29),
  ('2cr', '2 Crônicas', '2 cronicas', 'at', 14, 36),
  ('ed', 'Esdras', 'esdras', 'at', 15, 10),
  ('ne', 'Neemias', 'neemias', 'at', 16, 13),
  ('et', 'Ester', 'ester', 'at', 17, 10),
  ('jó', 'Jó', 'jo', 'at', 18, 42),
  ('sl', 'Salmos', 'salmos', 'at', 19, 150),
  ('pv', 'Provérbios', 'proverbios', 'at', 20, 31),
  ('ec', 'Eclesiastes', 'eclesiastes', 'at', 21, 12),
  ('ct', 'Cantares', 'cantares', 'at', 22, 8),
  ('is', 'Isaías', 'isaias', 'at', 23, 66),
  ('jr', 'Jeremias', 'jeremias', 'at', 24, 52),
  ('lm', 'Lamentações', 'lamentacoes', 'at', 25, 5),
  ('ez', 'Ezequiel', 'ezequiel', 'at', 26, 48),
  ('dn', 'Daniel', 'daniel', 'at', 27, 12),
  ('os', 'Oséias', 'oseias', 'at', 28, 14),
  ('jl', 'Joel', 'joel', 'at', 29, 3),
  ('am', 'Amós', 'amos', 'at', 30, 9),
  ('ob', 'Obadias', 'obadias', 'at', 31, 1),
  ('jn', 'Jonas', 'jonas', 'at', 32, 4),
  ('mq', 'Miquéias', 'miqueias', 'at', 33, 7),
  ('na', 'Naum', 'naum', 'at', 34, 3),
  ('hc', 'Habacuque', 'habacuque', 'at', 35, 3),
  ('sf', 'Sofonias', 'sofonias', 'at', 36, 3),
  ('ag', 'Ageu', 'ageu', 'at', 37, 2),
  ('zc', 'Zacarias', 'zacarias', 'at', 38, 14),
  ('ml', 'Malaquias', 'malaquias', 'at', 39, 4),
  ('mt', 'Mateus', 'mateus', 'nt', 40, 28),
  ('mc', 'Marcos', 'marcos', 'nt', 41, 16),
  ('lc', 'Lucas', 'lucas', 'nt', 42, 24),
  ('jo', 'João', 'joao', 'nt', 43, 21),
  ('atos', 'Atos', 'atos', 'nt', 44, 28),
  ('rm', 'Romanos', 'romanos', 'nt', 45, 16),
  ('1co', '1 Coríntios', '1 corintios', 'nt', 46, 16),
  ('2co', '2 Coríntios', '2 corintios', 'nt', 47, 13),
  ('gl', 'Gálatas', 'galatas', 'nt', 48, 6),
  ('ef', 'Efésios', 'efesios', 'nt', 49, 6),
  ('fp', 'Filipenses', 'filipenses', 'nt', 50, 4),
  ('cl', 'Colossenses', 'colossenses', 'nt', 51, 4),
  ('1ts', '1 Tessalonicenses', '1 tessalonicenses', 'nt', 52, 5),
  ('2ts', '2 Tessalonicenses', '2 tessalonicenses', 'nt', 53, 3),
  ('1tm', '1 Timóteo', '1 timoteo', 'nt', 54, 6),
  ('2tm', '2 Timóteo', '2 timoteo', 'nt', 55, 4),
  ('tt', 'Tito', 'tito', 'nt', 56, 3),
  ('fm', 'Filemom', 'filemom', 'nt', 57, 1),
  ('hb', 'Hebreus', 'hebreus', 'nt', 58, 13),
  ('tg', 'Tiago', 'tiago', 'nt', 59, 5),
  ('1pe', '1 Pedro', '1 pedro', 'nt', 60, 5),
  ('2pe', '2 Pedro', '2 pedro', 'nt', 61, 3),
  ('1jo', '1 João', '1 joao', 'nt', 62, 5),
  ('2jo', '2 João', '2 joao', 'nt', 63, 1),
  ('3jo', '3 João', '3 joao', 'nt', 64, 1),
  ('jd', 'Judas', 'judas', 'nt', 65, 1),
  ('ap', 'Apocalipse', 'apocalipse', 'nt', 66, 22);

insert into public.coletanea_playlists (url, faixa, ordem) values
  ('https://www.youtube.com/playlist?list=PLAPpcKnpMfeO9Fydpl1tTKC9CRRnIMMSK', '1-100', 1),
  ('https://www.youtube.com/watch?v=yey65PRKnwY&list=PLAPpcKnpMfeOsWzlaY0bXm1Q5pnQQxn_y', null, 2),
  ('https://www.youtube.com/watch?v=kUuN3BnJnaI&list=PLAPpcKnpMfeMnCMuGcdWKVkgpi2P_sRkE', null, 3),
  ('https://www.youtube.com/watch?v=X6AAFwBkfEM&list=PLAPpcKnpMfeNIrE1nk3w2OkcUdxuY6y1l', null, 4),
  ('https://www.youtube.com/watch?v=Dg2XiFULn3Q&list=PLAPpcKnpMfePvD6DLI-Y5TR-RVVo62s6Z', null, 5),
  ('https://www.youtube.com/watch?v=FlHMYuWZK0g&list=PLAPpcKnpMfePWEOuIu4B4F3PVljyD8DoO', null, 6);

-- As funções abaixo devolvem o acervo no mesmo formato que os antigos JSON,
-- em uma chamada só (PostgREST limita as consultas comuns a 1000 linhas).

create function public.coletanea_hinario()
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'generatedAt', (select atualizado_em from public.coletanea_revisoes where chave = 'hinario'),
    'language', 'pt',
    'hymns', coalesce(
      jsonb_agg(
        jsonb_build_object('id', h.id, 'number', h.numero, 'title', h.titulo, 'search', h.busca)
        order by h.numero, h.titulo
      ),
      '[]'::jsonb
    )
  )
  from public.coletanea_hinos h;
$$;

create function public.coletanea_mapa_videos()
returns jsonb
language sql
stable
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(v.hino_id::text, v.video_id), '{}'::jsonb)
  from public.coletanea_videos v;
$$;

create function public.coletanea_biblia(p_versao text)
returns jsonb
language sql
stable
set search_path = ''
as $$
  with capitulos as (
    select livro, capitulo, jsonb_agg(texto order by versiculo) as versos
    from public.coletanea_versiculos
    where versao = p_versao
    group by livro, capitulo
  ),
  livros as (
    select l.ordem, jsonb_build_object(
      'abbrev', l.abrev,
      'name', l.nome,
      'search', l.busca,
      'testament', l.testamento,
      'chapters', jsonb_agg(c.versos order by c.capitulo)
    ) as livro
    from public.coletanea_biblia_livros l
    join capitulos c on c.livro = l.abrev
    group by l.ordem, l.abrev, l.nome, l.busca, l.testamento
  )
  select case when v.id is null then null else jsonb_build_object(
    'generatedAt', (select atualizado_em from public.coletanea_revisoes where chave = 'biblia:' || p_versao),
    'version', v.id,
    'name', v.nome,
    'books', coalesce((select jsonb_agg(livro order by ordem) from livros), '[]'::jsonb)
  ) end
  from (select 1) as um
  left join public.coletanea_biblia_versoes v on v.id = p_versao;
$$;

create function public.coletanea_revisao()
returns jsonb
language sql
stable
set search_path = ''
as $$
  select coalesce(jsonb_object_agg(chave, atualizado_em), '{}'::jsonb) from public.coletanea_revisoes;
$$;

grant execute on function public.coletanea_hinario() to anon, authenticated;
grant execute on function public.coletanea_mapa_videos() to anon, authenticated;
grant execute on function public.coletanea_biblia(text) to anon, authenticated;
grant execute on function public.coletanea_revisao() to anon, authenticated;
