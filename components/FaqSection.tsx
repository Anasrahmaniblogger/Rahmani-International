'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { FAQ_ITEMS, SITE_CONFIG, type FaqItem } from '@/lib/site-config';

type FaqFilter = 'All' | FaqItem['category'];

const FAQ_CATEGORIES: FaqFilter[] = [
  'All',
  'Mobile Apps',
  'Support & Services',
];

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState<FaqFilter>('All');
  const [openId, setOpenId] = useState<string | null>(
    FAQ_ITEMS[0]?.id ?? null
  );

  const visibleFaqs = useMemo(() => {
    if (activeCategory === 'All') return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category: FaqFilter) => {
    setActiveCategory(category);
    const nextList =
      category === 'All'
        ? FAQ_ITEMS
        : FAQ_ITEMS.filter((item) => item.category === category);
    setOpenId((prev) =>
      nextList.some((item) => item.id === prev)
        ? prev
        : (nextList[0]?.id ?? null)
    );
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Sticky Editorial Intro & Category Filter */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Help &amp; Onboarding
              </p>
              <h2
                id="faq-heading"
                className="font-display text-balance-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50"
              >
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Quick answers to common questions about Rahmani International,
                our Google Play applications, independent disclaimers, and
                direct support channels.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Filter frequently asked questions by topic"
              className="flex flex-wrap gap-2"
            >
              {FAQ_CATEGORIES.map((category) => {
                const isSelected = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'btn-primary-elevated bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950'
                        : 'btn-secondary-elevated border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-500/60 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <HelpCircle
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0"
                  aria-hidden="true"
                />
                Need help with a specific app?
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                Reach our team directly at{' '}
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {SITE_CONFIG.contact.email}
                </a>{' '}
                or jump to the contact form below.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Contact Support
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-slate-200/90 dark:divide-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden">
              {visibleFaqs.map((item, idx) => {
                const isOpen = openId === item.id;
                const panelId = `faq-panel-${item.id}`;
                const buttonId = `faq-trigger-${item.id}`;

                return (
                  <div key={item.id} className="group">
                    <h3 className="m-0">
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() =>
                          setOpenId((prev) =>
                            prev === item.id ? null : item.id
                          )
                        }
                        className="flex w-full items-start justify-between gap-4 px-5 py-5 sm:px-6 text-left transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
                      >
                        <div className="space-y-1 pr-2">
                          <span className="block font-mono text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {String(idx + 1).padStart(2, '0')} · {item.category}
                          </span>
                          <span className="block font-display text-base sm:text-[17px] font-semibold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {item.question}
                          </span>
                        </div>
                        <span
                          className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                            isOpen
                              ? 'border-blue-500/40 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                              : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 space-y-3.5">
                            <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                              {item.answer}
                            </p>

                            {item.actionLabel && item.actionHref && (
                              <div>
                                {item.isExternal ? (
                                  <a
                                    href={item.actionHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                  >
                                    {item.actionLabel}
                                    <ExternalLink
                                      className="h-3.5 w-3.5"
                                      aria-hidden="true"
                                    />
                                  </a>
                                ) : item.actionHref.startsWith('#') ? (
                                  <a
                                    href={item.actionHref}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                  >
                                    {item.actionLabel}
                                    <ArrowRight
                                      className="h-3.5 w-3.5"
                                      aria-hidden="true"
                                    />
                                  </a>
                                ) : (
                                  <Link
                                    href={item.actionHref}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                  >
                                    {item.actionLabel}
                                    <ArrowRight
                                      className="h-3.5 w-3.5"
                                      aria-hidden="true"
                                    />
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
