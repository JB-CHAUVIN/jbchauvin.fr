export const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.projects': 'Projects',
  'nav.references': 'References',
  'nav.contact': 'Contact',
  'nav.lang': 'FR',
  'nav.lang.switch': 'Switch to French',

  // Hero
  'hero.title': 'Jean-Baptiste Chauvin',
  'hero.subtitle': 'Engineering Manager · hands-on',
  'hero.tagline': '33 yo.',
  'hero.description': '<strong>React Native</strong> & <strong>React</strong> specialist with <strong>10+ years</strong> of production experience — from solo freelancer to <strong>Engineering Manager</strong> leading a 10-person team at Cegedim Santé. Deep technical expertise (React Native, React, TypeScript, Node.js, PHP, AWS) paired with solid product sense and strong <strong>human leadership</strong>. Delivered apps used by <strong>170k+ users</strong> in healthcare, civic, and mobility sectors. <strong>13 projects</strong> shipped independently.' ,
  'hero.cta.projects': 'View my work',
  'hero.cta.contact': 'Get in touch',
  'hero.available': 'Open to opportunities',

  // Selected Projects
  'section.projects.title': 'Selected Projects',
  'section.projects.subtitle': 'A selection of products I built or led.',
  'section.projects.cta': 'See all projects',

  // Career
  'section.career.title': 'Career',
  'section.career.subtitle': 'My professional journey.',
  'common.present': 'Present',
  'common.now': 'now',

  // Skills
  'section.skills.title': 'Skills',
  'section.skills.subtitle': 'Technologies and practices I work with.',

  // References Preview
  'section.references.title': 'References',
  'section.references.subtitle': 'From companies I\'ve worked with.',
  'section.references.cta': 'See all references',

  // Contact
  'section.contact.title': 'Let\'s talk',
  'section.contact.description': 'Looking for a senior mobile developer or engineering manager? I\'m open to new opportunities.',
  'section.contact.email': 'Send an email',
  'section.contact.linkedin': 'Connect on LinkedIn',

  // Projects page
  'projects.title': 'Projects',
  'projects.subtitle': 'Mobile apps, APIs, and products I\'ve built.',
  'projects.filter.all': 'All',
  'projects.filter.type': 'Type',
  'projects.filter.stack': 'Stack',
  'projects.filter.role': 'Role',
  'projects.filter.reset': 'Reset filters',
  'projects.role.founder': 'Founder',
  'projects.role.lead-dev': 'Lead Dev',
  'projects.role.contributor': 'Contributor',
  'projects.type.mobile': 'Mobile',
  'projects.type.api': 'API',
  'projects.type.web': 'Web',
  'projects.users': 'users',
  'projects.links.ios': 'App Store',
  'projects.links.android': 'Play Store',
  'projects.links.web': 'Website',

  // References page
  'references.title': 'References',
  'references.subtitle': 'Companies and teams I\'ve worked with.',

  // Footer
  'footer.built': 'Built with Astro',
  'footer.rights': '© 2026 Jean-Baptiste Chauvin',

  // Common
  'common.read-more': 'Read more',
  'common.back': 'Back',
  'common.skills': 'Skills',
  'common.period': 'Period',
  'common.role': 'Role',
  'common.stack': 'Stack',
} as const;

export type TranslationKey = keyof typeof en;
