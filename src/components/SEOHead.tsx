import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  schemaJson?: object | object[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  keywords,
  ogType = 'website',
  ogImage = 'https://www.bitsoinnovations.com/images/hero_liquid_ribbon.jpg',
  publishedTime,
  modifiedTime,
  authorName,
  schemaJson,
}) => {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('Bitso Innovations')
      ? title
      : `${title} | Bitso Innovations`;
    document.title = formattedTitle;

    // Helper to safely set meta attributes
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    if (keywords && keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }

    // 3. Canonical URL
    const canonicalUrl = `https://www.bitsoinnovations.com${canonicalPath ? (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`) : ''}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'Bitso Innovations');

    if (ogType === 'article') {
      if (publishedTime) setMetaTag('property', 'article:published_time', publishedTime);
      if (modifiedTime) setMetaTag('property', 'article:modified_time', modifiedTime);
      if (authorName) setMetaTag('property', 'article:author', authorName);
    }

    // 5. Twitter Tags
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:card', 'summary_large_image');

    // 6. Dynamic JSON-LD Structured Data
    if (schemaJson) {
      let scriptElem = document.getElementById('seo-dynamic-jsonld');
      if (!scriptElem) {
        scriptElem = document.createElement('script');
        scriptElem.id = 'seo-dynamic-jsonld';
        scriptElem.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElem);
      }
      scriptElem.textContent = JSON.stringify(schemaJson);
    }

    return () => {
      // Clean up dynamic jsonld on unmount of subroute
      const scriptElem = document.getElementById('seo-dynamic-jsonld');
      if (scriptElem) {
        scriptElem.textContent = '';
      }
    };
  }, [
    title,
    description,
    canonicalPath,
    keywords,
    ogType,
    ogImage,
    publishedTime,
    modifiedTime,
    authorName,
    schemaJson,
  ]);

  return null;
};
