// Single source of truth for the "active" projects.
// A project is considered ACTIVE if — and only if — its id appears here.
// This is the exact list highlighted on the landing page (LP), in this order,
// and the same list drives the "active first" ordering on the /projects page.
// Keep this as the ONLY place that defines what "active" means (no per-project flag).
export const FEATURED_ORDER = [
  // 'agentsroom', // masqué volontairement (cf. HIDDEN_PROJECTS) — décommenter pour le remettre en tête
  'paris-water-map',
  'paris-toilet-finder',
  'paris-fraicheur',
  'rome-water-map',
];

export const isActiveProject = (id: string) => FEATURED_ORDER.includes(id);

// Projets volontairement masqués du site public.
// Leur JSON reste dans data/projects/ (rien n'est supprimé) : ils sont simplement
// filtrés partout où les projets sont chargés (landing + /projects + /fr/projets).
// Pour en réafficher un : retirer son id d'ici (et le remettre dans FEATURED_ORDER
// s'il doit aussi être mis en avant sur la landing page).
export const HIDDEN_PROJECTS = ['agentsroom'];

export const isHiddenProject = (id: string) => HIDDEN_PROJECTS.includes(id);

/** Retire les projets masqués d'une liste chargée depuis data/projects/*.json. */
export const filterVisible = <T extends { id: string }>(projects: T[]): T[] =>
  projects.filter((p) => !isHiddenProject(p.id));
