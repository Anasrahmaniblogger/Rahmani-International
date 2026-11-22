'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/site-config';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export function BrandLogo({ size = 40, className = '' }: BrandLogoProps) {
  const sources = [
    SITE_CONFIG.logo.primaryPath,
    SITE_CONFIG.logo.legacyExternalUrl,
    SITE_CONFIG.logo.fallbackPath,
  ];
  const [sourceIndex, setSourceIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  const handleError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((prev) => prev + 1);
    } else {
      setExhausted(true);
    }
  };

  if (exhausted) {
    return (
      <span
        style={{ width: size, height: size }}
        className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-display font-bold tracking-tight select-none ${className}`}
        aria-label={SITE_CONFIG.logo.alt}
      >
        RI
      </span>
    );
  }

  return (
    <Image
      src={sources[sourceIndex]}
      alt={SITE_CONFIG.logo.alt}
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      onError={handleError}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-xl object-cover border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-slate-900 ${className}`}
    />
  );
}
