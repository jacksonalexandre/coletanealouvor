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
