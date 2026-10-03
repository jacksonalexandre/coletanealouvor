# Coletânea de Louvor — Hinário

Aplicação web (PWA) para projetar os hinos do Hinário Adventista em culto: **busca em uma tela, vídeo do hino na outra**. Roda em desktop e em celular.

O escopo é deliberadamente pequeno: buscar o hino pelo título ou número, montar a ordem do culto e tocar o vídeo na tela da igreja. Sem letras, sem MP3, sem acervo de CDs.

## Rodando

```bash
npm install
npm run dev             # http://localhost:5173
```

O acervo (hinário, vídeos e Bíblia) vem do Supabase — ver **Acervo no Supabase** abaixo. Copie `.env.example` para `.env.local` e preencha a chave pública (anon) do projeto (Supabase → Project Settings → API Keys). No deploy do GitHub Pages, as mesmas duas vêm das variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY` do repositório.

Build de produção:

```bash
npm run build
npm run preview
```

## Como funciona o modo duas telas

| Rota | Papel |
| --- | --- |
| `/` | Controle: hinos, Bíblia, programação do culto e comandos do vídeo, em colunas (uma aba por vez no celular) |
| `/projecao` | Projeção: vídeo ou passagem bíblica, sem nenhum controle visível |

O roteiro aceita hinos, passagens bíblicas e etapas da programação sem vídeo (ex: "Oração", "Sermão"). Os botões **+ Escola Sabatina** e **+ Culto de Sábado**, no topo do roteiro, já carregam a ordem padrão dessas programações; dá pra editar o texto de cada etapa clicando nela, digitar etapas avulsas no campo abaixo dos modelos e arrastar os hinos da busca para os pontos certos. Navegação por teclado e o `stepHymn` pulam as etapas sem hino, indo direto de um hino para o outro.

O botão **Abrir projeção** abre `/projecao` em uma janela separada. Em Chrome/Edge no desktop, a [Window Management API](https://developer.mozilla.org/docs/Web/API/Window_Management_API) posiciona a janela direto na tela do projetor; nos demais navegadores a janela abre normal e o operador arrasta para a segunda tela.

Não precisa abrir a projeção antes: apertar **Tocar** (ou duplo clique num hino, na busca ou no roteiro) abre a projeção sozinho se ainda estiver fechada, e já toca.

Clicar (uma vez) num hino ou passagem só seleciona, pro painel mostrar o hino/editar o link do vídeo — não mexe no que já está na tela. Só entra no ar de verdade com **Tocar**, duplo clique, `N`/`P` (próximo/anterior) ou o botão **Projetar** da Bíblia; enquanto isso, o painel mostra "Selecionado" em vez de "No ar" e avisa o que continua em cartaz. Isso vale pra tudo: buscar outro hino, trocar a tradução da Bíblia, editar o link de um vídeo — nada disso derruba o que já está projetado.

A sincronia é local, por `BroadcastChannel` — sem servidor, sem latência. O controle publica o que quer (vídeo, tocar/pausar, volume, posição, tela apagada) e a projeção devolve o estado real do player.

### No celular: toca no próprio aparelho

No celular (e tablet) não há segunda tela, então o app **não abre a janela de projeção**: a projeção fica embutida no topo da aba **Ao vivo** e **Tocar** (ou duplo toque num hino) toca ali mesmo. Quando algo entra no ar — hino, passagem, sorteio, cronômetro — o app troca sozinho para essa aba. Trocar de aba depois não para o som. Toque duas vezes no quadro para tela cheia.

A detecção é automática (tela de toque, sem mouse) e pode ser trocada em **Configurações gerais → Tocar neste aparelho** — dá para ligar no desktop ou desligar num tablet ligado a um projetor. O canal é o mesmo `BroadcastChannel`, que também entrega mensagens dentro da própria página. Embutido, o player mostra os botões do YouTube: no iPhone o Safari só deixa começar um vídeo com som a partir de um toque dentro do próprio vídeo; se **Tocar** não arrancar, toque no play do quadro.

**Na primeira vez, clique uma vez na janela de projeção.** O navegador não deixa um vídeo com som começar sozinho em uma janela onde ninguém clicou. Esse clique também entra em tela cheia e vale para o culto inteiro.

### Atalhos de teclado

| Tecla | Ação |
| --- | --- |
| `espaço` `K` | Tocar / pausar |
| `N` `PageDown` | Próximo hino do roteiro (ou próximo versículo, com uma passagem em cartaz) |
| `P` `PageUp` | Hino anterior do roteiro (ou versículo anterior) |
| `→` / `←` | Adiantar / voltar 10 segundos (com uma passagem em cartaz, próximo / anterior versículo) |
| `L` / `J` | Adiantar / voltar 10 segundos |
| `Shift+→` / `Shift+←` | Adiantar / voltar 5 segundos |
| `↑` / `↓` | Aumentar / diminuir o volume (5%) |
| `M` | Mudo / volta ao volume de antes |
| `0`–`9` | Pular para 0%–90% do vídeo |
| `Home` / `End` | Início / fim do vídeo |
| `B` | Apagar a tela (o vídeo continua rodando por baixo) |
| `F` ou duplo clique (na projeção) | Entrar / sair da tela cheia |

As teclas seguem o padrão do YouTube e funcionam nas duas janelas. Para trocar de hino, use `N`/`P` ou o passador de slides (`PageDown`/`PageUp`).

## Link avulso do YouTube

Para um vídeo fora do hinário (abertura, clipe, vinheta), use o ícone de **link** no topo: cole o link (normal, `youtu.be`, `/shorts/`, `/live/`…) e escolha **Projetar agora** — vai para a projeção e já toca — ou **Na programação**. O título vem do YouTube quando possível; dá para digitar outro.

Também dá para colar o link direto no campo de etapa da programação: em vez de uma etapa de texto, entra um vídeo. Na programação, o vídeo se comporta como um hino: duplo clique toca, e `N`/`P` passam por ele. No painel **Ao vivo** ele aparece como "No ar · link", com os mesmos controles (tocar/pausar, linha do tempo, apagar tela, volume) e **Encerrar vídeo**. Clicar num hino enquanto o link está no ar só seleciona; **Tocar** então troca para o hino.

## Vídeos dos hinos

O app precisa saber qual vídeo do YouTube corresponde a cada hino. O mapa vive na tabela `coletanea_videos` do Supabase (hino → id do vídeo), montado pela importação de vídeos: ela lê as playlists da tabela `coletanea_playlists`, tira o número do hino do título de cada vídeo ("… Hino 12 …") e casa com o hinário. Se o YouTube bloquear a leitura, nada é apagado.

Para acrescentar uma playlist, insira a URL em `coletanea_playlists` e rode `select public.coletanea_importar('videos');`.

Também dá para cadastrar o vídeo de um hino pela interface: abra o hino e cole o link no campo do painel de comando. O app aceita link normal, `youtu.be`, `/embed/`, `/shorts/` ou o id cru e guarda no navegador, por cima do banco. Cadastrar, trocar e remover o vídeo exige login com o Google; sem login o painel só mostra se o hino tem vídeo.

O player usa `youtube-nocookie.com` com `rel=0`, `modestbranding=1` e `iv_load_policy=3`. Isso tira cookies de rastreio, vídeos relacionados e anotações — **não tira anúncio**. Quem decide se há anúncio é a monetização do vídeo. Um canal não monetizado roda limpo; fora isso, a saída é o operador estar logado com YouTube Premium naquele navegador.

## Hinário e coleções

Os hinos vêm de **coleções** (tabela `coletanea_colecoes`), e a busca tem o filtro **Todos / HASD / Menos Um / Minha Vida é uma Viagem** logo abaixo do campo — a escolha fica salva (e acompanha a conta, com login):

| Coleção | Origem |
| --- | --- |
| **HASD** — Hinário Adventista do Sétimo Dia | Tabela `coletanea_hinos` (601 hinos, 1 a 600 — o 587 tem as variações A e B), importada da API do LouvorJá; vídeos das playlists em `coletanea_playlists` |
| **Menos Um** | Cada vídeo do canal [@menosum7](https://www.youtube.com/@menosum7) vira um item; só entram os vídeos com "Menos Um" no título (o canal também tem flash mob, coletâneas…) |
| **Minha Vida é uma Viagem** | Músicas bíblicas infantis do canal [@minhavidaeumaviagem](https://www.youtube.com/@minhavidaeumaviagem); só a versão principal de cada música: volumes completos, maratonas, coletâneas e as versões PLAYBACK, Karaokê e em Libras ficam de fora |

O mesmo hino pode estar nas duas coleções (ex: *Castelo Forte* do HASD e do Menos Um): são itens separados, cada um com seu vídeo. Na lista "Todos", a sigla da coleção aparece ao lado do título; o detalhe da versão (*CD JOVEM*, *PLAYBACK*…) também, e entra na busca. O número de um item do Menos Um é o do **hinário atual**, achado pelo título (*Castelo Forte* → 73, igual ao HASD), então buscar "73" traz os dois. O "Hino IASD 33" que vem no título do vídeo é do hinário antigo: quando o título não tem par no hinário atual, ele aparece só no detalhe ("Hinário antigo nº 128"). Vídeos do canal que não passam no filtro ficam ocultos (`oculto`), não apagados.

Para acrescentar um canal: insira uma linha em `coletanea_colecoes` com `tipo = 'canal'`, a URL da aba de vídeos em `fonte_url` e, se precisar, `filtro_titulo` (só entram vídeos cujo título bate) e/ou `excluir_titulo` (os que batem ficam de fora) — expressões regulares em JavaScript, sem diferenciar maiúsculas; depois `select public.coletanea_importar('canais');`. A importação separa título e detalhe pelos separadores `|` e ` - `, tira o nome do canal e ruídos como "(Clipe Oficial)", e manda versões (*Playback*, *Karaokê*, *em Libras*) para o detalhe; o título original fica em `titulo_original`. A busca funciona offline depois da primeira carga, guardada em IndexedDB.

## Passagens bíblicas

Tabela `coletanea_versiculos` (cerca de 31 mil versículos por tradução), com quatro traduções importadas dos releases de [damarals/biblias](https://github.com/damarals/biblias):

| Sigla | Tradução |
| --- | --- |
| ARA | Almeida Revista e Atualizada |
| ARC | Almeida Revista e Corrigida |
| NTLH | Nova Tradução na Linguagem de Hoje |
| NVI | Nova Versão Internacional |

A importação confere se cada livro trouxe o número certo de capítulos (tabela `coletanea_biblia_livros`) e descarta o que passar disso (a fonte já teve nota de rodapé mal separada virando capítulo fantasma — o próprio projeto de origem mantém uma worklist desses casos). O app baixa a tradução inteira uma vez (~4 MB) e guarda em IndexedDB; só baixa de novo quando a tradução for reimportada.

Na coluna **Bíblia** (aba própria no celular): escolha o livro (em colunas, ordem ajustável na engrenagem), o capítulo e o(s) versículo(s) — capítulo e versículo são grades só de número, pra selecionar rápido; shift-clique estende o intervalo e o texto escolhido aparece embaixo da grade antes de confirmar. **Projetar** manda a passagem pra tela e **+** acrescenta ao roteiro. Passagem não tem som, então a projeção mostra direto, sem pedir o clique de ativação (esse clique continua valendo pra vídeo). A passagem some o vídeo da projeção enquanto está em cartaz; **Encerrar passagem** ou abrir outro hino volta ao normal.

O ícone de engrenagem (mesma linha da busca, e também no cabeçalho do capítulo/versículo) reúne toda a configuração: tradução (ARA/ARC/NTLH/NVI — troca atualiza a projeção na hora, mesmo com passagem em cartaz), ordem dos livros (ordem da Bíblia ou A-Z) e a aparência da passagem na projeção (tamanho da fonte, cor de fundo e da letra). Fica salvo no navegador.

Sem a tradução no banco (ou offline sem cache), a busca de hinos continua funcionando normalmente — só a aba Bíblia fica indisponível.

## Acervo no Supabase

Hinário, vídeos e Bíblia ficam no projeto Supabase `ei-clube-db`, em tabelas com prefixo `coletanea_` (para conviver com as tabelas de outros sistemas no mesmo banco). As migrações estão em `supabase/migrations/`.

| Tabela | Conteúdo |
| --- | --- |
| `coletanea_hinos` | Número, título e texto de busca de cada hino |
| `coletanea_videos` | Vídeo do YouTube de cada hino |
| `coletanea_playlists` | Playlists lidas pela importação de vídeos |
| `coletanea_biblia_versoes` / `coletanea_biblia_livros` | Traduções e os 66 livros (ordem e capítulos esperados) |
| `coletanea_versiculos` | Texto da Bíblia, um versículo por linha |
| `coletanea_revisoes` | Quando cada parte mudou — o app só baixa de novo o que mudou |
| `coletanea_importacoes` | Histórico das importações (privado) |

O app lê com a chave pública (anon), pelas funções `coletanea_hinario()`, `coletanea_mapa_videos()`, `coletanea_biblia(versão)` e `coletanea_revisao()`, que devolvem cada parte em uma chamada só. As políticas RLS só permitem leitura; ninguém grava pelo app.

**Importar / atualizar** (no SQL Editor do Supabase):

```sql
select public.coletanea_importar('tudo');                 -- hinário, Bíblia, vídeos e canais
select public.coletanea_importar('canais');               -- só as coleções de canal (ex: Menos Um)
select public.coletanea_importar('videos');               -- só os vídeos das playlists
select public.coletanea_importar('biblia', array['ara']); -- só uma tradução
select * from public.coletanea_importacoes order by id desc limit 5;  -- resultado
```

Quem faz o trabalho é a Edge Function `coletanea-importar` (`supabase/functions/`), que busca as fontes e grava com a service role. A função `coletanea_importar` chama essa Edge Function pelo `pg_net`, com um token que fica só no banco, e não é exposta à chave pública.

## Configurações gerais

A engrenagem no topo reúne a reprodução ("Tocar neste aparelho", ver acima) e as cores, salvas no navegador:

| Opção | Onde aparece |
| --- | --- |
| Tema (Escuro / Claro) | Tela de controle inteira; trocar o tema volta o fundo e a fonte do app para os do tema |
| Cor de destaque | Botões, seleção, indicador de "no ar" — no controle e no número/contador da projeção |
| Fundo do app | Tela de controle |
| Cor da fonte | Textos do controle; os tons mais fracos (legendas, bordas, campos) são misturas do fundo com a fonte |
| Fundo da projeção | Projeção sem vídeo, tela apagada (`B`), sorteio e cronômetro |
| Fonte da projeção | Textos do sorteio e do cronômetro, e o relógio |

A aparência das passagens bíblicas (fonte, fundo e letra) continua na engrenagem da coluna Bíblia. **Restaurar cores padrão** volta às cores do tema atual.

## Cronômetro

O ícone de cronômetro no topo abre a contagem regressiva até um **horário final** (ex: o início do culto). Digite o horário ou use os atalhos **+5/+10/+15/+30 min**; se o horário já passou hoje, vale o de amanhã (o painel avisa). O texto acima do contador é opcional (ex: "O culto começa em").

**Iniciar na projeção** mostra o contador grande — `MM:SS`, ou `H:MM:SS` quando falta mais de uma hora — com o relógio atual pequeno embaixo, nas cores das configurações gerais. Ao zerar, o `00:00` fica piscando até o operador tirar. Mudou o horário ou o texto com o cronômetro no ar? **Atualizar na projeção**. Cada janela conta pelo próprio relógio, então o contador não depende do canal para andar. Pôr um hino, passagem ou sorteio no ar tira o cronômetro.

## Sorteio

O ícone de dados no topo abre o sorteio, em dois modos:

- **Número**: sorteia entre o número inicial (1 por padrão) e o final (50 por padrão).
- **Nome**: cole ou digite os nomes, um por linha; linhas vazias são ignoradas e os espaços nas pontas, descartados.

**Não repetir** (ligado por padrão) tira da roda o que já saiu; a lista "Já sorteados" mostra o histórico e **Recomeçar** zera. Mudar o intervalo ou a lista também recomeça. Com **Mostrar na projeção** ligado, cada sorteio vai para a tela da igreja com uma roleta rápida antes do resultado (abrindo a projeção se estiver fechada); **Tirar sorteio da projeção** volta ao que estava por baixo. Pôr um hino ou passagem no ar também encerra o sorteio. O sorteio usa `crypto.getRandomValues`, sem viés.

## Login com o Google

O canto direito do topo tem o botão **Entrar com Google**. O login é feito pelo **Supabase Auth**, no mesmo projeto do ei-clube (a mesma conta Google vale nos dois). Depois de entrar, aparece a foto da conta; clicando nela dá para ver nome/e-mail e **Sair**. O login é opcional: o app funciona igual sem ele.

O Google volta para a raiz do app (`BASE_URL`) e o `supabase-js` lê a sessão da URL e a guarda no navegador, renovando o token sozinho até o operador clicar em **Sair**.

Para funcionar, o provedor Google já precisa estar ativo no projeto (é o mesmo do ei-clube) e as URLs de volta do app precisam estar em Supabase → Authentication → URL Configuration → **Redirect URLs**:

- `http://localhost:5173/**` (desenvolvimento)
- `https://jacksonalexandre.github.io/coletanealouvor/**` (GitHub Pages)

