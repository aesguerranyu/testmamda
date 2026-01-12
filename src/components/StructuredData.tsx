import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'article' | 'WebSite';
}

export function StructuredData({ type = 'website' }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

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
        "logo": "https://mamdanitracker.nyc/logo.png",
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
            "name": "Actions",
            "item": "https://mamdanitracker.nyc/actions"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Appointments",
            "item": "https://mamdanitracker.nyc/appointments"
          }
        ]
      };

      // Add all structured data scripts
      [websiteData, organizationData, breadcrumbData].forEach(data => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }
  }, [type]);

  return null;
}