/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Breadcrumb Navigation Component
 * Improves SEO with structured breadcrumb data
 */

import React from 'react';
import { Language } from '../types';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  language: Language;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, language }) => {
  const isRtl = language === 'ar';

  // Generate JSON-LD schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': item.url || 'https://tamnyplus.com'
    }))
  };

  React.useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [items]);

  return (
    <nav
      aria-label={language === 'ar' ? 'التنقل بالكسور' : 'Breadcrumb'}
      className={`flex items-center gap-2 text-sm text-text-muted py-3 ${isRtl ? 'flex-row-reverse' : ''}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className={`text-text-muted ${isRtl ? 'rotate-180' : ''}`}>›</span>
          )}
          {item.url ? (
            <a
              href={item.url}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-text-dark font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
