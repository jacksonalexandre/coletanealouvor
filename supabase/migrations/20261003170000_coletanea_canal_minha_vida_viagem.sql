-- Canal "Minha Vida é uma Viagem" (músicas bíblicas infantis). Títulos no formato
-- "Título - Playback", "Título [Tema · em Libras]"; volumes completos, maratonas e
-- coletâneas não são músicas e ficam ocultos pela regra excluir_titulo (expressão
-- regular avaliada em JavaScript pela Edge Function: borda de palavra é \b).
alter table public.coletanea_colecoes add column excluir_titulo text;
alter table public.coletanea_hinos add column titulo_original text;

insert into public.coletanea_colecoes (id, sigla, nome, ordem, tipo, fonte_url, excluir_titulo)
values ('minha-vida-viagem', 'Minha Vida é uma Viagem', 'Minha Vida é uma Viagem (canal do YouTube)', 3, 'canal',
        'https://www.youtube.com/@minhavidaeumaviagem/videos', 'completo|maratona|\+\s*de\s*\d|minutos|mais assistidos|\bmix\b|m[uú]sicas sobre')
on conflict (id) do update set excluir_titulo = excluded.excluir_titulo;
