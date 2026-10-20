import React, { useState, useEffect } from 'react';
import {
  SEOPageStrategy,
  INITIAL_SEO_STRATEGY,
  SEOPageType,
  SearchIntent,
} from '../../data/seoKeywordStrategy';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  Search,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe,
  Database,
  ArrowRight,
  Filter,
  X,
  FileEdit,
  Tag,
  HelpCircle,
} from 'lucide-react';

interface SeoDashboardProps {
  onNavigate: (href: string) => void;
  onClose?: () => void;
}

export const SeoDashboard: React.FC<SeoDashboardProps> = ({ onNavigate, onClose }) => {
  const [strategies, setStrategies] = useState<SEOPageStrategy[]>(() => {
    // Load local storage overrides if available
    try {
      const cached = localStorage.getItem('bitso_seo_strategies');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // fallback
    }
    return INITIAL_SEO_STRATEGY;
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<SEOPageStrategy | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Fetch overrides from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    const loadFirestoreMetadata = async () => {
      try {
        const updated = await Promise.all(
          INITIAL_SEO_STRATEGY.map(async (strat) => {
            try {
              const docRef = doc(db, 'seo_metadata', strat.id);
              const snap = await getDoc(docRef);
              if (snap.exists()) {
                return { ...strat, ...snap.data() };
              }
            } catch {
              // fallback to cached/initial
            }
            return strat;
          })
        );
        if (isMounted) {
          setStrategies(updated);
          localStorage.setItem('bitso_seo_strategies', JSON.stringify(updated));
        }
      } catch (err) {
        console.warn('Firestore SEO sync fallback to local cache', err);
      }
    };

    loadFirestoreMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered pages
  const filteredPages = strategies.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.primaryKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.secondaryKeywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Check for potential keyword cannibalization
  const cannibalizationWarnings = React.useMemo(() => {
    const keywordMap = new Map<string, string[]>();
    strategies.forEach((strat) => {
      const kw = strat.primaryKeyword.toLowerCase().trim();
      if (!keywordMap.has(kw)) {
        keywordMap.set(kw, []);
      }
      keywordMap.get(kw)!.push(strat.path);
    });

    const duplicates: { keyword: string; paths: string[] }[] = [];
    keywordMap.forEach((paths, keyword) => {
      if (paths.length > 1) {
        duplicates.push({ keyword, paths });
      }
    });
    return duplicates;
  }, [strategies]);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      // 1. Update in Firestore
      const docRef = doc(db, 'seo_metadata', selectedPage.id);
      await setDoc(docRef, {
        primaryKeyword: selectedPage.primaryKeyword,
        secondaryKeywords: selectedPage.secondaryKeywords,
        longTailKeywords: selectedPage.longTailKeywords,
        searchIntent: selectedPage.searchIntent,
        seoTitle: selectedPage.seoTitle,
        metaDescription: selectedPage.metaDescription,
        h1Heading: selectedPage.h1Heading,
        canonicalUrl: selectedPage.canonicalUrl,
        lastAuditedDate: new Date().toISOString().split('T')[0],
      });

      // 2. Update local state & localStorage
      const updatedList = strategies.map((s) =>
        s.id === selectedPage.id ? { ...selectedPage, lastAuditedDate: new Date().toISOString().split('T')[0] } : s
      );
      setStrategies(updatedList);
      localStorage.setItem('bitso_seo_strategies', JSON.stringify(updatedList));

      setSaveSuccessMsg('SEO Metadata successfully updated and deployed to Firestore!');
      setTimeout(() => {
        setSaveSuccessMsg('');
        setSelectedPage(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
      // Fallback update to local storage
      const updatedList = strategies.map((s) =>
        s.id === selectedPage.id ? selectedPage : s
      );
      setStrategies(updatedList);
      localStorage.setItem('bitso_seo_strategies', JSON.stringify(updatedList));
      setSaveSuccessMsg('Saved to local storage cache (Firestore offline).');
      setTimeout(() => {
        setSaveSuccessMsg('');
        setSelectedPage(null);
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all SEO strategies to factory baseline?')) {
      setStrategies(INITIAL_SEO_STRATEGY);
      localStorage.removeItem('bitso_seo_strategies');
      alert('SEO strategies reset to baseline.');
    }
  };

  const getTypeLabel = (type: SEOPageType) => {
    switch (type) {
      case 'informational_blog':
        return 'Informational Blog';
      case 'commercial_investigation':
        return 'Commercial Investigation';
      case 'it_service_page':
        return 'Core IT Service Page';
      case 'location_specific_page':
        return 'Location Landing Page';
      default:
        return 'Page';
    }
  };

  return (
    <div className="min-h-screen py-24 sm:py-28 relative bg-slate-950 text-slate-100 font-sans">
      {/* Dynamic Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono mb-2 uppercase">
              <Sliders className="w-3.5 h-3.5" />
              <span>ENTERPRISE SEO INTELLIGENCE DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Keyword Research & On-Page SEO Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Manage target search keywords, prevent keyword cannibalization, and edit meta tags with real-time Firestore synchronization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            {onClose ? (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 cursor-pointer"
                title="Close Dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('/')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Return to Website
              </button>
            )}
          </div>
        </div>

        {/* Legitimate Data Source Notice Banner (Rule 7) */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-start gap-3.5 shadow-xl">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            <span className="font-bold text-white block mb-0.5">
              Verified SEO Metric Integrity Policy
            </span>
            Search volumes, competition levels, and CPCs are not fabricated. We target specific, high-intent commercial keywords.
            To verify live monthly impressions for Delhi NCR, use{' '}
            <a
              href="https://ads.google.com/home/tools/keyword-planner/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-cyan-300 inline-flex items-center gap-0.5"
            >
              Google Keyword Planner
              <ExternalLink className="w-3 h-3" />
            </a>{' '}
            and monitor actual organic clicks via{' '}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-cyan-300 inline-flex items-center gap-0.5"
            >
              Google Search Console
              <ExternalLink className="w-3 h-3" />
            </a>.
          </div>
        </div>

        {/* Cannibalization Warning Alert (Rule 5) */}
        {cannibalizationWarnings.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200">
            <div className="flex items-center gap-2 font-bold text-sm mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Keyword Cannibalization Detected!</span>
            </div>
            <p className="text-xs text-slate-300 mb-2">
              The following primary keywords are assigned to multiple pages. Each page should target a unique primary search intent to avoid competing with itself:
            </p>
            <ul className="space-y-1 text-xs font-mono">
              {cannibalizationWarnings.map((item, idx) => (
                <li key={idx} className="text-amber-300">
                  • "{item.keyword}" is targeted on: {item.paths.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Statistical Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Active Strategy URLs
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {strategies.length}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Target Keywords Tracked
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {strategies.reduce((acc, s) => acc + 1 + s.secondaryKeywords.length, 0)}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Commercial / Local Intent
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {strategies.filter((s) => s.searchIntent.includes('Commercial') || s.searchIntent === 'Transactional').length}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Cannibalization Health
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 flex items-center gap-1.5">
              {cannibalizationWarnings.length === 0 ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>100% Clean</span>
                </>
              ) : (
                <span className="text-amber-400">{cannibalizationWarnings.length} Issues</span>
              )}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search page, keyword, path..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Pages' },
              { id: 'informational_blog', label: 'Technical Blogs' },
              { id: 'commercial_investigation', label: 'Commercial Articles' },
              { id: 'it_service_page', label: 'IT Services' },
              { id: 'location_specific_page', label: 'Location Pages' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Pages & Keyword Strategies */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">Target URL & Strategy Pillar</th>
                  <th className="py-4 px-5">Primary Target Keyword</th>
                  <th className="py-4 px-5">Search Intent</th>
                  <th className="py-4 px-5">SEO Title & Meta Preview</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Column 1: URL & Type */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 font-mono text-cyan-300 font-semibold mb-1">
                        <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{page.path}</span>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono border border-white/5">
                        {getTypeLabel(page.type)}
                      </span>
                    </td>

                    {/* Column 2: Primary Keyword & Count */}
                    <td className="py-4 px-5">
                      <span className="font-bold text-white block text-sm mb-1">
                        {page.primaryKeyword}
                      </span>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {page.secondaryKeywords.slice(0, 2).map((k) => (
                          <span
                            key={k}
                            className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono border border-white/5"
                          >
                            {k}
                          </span>
                        ))}
                        {page.secondaryKeywords.length > 2 && (
                          <span className="text-[10px] font-mono text-slate-500">
                            +{page.secondaryKeywords.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 3: Search Intent */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
                          page.searchIntent.includes('Commercial') || page.searchIntent === 'Transactional'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25'
                        }`}
                      >
                        {page.searchIntent}
                      </span>
                    </td>

                    {/* Column 4: Title & Meta Preview */}
                    <td className="py-4 px-5 max-w-sm">
                      <div className="font-semibold text-slate-200 line-clamp-1 mb-0.5" title={page.seoTitle}>
                        {page.seoTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1" title={page.metaDescription}>
                        {page.metaDescription}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                        <span className={page.seoTitle.length > 60 ? 'text-amber-400' : 'text-emerald-400'}>
                          Title: {page.seoTitle.length} chars
                        </span>
                        <span>•</span>
                        <span className={page.metaDescription.length > 160 ? 'text-amber-400' : 'text-emerald-400'}>
                          Meta: {page.metaDescription.length} chars
                        </span>
                      </div>
                    </td>

                    {/* Column 5: Edit Button */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedPage({ ...page })}
                        className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Edit Strategy</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Editing SEO Strategy (Rule 6) */}
        {selectedPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setSelectedPage(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2 uppercase">
                <FileEdit className="w-3.5 h-3.5" />
                <span>EDIT PAGE SEO STRATEGY</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {selectedPage.path}
              </h2>
              <p className="text-xs text-slate-400 mb-6 font-mono">
                Pillar: {getTypeLabel(selectedPage.type)}
              </p>

              {saveSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Primary Keyword */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                    Primary Target Keyword (Must be unique across site):
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedPage.primaryKeyword}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, primaryKeyword: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Search Intent */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                    Search Intent:
                  </label>
                  <select
                    value={selectedPage.searchIntent}
                    onChange={(e) =>
                      setSelectedPage({
                        ...selectedPage,
                        searchIntent: e.target.value as SearchIntent,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
                  >
                    <option value="Informational">Informational</option>
                    <option value="Commercial Investigation">Commercial Investigation</option>
                    <option value="Transactional">Transactional</option>
                    <option value="Local Commercial">Local Commercial</option>
                    <option value="Commercial / Academic">Commercial / Academic</option>
                  </select>
                </div>

                {/* SEO Page Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      SEO Page Title:
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        selectedPage.seoTitle.length >= 45 && selectedPage.seoTitle.length <= 65
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {selectedPage.seoTitle.length} / 60 chars (optimal 45-65)
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={selectedPage.seoTitle}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, seoTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono text-slate-300 font-semibold">
                      Meta Description:
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        selectedPage.metaDescription.length >= 130 && selectedPage.metaDescription.length <= 160
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {selectedPage.metaDescription.length} / 160 chars (optimal 130-160)
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={selectedPage.metaDescription}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, metaDescription: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* H1 Heading */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                    H1 Primary Heading:
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedPage.h1Heading}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, h1Heading: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Canonical URL */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                    Canonical URL:
                  </label>
                  <input
                    type="url"
                    required
                    value={selectedPage.canonicalUrl}
                    onChange={(e) =>
                      setSelectedPage({ ...selectedPage, canonicalUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Secondary Keywords (Comma-separated) */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                    Secondary Keywords (5–10, comma-separated):
                  </label>
                  <input
                    type="text"
                    value={selectedPage.secondaryKeywords.join(', ')}
                    onChange={(e) =>
                      setSelectedPage({
                        ...selectedPage,
                        secondaryKeywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPage(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/25 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Deploying to Firestore...' : 'Save Strategy'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
