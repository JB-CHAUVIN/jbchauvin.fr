import { useState, useMemo } from 'react';

interface ProjectContent {
  title: string;
  shortDescription: string;
  longDescription: string;
}

interface ProjectLinks {
  ios: string | null;
  android: string | null;
  web: string | null;
}

interface Project {
  id: string;
  priority: number;
  date: string;
  type: string;
  role: string;
  users: number | null;
  stack: string[];
  images: string[];
  links: ProjectLinks;
  tags: string[];
  content: { en: ProjectContent; fr: ProjectContent };
}

interface Translations {
  filterAll: string;
  filterReset: string;
  filterType: string;
  filterStack: string;
  filterRole: string;
  usersLabel: string;
  noResults: string;
}

interface Props {
  projects: Project[];
  lang: 'en' | 'fr';
  translations: Translations;
}

function FilterChip({ children, active, onClick }: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'inline-flex items-center px-3 py-1.5 rounded-xl',
        'font-body text-xs uppercase tracking-widest font-medium',
        'transition-all duration-300 cursor-pointer',
        active
          ? 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white shadow-[0_0_15px_rgba(124,58,237,0.2)]'
          : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.35)] hover:border-[rgba(255,255,255,0.15)] hover:text-[rgba(255,255,255,0.6)]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function openLightbox(images: string[], index: number, title: string) {
  window.dispatchEvent(new CustomEvent('open-lightbox', {
    detail: { images, index, projectTitle: title },
  }));
}

function StoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 font-body text-xs font-medium text-[rgba(255,255,255,0.35)] border border-[rgba(255,255,255,0.08)] px-2.5 py-1 rounded-lg hover:border-[#7c3aed] hover:text-[#7c3aed] transition-all duration-300"
    >
      {children}
    </a>
  );
}

function ProjectCardReact({ project, lang, usersLabel }: {
  project: Project;
  lang: 'en' | 'fr';
  usersLabel: string;
}) {
  const content = project.content[lang];
  const images = (project.images ?? []).map((img) => `/images/projects/${img}`);
  const heroImage = images[0] ?? null;

  return (
    <article className="bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-400 hover:border-[rgba(255,255,255,0.12)] hover:translate-y-[-4px] hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(124,58,237,0.1)] group relative">
      {/* Glow line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Hero image */}
      <div
        className="relative cursor-pointer overflow-hidden bg-[#0c0c12]"
        style={{ height: '220px' }}
        onClick={() => heroImage && openLightbox(images, 0, content.title)}
      >
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt={content.title}
              className="absolute inset-0 w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] text-white font-body text-xs px-2 py-0.5 rounded-lg z-10">
                +{images.length - 1}
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-xl text-white rounded-full p-3 border border-[rgba(255,255,255,0.08)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif', background: 'linear-gradient(135deg, #7c3aed, #06b6d4, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {content.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg font-body text-xs uppercase tracking-widest font-medium bg-[rgba(124,58,237,0.15)] text-[#7c3aed] border border-[rgba(124,58,237,0.2)]">
            {project.type}
          </span>
          <div className="flex items-center gap-2">
            {project.users === null && (
              <span className="font-body text-xs font-medium uppercase tracking-widest px-1.5 py-0.5 rounded-md border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)]">MVP</span>
            )}
            <span className="font-body text-xs text-[rgba(255,255,255,0.35)]">{project.date.slice(0, 4)}</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-2" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
          {content.title}
        </h2>

        <p className="font-body text-sm text-[rgba(255,255,255,0.6)] leading-relaxed mb-3">
          {content.shortDescription}
        </p>

        <p className="font-body text-sm text-[rgba(255,255,255,0.35)] leading-relaxed mb-5 flex-1">
          {content.longDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((tech) => (
            <span key={tech} className="inline-flex items-center px-2.5 py-0.5 rounded-lg font-body text-xs uppercase tracking-widest font-medium bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.35)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(124,58,237,0.3)] hover:text-[#7c3aed] transition-all duration-300">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg font-body text-xs uppercase tracking-widest font-medium bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)]">
              {project.role}
            </span>
            {project.users && (
              <span className="font-body text-xs text-[rgba(255,255,255,0.35)]">
                {project.users >= 1000 ? `${Math.round(project.users / 1000)}k` : project.users}+ {usersLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {project.links?.ios && (
              <StoreLink href={project.links.ios}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                iOS
              </StoreLink>
            )}
            {project.links?.android && (
              <StoreLink href={project.links.android}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.463 11.463 0 0 0-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>
                Android
              </StoreLink>
            )}
            {project.links?.web && (
              <StoreLink href={project.links.web}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Web
              </StoreLink>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsFilter({ projects, lang, translations }: Props) {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [activeStack, setActiveStack] = useState<string | null>(null);

  const types = useMemo(() => [...new Set(projects.map((p) => p.type))], [projects]);
  const roles = useMemo(() => [...new Set(projects.map((p) => p.role))], [projects]);
  const stacks = useMemo(() => [...new Set(projects.flatMap((p) => p.stack))].sort(), [projects]);

  const filtered = useMemo(() => projects.filter((p) => {
    if (activeType && p.type !== activeType) return false;
    if (activeRole && p.role !== activeRole) return false;
    if (activeStack && !p.stack.includes(activeStack)) return false;
    return true;
  }), [projects, activeType, activeRole, activeStack]);

  const hasFilters = activeType || activeRole || activeStack;

  return (
    <div>
      <div className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-[rgba(255,255,255,0.35)] w-12 shrink-0">{translations.filterType}</span>
          <FilterChip active={!activeType} onClick={() => setActiveType(null)}>{translations.filterAll}</FilterChip>
          {types.map((type) => (
            <FilterChip key={type} active={activeType === type} onClick={() => setActiveType(activeType === type ? null : type)}>{type}</FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-[rgba(255,255,255,0.35)] w-12 shrink-0">{translations.filterRole}</span>
          <FilterChip active={!activeRole} onClick={() => setActiveRole(null)}>{translations.filterAll}</FilterChip>
          {roles.map((role) => (
            <FilterChip key={role} active={activeRole === role} onClick={() => setActiveRole(activeRole === role ? null : role)}>{role}</FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-[rgba(255,255,255,0.35)] w-12 shrink-0">{translations.filterStack}</span>
          <FilterChip active={!activeStack} onClick={() => setActiveStack(null)}>{translations.filterAll}</FilterChip>
          {stacks.map((stack) => (
            <FilterChip key={stack} active={activeStack === stack} onClick={() => setActiveStack(activeStack === stack ? null : stack)}>{stack}</FilterChip>
          ))}
        </div>
        {hasFilters && (
          <button
            onClick={() => { setActiveType(null); setActiveRole(null); setActiveStack(null); }}
            className="font-body text-xs text-[#7c3aed] hover:text-[#06b6d4] underline underline-offset-4 transition-colors duration-300 ml-14"
          >
            {translations.filterReset}
          </button>
        )}
      </div>

      <p className="font-body text-sm text-[rgba(255,255,255,0.35)] mb-6">{filtered.length} / {projects.length}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body text-lg text-[rgba(255,255,255,0.35)]">{translations.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCardReact key={project.id} project={project} lang={lang} usersLabel={translations.usersLabel} />
          ))}
        </div>
      )}
    </div>
  );
}
