import { cpSync, mkdirSync } from 'node:fs';

// Generated static dependencies stay on the same origin, including offline on GitHub Pages.
mkdirSync('public/pdf-assets', { recursive: true });
for (const directory of ['cmaps', 'standard_fonts', 'wasm']) {
  cpSync(`node_modules/pdfjs-dist/${directory}`, `public/pdf-assets/${directory}`, { recursive: true });
}
