export type SEOPageType =
  | 'informational_blog'
  | 'commercial_investigation'
  | 'it_service_page'
  | 'location_specific_page';

export type SearchIntent =
  | 'Informational'
  | 'Commercial Investigation'
  | 'Transactional'
  | 'Local Commercial'
  | 'Commercial / Academic';

export interface InternalLinkTarget {
  label: string;
  targetUrl: string;
  anchorText: string;
}

export interface SEOPageStrategy {
  id: string;
  path: string;
  type: SEOPageType;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  searchIntent: SearchIntent;
  targetAudience: string;
  seoTitle: string;
  metaDescription: string;
  h1Heading: string;
  canonicalUrl: string;
  contextualInternalLinks: InternalLinkTarget[];
  competitionLevel: 'Low' | 'Medium' | 'High';
  commercialIntentScore: number; // 1 to 10
  keywordMetricNote: string;
  lastAuditedDate: string;
}

export const INITIAL_SEO_STRATEGY: SEOPageStrategy[] = [
  // -------------------------------------------------------------
  // PILLAR 1: INFORMATIONAL BLOG ARTICLES
  // -------------------------------------------------------------
  {
    id: 'blog-mern-stack',
    path: '/blog/mern-stack-development-architecture',
    type: 'informational_blog',
    primaryKeyword: 'MERN stack development guide',
    secondaryKeywords: [
      'React.js enterprise architecture',
      'Node.js REST API security',
      'MongoDB aggregation pipeline',
      'Express microservices',
      'full stack web development services',
      'TypeScript backend engineering',
      'JWT auth best practices',
    ],
    longTailKeywords: [
      'how to architect a scalable MERN stack web app for business',
      'scalable React and Node js architecture for startups',
      'best practices for MERN stack production deployment in 2026',
    ],
    searchIntent: 'Informational',
    targetAudience: 'CTOs, Startup Founders, Full-Stack Engineers',
    seoTitle: 'MERN Stack Development Architecture Guide for Enterprise Web Apps',
    metaDescription: 'Complete MERN stack architecture guide: learn how to design scalable React frontends, secured Node.js APIs, and high-concurrency MongoDB databases for business applications.',
    h1Heading: 'Architecting Scalable Enterprise Web Applications with the MERN Stack',
    canonicalUrl: 'https://www.bitsoinnovations.com/blog/mern-stack-development-architecture',
    contextualInternalLinks: [
      {
        label: 'Full-Stack Web Development Services',
        targetUrl: '/services/web-development',
        anchorText: 'our custom full-stack web development services',
      },
      {
        label: 'Custom Software Engineering',
        targetUrl: '/services/software-development',
        anchorText: 'enterprise custom software development solutions',
      },
    ],
    competitionLevel: 'Medium',
    commercialIntentScore: 7,
    keywordMetricNote: 'Verified via Search Intent Audit. Verify live regional search volumes in Google Keyword Planner.',
    lastAuditedDate: '2026-10-20',
  },
  {
    id: 'blog-technical-seo',
    path: '/blog/technical-seo-for-react-websites',
    type: 'informational_blog',
    primaryKeyword: 'technical SEO for React websites',
    secondaryKeywords: [
      'Core Web Vitals React',
      'Googlebot JavaScript indexing',
      'SSR vs SPA SEO optimization',
      'LCP optimization React',
      'meta tags dynamic hydration',
      'structured data JSON-LD React',
    ],
    longTailKeywords: [
      'how to make single page React applications rank on Google',
      'fixing crawlability issues for React websites',
      'improving Largest Contentful Paint on mobile web applications',
    ],
    searchIntent: 'Informational',
    targetAudience: 'Web Developers, Growth Marketers, Business Owners',
    seoTitle: 'Technical SEO for React Websites: Googlebot Indexing & Core Web Vitals',
    metaDescription: 'Master technical SEO for React & single-page applications. Fix Googlebot indexing issues, optimize Core Web Vitals under 1.2s, and configure dynamic JSON-LD structured data.',
    h1Heading: 'Technical SEO & Performance Optimization for Modern React Web Apps',
    canonicalUrl: 'https://www.bitsoinnovations.com/blog/technical-seo-for-react-websites',
    contextualInternalLinks: [
      {
        label: 'High-Speed Web Development',
        targetUrl: '/services/web-development',
        anchorText: 'explore our SEO-first website development services',
      },
    ],
    competitionLevel: 'Low',
    commercialIntentScore: 8,
    keywordMetricNote: 'High search conversion potential for IT audit queries. Check exact CPC in Google Keyword Planner.',
    lastAuditedDate: '2026-10-20',
  },
  {
    id: 'blog-cloud-security',
    path: '/blog/web-application-security-and-cors',
    type: 'informational_blog',
    primaryKeyword: 'web application security checklist',
    secondaryKeywords: [
      'fixing CORS policy errors Node.js',
      'API token authentication best practices',
      'cross-site scripting XSS prevention',
      'zero trust cloud IAM',
      'preventing SQL injection Node.js',
      'Content Security Policy headers',
    ],
    longTailKeywords: [
      'how to fix CORS errors on production React and Express',
      'securing Node js REST API endpoints for enterprise applications',
      'essential cybersecurity audit checklist for web applications',
    ],
    searchIntent: 'Informational',
    targetAudience: 'Backend Engineers, DevOps Leads, Enterprise Architects',
    seoTitle: 'Web Application Security & API Defense Checklist for Production',
    metaDescription: 'A practical web application security checklist: resolve CORS policy errors, secure REST API authentication, implement zero-trust IAM, and protect enterprise cloud databases.',
    h1Heading: 'Production Web Application Security, API Hardening & CORS Diagnostics',
    canonicalUrl: 'https://www.bitsoinnovations.com/blog/web-application-security-and-cors',
    contextualInternalLinks: [
      {
        label: 'Enterprise Custom Software',
        targetUrl: '/services/software-development',
        anchorText: 'our secure custom software development and cloud support',
      },
    ],
    competitionLevel: 'Medium',
    commercialIntentScore: 7,
    keywordMetricNote: 'Targeting technical problem-solving queries that build authoritative developer trust.',
    lastAuditedDate: '2026-10-20',
  },
  {
    id: 'blog-ai-automation',
    path: '/blog/business-process-automation-using-ai',
    type: 'informational_blog',
    primaryKeyword: 'business process automation using AI',
    secondaryKeywords: [
      'LLM API integration for business',
      'automated invoice extraction',
      'intelligent customer support bots',
      'custom AI software development',
      'workflow automation Node.js',
      'predictive inventory models',
    ],
    longTailKeywords: [
      'how to automate business workflows using generative AI and Python',
      'integrating custom AI chatbots with enterprise ERP databases',
      'business automation and custom AI development company Delhi',
    ],
    searchIntent: 'Informational',
    targetAudience: 'Operations Heads, Managing Directors, Business Analysts',
    seoTitle: 'Business Process Automation Using AI: Practical Enterprise Implementation',
    metaDescription: 'Discover how modern enterprises automate manual operations using AI models, autonomous workflow pipelines, intelligent document parsing, and database integrations.',
    h1Heading: 'Practical Business Process Automation with Generative AI & Autonomous Workflows',
    canonicalUrl: 'https://www.bitsoinnovations.com/blog/business-process-automation-using-ai',
    contextualInternalLinks: [
      {
        label: 'Enterprise Cloud AI Solutions',
        targetUrl: '/services/ai-automation',
        anchorText: 'our intelligent AI and workflow automation services',
      },
    ],
    competitionLevel: 'Low',
    commercialIntentScore: 9,
    keywordMetricNote: 'Rapidly emerging commercial intent. Track rising queries in Google Search Console.',
    lastAuditedDate: '2026-10-20',
  },

  // -------------------------------------------------------------
  // PILLAR 2: COMMERCIAL INVESTIGATION ARTICLES
  // -------------------------------------------------------------
  {
    id: 'blog-custom-vs-saas',
    path: '/blog/custom-software-vs-saas-for-business',
    type: 'commercial_investigation',
    primaryKeyword: 'custom software vs off the shelf SaaS',
    secondaryKeywords: [
      'custom software development services for businesses',
      'enterprise software ROI',
      'tailored ERP for Indian SMEs',
      'software development costs India',
      'B2B software customization',
      'long term software ownership',
    ],
    longTailKeywords: [
      'is custom software better than SaaS for scaling businesses',
      'when should an Indian business build custom software instead of buying',
      'custom software development company for small business in Delhi',
    ],
    searchIntent: 'Commercial Investigation',
    targetAudience: 'SME Owners, Finance Directors, Operations Directors',
    seoTitle: 'Custom Software vs Off-the-Shelf SaaS: The Enterprise ROI Analysis',
    metaDescription: 'Evaluating custom software vs SaaS subscription for scaling businesses: compare multi-year total cost of ownership, IP control, scalability, and workflow customization.',
    h1Heading: 'Custom Software vs Off-the-Shelf SaaS: Which Is Right for Your Business Growth?',
    canonicalUrl: 'https://www.bitsoinnovations.com/blog/custom-software-vs-saas-for-business',
    contextualInternalLinks: [
      {
        label: 'Custom Software Development Services',
        targetUrl: '/services/software-development',
        anchorText: 'custom software development services for growing enterprises',
      },
      {
        label: 'Schedule Executive Consultation',
        targetUrl: '/contact',
        anchorText: 'consulting with Bitso Innovations engineering leadership',
      },
    ],
    competitionLevel: 'Low',
    commercialIntentScore: 10,
    keywordMetricNote: 'Extremely high conversion intent. Readers are actively deciding on software investment.',
    lastAuditedDate: '2026-10-20',
  },
  {
    id: 'blog-website-cost-delhi',
    path: '/blog/website-development-cost-in-delhi-ncr',
    type: 'commercial_investigation',
    primaryKeyword: 'website development cost in Delhi NCR',
    secondaryKeywords: [
      'ecommerce website development cost India',
      'business website pricing Delhi',
      'custom web development quotation',
      'website design charges East Delhi',
      'cost to build full stack web application',
      'web developer agency rates Delhi',
    ],
    longTailKeywords: [
      'how much does a professional business website cost in Delhi NCR in 2026',
      'complete price breakdown of hiring web development agency in Delhi',
      'cost of building custom e-commerce portal in Delhi NCR India',
    ],
    searchIntent: 'Commercial Investigation',
    targetAudience: 'Entrepreneurs, Retail Owners, Marketing Managers',
    seoTitle: 'Website Development Cost in Delhi NCR (2026 Price & Scope Guide)',
    metaDescription: 'Detailed breakdown of website development costs in Delhi NCR: compare basic corporate sites, custom web apps, and e-commerce portals with transparent pricing scopes.',
    h1Heading: 'Website Development Cost in Delhi NCR: Comprehensive 2026 Scope & Pricing Guide',
    canonicalUrl: 'https://www.bitsoinnovations.com/blog/website-development-cost-in-delhi-ncr',
    contextualInternalLinks: [
      {
        label: 'Website Development Company in Laxmi Nagar',
        targetUrl: '/services/location-delhi-laxmi-nagar',
        anchorText: 'our website development services in Laxmi Nagar East Delhi',
      },
      {
        label: 'Web Engineering Solutions',
        targetUrl: '/services/web-development',
        anchorText: 'our custom full-stack web development team',
      },
    ],
    competitionLevel: 'Medium',
    commercialIntentScore: 10,
    keywordMetricNote: 'High regional transaction intent. Matches users seeking immediate web design proposals.',
    lastAuditedDate: '2026-10-20',
  },

  // -------------------------------------------------------------
  // PILLAR 3: CORE IT SERVICE LANDING PAGES
  // -------------------------------------------------------------
  {
    id: 'service-web-development',
    path: '/services/web-development',
    type: 'it_service_page',
    primaryKeyword: 'website development company',
    secondaryKeywords: [
      'business website development',
      'full-stack web development services',
      'React website design',
      'responsive web engineering',
      'fast loading business websites',
      'headless web architecture',
    ],
    longTailKeywords: [
      'hire custom website development company for corporate portal',
      'full stack web development company in India with fast Core Web Vitals',
      'responsive business website design and development services',
    ],
    searchIntent: 'Transactional',
    targetAudience: 'Corporate Clients, E-Commerce Brands, High-Growth Startups',
    seoTitle: 'Website Development Company | Business Websites & Web Apps | Bitso Innovations',
    metaDescription: 'Bitso Innovations is a premier website development company engineering fast, modern, and conversion-focused business websites and full-stack web applications.',
    h1Heading: 'High-Performance Business Websites Built to Scale and Convert',
    canonicalUrl: 'https://www.bitsoinnovations.com/services/web-development',
    contextualInternalLinks: [
      {
        label: 'View Technical SEO Guide',
        targetUrl: '/blog/technical-seo-for-react-websites',
        anchorText: 'our engineering guide on technical SEO and Core Web Vitals',
      },
      {
        label: 'Website Pricing Guide',
        targetUrl: '/blog/website-development-cost-in-delhi-ncr',
        anchorText: 'transparent website development cost breakdown in Delhi NCR',
      },
    ],
    competitionLevel: 'Medium',
    commercialIntentScore: 10,
    keywordMetricNote: 'Primary revenue service landing page. Track impressions in Google Search Console.',
    lastAuditedDate: '2026-10-20',
  },
  {
    id: 'service-software-development',
    path: '/services/software-development',
    type: 'it_service_page',
    primaryKeyword: 'custom software development company',
    secondaryKeywords: [
      'software development services for businesses',
      'enterprise software engineering',
      'custom ERP development',
      'cloud microservices development',
      'B2B portal development',
      'technical issue troubleshooting',
    ],
    longTailKeywords: [
      'custom software development company for small business in Delhi',
      'enterprise custom software development services in India',
      'bespoke software development and API microservices architecture',
    ],
    searchIntent: 'Transactional',
    targetAudience: 'Enterprises, Industrial Manufacturers, Logistics & Retail Operators',
    seoTitle: 'Custom Software Development Company | Enterprise Web & Cloud Systems | Bitso Innovations',
    metaDescription: 'Custom software development services for modern businesses. We design and build enterprise ERPs, cloud microservices, APIs, and scalable internal tools.',
    h1Heading: 'Custom Software Designed Around Your Business Workflows',
    canonicalUrl: 'https://www.bitsoinnovations.com/services/software-development',
    contextualInternalLinks: [
      {
        label: 'MERN Stack Architecture Guide',
        targetUrl: '/blog/mern-stack-development-architecture',
        anchorText: 'scalable MERN stack development architectural patterns',
      },
      {
        label: 'Custom Software ROI Guide',
        targetUrl: '/blog/custom-software-vs-saas-for-business',
        anchorText: 'evaluating custom software ROI versus off-the-shelf SaaS',
      },
    ],
    competitionLevel: 'Medium',
    commercialIntentScore: 10,
    keywordMetricNote: 'Highest customer lifetime value (LTV). Focus on technical authority and verified case studies.',
    lastAuditedDate: '2026-10-20',
  },
  {
    id: 'service-ai-automation',
    path: '/services/ai-automation',
    type: 'it_service_page',
    primaryKeyword: 'enterprise AI development and automation company',
    secondaryKeywords: [
      'cloud AI automation services',
      'business process automation',
      'generative AI integration India',
      'smart data extraction systems',
      'intelligent workflow bots',
    ],
    longTailKeywords: [
      'custom AI development and business automation company in Delhi NCR',
      'hire AI developers for enterprise workflow automation in India',
      'integrating generative AI and LLMs into company internal software',
    ],
    searchIntent: 'Transactional',
    targetAudience: 'Chief Information Officers (CIOs), Digital Transformation Heads',
    seoTitle: 'Enterprise Cloud AI & Automation Solutions | Intelligent Workflows | Bitso Innovations',
    metaDescription: 'Harness practical generative AI, machine learning pipelines, and autonomous workflow automation to accelerate enterprise business operations with Bitso Innovations.',
    h1Heading: 'Transform Manual Workflows with Practical Business AI & Automation',
    canonicalUrl: 'https://www.bitsoinnovations.com/services/ai-automation',
    contextualInternalLinks: [
      {
        label: 'Business Process Automation Guide',
        targetUrl: '/blog/business-process-automation-using-ai',
        anchorText: 'our complete tutorial on business process automation with AI',
      },
    ],
    competitionLevel: 'Low',
    commercialIntentScore: 9,
    keywordMetricNote: 'High growth segment. Prioritize long-tail queries around specific operational workflows.',
    lastAuditedDate: '2026-10-20',
  },
  {
    id: 'service-student-projects',
    path: '/services/student-projects',
    type: 'it_service_page',
    primaryKeyword: 'student project development assistance',
    secondaryKeywords: [
      'final-year engineering project guidance',
      'computer science capstone projects',
      'MERN stack student projects',
      'engineering viva voce preparation',
      'Python AI final year projects',
      'BTech project code guidance Delhi',
    ],
    longTailKeywords: [
      'final year computer science project development assistance in Delhi',
      'academic capstone project mentorship with live cloud deployment',
      'BTech engineering project code guidance and viva defense preparation',
    ],
    searchIntent: 'Commercial / Academic',
    targetAudience: 'B.Tech, BCA, MCA, B.Sc & M.Tech Computer Science Students',
    seoTitle: 'Student Project Development Assistance & Mentorship | Capstone Guidance | Bitso Innovations',
    metaDescription: 'Bitso Innovations provides professional project development assistance and technical mentorship for computer science, IT, and engineering final-year student projects.',
    h1Heading: 'Practical Final-Year Engineering Project Guidance & Code Mentorship',
    canonicalUrl: 'https://www.bitsoinnovations.com/services/student-projects',
    contextualInternalLinks: [
      {
        label: 'MERN Stack Guide',
        targetUrl: '/blog/mern-stack-development-architecture',
        anchorText: 'our MERN stack architecture guide for capstone projects',
      },
    ],
    competitionLevel: 'Low',
    commercialIntentScore: 8,
    keywordMetricNote: 'High seasonal search volume in universities and colleges. Achievable ranking potential.',
    lastAuditedDate: '2026-10-20',
  },

  // -------------------------------------------------------------
  // PILLAR 4: LOCATION-SPECIFIC SERVICE PAGES (GENUINELY SERVED)
  // -------------------------------------------------------------
  {
    id: 'location-delhi-laxmi-nagar',
    path: '/services/location-delhi-laxmi-nagar',
    type: 'location_specific_page',
    primaryKeyword: 'website development company in Laxmi Nagar Delhi',
    secondaryKeywords: [
      'web design Laxmi Nagar East Delhi',
      'IT services company Laxmi Nagar',
      'software development Laxmi Nagar',
      'ecommerce website design East Delhi',
      'website developer near Laxmi Nagar metro',
      'best web development firm East Delhi',
    ],
    longTailKeywords: [
      'best website development company in Laxmi Nagar East Delhi for small businesses',
      'custom software and web design agency in Laxmi Nagar New Delhi',
      'website design and local business SEO services in Laxmi Nagar 110092',
    ],
    searchIntent: 'Local Commercial',
    targetAudience: 'Local Business Owners, Retail Stores, Traders in East Delhi',
    seoTitle: 'Website Development Company in Laxmi Nagar East Delhi | Bitso Innovations',
    metaDescription: 'Looking for a reliable website development company in Laxmi Nagar, East Delhi? Bitso Innovations builds fast, responsive business websites and custom software solutions.',
    h1Heading: 'Premier Website Development & IT Solutions in Laxmi Nagar, East Delhi',
    canonicalUrl: 'https://www.bitsoinnovations.com/services/location-delhi-laxmi-nagar',
    contextualInternalLinks: [
      {
        label: 'Core Web Development Services',
        targetUrl: '/services/web-development',
        anchorText: 'our full-service business website development packages',
      },
      {
        label: 'Contact East Delhi Office',
        targetUrl: '/contact',
        anchorText: 'visiting our office in Laxmi Nagar, New Delhi 110092',
      },
    ],
    competitionLevel: 'Low',
    commercialIntentScore: 10,
    keywordMetricNote: 'Hyperlocal query. Highly achievable #1 local ranking with Google Business Profile synergy.',
    lastAuditedDate: '2026-10-20',
  },
  {
    id: 'location-delhi-ncr',
    path: '/services/location-delhi-ncr',
    type: 'location_specific_page',
    primaryKeyword: 'custom software development company in Delhi NCR',
    secondaryKeywords: [
      'IT consulting services Delhi NCR',
      'MERN stack developers Delhi',
      'enterprise web app development Delhi',
      'software development agency Gurgaon Noida Delhi',
      'cloud DevOps consultants Delhi NCR',
      'custom ERP development Delhi',
    ],
    longTailKeywords: [
      'top custom software development company in Delhi NCR for startups and enterprises',
      'custom ERP and web application developers in Delhi NCR India',
      'hire reliable software development agency in Delhi NCR with dedicated SLAs',
    ],
    searchIntent: 'Local Commercial',
    targetAudience: 'Mid-sized Enterprises, Startups, Corporate Hubs across Delhi, Noida, Gurgaon',
    seoTitle: 'Custom Software Development Company in Delhi NCR | Bitso Innovations',
    metaDescription: 'Leading custom software development and IT consulting company in Delhi NCR. Bitso Innovations delivers enterprise ERPs, cloud platforms, and full-stack web applications.',
    h1Heading: 'Enterprise Custom Software Development & IT Consulting across Delhi NCR',
    canonicalUrl: 'https://www.bitsoinnovations.com/services/location-delhi-ncr',
    contextualInternalLinks: [
      {
        label: 'Enterprise Software Services',
        targetUrl: '/services/software-development',
        anchorText: 'custom ERP and microservices development services',
      },
      {
        label: 'Executive Leadership Consultation',
        targetUrl: '/contact',
        anchorText: 'consulting with Bitso Innovations executive leadership team',
      },
    ],
    competitionLevel: 'Medium',
    commercialIntentScore: 10,
    keywordMetricNote: 'High regional commercial value. Strong B2B lead generation potential.',
    lastAuditedDate: '2026-10-20',
  },
];
