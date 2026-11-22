import fs from 'node:fs/promises';
import path from 'node:path';
import { FEATURED_PUBLIC_FILES } from './site-config';

export interface DiscoveredPublicFile {
  name: string;
  relativePath: string;
  publicUrl: string;
  folder: string;
  extension: string;
  sizeBytes: number;
  sizeLabel: string;
  title: string;
  category: string;
  description: string;
}

const PUBLIC_ROOT = path.join(process.cwd(), 'public');

const ALLOWED_EXTENSIONS = new Set([
  '.html',
  '.htm',
  '.txt',
  '.json',
  '.pdf',
  '.xml',
  '.md',
  '.csv',
  '.png',
  '.svg',
  '.webp',
  '.jpg',
  '.jpeg',
]);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function humanizeSlug(slug: string): string {
  return slug
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function scanDirectoryRecursive(
  dirPath: string,
  baseSegment: string
): Promise<DiscoveredPublicFile[]> {
  const results: DiscoveredPublicFile[] = [];

  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.toLowerCase().includes('.env')) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    const resolved = path.resolve(fullPath);
    if (!resolved.startsWith(path.resolve(PUBLIC_ROOT))) {
      continue;
    }

    if (entry.isDirectory()) {
      const nested = await scanDirectoryRecursive(fullPath, baseSegment);
      results.push(...nested);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        continue;
      }

      const stat = await fs.stat(fullPath);
      const relFromPublic = path
        .relative(PUBLIC_ROOT, fullPath)
        .split(path.sep)
        .join('/');
      const publicUrl = `/${relFromPublic}`;
      const folderParts = relFromPublic.split('/');
      const folder =
        folderParts.length > 2
          ? folderParts.slice(1, -1).join('/')
          : baseSegment;

      const curated = FEATURED_PUBLIC_FILES[publicUrl];
      const defaultTitle =
        entry.name.toLowerCase() === 'index.html' && folder !== baseSegment
          ? `${humanizeSlug(folder)} Privacy Policy`
          : humanizeSlug(entry.name);

      results.push({
        name: entry.name,
        relativePath: `public/${relFromPublic}`,
        publicUrl,
        folder,
        extension: ext.replace('.', '').toUpperCase(),
        sizeBytes: stat.size,
        sizeLabel: formatBytes(stat.size),
        title: curated?.title ?? defaultTitle,
        category:
          curated?.category ??
          (baseSegment === 'privacy-policy'
            ? ext === '.txt'
              ? 'Plain Text Policy'
              : 'HTML Policy Page'
            : `${ext.replace('.', '').toUpperCase()} Resource`),
        description:
          curated?.description ??
          `Publicly hosted file at ${publicUrl}, served directly from GitHub via Vercel.`,
      });
    }
  }

  return results.sort((a, b) => a.publicUrl.localeCompare(b.publicUrl));
}

export async function getDiscoveredPrivacyPolicies(): Promise<
  DiscoveredPublicFile[]
> {
  return scanDirectoryRecursive(
    path.join(PUBLIC_ROOT, 'privacy-policy'),
    'privacy-policy'
  );
}

export async function getDiscoveredPublicFiles(): Promise<
  DiscoveredPublicFile[]
> {
  return scanDirectoryRecursive(path.join(PUBLIC_ROOT, 'files'), 'files');
}

export async function checkCustomLogoExists(): Promise<{
  hasCustomPng: boolean;
  detectedFile: string | null;
}> {
  const brandDir = path.join(PUBLIC_ROOT, 'brand');
  const candidates = ['logo.png', 'logo.webp', 'logo.jpg', 'logo.svg'];
  try {
    const files = await fs.readdir(brandDir);
    const hasCustomPng = files.includes('logo.png');
    const found = candidates.find((c) => files.includes(c)) ?? null;
    return { hasCustomPng, detectedFile: found ? `/brand/${found}` : null };
  } catch {
    return { hasCustomPng: false, detectedFile: null };
  }
}
