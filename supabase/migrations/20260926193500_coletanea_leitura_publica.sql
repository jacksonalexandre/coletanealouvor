-- Um endurecimento aplicado direto no banco (migration 20260926181754) passou a
-- leitura do acervo para só "authenticated" e revogou o SELECT do anon. Mas o
-- app abre sem login (o login é opcional) e as funções coletanea_* rodam como
-- quem chama, então a carga do hinário quebrava com
-- "permission denied for table coletanea_revisoes".
-- Hinário, vídeos e Bíblia são conteúdo público: volta a leitura para anon.
-- coletanea_playlists só é usada pela importação e continua restrita.

do $$
declare
  tabela text;
begin
  foreach tabela in array array[
    'coletanea_hinos',
    'coletanea_videos',
    'coletanea_biblia_versoes',
    'coletanea_biblia_livros',
    'coletanea_versiculos',
    'coletanea_revisoes'
  ] loop
    execute format('drop policy if exists "leitura pública" on public.%I', tabela);
    execute format(
      'create policy "leitura pública" on public.%I for select to anon, authenticated using (true)',
      tabela
    );
    execute format('grant select on public.%I to anon, authenticated', tabela);
  end loop;
end $$;
