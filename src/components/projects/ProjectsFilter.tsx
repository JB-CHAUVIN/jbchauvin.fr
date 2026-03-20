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

function openLightbox(images: string[], index: number, title: string) {
  window.dispatchEvent(new CustomEvent('open-lightbox', {
    detail: { images, index, projectTitle: title },
  }));
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'inherit',
        fontSize: '11px',
        padding: '2px 10px',
        borderRadius: '2px',
        border: '1px solid',
        borderColor: active ? '#111827' : '#d1d5db',
        background: active ? '#111827' : '#ffffff',
        color: active ? '#ffffff' : '#6b7280',
        cursor: 'pointer',
        transition: 'all 0.1s',
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </button>
  );
}

function ProjectRow({
  project,
  lang,
  usersLabel,
}: {
  project: Project;
  lang: 'en' | 'fr';
  usersLabel: string;
}) {
  const content = project.content[lang];
  const images = (project.images ?? []).map((img) => `/images/projects/${img}`);
  const heroImage = images[0] ?? null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '88px 1fr',
        columnGap: '1.5rem',
        padding: '0.875rem 0',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      {/* Date & type */}
      <div style={{ fontSize: '0.72rem', color: '#9ca3af', lineHeight: '1.55rem', paddingTop: '1px' }}>
        <div style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {project.date.slice(0, 4)}
        </div>
        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>{project.type}</div>
        {heroImage && (
          <div
            style={{ marginTop: '8px', cursor: 'pointer' }}
            onClick={() => openLightbox(images, 0, content.title)}
          >
            <img
              src={heroImage}
              alt={content.title}
              style={{
                width: '44px',
                height: '44px',
                objectFit: 'contain',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                display: 'block',
              }}
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
          <span style={{ fontWeight: 600, fontSize: '13px', color: '#111827' }}>{content.title}</span>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>{project.role}</span>
          {project.users !== null && (
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>
              · {project.users >= 1000 ? `${Math.round(project.users / 1000)}k` : project.users}+ {usersLabel}
            </span>
          )}
          {project.users === null && (
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>· MVP</span>
          )}
        </div>

        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: 0, marginBottom: '8px', lineHeight: '1.5' }}>
          {content.shortDescription}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
          {project.stack.map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: '10px',
                background: '#f3f4f6',
                color: '#6b7280',
                padding: '1px 6px',
                borderRadius: '2px',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {project.links?.ios && (
            <a
              href={project.links.ios}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '11px', color: '#2563eb', textDecoration: 'none' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = 'underline')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = 'none')}
            >
              App Store ↗
            </a>
          )}
          {project.links?.android && (
            <a
              href={project.links.android}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '11px', color: '#2563eb', textDecoration: 'none' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = 'underline')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = 'none')}
            >
              Play Store ↗
            </a>
          )}
          {project.links?.web && (
            <a
              href={project.links.web}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '11px', color: '#2563eb', textDecoration: 'none' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = 'underline')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = 'none')}
            >
              {lang === 'en' ? 'Website' : 'Site web'} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsFilter({ projects, lang, translations }: Props) {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [activeStack, setActiveStack] = useState<string | null>(null);

  const types = useMemo(() => [...new Set(projects.map((p) => p.type))], [projects]);
  const roles = useMemo(() => [...new Set(projects.map((p) => p.role))], [projects]);
  const stacks = useMemo(() => [...new Set(projects.flatMap((p) => p.stack))].sort(), [projects]);

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (activeType && p.type !== activeType) return false;
        if (activeRole && p.role !== activeRole) return false;
        if (activeStack && !p.stack.includes(activeStack)) return false;
        return true;
      }),
    [projects, activeType, activeRole, activeStack]
  );

  const hasFilters = activeType || activeRole || activeStack;

  return (
    <div>
      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        {/* Type filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', minWidth: '36px' }}>
            {translations.filterType}
          </span>
          <FilterPill active={!activeType} onClick={() => setActiveType(null)}>
            {translations.filterAll}
          </FilterPill>
          {types.map((type) => (
            <FilterPill
              key={type}
              active={activeType === type}
              onClick={() => setActiveType(activeType === type ? null : type)}
            >
              {type}
            </FilterPill>
          ))}
        </div>

        {/* Role filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', minWidth: '36px' }}>
            {translations.filterRole}
          </span>
          <FilterPill active={!activeRole} onClick={() => setActiveRole(null)}>
            {translations.filterAll}
          </FilterPill>
          {roles.map((role) => (
            <FilterPill
              key={role}
              active={activeRole === role}
              onClick={() => setActiveRole(activeRole === role ? null : role)}
            >
              {role}
            </FilterPill>
          ))}
        </div>

        {/* Stack filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', minWidth: '36px' }}>
            {translations.filterStack}
          </span>
          <FilterPill active={!activeStack} onClick={() => setActiveStack(null)}>
            {translations.filterAll}
          </FilterPill>
          {stacks.map((stack) => (
            <FilterPill
              key={stack}
              active={activeStack === stack}
              onClick={() => setActiveStack(activeStack === stack ? null : stack)}
            >
              {stack}
            </FilterPill>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={() => {
              setActiveType(null);
              setActiveRole(null);
              setActiveStack(null);
            }}
            style={{
              fontFamily: 'inherit',
              fontSize: '11px',
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {translations.filterReset}
          </button>
        )}
      </div>

      {/* Count */}
      <div
        style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginBottom: '8px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '8px',
        }}
      >
        {filtered.length} / {projects.length} {lang === 'en' ? 'projects' : 'projets'}
      </div>

      {/* Project list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '14px', color: '#9ca3af' }}>
          {translations.noResults}
        </div>
      ) : (
        <div>
          {filtered.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              lang={lang}
              usersLabel={translations.usersLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
