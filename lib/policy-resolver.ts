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

function isInsideRoot(candidate: string, root: string): boolean {
  const normalizedRoot = path.resolve(root);
  const normalizedCandidate = path.resolve(candidate);
  return (
    normalizedCandidate === normalizedRoot ||
    normalizedCandidate.startsWith(`${normalizedRoot}${path.sep}`)
  );
}

async function resolveFileInsideRoot(
  rootDir: string,
  segments: string[]
): Promise<string | null> {
  if (segments.length === 0 || !segments.every(isValidSegment)) {
    return null;
  }

  let currentPath = path.resolve(rootDir);
  try {
    const rootStat = await fs.stat(currentPath);
    if (!rootStat.isDirectory()) return null;
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

    const exactMatch = entries.find((entry) => entry === segment);
    const matched =
      exactMatch ??
      entries.find(
        (entry) =>
          !entry.startsWith('.') &&
          entry.toLowerCase() === segment.toLowerCase()
      );

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
      return null;
    }

    const resolvedIndex = path.resolve(currentPath, targetFile);
    if (!isInsideRoot(resolvedIndex, rootDir)) {
      return null;
    }

    try {
      const indexStat = await fs.stat(resolvedIndex);
      if (!indexStat.isFile()) return null;
      return resolvedIndex;
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

  return currentPath;
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
      decodedSegments[0]?.toLowerCase() === 'privacy-policy' &&
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
    'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
  });

  if (headOnly) {
    return new NextResponse(null, { status: 200, headers });
  }

  const fileBuffer = await fs.readFile(matchedFile);
  return new NextResponse(fileBuffer, { status: 200, headers });
}
