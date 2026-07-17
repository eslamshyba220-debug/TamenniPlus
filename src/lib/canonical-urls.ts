/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Canonical URL Manager
 * Manages canonical URLs to prevent duplicate content issues
 */

export class CanonicalURLManager {
  private static baseURL = 'https://tamnyplus.com';

  /**
   * Set canonical URL for current page
   */
  static setCanonical(path: string) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }

    const url = this.buildCanonicalURL(path);
    link.href = url;
  }

  /**
   * Build canonical URL from path
   */
  private static buildCanonicalURL(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }

    // Remove query parameters and fragments
    path = path.split('?')[0].split('#')[0];

    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Remove trailing slash except for home
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    return `${this.baseURL}${path}`;
  }

  /**
   * Get canonical URLs for main pages
   */
  static getCanonicalURLs() {
    return {
      home: `${this.baseURL}`,
      search: `${this.baseURL}/search`,
      doctorProfile: (id: string) => `${this.baseURL}/doctor/${id}`,
      patientLogin: `${this.baseURL}/patient/login`,
      doctorLogin: `${this.baseURL}/doctor/login`,
      doctorRegistration: `${this.baseURL}/doctor/register`,
      doctorDashboard: `${this.baseURL}/doctor/dashboard`,
      adminPanel: `${this.baseURL}/admin`,
      search_specialty: (specialty: string) => `${this.baseURL}/search?specialty=${encodeURIComponent(specialty)}`,
      search_location: (gov: string, city?: string) => `${this.baseURL}/search?gov=${encodeURIComponent(gov)}${city ? `&city=${encodeURIComponent(city)}` : ''}`
    };
  }

  /**
   * Validate and fix canonical URLs
   */
  static validateCanonical(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'tamnyplus.com';
    } catch {
      return false;
    }
  }

  /**
   * Remove duplicate parameters from URL
   */
  static sanitizeURL(url: string): string {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      // Remove tracking parameters
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
      trackingParams.forEach(param => params.delete(param));

      if (params.toString()) {
        urlObj.search = params.toString();
      } else {
        urlObj.search = '';
      }

      return urlObj.toString();
    } catch {
      return url;
    }
  }
}

/**
 * URL Parameter Manager for clean URLs
 */
export class URLParameterManager {
  /**
   * Get clean search parameters
   */
  static getSearchParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      specialty: params.get('specialty'),
      governorate: params.get('gov'),
      city: params.get('city'),
      search: params.get('q'),
      page: params.get('page'),
      sort: params.get('sort'),
      filter: params.get('filter')
    };
  }

  /**
   * Build clean URL with parameters
   */
  static buildSearchURL(filters: {
    specialty?: string;
    governorate?: string;
    city?: string;
    search?: string;
    page?: number;
    sort?: string;
  }): string {
    const params = new URLSearchParams();

    if (filters.specialty) params.set('specialty', filters.specialty);
    if (filters.governorate) params.set('gov', filters.governorate);
    if (filters.city) params.set('city', filters.city);
    if (filters.search) params.set('q', filters.search);
    if (filters.page) params.set('page', filters.page.toString());
    if (filters.sort) params.set('sort', filters.sort);

    const queryString = params.toString();
    return queryString ? `/search?${queryString}` : '/search';
  }

  /**
   * Remove tracking parameters (UTM, etc.)
   */
  static removeTrackingParams(): string {
    const params = new URLSearchParams(window.location.search);
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];

    trackingParams.forEach(param => params.delete(param));

    const queryString = params.toString();
    const newURL = queryString 
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState({}, '', newURL);
    return newURL;
  }
}
