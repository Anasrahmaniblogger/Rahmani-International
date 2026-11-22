import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[720px] flex-col items-center justify-center px-5 py-20 text-center">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
        Error 404
      </p>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        The requested page could not be located on{' '}
        <span className="font-medium text-slate-900 dark:text-slate-200">
          {SITE_CONFIG.companyName}
        </span>
        . Check the URL spelling or return to our homepage.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="btn-primary-elevated inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
