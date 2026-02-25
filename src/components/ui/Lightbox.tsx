import { useState, useEffect, useCallback } from 'react';

interface LightboxState {
  images: string[];
  index: number;
  projectTitle: string;
}

export default function Lightbox() {
  const [state, setState] = useState<LightboxState | null>(null);

  const close = useCallback(() => setState(null), []);

  const prev = useCallback(() => {
    setState((s) => s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : null);
  }, []);

  const next = useCallback(() => {
    setState((s) => s ? { ...s, index: (s.index + 1) % s.images.length } : null);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { images, index, projectTitle } = (e as CustomEvent).detail;
      setState({ images, index: index ?? 0, projectTitle });
    };
    window.addEventListener('open-lightbox', handler);
    return () => window.removeEventListener('open-lightbox', handler);
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [state, close, prev, next]);

  // Touch swipe
  const touchStart = { x: 0 };
  const onTouchStart = (e: React.TouchEvent) => { touchStart.x = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStart.x;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  };

  if (!state) return null;

  const { images, index, projectTitle } = state;
  const hasMultiple = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center"
      onClick={close}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        onClick={close}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 p-2"
        aria-label="Close"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Title + counter */}
      <div className="absolute top-4 left-4 right-14 z-10">
        <p className="text-white/90 font-body text-sm font-medium">{projectTitle}</p>
        {hasMultiple && (
          <p className="text-white/50 font-body text-xs mt-0.5">{index + 1} / {images.length}</p>
        )}
      </div>

      {/* Prev arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 md:left-6 text-white/60 hover:text-white transition-colors z-10 p-3"
          aria-label="Previous"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Image — portrait-safe: max height 90vh, width auto */}
      <div
        className="flex items-center justify-center w-full h-full px-16 py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={images[index]}
          src={images[index]}
          alt={`${projectTitle} screenshot ${index + 1}`}
          className="max-h-[85vh] max-w-full w-auto h-auto object-contain rounded-sm shadow-2xl"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {/* Next arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 md:right-6 text-white/60 hover:text-white transition-colors z-10 p-3"
          aria-label="Next"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="absolute bottom-5 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setState((s) => s ? { ...s, index: i } : null); }}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/40'}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
