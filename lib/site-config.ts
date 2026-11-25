import appsCatalog from '@/content/apps/apps.json';

export interface AppProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  logo: string;
  screenshot?: string;
  accentHex: string;
  badge?: string;
  featuredSpotlight?: boolean;
  description: string;
  features: string[];
  note?: string;
  playStoreUrl: string;
  packageId: string;
  privacyPolicyPath?: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  iconKey:
    | 'mobile'
    | 'globe'
    | 'webapp'
    | 'design'
    | 'play'
    | 'cloud'
    | 'support'
    | 'custom';
}

export interface AdvantageItem {
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface FeaturedFileEntry {
  title: string;
  path: string;
  category: string;
  description: string;
}

export interface FaqItem {
  id: string;
  category: 'Mobile Apps' | 'Support & Services';
  question: string;
  answer: string;
  actionLabel?: string;
  actionHref?: string;
  isExternal?: boolean;
}

export const SITE_CONFIG = {
  companyName: 'Rahmani International',
  tagline: 'Apps, Websites & Digital Solutions',
  domain: 'https://rahmaniinternational.in',
  owner: {
    name: 'Anas Rahmani',
    initials: 'AR',
    role: 'Owner — Rahmani International',
    bio: 'Leading Rahmani International with a focus on building useful digital products, Android applications, and responsive websites designed for everyday users.',
  },
  // Centralized Logo Configuration:
  // Replace public/brand/logo.png in GitHub and push to automatically update the logo across Header, Hero, About, Footer, and Mobile Navigation on Vercel.
  logo: {
    primaryPath: '/brand/logo.png',
    fallbackPath: '/brand/logo.svg',
    legacyExternalUrl: 'https://imagizer.imageshack.com/img924/3142/v0S0Te.png',
    supportedFormats: ['PNG', 'SVG', 'WebP', 'JPG'],
    githubReplacePath: 'public/brand/logo.png',
    alt: 'Rahmani International company logo',
  },
  contact: {
    email: 'info@rahmaniinternational.in',
    googleMapsUrl: 'https://share.google/x2X20o3J3VwvffOEo',
    instagramUrl: 'https://www.instagram.com/xanas_rahmani?igsi=c2RsNm5vM3M1ZWVh',
    whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vayr0gA5Ui2f8QjMYl39',
    googlePlayDeveloperUrl:
      'https://play.google.com/store/apps/dev?id=5231589266899006682',
    googleGroupUrl: 'https://groups.google.com/u/1/g/anasrahmani',
  },
  seo: {
    title: 'Rahmani International | Apps, Websites & Digital Solutions',
    description:
      'Rahmani International develops, publishes, and supports mobile apps, websites, and digital products built for everyday users.',
    ogImage: 'https://imagizer.imageshack.com/img924/3142/v0S0Te.png',
  },
} as const;

export const APPS_PORTFOLIO: AppProduct[] = appsCatalog as AppProduct[];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'mobile',
    number: '01',
    title: 'Mobile App Development',
    description:
      'Android applications built with practical features and clean, usable interfaces.',
    iconKey: 'mobile',
  },
  {
    id: 'website',
    number: '02',
    title: 'Website Development',
    description:
      'Responsive, fast-loading websites that work reliably across every screen size.',
    iconKey: 'globe',
  },
  {
    id: 'webapp',
    number: '03',
    title: 'Web App Development',
    description:
      'Interactive web applications with structured functionality and clear user flows.',
    iconKey: 'webapp',
  },
  {
    id: 'uiux',
    number: '04',
    title: 'UI/UX Design',
    description:
      'Interface and experience design focused on clarity, hierarchy, and ease of use.',
    iconKey: 'design',
  },
  {
    id: 'app-publishing',
    number: '05',
    title: 'App Publishing',
    description:
      'Preparing, packaging, policy verification, and publishing applications to Google Play.',
    iconKey: 'play',
  },
  {
    id: 'web-publishing',
    number: '06',
    title: 'Website Publishing',
    description:
      'Deployment, HTTPS configuration, and domain setup on modern hosting environments.',
    iconKey: 'cloud',
  },
  {
    id: 'support',
    number: '07',
    title: 'Technical Support',
    description:
      'Post-launch assistance, updates, and ongoing maintenance for released products.',
    iconKey: 'support',
  },
  {
    id: 'custom',
    number: '08',
    title: 'Custom Digital Solutions',
    description:
      'Tailored digital tools and utilities built around specific everyday requirements.',
    iconKey: 'custom',
  },
];

