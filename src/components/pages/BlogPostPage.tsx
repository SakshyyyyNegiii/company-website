import React, { useState } from 'react';
import { EnrichedBlogArticle, ENRICHED_BLOG_ARTICLES } from '../../data/enhancedBlogData';
import { Breadcrumbs } from '../Breadcrumbs';
import { SEOHead } from '../SEOHead';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Share2,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';

interface BlogPostPageProps {
  post: EnrichedBlogArticle;
  onNavigate: (href: string) => void;
  onStartProject?: (serviceName?: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  post,
  onNavigate,
  onStartProject,
}) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    image: 'https://www.bitsoinnovations.com/images/hero_liquid_ribbon.jpg',
    datePublished: post.publishedDate,
    dateModified: post.modifiedDate,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bitso Innovations',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.bitsoinnovations.com/favicon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.bitsoinnovations.com/blog/${post.slug}`,
    },
    keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(', '),
  };

  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : undefined;

  const combinedSchema = faqSchema ? [articleSchema, faqSchema] : articleSchema;

  const relatedPosts = ENRICHED_BLOG_ARTICLES.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="min-h-screen py-24 sm:py-28 relative">
      <SEOHead
        title={post.title}
        description={post.metaDescription}
        canonicalPath={`/blog/${post.slug}`}
        keywords={[post.primaryKeyword, ...post.secondaryKeywords, ...post.longTailKeywords]}
        ogType="article"
        publishedTime={post.publishedDate}
        modifiedTime={post.modifiedDate}
        authorName={post.author.name}
        schemaJson={combinedSchema}
      />

      {/* Dynamic Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Technical Blog', href: '/blog' },
            { label: post.title, active: true },
          ]}
          onNavigate={onNavigate}
        />

        {/* Back Link */}
        <button
          onClick={() => onNavigate('/blog')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </button>

        {/* Article Header */}
        <header className="mb-10 sm:mb-12">
          <div className="flex flex-wrap items-center gap-2.5 mb-4 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold">
              {post.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-white/10 flex items-center gap-1">
              <Target className="w-3 h-3 text-cyan-400" />
              <span>Intent: {post.searchIntent}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              Updated {post.modifiedDate}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            {post.excerpt}
          </p>

          {/* Target Keyword Tags */}
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              Target Keyword: <span className="text-white underline decoration-cyan-500">{post.primaryKeyword}</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="flex flex-wrap gap-1.5">
              {post.secondaryKeywords.slice(0, 3).map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono text-slate-400 border border-white/5"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Author Badge & Share Button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-extrabold flex items-center justify-center text-sm shadow-md">
                {post.author.initials}
              </div>
              <div>
                <span className="text-sm font-bold text-white block">{post.author.name}</span>
                <span className="text-xs font-mono text-slate-400">{post.author.role}</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </header>

        {/* Table of Contents */}
        <nav aria-label="Table of Contents" className="mb-10 p-5 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-sm">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold block mb-3">
            Table of Contents
          </span>
          <ol className="space-y-2 text-sm text-slate-300 font-sans">
            {post.sections.map((section, idx) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs font-mono text-slate-500">0{idx + 1}.</span>
                  <span>{section.heading}</span>
                </a>
              </li>
            ))}
            {post.faq && post.faq.length > 0 && (
              <li>
                <a href="#faq" className="hover:text-cyan-300 transition-colors flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">0{post.sections.length + 1}.</span>
                  <span>Frequently Asked Questions</span>
                </a>
              </li>
            )}
          </ol>
        </nav>

        {/* Article Sections */}
        <div className="space-y-12">
          {post.sections.map((section, idx) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
                {section.heading}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Code Snippet Box */}
              {section.codeBlock && (
                <div className="my-6 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl">
                  {section.codeBlock.filename && (
                    <div className="px-4 py-2 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{section.codeBlock.filename}</span>
                      <button
                        onClick={() => handleCopyCode(section.codeBlock!.code, idx)}
                        className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        {copiedCodeIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-cyan-300/90 leading-relaxed">
                    <code>{section.codeBlock.code}</code>
                  </pre>
                </div>
              )}

              {/* Best Practice Tips Callout */}
              {section.tips && section.tips.length > 0 && (
                <div className="my-5 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs sm:text-sm text-cyan-200">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-1.5">
                    <Lightbulb className="w-4 h-4 shrink-0" />
                    <span>Engineering Best Practice</span>
                  </div>
                  <ul className="space-y-1 list-disc list-inside text-slate-300">
                    {section.tips.map((tip, tIdx) => (
                      <li key={tIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          {/* FAQ Section */}
          {post.faq && post.faq.length > 0 && (
            <section id="faq" className="scroll-mt-24 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 text-white text-2xl font-bold mb-6">
                <HelpCircle className="w-6 h-6 text-cyan-400" />
                <h2>Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {post.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-white/5"
                  >
                    <h3 className="text-base font-bold text-white mb-2">{item.question}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contextual Service Callout Banner (Prevents Cannibalization & Drives Leads) */}
          <aside className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                Contextual IT Solutions
              </span>
              <h3 className="text-lg font-bold text-white">{post.contextualCallout.heading}</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl font-sans">
                {post.contextualCallout.body}
              </p>
            </div>
            <button
              onClick={() => onNavigate(post.contextualCallout.serviceUrl)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md shadow-cyan-500/20 cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>{post.contextualCallout.buttonText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </aside>
        </div>

        {/* Related Articles Footer */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <h3 className="text-xl font-bold text-white mb-6">Related Technical & Commercial Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {relatedPosts.map((related) => (
              <div
                key={related.slug}
                onClick={() => onNavigate(`/blog/${related.slug}`)}
                className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1.5">
                  {related.category} • {related.searchIntent}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {related.title}
                </h4>
                <span className="mt-3 text-xs font-semibold text-cyan-400 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
