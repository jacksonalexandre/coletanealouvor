-- Vídeos escolhidos à mão (ex: hino que as playlists não trazem). A importação
-- (Edge Function, papel service_role) não sobrescreve um vídeo marcado como
-- manual; quem edita pelo SQL Editor (postgres) continua podendo trocar.
alter table public.coletanea_videos add column manual boolean not null default false;

create function public.coletanea_videos_preserva_manual()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.manual and current_user = 'service_role' then
    return old;
  end if;
  return new;
end;
$$;

create trigger coletanea_videos_preserva_manual
  before update on public.coletanea_videos
  for each row execute function public.coletanea_videos_preserva_manual();

-- Hino 600 do HASD (Em Paz eu Vou): não está nas playlists.
insert into public.coletanea_videos (hino_id, video_id, manual)
select id, 'hER6dGJKpqY', true from public.coletanea_hinos where colecao = 'hasd' and numero = 600
on conflict (hino_id) do update set video_id = excluded.video_id, manual = true, atualizado_em = now();

-- O app baixa o mapa de vídeos de novo quando a revisão muda.
insert into public.coletanea_revisoes (chave, atualizado_em) values ('videos', now())
on conflict (chave) do update set atualizado_em = excluded.atualizado_em;
