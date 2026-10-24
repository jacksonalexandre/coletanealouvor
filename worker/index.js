// Worker que fica na frente dos arquivos estáticos (run_worker_first no
// wrangler.jsonc): quem chega por http:// é mandado para https://, e as
// respostas por https levam o HSTS, para o navegador não tentar http de novo.
const HSTS = "max-age=31536000";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // localhost fica de fora: o `wrangler dev` serve só em http.
    if (url.protocol === "http:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      return Response.redirect(`https://${url.host}${url.pathname}${url.search}`, 301);
    }

    const resposta = await env.ASSETS.fetch(request);
    if (url.protocol !== "https:") return resposta;

    const comHsts = new Response(resposta.body, resposta);
    comHsts.headers.set("Strict-Transport-Security", HSTS);
    return comHsts;
  },
};
