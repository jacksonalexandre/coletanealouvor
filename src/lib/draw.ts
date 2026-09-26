/** Inteiro uniforme em [0, n), com crypto quando disponível (sem viés de módulo). */
export function randomIndex(n: number): number {
  if (n <= 1) return 0;
  if (typeof crypto === "undefined" || !crypto.getRandomValues) return Math.floor(Math.random() * n);
  const limit = Math.floor(0x100000000 / n) * n;
  const buffer = new Uint32Array(1);
  do crypto.getRandomValues(buffer);
  while (buffer[0] >= limit);
  return buffer[0] % n;
}

/** Cada linha com texto vira um nome; linhas vazias são ignoradas. */
export function parseNames(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Sorteia um número em [min, max], pulando os já sorteados se `exclude` vier.
 * null quando não sobra nenhum.
 */
export function drawNumber(min: number, max: number, exclude: ReadonlySet<string> = new Set()): number | null {
  const size = max - min + 1;
  if (size <= 0) return null;
  const taken = [...exclude].map(Number).filter((n) => Number.isInteger(n) && n >= min && n <= max);
  const remaining = size - new Set(taken).size;
  if (remaining <= 0) return null;
  // Sorteia a posição entre os que restam e anda pelos já tirados, em ordem.
  let position = randomIndex(remaining);
  for (const n of [...new Set(taken)].sort((a, b) => a - b)) {
    if (min + position >= n) position++;
    else break;
  }
  return min + position;
}

/** Sorteia um nome da lista, pulando os já sorteados. null quando não sobra nenhum. */
export function drawName(names: string[], exclude: ReadonlySet<string> = new Set()): string | null {
  const available = names.filter((name) => !exclude.has(name));
  return available.length ? available[randomIndex(available.length)] : null;
}
