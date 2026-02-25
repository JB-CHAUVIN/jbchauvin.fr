import { en, type TranslationKey } from './en';
import { fr } from './fr';

export type Lang = 'en' | 'fr';

const translations = { en, fr } as const;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'fr') return 'fr';
  return 'en';
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return (translations[lang] as Record<string, string>)[key] ?? (translations.en as Record<string, string>)[key] ?? key;
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  if (lang === 'en') return path;
  // Map EN paths to FR paths
  const frPaths: Record<string, string> = {
    '/': '/fr/',
    '/projects/': '/fr/projets/',
    '/references/': '/fr/references/',
  };
  return frPaths[path] ?? `/fr${path}`;
}

export function getAlternatePath(currentPath: string, targetLang: Lang): string {
  // Strip /fr/ prefix to get the base path
  const basePath = currentPath.replace(/^\/fr/, '') || '/';

  // FR paths map
  const enToFr: Record<string, string> = {
    '/': '/fr/',
    '/projects/': '/fr/projets/',
    '/references/': '/fr/references/',
  };

  const frToEn: Record<string, string> = {
    '/fr/': '/',
    '/fr/projets/': '/projects/',
    '/fr/references/': '/references/',
  };

  if (targetLang === 'fr') {
    return enToFr[currentPath] ?? enToFr[basePath] ?? `/fr${basePath}`;
  } else {
    return frToEn[currentPath] ?? basePath;
  }
}
