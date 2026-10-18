import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.bitsoinnovations.com/',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href
          ? `https://www.bitsoinnovations.com${item.href.startsWith('/') ? item.href : `/${item.href}`}`
          : undefined,
      })),
    ],
  };

  const handleClick = (e: React.MouseEvent, href?: string) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumbs) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs font-mono text-slate-400">
          <li className="inline-flex items-center">
            <a
              href="/"
              onClick={(e) => handleClick(e, '/')}
              className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </a>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="inline-flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                {isLast || !item.href ? (
                  <span
                    className="text-cyan-300 font-semibold truncate max-w-[220px] sm:max-w-xs"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className="hover:text-cyan-400 transition-colors cursor-pointer truncate max-w-[200px]"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
