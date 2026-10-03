-- Preferências de cada usuário logado (programação, cores, Bíblia, vídeos
-- cadastrados na mão, sorteio, cronômetro…), como um objeto JSON por usuário.
-- Sem login, o app guarda as mesmas chaves só no navegador.

create table public.coletanea_preferencias (
  user_id uuid primary key references auth.users (id) on delete cascade,
  dados jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);

alter table public.coletanea_preferencias enable row level security;

-- Cada um lê e grava só a própria linha.
create policy "dono lê" on public.coletanea_preferencias
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "dono cria" on public.coletanea_preferencias
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "dono atualiza" on public.coletanea_preferencias
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.coletanea_preferencias from anon;
