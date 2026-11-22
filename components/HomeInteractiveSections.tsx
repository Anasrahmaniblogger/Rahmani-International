'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUp,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  Mail,
  MapPin,
  Send,
  X,
} from 'lucide-react';
import {
  ADVANTAGES_LIST,
  APPS_PORTFOLIO,
  COMPANY_OVERVIEW_ITEMS,
  SITE_CONFIG,
  SOCIAL_CHANNELS,
  isSafeExternalUrl,
  type AppProduct,
} from '@/lib/site-config';
import { BrandLogo } from './BrandLogo';
import { AppIcon } from './AppIcon';
import { HeroThreeScene } from './HeroThreeScene';
import { FaqSection } from './FaqSection';
import { TiltCard } from './TiltCard';

const APP_CATEGORIES: string[] = [
  'All',
  ...Array.from(new Set(APPS_PORTFOLIO.map((app) => app.category))),
];

export function HomeInteractiveSections() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeAppModal, setActiveAppModal] = useState<AppProduct | null>(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const [toastMsg, setToastMsg] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});

  const showToast = (text: string, isError = false) => {
    setToastMsg({ text, isError });
    window.setTimeout(() => {
      setToastMsg((curr) => (curr?.text === text ? null : curr));
    }, 3400);
  };

  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 520);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!activeAppModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveAppModal(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeAppModal]);

  const filteredApps =
    selectedCategory === 'All'
      ? APPS_PORTFOLIO
      : APPS_PORTFOLIO.filter((app) => app.category === selectedCategory);

  const featuredApp =
    APPS_PORTFOLIO.find((a) => a.featuredSpotlight) ??
    APPS_PORTFOLIO.find((a) => a.id === 'swarx') ??
    APPS_PORTFOLIO[0];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.contact.email);
      showToast('Support email copied to clipboard.');
    } catch {
      showToast(`Email: ${SITE_CONFIG.contact.email}`, true);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof formErrors = {};
    const name = formName.trim();
    const email = formEmail.trim();
    const subject = formSubject.trim();
    const message = formMessage.trim();

    if (name.length < 2) errs.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (subject.length < 3) errs.subject = 'Please enter a subject.';
    if (message.length < 15) {
      errs.message = 'Message should be at least 15 characters.';
    }

    setFormErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Please review the highlighted contact fields.', true);
      return;
    }

    const mailBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoHref = `mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(mailBody)}`;

    showToast('Opening your default email application...');
    window.location.href = mailtoHref;
  };

  return (
    <main>
      <section
        id="home"
        className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/90 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 pt-12 pb-16 sm:pt-16 sm:pb-24"
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center lg:col-span-6"
            >
              <div className="flex items-center gap-3.5 mb-6">
                <BrandLogo size={54} />
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {SITE_CONFIG.companyName}
                  </p>
                  <p>Apps · Websites · Digital Solutions</p>
                </div>
              </div>

              <h1 className="font-display text-balance-heading text-[clamp(2.25rem,4.2vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50">
                Building practical{' '}
                <span className="bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-300 bg-clip-text text-transparent">
                  mobile apps, websites
                </span>{' '}
                &amp; digital products
              </h1>

              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Rahmani International develops, publishes, and supports reliable
                Android applications, responsive web platforms, and practical
                digital products built for everyday users.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href="#apps"
                  className="btn-primary-elevated inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950 whitespace-nowrap"
                >
                  Explore Our Apps
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={SITE_CONFIG.contact.googlePlayDeveloperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-elevated inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 whitespace-nowrap"
                >
                  Google Play Store
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>

            <div className="lg:col-span-6 flex items-stretch">
              <HeroThreeScene />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 border-t border-slate-200 dark:border-slate-800/80 pt-8">
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
                {APPS_PORTFOLIO.length}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Published Android Apps on Google Play
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
                {Math.max(APP_CATEGORIES.length - 1, 1)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Everyday Product Categories
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                Google Play
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Official Android App Distribution
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                Ongoing
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Technical Support &amp; Post-Launch Care
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Company Overview
              </p>
              <h2 className="font-display text-balance-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                About Rahmani International
              </h2>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Rahmani International is a technology-focused company dedicated
                to creating mobile applications, websites, and digital products.
                The company focuses on combining useful functionality, modern
                interfaces, and practical digital experiences.
              </p>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Work spans the full product lifecycle — from designing and
                developing Android applications and responsive websites, through
                publishing on app stores and modern web hosting, to ongoing
                technical support and continuous improvement of released
                products.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {COMPANY_OVERVIEW_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 surface-card rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-200 dark:border-slate-800">
                <BrandLogo size={48} />
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                    {SITE_CONFIG.companyName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Official Publisher Profile
                  </p>
                </div>
              </div>
              <dl className="divide-y divide-slate-200/80 dark:divide-slate-800/80 text-sm">
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-slate-500 dark:text-slate-400">Domain</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    rahmaniinternational.in
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-slate-500 dark:text-slate-400">Owner</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {SITE_CONFIG.owner.name}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-slate-500 dark:text-slate-400">Focus</dt>
                  <dd className="font-medium text-right text-slate-900 dark:text-slate-100">
                    Apps · Websites · Digital Tools
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-slate-500 dark:text-slate-400">Support</dt>
                  <dd className="font-medium text-right text-blue-600 dark:text-blue-400 break-all">
                    <a href={`mailto:${SITE_CONFIG.contact.email}`}>
                      {SITE_CONFIG.contact.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="surface-card rounded-2xl p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                Our Vision
              </h3>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                To create useful, modern, and accessible digital experiences
                that make technology simpler for everyday users.
              </p>
            </div>
            <div className="surface-card rounded-2xl p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                Our Mission
              </h3>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                To develop reliable apps, websites, and digital products with a
                strong focus on usability, innovation, and continuous
                improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="apps"
        className="border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/35 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Google Play Portfolio
              </p>
              <h2 className="font-display text-balance-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
                Our Published Applications
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Explore mobile applications developed and published by Rahmani
                International, complete with direct Google Play links and
                detailed feature overviews.
              </p>
            </div>

            <div
              className="inline-flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 shadow-xs"
              role="group"
              aria-label="Filter applications by category"
            >
              {APP_CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={active}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      active
                        ? 'btn-primary-elevated bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            Showing {filteredApps.length} applications for {selectedCategory}.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((app) => (
              <TiltCard
                key={app.id}
                className="surface-card surface-card-interactive rounded-2xl p-6"
              >
                <article className="flex h-full flex-col">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 transition-transform duration-300">
                      <AppIcon src={app.logo} name={app.name} size={58} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 truncate">
                        {app.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        <span>{app.categoryLabel}</span>
                        {app.badge && (
                          <>
                            <span className="mx-1.5" aria-hidden="true">
                              ·
                            </span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {app.badge}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {app.description}
                  </p>

                  <p className="mt-4 border-t border-slate-200/80 dark:border-slate-800 pt-3.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {app.features.slice(0, 4).join(' · ')}
                    {app.features.length > 4
                      ? ` · +${app.features.length - 4} more`
                      : ''}
                  </p>

                  <div className="mt-5 flex items-center gap-2.5">
                    <a
                      href={isSafeExternalUrl(app.playStoreUrl) ? app.playStoreUrl : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-elevated inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950 whitespace-nowrap"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      Google Play
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveAppModal(app)}
                      className="btn-secondary-elevated inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 whitespace-nowrap"
                      aria-label={`View full details for ${app.name}`}
                    >
                      <Info className="h-3.5 w-3.5" aria-hidden="true" />
                      Details
                    </button>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>

          {featuredApp && (
            <div className="mt-10 surface-card rounded-2xl p-7 sm:p-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                <TiltCard
                  maxTilt={4}
                  className="lg:col-span-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-8"
                >
                  <div className="flex flex-col items-center justify-center">
                    <AppIcon
                      src={featuredApp.logo}
                      name={featuredApp.name}
                      size={136}
                    />
                    <p className="mt-4 font-mono-code text-xs text-slate-500 dark:text-slate-400">
                      {featuredApp.packageId}
                    </p>
                  </div>
                </TiltCard>
                <div className="lg:col-span-8 space-y-4">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Featured Product · {featuredApp.categoryLabel}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    {featuredApp.name}
                  </h3>
                  <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {featuredApp.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                    {featuredApp.features.slice(0, 4).map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
                      >
                        <Check
                          className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0"
                          aria-hidden="true"
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={
                        isSafeExternalUrl(featuredApp.playStoreUrl)
                          ? featuredApp.playStoreUrl
                          : '#'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-elevated inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      View on Google Play
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveAppModal(featuredApp)}
                      className="btn-secondary-elevated inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600"
                    >
                      <Info className="h-4 w-4" aria-hidden="true" />
                      Explore Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
            <p className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              More Products in Development
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              New Android applications and web utilities are actively being
              built. Follow our official channels below for upcoming releases.
            </p>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Our Standards
            </p>
            <h2 className="font-display text-balance-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
              Why Rahmani International
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              A practical, quality-focused approach to building and maintaining
              everyday digital tools.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES_LIST.map((adv) => (
              <div
                key={adv.title}
                className="border-t border-slate-200 dark:border-slate-800 pt-4"
              >
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                  {adv.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="owner" className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/35 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="surface-card rounded-2xl p-7 sm:p-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-3 flex justify-center md:justify-start">
                <div
                  className="flex h-36 w-36 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white font-display text-4xl font-bold tracking-tight"
                  role="img"
                  aria-label={`Monogram for ${SITE_CONFIG.owner.name}`}
                >
                  {SITE_CONFIG.owner.initials}
                </div>
              </div>
              <div className="md:col-span-9 space-y-3">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Leadership
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                  {SITE_CONFIG.owner.name}
                </h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {SITE_CONFIG.owner.role}
                </p>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                  {SITE_CONFIG.owner.bio}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={SITE_CONFIG.contact.googlePlayDeveloperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors"
                  >
                    Google Play Developer Profile
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <a
                    href={SITE_CONFIG.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors"
                  >
                    Instagram
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />

      <section
        id="contact"
        className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/35 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Contact &amp; Support
            </p>
            <h2 className="font-display text-balance-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">
              Let&apos;s Build Something Digital
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Have a project inquiry, app feedback, or technical support
              request? Reach Rahmani International directly through our verified
              channels below.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="surface-card rounded-2xl p-6 sm:p-7 space-y-5">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  Reach Us Directly
                </h3>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Mail
                      className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 break-all">
                      {SITE_CONFIG.contact.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    Copy
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email Us
                  </a>
                  <a
                    href={SITE_CONFIG.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-blue-500 transition-colors"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    Google Maps
                  </a>
                </div>
              </div>

              <div className="surface-card rounded-2xl p-6 sm:p-7">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Social &amp; Community
                </h3>
                <ul className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
                  {SOCIAL_CHANNELS.map((ch) => (
                    <li key={ch.key} className="py-3 first:pt-0 last:pb-0">
                      <a
                        href={ch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {ch.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {ch.description}
                          </p>
                        </div>
                        <ExternalLink
                          className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <form
              onSubmit={handleContactSubmit}
              noValidate
              className="lg:col-span-7 surface-card rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
                  Send a Message
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Because this is a static website without a database,
                  submitting validates your message and opens your default email
                  app addressed to{' '}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {SITE_CONFIG.contact.email}
                  </strong>
                  .
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none"
                />
                {formErrors.subject && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {formErrors.subject}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none resize-y"
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {formErrors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-slate-950 transition-colors"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Open in Email Client
              </button>
            </form>
          </div>
        </div>
      </section>

      {activeAppModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-modal-title"
        >
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setActiveAppModal(null)}
          />
          <div className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveAppModal(null)}
              aria-label="Close application details"
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-4 pr-10">
              <AppIcon
                src={activeAppModal.logo}
                name={activeAppModal.name}
                size={68}
              />
              <div>
                <h3
                  id="app-modal-title"
                  className="font-display text-xl font-bold text-slate-900 dark:text-slate-50"
                >
                  {activeAppModal.name}
                </h3>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {activeAppModal.categoryLabel}
                </p>
                <p className="font-mono-code text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeAppModal.packageId}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {activeAppModal.description}
            </p>

            <h4 className="mt-6 font-display text-sm font-bold text-slate-900 dark:text-slate-100">
              Key Features
            </h4>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {activeAppModal.features.map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                  {feat}
                </li>
              ))}
            </ul>

            {activeAppModal.note && (
              <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {activeAppModal.note}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={
                  isSafeExternalUrl(activeAppModal.playStoreUrl)
                    ? activeAppModal.playStoreUrl
                    : '#'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-elevated inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                View on Google Play
              </a>
              <button
                type="button"
                onClick={() => setActiveAppModal(null)}
                className="btn-secondary-elevated inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showBackTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          className="fixed right-5 bottom-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-md hover:border-blue-500 transition-colors"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-4 py-3 text-xs font-medium shadow-lg ${
            toastMsg.isError
              ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-200'
              : 'border-slate-300 dark:border-slate-700 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
          }`}
        >
          {toastMsg.text}
        </div>
      )}
    </main>
  );
}
