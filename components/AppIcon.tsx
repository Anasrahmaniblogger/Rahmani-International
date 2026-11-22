'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Smartphone } from 'lucide-react';

interface AppIconProps {
  src: string;
  name: string;
  size?: number;
  className?: string;
}

export function AppIcon({ src, name, size = 56, className = '' }: AppIconProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 ${className}`}
        aria-label={`${name} icon`}
      >
        <Smartphone className="w-6 h-6" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${name} app icon`}
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-2xl object-cover border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900 ${className}`}
    />
  );
}
