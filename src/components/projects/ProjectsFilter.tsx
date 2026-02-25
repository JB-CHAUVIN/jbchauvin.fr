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
        'inline-flex items-center px-3 py-1 rounded-sm',
        'font-body text-xs uppercase tracking-widest font-medium',
        'transition-all duration-200 cursor-pointer',
        active
          ? 'bg-[#C84B31] text-white'
          : 'bg-white border border-[#E5DDD0] text-[#6B6B6B] hover:border-[#1A1A1A] hover:text-[#1A1A1A]',
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
      className="inline-flex items-center gap-1 font-body text-xs font-medium text-[#6B6B6B] border border-[#E5DDD0] px-2.5 py-1 rounded-sm hover:border-[#C84B31] hover:text-[#C84B31] transition-colors"
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
    <article className="bg-white border border-[#E5DDD0] rounded-sm overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-[0_8px_24px_rgba(26,26,26,0.12)] hover:translate-y-[-2px]">
      {/* Hero image — portrait-safe: fixed height, object-contain */}
      <div
        className="relative bg-[#F0EBE3] cursor-pointer group overflow-hidden"
        style={{ height: '220px' }}
        onClick={() => heroImage && openLightbox(images, 0, content.title)}
      >
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt={content.title}
              className="absolute inset-0 w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/60 text-white font-body text-xs px-2 py-0.5 rounded-sm z-10">
                +{images.length - 1}
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-black/60 text-white rounded-full p-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl font-bold text-[#E5DDD0]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              {content.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm font-body text-xs uppercase tracking-widest font-medium bg-[#F5DDD9] text-[#C84B31]">
            {project.type}
          </span>
          <div className="flex items-center gap-2">
            {project.users === null && (
              <span className="font-body text-xs font-medium uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-[#9B9B9B]/30 text-[#9B9B9B]/70">MVP</span>
            )}
            <span className="font-body text-xs text-[#9B9B9B]">{project.date.slice(0, 4)}</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          {content.title}
        </h2>

        <p className="font-body text-sm text-[#6B6B6B] leading-relaxed mb-3">
          {content.shortDescription}
        </p>

        <p className="font-body text-sm text-[#9B9B9B] leading-relaxed mb-5 flex-1">
          {content.longDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.map((tech) => (
            <span key={tech} className="inline-flex items-center px-2.5 py-0.5 rounded-sm font-body text-xs uppercase tracking-widest font-medium bg-white text-[#9B9B9B] border border-[#E5DDD0]">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD0] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm font-body text-xs uppercase tracking-widest font-medium bg-[#E5DDD0] text-[#6B6B6B]">
              {project.role}
            </span>
            {project.users && (
              <span className="font-body text-xs text-[#9B9B9B]">
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
          <span className="font-body text-xs uppercase tracking-widest text-[#9B9B9B] w-12 shrink-0">{translations.filterType}</span>
          <FilterChip active={!activeType} onClick={() => setActiveType(null)}>{translations.filterAll}</FilterChip>
          {types.map((type) => (
            <FilterChip key={type} active={activeType === type} onClick={() => setActiveType(activeType === type ? null : type)}>{type}</FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-[#9B9B9B] w-12 shrink-0">{translations.filterRole}</span>
          <FilterChip active={!activeRole} onClick={() => setActiveRole(null)}>{translations.filterAll}</FilterChip>
          {roles.map((role) => (
            <FilterChip key={role} active={activeRole === role} onClick={() => setActiveRole(activeRole === role ? null : role)}>{role}</FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-[#9B9B9B] w-12 shrink-0">{translations.filterStack}</span>
          <FilterChip active={!activeStack} onClick={() => setActiveStack(null)}>{translations.filterAll}</FilterChip>
          {stacks.map((stack) => (
            <FilterChip key={stack} active={activeStack === stack} onClick={() => setActiveStack(activeStack === stack ? null : stack)}>{stack}</FilterChip>
          ))}
        </div>
        {hasFilters && (
          <button
            onClick={() => { setActiveType(null); setActiveRole(null); setActiveStack(null); }}
            className="font-body text-xs text-[#C84B31] hover:text-[#A33D27] underline underline-offset-4 transition-colors ml-14"
          >
            {translations.filterReset}
          </button>
        )}
      </div>

      <p className="font-body text-sm text-[#9B9B9B] mb-6">{filtered.length} / {projects.length}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body text-lg text-[#9B9B9B]">{translations.noResults}</p>
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