export const ADVANTAGES_LIST: AdvantageItem[] = [
  {
    title: 'Modern Technology',
    description:
      'Current web and mobile technologies applied in a practical, maintainable way.',
  },
  {
    title: 'User-Focused Design',
    description: 'Interfaces designed around real everyday usage patterns.',
  },
  {
    title: 'Practical Digital Products',
    description: 'Tools built to solve genuine, day-to-day problems cleanly.',
  },
  {
    title: 'Responsive Experiences',
    description: 'Consistent layouts across phones, tablets, and desktops.',
  },
  {
    title: 'Quality-Focused Development',
    description:
      'Careful implementation with attention to detail, accessibility, and stability.',
  },
  {
    title: 'Publishing Support',
    description:
      'Guidance and handling of app store listings, policies, and website releases.',
  },
  {
    title: 'Technical Support',
    description: 'Ongoing help after launch, not just at initial delivery.',
  },
  {
    title: 'Continuous Improvement',
    description: 'Products refined and updated steadily over their lifecycle.',
  },
];

export const TECH_CAPABILITIES: string[] = [
  'Next.js & TypeScript',
  'HTML5 & CSS3',
  'JavaScript',
  'Responsive Web',
  'Android Apps',
  'Web Applications',
  'UI/UX Architecture',
  'Google Play Publishing',
  'Vercel Deployment',
];

export const PROCESS_STEPS: ProcessStep[] = [
  { number: '01', title: 'Discover', description: 'Understand requirements and user needs.' },
  { number: '02', title: 'Plan', description: 'Define functionality, architecture, and structure.' },
  { number: '03', title: 'Design', description: 'Create clean user interfaces and accessible flows.' },
  { number: '04', title: 'Develop', description: 'Build the mobile application or web platform.' },
  { number: '05', title: 'Test', description: 'Verify responsiveness, stability, and edge cases.' },
  { number: '06', title: 'Publish', description: 'Deploy to Vercel or release on Google Play.' },
  { number: '07', title: 'Support', description: 'Provide post-launch technical support and updates.' },
];

export const SOCIAL_CHANNELS = [
  {
    name: 'Google Play Developer',
    description: 'Browse all published Android applications in one official catalog.',
    url: SITE_CONFIG.contact.googlePlayDeveloperUrl,
    key: 'play' as const,
  },
  {
    name: 'Instagram',
    description: 'Product updates, release previews, and company announcements.',
    url: SITE_CONFIG.contact.instagramUrl,
    key: 'instagram' as const,
  },
  {
    name: 'WhatsApp Channel',
    description: 'Direct release notes and new app launch alerts.',
    url: SITE_CONFIG.contact.whatsappChannelUrl,
    key: 'whatsapp' as const,
  },
  {
    name: 'Google Group',
    description: 'Community discussions, testing updates, and support topics.',
    url: SITE_CONFIG.contact.googleGroupUrl,
    key: 'group' as const,
  },
];

export const FEATURED_PUBLIC_FILES: Record<
  string,
  Omit<FeaturedFileEntry, 'path'>
> = {
  '/files/app-info.txt': {
    title: 'Published Apps Directory (Plain Text)',
    category: 'App Information',
    description:
      'Plain-text summary of Rahmani International applications, package IDs, and support contact.',
  },
  '/files/app-config.json': {
    title: 'Public App Registry JSON',
    category: 'Developer Metadata',
    description:
      'Machine-readable JSON manifest of published Android apps and their public policy endpoints.',
  },
  '/files/developer-guide.html': {
    title: 'GitHub & Vercel Maintenance Guide',
    category: 'Documentation',
    description:
      'Standalone HTML reference for updating the logo, privacy policies, and public assets via GitHub.',
  },
};

