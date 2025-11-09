import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
}

export function Logo({ variant = 'horizontal', size = 'md', className, href = '/' }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      tagline: 'text-xs',
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-xl',
      tagline: 'text-xs',
    },
    lg: {
      icon: 'w-10 h-10',
      text: 'text-2xl',
      tagline: 'text-sm',
    },
  };

  const LogoIcon = ({ isLight }: { isLight?: boolean }) => (
    <svg
      className={cn(sizes[size].icon, isLight ? 'text-white' : 'text-primary-600')}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Camera/Screenshot icon design */}
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="5" y="8" width="14" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M8 5L9 3h6l1 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // Check if we're in a light/white context (footer)
  const isLight = className?.includes('text-white');

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoIcon isLight={isLight} />
      {variant === 'horizontal' && (
        <div className="flex flex-col">
          <span className={cn('font-semibold leading-none', sizes[size].text, isLight ? 'text-white' : 'text-secondary-900')}>
            SnapWeb
          </span>
          {size !== 'sm' && (
            <span className={cn('leading-none mt-0.5', sizes[size].tagline, isLight ? 'text-secondary-300' : 'text-secondary-600')}>
              Professional Screenshots
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none focus:ring-2 focus:ring-primary-600 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
