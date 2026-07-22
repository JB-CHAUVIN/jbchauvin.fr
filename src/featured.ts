// Single source of truth for the "active" projects.
// A project is considered ACTIVE if — and only if — its id appears here.
// This is the exact list highlighted on the landing page (LP), in this order,
// and the same list drives the "active first" ordering on the /projects page.
// Keep this as the ONLY place that defines what "active" means (no per-project flag).
export const FEATURED_ORDER = [
  'agentsroom',
  'paris-water-map',
  'paris-toilet-finder',
  'paris-fraicheur',
  'rome-water-map',
];

export const isActiveProject = (id: string) => FEATURED_ORDER.includes(id);
