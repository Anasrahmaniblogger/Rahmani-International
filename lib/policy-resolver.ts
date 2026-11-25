import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const PUBLIC_ROOT = path.resolve(process.cwd(), 'public');

const MIME_BY_EXT: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function isValidSegment(segment: string): boolean {
  if (!segment || segment.length > 200) return false;
  if (segment.startsWith('.')) return false;
  if (
    segment.includes('..') ||
    segment.includes('/') ||
    segment.includes('\\') ||
    segment.includes('\0')
  ) {
    return false;
  }
  return true;
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[+\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function compactSlug(value: string): string {
  return value.toLowerCase().replace(/[+\s_-]+/g, '');
}

function isInsideRoot(candidate: string, root: string): boolean {
  const normalizedRoot = path.resolve(root);
  const normalizedCandidate = path.resolve(candidate);
  return (
    normalizedCandidate === normalizedRoot ||
    normalizedCandidate.startsWith(`${normalizedRoot}${path.sep}`)
  );
}

function findMatchingEntry(entries: string[], segment: string): string | undefined {
  const visible = entries.filter((entry) => !entry.startsWith('.'));

  // 1. Exact match
  const exact = visible.find((entry) => entry === segment);
  if (exact) return exact;

  // 2. Case-insensitive match (e.g., "swarx" -> "SwarX")
  const lowerSegment = segment.toLowerCase();
  const caseInsensitive = visible.find(
    (entry) => entry.toLowerCase() === lowerSegment
  );
  if (caseInsensitive) return caseInsensitive;

  // 3. Space / hyphen / underscore / plus normalized match
  //    (e.g., "booyah-challenge" or "Booyah+Challenge" -> "Booyah Challenge")
  const normalizedSegment = normalizeSlug(segment);
  if (normalizedSegment) {
    const normalizedMatch = visible.find(
      (entry) => normalizeSlug(entry) === normalizedSegment
    );
    if (normalizedMatch) return normalizedMatch;
  }

  // 4. Compact match without separators (e.g., "swar-x" -> "SwarX")
  const compactedSegment = compactSlug(segment);
  if (compactedSegment) {
    const compactMatch = visible.find(
      (entry) => compactSlug(entry) === compactedSegment
    );
    if (compactMatch) return compactMatch;
  }

  return undefined;
}

async function resolveFileInsideRoot(
  rootDir: string,
  segments: string[]
): Promise<string | null> {
  if (segments.length === 0 || !segments.every(isValidSegment)) {
    return null;
  }

  let currentPath = path.resolve(rootDir);
  let realRoot: string;
  try {
    const rootStat = await fs.stat(currentPath);
    if (!rootStat.isDirectory()) return null;
    realRoot = await fs.realpath(currentPath);
  } catch {
    return null;
  }

  for (const segment of segments) {
    let entries: string[];
    try {
      entries = await fs.readdir(currentPath);
    } catch {
      return null;
    }

    const matched = findMatchingEntry(entries, segment);
    if (!matched) {
      return null;
    }

    const nextPath = path.resolve(currentPath, matched);
    if (!isInsideRoot(nextPath, rootDir)) {
      return null;
    }
    currentPath = nextPath;
  }

  let stat;
  try {
    stat = await fs.stat(currentPath);
  } catch {
    return null;
  }

  if (stat.isDirectory()) {
    let dirEntries: string[];
    try {
      dirEntries = await fs.readdir(currentPath);
    } catch {
      return null;
    }

    const visibleEntries = dirEntries.filter((name) => !name.startsWith('.'));
    const indexCandidate =
      visibleEntries.find((name) => name.toLowerCase() === 'index.html') ??
      visibleEntries.find((name) => name.toLowerCase() === 'index.htm');

    let targetFile = indexCandidate ?? null;

    if (!targetFile) {
      const htmlFiles = visibleEntries.filter((name) =>
        /\.(html|htm)$/i.test(name)
      );
      if (htmlFiles.length === 1) {
        targetFile = htmlFiles[0];
      }
    }

    if (!targetFile) {
      const txtFiles = visibleEntries.filter((name) => /\.txt$/i.test(name));
      if (txtFiles.length === 1) {
        targetFile = txtFiles[0];
      }
    }

    if (!targetFile) {
      return null;
    }

    const resolvedIndex = path.resolve(currentPath, targetFile);
    if (!isInsideRoot(resolvedIndex, rootDir)) {
      return null;
    }

    try {
      const realResolved = await fs.realpath(resolvedIndex);
      if (!isInsideRoot(realResolved, realRoot)) {
        return null;
      }
      const indexStat = await fs.stat(realResolved);
      if (!indexStat.isFile()) return null;
      return realResolved;
    } catch {
      return null;
    }
  }

  if (!stat.isFile()) {
    return null;
  }

  const ext = path.extname(currentPath).toLowerCase();
  if (!MIME_BY_EXT[ext]) {
    return null;
  }

  try {
    const realFile = await fs.realpath(currentPath);
    if (!isInsideRoot(realFile, realRoot)) {
      return null;
    }
    return realFile;
  } catch {
    return null;
  }
}

export async function servePolicyDocument(
  base: 'policies' | 'privacy-policy',
  rawSlug: string[],
  headOnly = false
): Promise<NextResponse> {
  const decodedSegments = rawSlug
    .map((part) => {
      try {
        return decodeURIComponent(part).trim();
      } catch {
        return '';
      }
    })
    .filter((part) => part.length > 0);

  if (decodedSegments.length === 0) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const policiesRoot = path.resolve(PUBLIC_ROOT, 'policies');
  const legacyPrivacyRoot = path.resolve(PUBLIC_ROOT, 'privacy-policy');

  let matchedFile: string | null = null;

  if (base === 'policies') {
    matchedFile = await resolveFileInsideRoot(policiesRoot, decodedSegments);

    if (
      !matchedFile &&
      normalizeSlug(decodedSegments[0] ?? '') === 'privacy-policy' &&
      decodedSegments.length >= 2
    ) {
      matchedFile = await resolveFileInsideRoot(
        legacyPrivacyRoot,
        decodedSegments.slice(1)
      );
    }
  } else {
    matchedFile = await resolveFileInsideRoot(
      legacyPrivacyRoot,
      decodedSegments
    );

    if (!matchedFile) {
      matchedFile = await resolveFileInsideRoot(
        path.resolve(policiesRoot, 'privacy-policy'),
        decodedSegments
      );
    }
  }

  if (!matchedFile) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const ext = path.extname(matchedFile).toLowerCase();
  const contentType = MIME_BY_EXT[ext] ?? 'application/octet-stream';

  const headers = new Headers({
    'Content-Type': contentType,
    'X-Robots-Tag': 'noindex',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control':
      'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
  });

  if (headOnly) {
    return new NextResponse(null, { status: 200, headers });
  }

  const fileBuffer = await fs.readFile(matchedFile);
  return new NextResponse(fileBuffer, { status: 200, headers });
}