Sem `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` no build, o botão não aparece.

### Preferências na conta

**Com login**, as preferências vão para a conta (tabela `coletanea_preferencias`, uma linha por usuário, protegida por RLS — cada um só lê e grava a própria) e voltam em qualquer aparelho em que a pessoa entrar:

- programação do culto, cores e tema, aparência das passagens, tradução e ordem dos livros da Bíblia;
- vídeos cadastrados na mão, nomes e intervalo do sorteio, texto e horário do cronômetro.

Ficam só no aparelho: a tela do projetor, "Tocar neste aparelho" e o volume.

**Sem login**, as mesmas preferências continuam salvas no navegador, como sempre; sair da conta também não apaga nada do navegador.

No login vale a versão mais recente: se o navegador mudou depois do último envio (sem login ou offline), ele sobe para a conta; senão, a conta desce para o navegador. Um navegador com preferências de outra conta perde para a conta que entrou. Depois, cada mudança é enviada em ~1,5 s (várias seguidas viram um envio só). O menu da conta mostra se está tudo salvo na conta ou só no navegador.

## Estrutura

```
supabase/migrations/        Tabelas coletanea_*, políticas RLS e funções de leitura/importação
supabase/functions/         Edge Function coletanea-importar (hinário, Bíblia, vídeos)
src/lib/supabase.ts         Cliente Supabase: login com o Google e leitura do acervo
src/lib/appearance.ts       Tema claro/escuro e cores globais do app e da projeção
src/lib/bible.ts            Recorte e referência de passagens bíblicas
src/lib/bibleVersions.ts    Catálogo das traduções disponíveis (ARA, ARC, NTLH, NVI)
src/lib/passageStyle.ts     Tipo e padrão da aparência da passagem na projeção
src/lib/channel.ts          Canal controle <-> projeção
src/lib/templates.ts        Modelos de programação (culto de sábado, escola sabatina)
src/lib/screens.ts          Descoberta de telas e abertura da janela de projeção
src/lib/countdown.ts        Cronômetro regressivo (horário final, formatação, relógio)
src/lib/draw.ts             Sorteio de número e de nome
src/lib/storage.ts          Acervo do Supabase com cache em IndexedDB, preferências
src/lib/preferenceSync.ts   Preferências na conta (Supabase) ou só no navegador
src/lib/youtube.ts          Leitura de link do YouTube
src/lib/useLive.ts          Lado do controle do canal
src/store/useApp.ts         Estado global (zustand)
src/store/useAuth.ts        Sessão do Supabase Auth (login com o Google)
src/routes/Control.tsx      Tela de controle
src/routes/Display.tsx      Tela de projeção (IFrame Player API)
```

Stack: React 19, Vite 6, Tailwind 4, Radix (componentes no padrão shadcn/ui), zustand, dnd-kit, vite-plugin-pwa.

## Navegador

Chrome ou Edge dão o posicionamento automático das telas. Brave funciona e bloqueia anúncio do YouTube, mas o anti-fingerprint dele pode esconder as telas disponíveis e o Shields em modo agressivo às vezes derruba o embed — teste antes do culto, não no culto.

## Deploy

Qualquer host estático serve. É preciso apontar todas as rotas para `index.html` (SPA); `public/_redirects` já cobre Netlify. Para Vercel, um `vercel.json` com rewrite de `/(.*)` para `/index.html`; para Nginx, `try_files $uri /index.html`.

**GitHub Pages:** `.github/workflows/deploy-pages.yml` builda e publica a cada push em `master` (ative uma vez em Settings → Pages → Source: GitHub Actions). Como um Pages de projeto serve em `/<repo>/` em vez da raiz, o build usa `BASE_PATH=/<repo>/`; localmente isso não é necessário (`npm run build` sem a variável já serve da raiz, para Netlify/Vercel/Nginx).
