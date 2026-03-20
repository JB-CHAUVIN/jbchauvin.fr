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
        'font-[MS_Sans_Serif,Geneva,sans-serif] text-[11px] uppercase px-2 py-1 cursor-pointer',
        'border-2 border-solid transition-[filter] duration-150',
        active
          ? 'bg-[#000080] text-white'
          : 'bg-[#C0C0C0] text-black hover:brightness-105',
      ].join(' ')}
      style={{
        borderColor: active
          ? '#4040FF #000040 #000040 #4040FF'
          : '#FFFFFF #808080 #808080 #FFFFFF',
      }}
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

function ProjectCardReact({ project, lang, usersLabel }: {
  project: Project;
  lang: 'en' | 'fr';
  usersLabel: string;
}) {
  const content = project.content[lang];
  const images = (project.images ?? []).map((img) => `/images/projects/${img}`);
  const heroImage = images[0] ?? null;

  return (
    <tr
      className="hover:bg-[#E0E0FF]"
      style={{ transition: 'background 0.2s ease' }}
    >
      {/* Preview */}
      <td
        style={{
          width: '70px',
          padding: '6px 12px',
          border: '1px solid #808080',
          textAlign: 'center',
          verticalAlign: 'top',
        }}
      >
        {heroImage ? (
          <div
            className="inline-block cursor-pointer"
            style={{
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
            }}
            onClick={() => openLightbox(images, 0, content.title)}
          >
            <img
              src={heroImage}
              alt={content.title}
              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              loading="lazy"
            />
          </div>
        ) : (
          <div
            style={{
              width: '50px',
              height: '50px',
              background: '#000080',
              color: '#FFFF00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Comic Sans MS, cursive',
              fontSize: '20px',
              border: '2px solid',
              borderColor: '#808080 #FFFFFF #FFFFFF #808080',
              margin: '0 auto',
            }}
          >
            {content.title.charAt(0)}
          </div>
        )}
      </td>

      {/* Project info */}
      <td style={{ padding: '6px 12px', border: '1px solid #808080', verticalAlign: 'top' }}>
        <div
          style={{
            fontFamily: 'Comic Sans MS, cursive',
            fontSize: '13px',
            color: '#000080',
            fontWeight: 'bold',
          }}
        >
          {content.title}
        </div>
        <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '12px', color: '#333', marginTop: '2px' }}>
          {content.shortDescription}
        </div>
        <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '11px', color: '#666', marginTop: '2px' }}>
          {content.longDescription}
        </div>
        <div style={{ marginTop: '4px' }}>
          <span
            className="retro-tag-accent"
            style={{
              display: 'inline-block',
              fontFamily: 'MS Sans Serif, Geneva, sans-serif',
              fontSize: '10px',
              padding: '1px 6px',
              background: '#000080',
              color: '#FFF',
              border: '1px solid',
              borderColor: '#4040FF #000040 #000040 #4040FF',
              textTransform: 'uppercase',
              marginRight: '4px',
            }}
          >
            {project.type}
          </span>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'MS Sans Serif, Geneva, sans-serif',
              fontSize: '10px',
              padding: '1px 6px',
              background: '#C0C0C0',
              border: '1px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              textTransform: 'uppercase',
              marginRight: '4px',
            }}
          >
            {project.role}
          </span>
          {project.users !== null && (
            <span style={{ fontFamily: 'MS Sans Serif, Geneva, sans-serif', fontSize: '10px', color: '#666' }}>
              {project.users >= 1000 ? `${Math.round(project.users / 1000)}k` : project.users}+ {usersLabel}
            </span>
          )}
          {project.users === null && (
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'MS Sans Serif, Geneva, sans-serif',
                fontSize: '10px',
                padding: '1px 6px',
                background: '#FFFF00',
                border: '1px solid #FF6600',
                textTransform: 'uppercase',
              }}
            >
              MVP
            </span>
          )}
        </div>
      </td>

      {/* Stack */}
      <td
        className="hidden md:table-cell"
        style={{ padding: '6px 12px', border: '1px solid #808080', verticalAlign: 'top' }}
      >
        {project.stack.map((tech) => (
          <span
            key={tech}
            style={{
              display: 'inline-block',
              fontFamily: 'MS Sans Serif, Geneva, sans-serif',
              fontSize: '10px',
              padding: '1px 6px',
              background: '#C0C0C0',
              border: '1px solid',
              borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
              textTransform: 'uppercase',
              marginRight: '2px',
              marginBottom: '2px',
            }}
          >
            {tech}
          </span>
        ))}
      </td>

      {/* Year */}
      <td
        className="hidden md:table-cell"
        style={{
          padding: '6px 12px',
          border: '1px solid #808080',
          fontFamily: 'Courier New, monospace',
          fontSize: '12px',
          textAlign: 'center',
          verticalAlign: 'top',
        }}
      >
        {project.date.slice(0, 4)}
      </td>

      {/* Links */}
      <td
        className="hidden md:table-cell"
        style={{
          padding: '6px 12px',
          border: '1px solid #808080',
          textAlign: 'center',
          verticalAlign: 'top',
          fontFamily: 'MS Sans Serif, Geneva, sans-serif',
          fontSize: '11px',
        }}
      >
        {project.links?.ios && (
          <a
            href={project.links.ios}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'block', color: '#0000FF' }}
          >
            iOS
          </a>
        )}
        {project.links?.android && (
          <a
            href={project.links.android}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'block', color: '#0000FF' }}
          >
            Android
          </a>
        )}
        {project.links?.web && (
          <a
            href={project.links.web}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'block', color: '#0000FF' }}
          >
            Web
          </a>
        )}
        {!project.links?.ios && !project.links?.android && !project.links?.web && (
          <span style={{ color: '#808080' }}>—</span>
        )}
      </td>
    </tr>
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
      {/* Filters in a retro panel */}
      <div
        style={{
          background: '#C0C0C0',
          border: '2px solid',
          borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
          padding: '8px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(90deg, #000080, #1084d0)',
            color: '#FFFFFF',
            fontFamily: 'MS Sans Serif, Geneva, sans-serif',
            fontWeight: 'bold',
            fontSize: '11px',
            padding: '2px 6px',
            marginBottom: '8px',
          }}
        >
          {lang === 'en' ? '🔍 Filters' : '🔍 Filtres'}
        </div>

        <div style={{ marginBottom: '6px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: 'MS Sans Serif, Geneva, sans-serif', fontSize: '11px', color: '#666', width: '40px' }}>
            {translations.filterType}
          </span>
          <FilterChip active={!activeType} onClick={() => setActiveType(null)}>{translations.filterAll}</FilterChip>
          {types.map((type) => (
            <FilterChip key={type} active={activeType === type} onClick={() => setActiveType(activeType === type ? null : type)}>{type}</FilterChip>
          ))}
        </div>

        <div style={{ marginBottom: '6px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: 'MS Sans Serif, Geneva, sans-serif', fontSize: '11px', color: '#666', width: '40px' }}>
            {translations.filterRole}
          </span>
          <FilterChip active={!activeRole} onClick={() => setActiveRole(null)}>{translations.filterAll}</FilterChip>
          {roles.map((role) => (
            <FilterChip key={role} active={activeRole === role} onClick={() => setActiveRole(activeRole === role ? null : role)}>{role}</FilterChip>
          ))}
        </div>

        <div style={{ marginBottom: '6px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: 'MS Sans Serif, Geneva, sans-serif', fontSize: '11px', color: '#666', width: '40px' }}>
            {translations.filterStack}
          </span>
          <FilterChip active={!activeStack} onClick={() => setActiveStack(null)}>{translations.filterAll}</FilterChip>
          {stacks.map((stack) => (
            <FilterChip key={stack} active={activeStack === stack} onClick={() => setActiveStack(activeStack === stack ? null : stack)}>{stack}</FilterChip>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={() => { setActiveType(null); setActiveRole(null); setActiveStack(null); }}
            style={{
              fontFamily: 'MS Sans Serif, Geneva, sans-serif',
              fontSize: '11px',
              color: '#0000FF',
              background: 'none',
              border: 'none',
              textDecoration: 'underline',
              cursor: 'pointer',
              marginLeft: '44px',
            }}
          >
            {translations.filterReset}
          </button>
        )}
      </div>

      {/* Result count */}
      <div style={{
        fontFamily: 'MS Sans Serif, Geneva, sans-serif',
        fontSize: '11px',
        color: '#666',
        marginBottom: '8px',
        borderBottom: '1px solid #808080',
        paddingBottom: '4px',
      }}>
        {filtered.length} / {projects.length} {lang === 'en' ? 'projects' : 'projets'}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Comic Sans MS, cursive', color: '#808080' }}>
          {translations.noResults}
        </div>
      ) : (
        <table
          cellPadding={0}
          cellSpacing={0}
          style={{
            borderCollapse: 'collapse',
            border: '2px solid',
            borderColor: '#FFFFFF #808080 #808080 #FFFFFF',
            background: '#C0C0C0',
            width: '100%',
          }}
        >
          <thead>
            <tr>
              <th style={{
                background: '#000080', color: '#FFFFFF',
                fontFamily: 'Comic Sans MS, cursive', fontSize: '12px',
                padding: '6px 12px', border: '1px solid #404040', textAlign: 'left',
              }}>
                {lang === 'en' ? 'Preview' : 'Aperçu'}
              </th>
              <th style={{
                background: '#000080', color: '#FFFFFF',
                fontFamily: 'Comic Sans MS, cursive', fontSize: '12px',
                padding: '6px 12px', border: '1px solid #404040', textAlign: 'left',
              }}>
                {lang === 'en' ? 'Project' : 'Projet'}
              </th>
              <th
                className="hidden md:table-cell"
                style={{
                  background: '#000080', color: '#FFFFFF',
                  fontFamily: 'Comic Sans MS, cursive', fontSize: '12px',
                  padding: '6px 12px', border: '1px solid #404040', textAlign: 'left',
                }}
              >
                Stack
              </th>
              <th
                className="hidden md:table-cell"
                style={{
                  background: '#000080', color: '#FFFFFF',
                  fontFamily: 'Comic Sans MS, cursive', fontSize: '12px',
                  padding: '6px 12px', border: '1px solid #404040', textAlign: 'left',
                }}
              >
                {lang === 'en' ? 'Year' : 'Année'}
              </th>
              <th
                className="hidden md:table-cell"
                style={{
                  background: '#000080', color: '#FFFFFF',
                  fontFamily: 'Comic Sans MS, cursive', fontSize: '12px',
                  padding: '6px 12px', border: '1px solid #404040', textAlign: 'left',
                }}
              >
                {lang === 'en' ? 'Links' : 'Liens'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <ProjectCardReact key={project.id} project={project} lang={lang} usersLabel={translations.usersLabel} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
