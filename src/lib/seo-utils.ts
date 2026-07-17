/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SEO Component Utilities
 * Common SEO component patterns and helpers
 */

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  keywords?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  jsonLd?: any;
}

/**
 * Helper function to generate structured data for rich snippets
 */
export function generateStructuredData(type: string, data: any) {
  const schemas: { [key: string]: any } = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Tamny Plus',
      'url': 'https://tamnyplus.com',
      'logo': 'https://tamnyplus.com/logo.png',
      ...data
    },
    medicalBusiness: {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      'name': data.name,
      'image': data.image,
      'address': data.address,
      'telephone': data.telephone,
      ...data
    },
    physician: {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      'name': data.name,
      'medicalSpecialty': data.specialty,
      'image': data.image,
      'address': data.address,
      'telephone': data.telephone,
      ...data
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': data.items.map((item: any, index: number) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    },
    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': data.name,
      'image': data.image,
      'address': data.address,
      'telephone': data.telephone,
      'url': data.url,
      ...data
    }
  };

  return schemas[type] || schemas.organization;
}

/**
 * Helper to format JSON-LD script tags
 */
export function renderJsonLD(schema: any) {
  const jsonString = JSON.stringify(schema);
  return `<script type="application/ld+json">${jsonString}</script>`;
}
