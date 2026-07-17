/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Head Tags Manager
 * Dynamically manage head tags for meta, og, twitter, etc.
 */

export class HeadTagsManager {
  /**
   * Update or create a meta tag
   */
  static setMetaTag(name: string, content: string, isProperty = false) {
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement;

    if (!element) {
      element = document.createElement('meta');
      if (isProperty) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      document.head.appendChild(element);
    }

    element.content = content;
  }

  /**
   * Update page title
   */
  static setTitle(title: string) {
    document.title = title;
    this.setMetaTag('title', title);
    this.setMetaTag('og:title', title, true);
    this.setMetaTag('twitter:title', title);
  }

  /**
   * Update page description
   */
  static setDescription(description: string) {
    this.setMetaTag('description', description);
    this.setMetaTag('og:description', description, true);
    this.setMetaTag('twitter:description', description);
  }

  /**
   * Update canonical URL
   */
  static setCanonical(url: string) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }

  /**
   * Update Open Graph tags
   */
  static setOpenGraph(data: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  }) {
    if (data.title) this.setMetaTag('og:title', data.title, true);
    if (data.description) this.setMetaTag('og:description', data.description, true);
    if (data.image) this.setMetaTag('og:image', data.image, true);
    if (data.url) this.setMetaTag('og:url', data.url, true);
    if (data.type) this.setMetaTag('og:type', data.type, true);
  }

  /**
   * Update Twitter Card tags
   */
  static setTwitterCard(data: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  }) {
    if (data.card) this.setMetaTag('twitter:card', data.card);
    if (data.title) this.setMetaTag('twitter:title', data.title);
    if (data.description) this.setMetaTag('twitter:description', data.description);
    if (data.image) this.setMetaTag('twitter:image', data.image);
  }

  /**
   * Update structured data (JSON-LD)
   */
  static setJsonLD(schema: any, id = 'schema-dynamic') {
    let script = document.querySelector(`script#${id}[type="application/ld+json"]`) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = id;
      (script as HTMLScriptElement).type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  /**
   * Complete SEO update
   */
  static updatePageSEO(config: {
    title: string;
    description: string;
    canonical?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    schema?: any;
    twitterHandle?: string;
  }) {
    this.setTitle(config.title);
    this.setDescription(config.description);

    if (config.keywords) {
      this.setMetaTag('keywords', config.keywords);
    }

    if (config.canonical) {
      this.setCanonical(config.canonical);
    }

    const ogUrl = config.url || (typeof window !== 'undefined' ? window.location.href : '');
    const ogImage = config.image || 'https://tamnyplus.com/og-image.png';

    this.setOpenGraph({
      title: config.title,
      description: config.description,
      image: ogImage,
      url: ogUrl,
      type: config.type || 'website'
    });

    this.setTwitterCard({
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      image: ogImage
    });

    if (config.twitterHandle) {
      this.setMetaTag('twitter:creator', config.twitterHandle);
    }

    if (config.schema) {
      this.setJsonLD(config.schema);
    }
  }
}

// Auto-register head tags on load if not in production
if (typeof window !== 'undefined') {
  console.log('HeadTagsManager ready for dynamic meta tag updates');
}
