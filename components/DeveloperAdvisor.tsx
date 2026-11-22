'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import {
  Brain,
  ExternalLink,
  Globe,
  Loader2,
  Send,
  AlertCircle,
} from 'lucide-react';

interface Citation {
  title: string;
  uri: string;
}

interface AdvisorResult {
  text: string;
  mode: 'search' | 'thinking';
  citations: Citation[];
}

const SAMPLE_PROMPTS = [
  {
    label: 'Google Play Privacy Policy Rules',
    mode: 'search' as const,
    prompt:
      'What are the current Google Play Console privacy policy and Data Safety requirements for Android utility apps?',
  },
  {
    label: 'Next.js Static Assets on Vercel',
    mode: 'search' as const,
    prompt:
      'How does Vercel serve static HTML and TXT files placed inside the Next.js public/ directory with custom headers?',
  },
  {
    label: 'Multi-App Architecture Checklist',
    mode: 'thinking' as const,
    prompt:
      'Design a maintainable release checklist for an independent Android publisher managing 5 utility, music, and calculator apps alongside a static Next.js hub on Vercel.',
  },
];

export function DeveloperAdvisor() {
  const [mode, setMode] = useState<'search' | 'thinking'>('search');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdvisorResult | null>(null);

  const runQuery = async (queryText: string, activeMode: 'search' | 'thinking') => {
    const trimmed = queryText.trim();
    if (trimmed.length < 4) {
      setError('Enter at least 4 characters to run a developer query.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed, mode: activeMode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Request failed. Please try again.');
        setResult(null);
      } else {
        setResult({
          text: data.text,
          mode: data.mode,
          citations: Array.isArray(data.citations) ? data.citations : [],
        });
      }
    } catch {
      setError('Network error while contacting the server route.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runQuery(prompt, mode);
  };

  return (
    <div className="surface-card rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Developer Research &amp; Architecture Utility
          </p>
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
            Play Console, SEO &amp; Technical Advisor
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Look up current Google Play Console policy requirements with live
            Google Search grounding, or switch to High Thinking mode for
            multi-step Android &amp; Next.js architectural checklists.
          </p>
        </div>

        <div
          className="inline-flex shrink-0 items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-1"
          role="group"
          aria-label="Research mode"
        >
          <button
            type="button"
            onClick={() => setMode('search')}
            aria-pressed={mode === 'search'}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              mode === 'search'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            Google Search
          </button>
          <button
            type="button"
            onClick={() => setMode('thinking')}
            aria-pressed={mode === 'thinking'}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              mode === 'thinking'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="h-3.5 w-3.5" aria-hidden="true" />
            High Thinking
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {SAMPLE_PROMPTS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setMode(item.mode);
              setPrompt(item.prompt);
              runQuery(item.prompt, item.mode);
            }}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 transition-colors whitespace-nowrap"
          >
            {item.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="developer-advisor-input" className="sr-only">
          Ask a technical or publishing question
        </label>
        <input
          id="developer-advisor-input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === 'search'
              ? 'Search latest Google Play policies, Android target SDKs, or Vercel SEO...'
              : 'Ask a complex Android publishing, privacy structure, or Next.js architecture question...'
          }
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {mode === 'thinking' ? 'Reasoning...' : 'Searching...'}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Run Query
            </>
          )}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-800 dark:text-red-300"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-5">
          <div className="mb-3 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2.5">
            <span>
              Mode:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {result.mode === 'search'
                  ? 'Live Google Search Grounding'
                  : 'High Thinking Deep Reasoning'}
              </strong>
            </span>
          </div>

          <div className="markdown-body text-sm text-slate-800 dark:text-slate-200">
            <Markdown>{result.text}</Markdown>
          </div>

          {result.citations.length > 0 && (
            <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-3">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Verified Search Sources
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                {result.citations.map((cite) => (
                  <li key={cite.uri}>
                    <a
                      href={cite.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span className="max-w-[240px] truncate">{cite.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
