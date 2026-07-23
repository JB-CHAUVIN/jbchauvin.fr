import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Explains why a project carries no store link, instead of silently showing
 * nothing (or worse, a dead link to a delisted app).
 *
 * Opened from anywhere with:
 *   window.dispatchEvent(new CustomEvent('open-discontinued', { detail: {...} }))
 * Mounted once in Layout.astro, same pattern as <Lightbox />.
 */
export interface DiscontinuedDetail {
  /** Project title, shown as the dialog's subject. */
  title: string;
  /** Stores the app used to ship on. Empty ⇒ never publicly released. */
  stores: string[];
  /** Release year, for context. */
  year: string;
  /** Peak user count, or null for an MVP. */
  users: number | null;
  usersLabel: string;
}

export interface DiscontinuedStrings {
  title: string;
  stores: string;
  offline: string;
  unpublished: string;
  close: string;
  storeLabels: Record<string, string>;
}

/** A shut-down website and a delisted app are not the same story — say the right one. */
function bodyFor(stores: string[], strings: DiscontinuedStrings): string {
  if (stores.some((s) => s === 'ios' || s === 'android')) return strings.stores;
  if (stores.includes('web')) return strings.offline;
  return strings.unpublished;
}

export default function DiscontinuedDialog({ strings }: { strings: DiscontinuedStrings }) {
  const [detail, setDetail] = useState<DiscontinuedDetail | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setDetail(null), []);

  useEffect(() => {
    const handler = (e: Event) => setDetail((e as CustomEvent<DiscontinuedDetail>).detail);
    window.addEventListener('open-discontinued', handler);
    return () => window.removeEventListener('open-discontinued', handler);
  }, []);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Move focus into the dialog so Escape/Tab behave and screen readers announce it.
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [detail, close]);

  if (!detail) return null;

  const { title, stores, year, users, usersLabel } = detail;
  const wasPublished = stores.length > 0;
  const body = bodyFor(stores, strings);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 px-6"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="discontinued-title"
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="discontinued-title"
            className="font-display text-base font-semibold tracking-tight text-gray-900"
          >
            {strings.title}
          </h2>
          <button
            ref={closeRef}
            onClick={close}
            aria-label={strings.close}
            className="-m-1 p-1 text-gray-400 transition-colors hover:text-gray-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-gray-600">{body}</p>

        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="text-[13px] font-medium text-gray-900">{title}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {year}
            {users !== null && ` · ${users >= 1000 ? `${Math.round(users / 1000)}k` : users}+ ${usersLabel}`}
          </p>

          {wasPublished && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {stores.map((store) => (
                <span
                  key={store}
                  className="rounded-sm bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 line-through"
                >
                  {strings.storeLabels[store] ?? store}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
