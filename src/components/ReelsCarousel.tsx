import { useEffect, useRef, useState } from 'react';

type Reel = { video: string; post: string; poster?: string };
const track = (n: string, d?: object) => (window as any).umami?.track(n, d);

export default function ReelsCarousel({ reels, profil }: { reels: Reel[]; profil: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const [son, setSon] = useState<number | null>(null);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting && e.intersectionRatio > 0.6) {
          if (!v.src) v.src = v.dataset.src!;
          if (!reduce) v.play().then(() => track('reel-lecture', { video: v.dataset.name })).catch(() => {});
        } else v.pause();
      }
    }, { threshold: [0, 0.6] });
    vids.current.forEach((v) => v && io.observe(v));
    const pio = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { const v = e.target as HTMLVideoElement; v.poster = v.dataset.poster ?? ''; pio.unobserve(v); }
    }, { rootMargin: '600px' });
    vids.current.forEach((v) => v && pio.observe(v));
    return () => { io.disconnect(); pio.disconnect(); };
  }, []);

  const defiler = (sens: 1 | -1) => {
    const r = rail.current; if (!r) return;
    r.scrollBy({ left: sens * (r.firstElementChild as HTMLElement).offsetWidth * 1.05, behavior: 'smooth' });
    track('reel-swipe');
  };

  const basculerSon = (i: number) => {
    vids.current.forEach((v, j) => { if (v) v.muted = j !== i || son === i; });
    setSon(son === i ? null : i);
  };

  return (
    <div>
      <div
        ref={rail}
        role="region"
        aria-label="Vidéos Instagram de Roman Mitride"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') defiler(1); if (e.key === 'ArrowLeft') defiler(-1); }}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none]"
      >
        {reels.map((r, i) => (
          <figure key={r.video} className="relative aspect-[9/16] w-[72%] shrink-0 snap-center overflow-hidden rounded-3xl bg-surface sm:w-[42%] lg:w-[31%]">
            <video
              ref={(el) => { vids.current[i] = el; }}
              data-src={`/media/${r.video}.mp4`}
              data-name={r.video}
              data-poster={r.poster}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover"
              aria-label={`Vidéo ${i + 1} de Roman Mitride en BMX Flatland`}
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-4">
              <button
                type="button"
                onClick={() => basculerSon(i)}
                className="liquid-glass rounded-full px-4 py-2 text-sm text-white"
                aria-pressed={son === i}
              >
                {son === i ? 'Couper le son' : 'Activer le son'}
              </button>
              <a
                href={r.post}
                target="_blank"
                rel="noopener"
                className="text-sm text-white underline"
                onClick={() => track('reel-post-clic', { video: r.video })}
              >
                Voir le post
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="hidden gap-2 md:flex">
          <button type="button" onClick={() => defiler(-1)} className="liquid-glass h-11 w-11 rounded-full" aria-label="Vidéo précédente">←</button>
          <button type="button" onClick={() => defiler(1)} className="liquid-glass h-11 w-11 rounded-full" aria-label="Vidéo suivante">→</button>
        </div>
        <a href={profil} target="_blank" rel="noopener me" className="btn-accent" onClick={() => track('instagram-suivre')}>
          Suivre sur Instagram
        </a>
      </div>
    </div>
  );
}
