import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export function SEO({
  title = "Mamdani Tracker - Tracking NYC Mayor Zohran Mamdani's Promises & Actions",
  description = "An independent public-interest website tracking New York City Mayor Zohran Mamdani's campaign promises, policy positions, mayoral actions, and appointments with verified sources.",
  keywords = "Zohran Mamdani, NYC Mayor, New York City, campaign promises, accountability, political tracker, mayoral actions, NYC politics, policy tracker, government transparency, public interest",
  ogImage = "https://mamdanitracker.nyc/og-image.png",
  ogType = "website",
  canonical
}: SEOProps) {
  const location = useLocation();
  const currentUrl = `https://mamdanitracker.nyc${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Mamdani Tracker Team');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('googlebot', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    updateMetaTag('language', 'English');
    updateMetaTag('geo.region', 'US-NY');
    updateMetaTag('geo.placename', 'New York City');
    
    // iOS specific meta tags
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('format-detection', 'telephone=no');

    // Open Graph meta tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:site_name', 'Mamdani Tracker', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Update canonical link
    let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.href = canonicalUrl;

  }, [title, description, keywords, ogImage, ogType, currentUrl, canonicalUrl]);

  return null;
}