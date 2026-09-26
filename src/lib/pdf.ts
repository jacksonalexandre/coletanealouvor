import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

export async function renderPdf(file: File, onPage: (canvas: HTMLCanvasElement, page: number, total: number) => Promise<void>) {
  const task = getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false });
  task.onPassword = () => { void task.destroy(); };
  try {
    const pdf = await task.promise;
    if (pdf.numPages > 300) throw new Error('Divida PDFs com mais de 300 páginas em apresentações menores.');
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const original = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: Math.min(2560 / original.width, 1440 / original.height) });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, viewport }).promise;
      await onPage(canvas, pageNumber, pdf.numPages);
      page.cleanup(); canvas.width = 0; canvas.height = 0;
    }
  } finally { await task.destroy(); }
}