export const COMPANY_OVERVIEW_ITEMS = [
  'App Development',
  'Website Development',
  'Google Play Publishing',
  'Digital Tools & Utilities',
  'Product Development',
  'Ongoing Technical Support',
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'official-downloads',
    category: 'Mobile Apps',
    question:
      'Where can I officially download Rahmani International mobile applications?',
    answer:
      'All official Android applications from Rahmani International—including Multi Tool App, SwarX, WA Direct Chat, Sarkari Yojana Calculator, and Booyah Challenge—are published on our verified Google Play Developer profile. Always download from Google Play to ensure you receive authentic releases and updates.',
    actionLabel: 'Open Google Play Developer Profile',
    actionHref: SITE_CONFIG.contact.googlePlayDeveloperUrl,
    isExternal: true,
  },
  {
    id: 'multi-tool-features',
    category: 'Mobile Apps',
    question: 'Which everyday utilities are included inside Multi Tool App?',
    answer:
      'Multi Tool App combines 10+ practical everyday utilities in a single lightweight Android app: QR Code Generator, Image to PDF converter, Internet Speed Test, Calculator, Unit Converter, Image Compressor, Secure Notes, Word Counter, Percentage Calculator, and Stopwatch.',
    actionLabel: 'View Multi Tool App on Google Play',
    actionHref:
      'https://play.google.com/store/apps/details?id=com.app.qrgeneratoranas',
    isExternal: true,
  },
  {
    id: 'swarx-playback',
    category: 'Mobile Apps',
    question: 'Does SwarX support both online and offline music listening?',
    answer:
      'Yes. SwarX is built to deliver a feature-rich music listening experience for both online music streaming and offline playback, paired with a modern audio player and organized music library.',
    actionLabel: 'Explore SwarX on Google Play',
    actionHref: 'https://play.google.com/store/apps/details?id=com.musicxanas',
    isExternal: true,
  },
  {
    id: 'app-disclaimers',
    category: 'Mobile Apps',
    question:
      'Is WA Direct Chat affiliated with WhatsApp, or is Sarkari Yojana Calculator an official government app?',
    answer:
      'No. WA Direct Chat is an independent messaging utility app and is not affiliated with, endorsed by, or associated with WhatsApp. Similarly, Sarkari Yojana Calculator is an independent informational calculator for estimating returns on savings schemes such as PPF, FD, RD, SSY, and SCSS—it is not affiliated with any government organization, and all calculation results are estimates that should be independently verified.',
  },
  {
    id: 'booyah-tournaments',
    category: 'Mobile Apps',
    question: 'How do tournaments and rewards work in Booyah Challenge?',
    answer:
      'Booyah Challenge is a tournament-focused competitive gaming platform featuring match-based challenges. Users can participate in eligible tournaments and compete for available rewards; please note that the availability of specific tournaments and rewards may vary over time.',
    actionLabel: 'View Booyah Challenge on Google Play',
    actionHref: 'https://play.google.com/store/apps/details?id=anasbooyah.com',
    isExternal: true,
  },
  {
    id: 'support-and-feedback',
    category: 'Support & Services',
    question:
      'How do I report an app issue, request technical support, or follow new updates?',
    answer:
      'For direct app support, bug reports, or general inquiries, email us at info@rahmaniinternational.in or use the Contact section below. You can also join our official WhatsApp Channel and Google Group for release updates, testing announcements, and community discussions.',
    actionLabel: 'Go to Contact & Support',
    actionHref: '#contact',
    isExternal: false,
  },
  {
    id: 'custom-development',
    category: 'Support & Services',
    question:
      'Does Rahmani International offer custom mobile app and website development?',
    answer:
      'Yes. Led by Anas Rahmani, Rahmani International provides Android app development, responsive website and web app development, UI/UX design, Google Play and website publishing support, and ongoing post-launch technical maintenance.',
    actionLabel: 'Send a Project Inquiry',
    actionHref: '#contact',
    isExternal: false,
  },
];

export function isSafeExternalUrl(url: string): boolean {
  return /^(https:\/\/|mailto:)/i.test(url);
}
