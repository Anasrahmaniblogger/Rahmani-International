import React from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, MapPin } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { SITE_CONFIG, SOCIAL_CHANNELS } from '@/lib/site-config';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/90 bg-slate-50/90 dark:bg-slate-950">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandLogo size={42} />
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {SITE_CONFIG.companyName}
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {SITE_CONFIG.tagline}. Developing, publishing, and supporting
              practical mobile applications, modern websites, and digital tools.
            </p>
            <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
              <p>
                <span className="text-slate-500 dark:text-slate-500">
                  Owner:
                </span>{' '}
                <strong className="font-medium text-slate-900 dark:text-slate-200">
                  {SITE_CONFIG.owner.name}
                </strong>
              </p>
              <p className="flex items-center gap-2">
                <Mail
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href={SITE_CONFIG.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  View Location on Google Maps
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/#apps"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Apps Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Official Channels
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              {SOCIAL_CHANNELS.map((channel) => (
                <li key={channel.key}>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {channel.name}
                    <ExternalLink
                      className="h-3.5 w-3.5 opacity-70"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-6 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {SITE_CONFIG.companyName}. All rights reserved.
          </p>
          <p>
            Official domain:{' '}
            <a
              href={SITE_CONFIG.domain}
              className="font-medium text-slate-700 dark:text-slate-300 hover:underline"
            >
              rahmaniinternational.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
