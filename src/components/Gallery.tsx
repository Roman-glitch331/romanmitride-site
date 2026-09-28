import { useCallback, useEffect, useRef, useState } from 'react';

export type Photo = { thumb: string; full: string; alt: string; w: number; h: number; credit?: string };

export default function Gallery({ photos }: { photos: Photo[] }) {
  const [ouvert, setOuvert] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const declencheur = useRef<HTMLButtonElement | null>(null);

  const fermer = useCallback(() => { dialog.current?.close(); setOuvert(null); declencheur.current?.focus(); }, []);
  const aller = useCallback((sens: 1 | -1) => setOuvert((i) => (i === null ? i : (i + sens + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (ouvert !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [ouvert]);

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 [&>li]:mb-3">
        {photos.map((p, i) => (
          <li key={p.thumb} className={`break-inside-avoid ${i >= 6 ? 'hidden md:block' : ''}`}>
            <button
              type="button"
              className="block w-full overflow-hidden rounded-2xl"
              onClick={(e) => { declencheur.current = e.currentTarget; setOuvert(i); }}
              aria-label={`Agrandir : ${p.alt}`}
            >
              <img src={p.thumb} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async"
                className="h-auto w-full transition-transform duration-700 hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOuvert(null)}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') aller(1); if (e.key === 'ArrowLeft') aller(-1); }}
        className="m-auto max-h-[92vh] max-w-[92vw] bg-transparent p-0 backdrop:bg-black/85"
        aria-label="Visionneuse de photos"
      >
        {ouvert !== null && (
          <figure className="relative">
            <img src={photos[ouvert].full} alt={photos[ouvert].alt} className="max-h-[85vh] w-auto rounded-xl" />
            <figcaption className="mt-2 text-center text-sm text-white/80">
              {photos[ouvert].alt}{photos[ouvert].credit ? ` · Photo : ${photos[ouvert].credit}` : ''}
            </figcaption>
            <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
              <button type="button" onClick={() => aller(-1)} className="liquid-glass h-11 w-11 rounded-full text-white" aria-label="Photo précédente">←</button>
              <button type="button" onClick={() => aller(1)} className="liquid-glass h-11 w-11 rounded-full text-white" aria-label="Photo suivante">→</button>
            </div>
            <button type="button" onClick={fermer} className="liquid-glass absolute right-2 top-2 h-11 w-11 rounded-full text-white" aria-label="Fermer la visionneuse" autoFocus>✕</button>
          </figure>
        )}
      </dialog>
    </>
  );
}
