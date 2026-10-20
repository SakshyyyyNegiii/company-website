import React, { useState, useMemo } from 'react';
import { ENRICHED_BLOG_ARTICLES, EnrichedBlogArticle } from '../../data/enhancedBlogData';
import { Breadcrumbs } from '../Breadcrumbs';
import { SEOHead } from '../SEOHead';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Terminal,
  Target,
  Compass,
} from 'lucide-react';

interface BlogListPageProps {
  onNavigate: (href: string) => void;
  onOpenConsultation?: (serviceName?: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ onNavigate, onOpenConsultation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'informational_blog' | 'commercial_investigation'>('All');

  const filteredPosts = useMemo(() => {
    return ENRICHED_BLOG_ARTICLES.filter((post) => {
      const matchesFilter =
        selectedFilter === 'All' || post.type === selectedFilter;
      const matchesSearch =
        searchTerm.trim() === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.primaryKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.secondaryKeywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchTerm]);

  const featuredPost = useMemo(() => {
    return ENRICHED_BLOG_ARTICLES.find((p) => p.featured) || ENRICHED_BLOG_ARTICLES[0];
  }, []);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Bitso Innovations Technical Engineering & IT Strategy Blog',
    description: 'Technical MERN stack architecture guides, React SEO tutorials, production API security checklists, and commercial software pricing insights.',
    url: 'https://www.bitsoinnovations.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Bitso Innovations',
      logo: 'https://www.bitsoinnovations.com/favicon.svg',
    },
    blogPost: ENRICHED_BLOG_ARTICLES.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription,
      url: `https://www.bitsoinnovations.com/blog/${post.slug}`,
      datePublished: post.publishedDate,
      dateModified: post.modifiedDate,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
    })),
  };

  return (
    <div className="min-h-screen py-24 sm:py-28 relative">
      <SEOHead
        title="Technical Blog & IT Keyword Strategy | Bitso Innovations"
        description="Explore technical MERN stack guides, React SEO tutorials, production API security checklists, and commercial website development cost breakdowns."
        canonicalPath="/blog"
        keywords={[
          'MERN stack development guide',
          'technical SEO for React websites',
          'web application security checklist',
          'business process automation using AI',
          'custom software vs off the shelf SaaS',
          'website development cost in Delhi NCR',
        ]}
        schemaJson={blogSchema}
      />

      {/* Dynamic Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Technical Blog & Insights', active: true }]} onNavigate={onNavigate} />

        {/* Page Hero Header */}
        <header className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono mb-4 tracking-wider uppercase">
            <Terminal className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE & COMMERCIAL GUIDES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineering Insights & Technology Strategy
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-sans">
            Field-tested architectural blueprints, technical SEO tutorials, cybersecurity practices, and transparent commercial guides designed to help businesses scale digital operations.
          </p>
        </header>

        {/* Search & Strategic Filter Bar */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center gap-4 justify-between shadow-xl">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keyword, stack, tutorial..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Strategic Pillar Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('All')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === 'All'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
              }`}
            >
              All Articles ({ENRICHED_BLOG_ARTICLES.length})
            </button>
            <button
              onClick={() => setSelectedFilter('informational_blog')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'informational_blog'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Technical Tutorials</span>
            </button>
            <button
              onClick={() => setSelectedFilter('commercial_investigation')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'commercial_investigation'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Commercial & Pricing</span>
            </button>
          </div>
        </div>

        {/* Featured Article Banner */}
        {selectedFilter === 'All' && searchTerm === '' && featuredPost && (
          <div className="mb-14">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Engineering Guide</span>
            </div>

            <article
              onClick={() => onNavigate(`/blog/${featuredPost.slug}`)}
              className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 group cursor-pointer shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium border border-cyan-500/30">
                      {featuredPost.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-mono border border-white/5">
                      Target: {featuredPost.primaryKeyword}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold flex items-center justify-center">
                      {featuredPost.author.initials}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{featuredPost.author.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{featuredPost.author.role}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Complete Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-cyan-950/40 backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-white/5">
                    {post.category}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Primary Keyword & Long-Tail Pills */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold block mb-1.5">
                    Focus: {post.primaryKeyword}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.secondaryKeywords.slice(0, 2).map((keyw) => (
                      <span
                        key={keyw}
                        className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] font-mono text-slate-400 border border-white/5"
                      >
                        {keyw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  By {post.author.name.split(' ')[0]}
                </span>
                <span className="text-xs font-bold text-cyan-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-white/5 my-8">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No articles matched your criteria</h3>
            <p className="text-sm text-slate-400 mt-1">Try searching for keywords like "MERN", "SEO", "security", or "pricing".</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('All');
              }}
              className="mt-4 px-4 py-2 bg-cyan-500 text-slate-950 rounded-xl font-bold text-xs cursor-pointer"
            >
              Reset Search Filters
            </button>
          </div>
        )}

        {/* Bottom Callout Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-900/60 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Need Custom Software or Website Development in Delhi NCR?</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Bitso Innovations engineers enterprise software, high-speed business websites, and intelligent automation workflows with guaranteed SLAs.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shrink-0 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            Consult Our Engineering Leads
          </button>
        </div>
      </div>
    </div>
  );
};
