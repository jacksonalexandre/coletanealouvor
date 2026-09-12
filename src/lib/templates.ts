import type { SetlistTemplate } from "@/lib/types";

/**
 * Modelos padrão de programação. As etapas viram itens do roteiro (sem hino
 * associado); o operador arrasta os hinos da busca para os pontos certos.
 */
export const SETLIST_TEMPLATES: SetlistTemplate[] = [
  {
    id: "escola-sabatina",
    name: "Escola Sabatina",
    items: [
      "Boas-vindas e abertura",
      "Hino de abertura",
      "Oração inicial",
      "Programa de missões",
      "Atividades da secretaria",
      "Estudo da lição em classes",
      "Hino final",
      "Oração final",
    ],
  },
  {
    id: "culto-sabado",
    name: "Culto de Sábado",
    items: [
      "Prelúdio",
      "Boas-vindas e avisos",
      "Hino de louvor",
      "Oração de invocação",
      "Momento de oração intercessória",
      "Momento infantil",
      "Dízimos e ofertas",
      "Louvor especial",
      "Sermão",
      "Hino de resposta",
      "Bênção apostólica",
      "Poslúdio",
    ],
  },
];
