#!/usr/bin/env node
/**
 * Regenerates the social cards read by Layout.astro:
 *   public/og-image.jpg      (EN, used by / and every EN page)
 *   public/og-image-fr.jpg   (FR, used by /fr/*)
 *
 * Both are 1200x630 (1.91:1) — the Open Graph standard, and the ratio LinkedIn
 * uses for link previews and for the "Featured" section (its own spec says
 * 1200x627). One asset therefore covers LinkedIn, X, Slack, WhatsApp, iMessage.
 *
 * Rendered at 2x by headless Chrome then downsampled, so the type stays crisp.
 * No npm dependency: Chrome + macOS `sips` only.
 *
 * Usage: npm run og
 *
 * After deploying, refresh LinkedIn's cache with the Post Inspector
 * (https://www.linkedin.com/post-inspector/) — it caches previews for ~7 days.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Keep in sync with the Hero stats block and data/experiences.json. */
const COMMON = { YEARS_N: '10+', PRODUCTS_N: '18', USERS_N: '170k+', ROLE: 'Lead Tech' };

const LOCALES = {
  en: {
    ...COMMON,
    LANG: 'en',
    YEARS: 'years',
    PRODUCTS: 'products',
    USERS: 'users',
    CURRENT: 'Current role',
    CLIENT: 'Carrefour &amp; Promocash &mdash; French overseas',
    OUT: 'public/og-image.jpg',
  },
  fr: {
    ...COMMON,
    LANG: 'fr',
    YEARS: 'ans',
    PRODUCTS: 'produits',
    USERS: 'utilisateurs',
    CURRENT: 'Poste actuel',
    CLIENT: 'Carrefour &amp; Promocash &mdash; DOM-TOM',
    OUT: 'public/og-image-fr.jpg',
  },
};

const template = readFileSync(join(HERE, 'template.html'), 'utf8');
// Render inside scripts/og-image/ so the template's relative asset paths resolve.
const shots = mkdtempSync(join(tmpdir(), 'og-'));

for (const [lang, vars] of Object.entries(LOCALES)) {
  const html = Object.entries(vars).reduce(
    (acc, [key, val]) => acc.replaceAll(`{{${key}}}`, val),
    template
  );
  const page = join(HERE, `.og-${lang}.tmp.html`);
  const png = join(shots, `og-${lang}.png`);
  const out = join(ROOT, vars.OUT);

  writeFileSync(page, html);
  try {
    execFileSync(CHROME, [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=2',
      '--window-size=1200,630',
      '--default-background-color=ffffff',
      '--virtual-time-budget=4000',
      `--screenshot=${png}`,
      page,
    ], { stdio: 'ignore' });

    // 2400x1260 -> 1200x630, JPEG q90 (~90 KB, well under LinkedIn's 5 MB cap).
    execFileSync('sips', [
      '-s', 'format', 'jpeg',
      '-s', 'formatOptions', '90',
      '-z', '630', '1200',
      png, '--out', out,
    ], { stdio: 'ignore' });
  } finally {
    rmSync(page, { force: true });
  }
  console.log(`✓ ${vars.OUT}  1200x630`);
}

rmSync(shots, { recursive: true, force: true });
