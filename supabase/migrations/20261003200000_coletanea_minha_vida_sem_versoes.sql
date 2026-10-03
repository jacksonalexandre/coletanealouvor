-- "Minha Vida é uma Viagem": fora as versões PLAYBACK, Karaokê e em Libras; fica
-- só a versão principal de cada música. A regra vale nas próximas importações e
-- os já importados ficam ocultos (não apagados: programações salvas seguem válidas).
update public.coletanea_colecoes
set excluir_titulo = excluir_titulo || '|playback|karaok[eê]|libras'
where id = 'minha-vida-viagem' and excluir_titulo !~ 'playback';

update public.coletanea_hinos
set oculto = true
where colecao = 'minha-vida-viagem'
  and not oculto
  and concat_ws(' ', titulo_original, titulo, detalhe) ~* 'playback|karaok[eê]|libras';

-- O app recarrega o hinário quando a revisão muda.
insert into public.coletanea_revisoes (chave, atualizado_em)
values ('hinario', now())
on conflict (chave) do update set atualizado_em = excluded.atualizado_em;
