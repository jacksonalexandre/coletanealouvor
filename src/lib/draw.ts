export const DRAW_DURATION = 3200;

// Visual timing only. Winners are already immutable in the content snapshot.
export function drawPhase(results: string[], startedAt: number | undefined, now: number) {
  if (startedAt === undefined) return { index: Math.max(0, results.length - 1), revealing: false, tick: 0 };
  const elapsed = Math.max(0, now - startedAt);
  const index = Math.min(Math.floor(elapsed / DRAW_DURATION), Math.max(0, results.length - 1));
  const time = elapsed - index * DRAW_DURATION;
  // 36 changes: quick at first, with steadily longer pauses near the reveal.
  const tick = Math.floor(36 * (1 - Math.pow(1 - Math.min(1, time / 2700), 2.5)));
  return { index, revealing: time < 2700, tick };
}

function randomIndex(length: number) {
  const limit = Math.floor(0x100000000 / length) * length;
  const data = new Uint32Array(1);
  do {
    crypto.getRandomValues(data);
  } while (data[0] >= limit);
  return data[0] % length;
}

export function drawItems(
  pool: string[],
  quantity: number,
  noRepeat: boolean,
  history: string[],
): string[] {
  if (pool.some(s => s.trim().length > 120)) throw new Error("Use nomes de até 120 caracteres para manter a leitura no telão.");
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100)
    throw new Error("Escolha de 1 a 100 resultados.");
  const available = [
    ...new Set(pool.map((s) => s.trim()).filter(Boolean)),
  ].filter((s) => !noRepeat || !history.includes(s));
  if (!available.length || (noRepeat && quantity > available.length))
    throw new Error(
      `Restam ${available.length} opções. Reduza a quantidade ou limpe o histórico.`,
    );
  const results: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const index = randomIndex(available.length);
    results.push(available[index]);
    if (noRepeat) available.splice(index, 1);
  }
  return results;
}
