import { useEffect } from 'react';

interface ArticleData {
  headline: string;
  description: string;
  dateModified?: string;
  datePublished?: string;
  url: string;
  category?: string;
  status?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'article' | 'WebSite';
  articleData?: ArticleData;
  breadcrumbs?: BreadcrumbItem[];
}

export function StructuredData({ type = 'website', articleData, breadcrumbs }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    const addScript = (data: object) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    };

    // Article structured data for detail pages
    if (type === 'article' && articleData) {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.headline,
        "description": articleData.description,
        "url": articleData.url,
        "dateModified": articleData.dateModified || new Date().toISOString(),
        "datePublished": articleData.datePublished || articleData.dateModified || new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": "Mamdani Tracker",
          "url": "https://mamdanitracker.nyc"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Mamdani Tracker",
          "url": "https://mamdanitracker.nyc",
          "logo": {
            "@type": "ImageObject",
            "url": "https://mamdanitracker.nyc/og-image.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": articleData.url
        }
      };
      addScript(articleSchema);
    }

    // Custom breadcrumbs for detail pages
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      };
      addScript(breadcrumbSchema);
    }

    // Website structured data
    if (type === 'website') {
      const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Mamdani Tracker",
        "url": "https://mamdanitracker.nyc",
        "description": "An independent public-interest website tracking New York City Mayor Zohran Mamdani's campaign promises, policy positions, mayoral actions, and appointments.",
        "publisher": {
          "@type": "Organization",
          "name": "Mamdani Tracker",
          "url": "https://mamdanitracker.nyc"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://mamdanitracker.nyc/promises?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };

      const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Mamdani Tracker",
        "url": "https://mamdanitracker.nyc",
        "logo": "https://mamdanitracker.nyc/og-image.png",
        "description": "Independent public-interest website tracking NYC Mayor Zohran Mamdani's promises and actions",
        "foundingDate": "2024",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "New York",
          "addressRegion": "NY",
          "addressCountry": "US"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "hello@mamdanitracker.nyc",
          "contactType": "Customer Service"
        },
        "sameAs": []
      };

      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://mamdanitracker.nyc"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Promises",
            "item": "https://mamdanitracker.nyc/promises"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Indicators",
            "item": "https://mamdanitracker.nyc/indicators"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "First 100 Days",
            "item": "https://mamdanitracker.nyc/zohran-mamdani-first-100-days"
          }
        ]
      };

      // Add all structured data scripts
      [websiteData, organizationData, breadcrumbData].forEach(addScript);
    }
  }, [type, articleData, breadcrumbs]);

  return null;
}