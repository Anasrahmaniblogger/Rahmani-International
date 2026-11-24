import type { NextRequest } from 'next/server';
import { servePolicyDocument } from '@/lib/policy-resolver';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  return servePolicyDocument('policies', slug ?? [], false);
}

export async function HEAD(
  _req: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  return servePolicyDocument('policies', slug ?? [], true);
}
