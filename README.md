# Coletânea de Louvor — versão web

Aplicação web (PWA) para projetar letras de música em culto, com **controle em uma tela e projeção em outra**. Roda em desktop e em celular, funciona offline depois do primeiro carregamento.

## Rodando

```bash
npm install
npm run import:louvorja   # baixa e normaliza o acervo em public/data (uma vez)
npm run dev               # http://localhost:5173
```

Build de produção:

```bash
npm run build
npm run preview
```

## Como funciona o modo duas telas

| Rota | Papel |
| --- | --- |
| `/` | Controle: busca, roteiro do culto, slides, pré-visualização, ajustes |
| `/projecao` | Projeção: apenas a letra, fundo escuro, sem nenhum controle |

O botão **Abrir projeção** abre `/projecao` em uma janela separada. Em Chrome/Edge no desktop, a [Window Management API](https://developer.mozilla.org/docs/Web/API/Window_Management_API) é usada para posicionar essa janela direto na tela do projetor; nos demais navegadores a janela abre normal e o operador arrasta para a segunda tela (dois cliques na janela entram em tela cheia).

A sincronia entre as duas janelas é local, por `BroadcastChannel` — sem servidor, sem latência, funciona offline. Onde `BroadcastChannel` não existe, o fallback é o evento `storage` do `localStorage`.

Nada vai para a projeção enquanto o operador não apertar **Colocar no ar** (tecla `L`). Isso permite procurar a próxima música com a tela da igreja ainda mostrando a anterior.

### Atalhos de teclado

| Tecla | Ação |
| --- | --- |
| `→` `espaço` `PageDown` | Próximo slide (encadeia com a próxima música do roteiro) |
| `←` `PageUp` | Slide anterior |
| `B` | Apagar a tela (preto) |
| `L` | Colocar no ar / tirar do ar |
| `N` / `P` | Próxima / música anterior do roteiro |
| `Home` / `End` | Primeiro / último slide |
| `F` (na janela de projeção) | Tela cheia |

As teclas funcionam tanto na janela de controle quanto na de projeção — dá para usar um apresentador remoto apontado para qualquer uma das duas.

## Acervo

`npm run import:louvorja` baixa os JSONs públicos do LouvorJA e grava dois arquivos:

- `public/data/catalog.json` — músicas, álbuns e categorias (~340 KB)
- `public/data/lyrics.json` — letras por id (~1,4 MB)

O app lê só esses arquivos locais e guarda cópia em IndexedDB; a API de terceiros nunca é chamada em runtime. São 1889 músicas, das quais 601 do hinário.

> **Atenção:** letras e áudios são obra de terceiros. O importador existe para desenvolvimento; publicar o conteúdo resultante depende de você ter o direito de distribuí-lo.

### Quebra das letras em slides

O acervo original guarda as letras já quebradas na largura da tela do software desktop antigo, o que corta frases no meio (`Cedo de manhã / cantaremos Teu louvor Santo, santo, santo!`). O modo **Por frase** (padrão) reconstrói os versos usando dois sinais: pontuação de fim de frase e inicial maiúscula depois de palavra minúscula — que é onde o texto original começava um verso. Fragmentos curtos são fundidos de volta para não picotar letras com muita inicial maiúscula. O modo **Original** mantém a quebra do acervo.

## Estrutura

```
scripts/import-louvorja.mjs   Importador do acervo (tempo de desenvolvimento)
src/lib/slides.ts             Texto bruto -> versos -> slides
src/lib/channel.ts            Canal controle <-> projeção
src/lib/screens.ts            Descoberta de telas e abertura da janela de projeção
src/lib/storage.ts            Cache do acervo (IndexedDB) e preferências
src/store/useApp.ts           Estado global (zustand)
src/routes/Control.tsx        Tela de controle
src/routes/Display.tsx        Tela de projeção
```

Stack: React 19, Vite 6, Tailwind 4, Radix (componentes no padrão shadcn/ui), zustand, dnd-kit, vite-plugin-pwa.

## Deploy

Qualquer host estático serve. É preciso apontar todas as rotas para `index.html` (SPA); `public/_redirects` já cobre Netlify. Para Vercel, um `vercel.json` com rewrite de `/(.*)` para `/index.html`; para Nginx, `try_files $uri /index.html`.
