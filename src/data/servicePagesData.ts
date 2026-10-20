export interface ServicePageData {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroBadge: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  process: {
    step: string;
    title: string;
    desc: string;
  }[];
  useCases: {
    title: string;
    tag: string;
    description: string;
    metric: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const DEDICATED_SERVICES: Record<string, ServicePageData> = {
  'web-development': {
    slug: 'web-development',
    name: 'Website Development',
    metaTitle: 'Website Development Company | Business Websites & Web Apps | Bitso Innovations',
    metaDescription: 'Bitso Innovations is a premier website development company engineering fast, modern, and conversion-focused business websites and full-stack web applications.',
    keywords: [
      'website development company',
      'business website development',
      'full-stack web development services',
      'React website development',
      'responsive web design Delhi',
      'modern web application development',
    ],
    heroBadge: 'PREMIER WEB ENGINEERING',
    headline: 'High-Performance Business Websites Built to Scale and Convert',
    subheadline: 'We engineer blazingly fast, SEO-optimized business websites and full-stack web applications tailored to your business model, customer journey, and growth targets.',
    primaryCtaText: 'Start Your Web Project',
    features: [
      {
        title: 'Sub-Second Core Web Vitals',
        description: 'Optimized rendering pipelines, lazy-loaded media assets, and CDN edge distribution delivering sub-second Largest Contentful Paint (LCP).',
        icon: 'zap',
      },
      {
        title: 'Search-Engine-First Architecture',
        description: 'Built-in semantic HTML5, valid JSON-LD structured data, automatic XML sitemaps, OpenGraph social cards, and mobile-friendly layouts.',
        icon: 'search',
      },
      {
        title: 'Full-Stack Integration',
        description: 'Seamless integration with backend databases, Google Firebase, payment gateways, WhatsApp business cloud APIs, and enterprise CRMs.',
        icon: 'layers',
      },
      {
        title: 'Mobile-First Responsive Design',
        description: 'Ergonomic touch navigation, fluid layouts across smartphones, tablets, laptops, and ultra-wide screens with zero layout shifts.',
        icon: 'smartphone',
      },
    ],
    process: [
      { step: '01', title: 'Discovery & Wireframing', desc: 'Analyzing your target audience, conversion goals, and architectural specifications.' },
      { step: '02', title: 'Figma UI/UX & Prototyping', desc: 'Crafting high-fidelity interactive designs with brand-aligned typography and color schemes.' },
      { step: '03', title: 'Modern Clean Code Engineering', desc: 'Developing with React, TypeScript, and Tailwind CSS with strict automated testing.' },
      { step: '04', title: 'Production Launch & SEO Audit', desc: 'Zero-downtime deployment, SSL installation, Google Search Console indexing, and performance monitoring.' },
    ],
    useCases: [
      {
        title: 'Corporate Enterprise Portals',
        tag: 'B2B & IT Services',
        description: 'Multi-page branded authority websites with dynamic consultation scheduling, client portals, and live telemetry.',
        metric: '< 1.1s FCP on 4G Mobile',
      },
      {
        title: 'High-Conversion E-Commerce & Retail',
        tag: 'Retail & D2C',
        description: 'Headless storefronts with instant product search, real-time cart synchronization, and localized checkout flows.',
        metric: '+48% Repeat Checkout Rate',
      },
      {
        title: 'Interactive Web Apps & SaaS',
        tag: 'Startups & Scaleups',
        description: 'Real-time collaborative dashboards, customer accounts, subscription management, and analytics engines.',
        metric: '99.99% Guaranteed SLA Uptime',
      },
    ],
    faq: [
      {
        question: 'How long does it take to develop a custom business website?',
        answer: 'A standard professional business website typically takes 2 to 3 weeks from wireframing to production deployment, while complex web applications with custom database integrations range from 4 to 8 weeks.',
      },
      {
        question: 'Will my website be search-engine optimized (SEO) from day one?',
        answer: 'Yes! Every website engineered by Bitso Innovations is built with semantic HTML5, OpenGraph tags, canonical links, robots directives, and Schema.org structured data to ensure immediate crawlability by Googlebot.',
      },
      {
        question: 'Do you provide maintenance and technical support after launch?',
        answer: 'Absolutely. We provide ongoing maintenance SLAs covering server monitoring, SSL certificate renewals, security updates, and feature enhancements.',
      },
    ],
  },
  'software-development': {
    slug: 'software-development',
    name: 'Custom Software Development',
    metaTitle: 'Custom Software Development Company | Enterprise Web & Cloud Systems | Bitso Innovations',
    metaDescription: 'Custom software development services for modern businesses. We design and build enterprise ERPs, cloud microservices, APIs, and scalable internal tools.',
    keywords: [
      'custom software development',
      'software development services for businesses',
      'enterprise software development',
      'custom ERP systems',
      'cloud microservices development',
      'technical issue troubleshooting',
    ],
    heroBadge: 'ENTERPRISE SOFTWARE ENGINEERING',
    headline: 'Custom Software Designed Around Your Business Workflows',
    subheadline: 'Eliminate manual bottlenecks with enterprise-grade software systems, real-time operational ledgers, custom ERPs, and cloud microservices engineered for zero downtime.',
    primaryCtaText: 'Request Software Consultation',
    features: [
      {
        title: 'Microservices & Distributed Systems',
        description: 'Stateless Kubernetes microservices and containerized architectures built for horizontal auto-scaling and high fault tolerance.',
        icon: 'server',
      },
      {
        title: 'ACID Relational & Document Databases',
        description: 'Robust PostgreSQL and Firebase Firestore architectures designed with strict schema constraints, indexing, and data security.',
        icon: 'database',
      },
      {
        title: 'Sub-Millisecond In-Memory Caching',
        description: 'Integrated Redis caching layers reducing primary database load and accelerating frequent API read queries by up to 95%.',
        icon: 'zap',
      },
      {
        title: 'Automated Tax, GST & Financial Compliance',
        description: 'Real-time billing engines, GST E-Way invoice adapters, automated ledger reconciliation, and multi-entity accounting.',
        icon: 'shield',
      },
    ],
    process: [
      { step: '01', title: 'Workflow & Architecture Modeling', desc: 'Mapping physical business operations, bottlenecks, database schemas, and threat vectors.' },
      { step: '02', title: 'OpenAPI Contract Specification', desc: 'Designing strict RESTful APIs and real-time WebSocket protocol contracts before development.' },
      { step: '03', title: 'Iterative Sprint Implementation', desc: 'Modular development sprints with automated CI/CD pipelines and regression verification.' },
      { step: '04', title: 'Zero-Downtime Deployment & SLA', desc: 'Blue/green cloud rollout, Prometheus/Grafana telemetry, and dedicated 24/7 technical response.' },
    ],
    useCases: [
      {
        title: 'Omnichannel Warehouse & Inventory ERP',
        tag: 'Supply Chain & Wholesale',
        description: 'Unified multi-warehouse stock sync preventing overselling across retail counters, distributor portals, and e-commerce orders.',
        metric: '100% Automated GST Reconciliation',
      },
      {
        title: 'Hyperlocal Logistics & Dispatch Routing',
        tag: 'On-Demand Delivery',
        description: 'Batch rider assignment algorithms, geospatial Redis indexing, and sub-second live GPS tracking for courier fleets.',
        metric: '42% Overhead Cost Reduction',
      },
    ],
    faq: [
      {
        question: 'Can you migrate our existing legacy software to the modern cloud?',
        answer: 'Yes! We specialize in re-platforming legacy desktop or monolithic applications to modern, cloud-native web architectures with zero data loss.',
      },
      {
        question: 'Do we own the full source code and intellectual property (IP)?',
        answer: 'Yes. You receive 100% ownership of all source code, database schemas, deployment pipelines, and intellectual property upon project handover.',
      },
    ],
  },
  'student-projects': {
    slug: 'student-projects',
    name: 'Student Project Development Assistance',
    metaTitle: 'Student Project Development Assistance & Mentorship | Final-Year Capstone Guidance | Bitso Innovations',
    metaDescription: 'Bitso Innovations provides professional project development assistance and technical mentorship for computer science, IT, and engineering final-year student projects.',
    keywords: [
      'student project development assistance',
      'final-year engineering project guidance',
      'computer science capstone projects',
      'MERN stack student projects',
      'Python AI final year projects',
      'engineering viva voce preparation',
    ],
    heroBadge: 'ACADEMIC & TECHNICAL MENTORSHIP',
    headline: 'Practical Final-Year Engineering Project Guidance & Code Mentorship',
    subheadline: 'Turn your capstone concept into a fully functional, live-deployed full-stack web application. We mentor students on modern architectures, clean Git code, and viva voce defense.',
    primaryCtaText: 'Get Project Guidance',
    features: [
      {
        title: 'Real-World Problem Selection',
        description: 'Guidance in choosing impactful, practical problem statements that impress university evaluation committees and external examiners.',
        icon: 'award',
      },
      {
        title: 'Modern Industry Tech Stacks',
        description: 'Hands-on mentorship in modern tech stacks: React, TypeScript, Node.js, Express, Python, Firebase, PostgreSQL, and Machine Learning.',
        icon: 'cpu',
      },
      {
        title: 'Clean Git & Documentation Standards',
        description: 'Professional repository structure, modular coding practices, UML architecture diagrams, project synopses, and final project reports.',
        icon: 'fileText',
      },
      {
        title: 'Viva Voce & Technical Defense Prep',
        description: 'Mock technical interview and viva questions covering database selection, API security, state management, and algorithmic decisions.',
        icon: 'users',
      },
    ],
    process: [
      { step: '01', title: 'Topic Consultation & Feasibility', desc: 'Evaluating the project scope, novelty, university guidelines, and timeline feasibility.' },
      { step: '02', title: 'System Architecture & Schema', desc: 'Designing ER diagrams, database schemas, component structures, and user flow wireframes.' },
      { step: '03', title: 'Guided Code Development', desc: 'Mentoring through core functionality, authentication, API integrations, and bug fixing.' },
      { step: '04', title: 'Cloud Deployment & Viva Defense', desc: 'Deploying the project on live public cloud infrastructure and conducting mock viva practice.' },
    ],
    useCases: [
      {
        title: 'AI-Powered Smart Healthcare / Retail Platforms',
        tag: 'B.Tech / MCA Capstone',
        description: 'Full-stack applications with integrated prediction models, role-based dashboards, and real-time appointment booking.',
        metric: 'Top University Evaluation Grade',
      },
      {
        title: 'Decentralized & Logistics Tracking Systems',
        tag: 'B.E. / M.Tech Projects',
        description: 'Multi-tier distributed tracking platforms featuring live GPS telemetry, audit logs, and automated notification engines.',
        metric: '100% Working Production Deploy',
      },
    ],
    faq: [
      {
        question: 'What degree programs does Bitso Innovations support?',
        answer: 'We provide technical mentorship and guidance for students in B.Tech, B.E., BCA, MCA, B.Sc Computer Science, and M.Tech programs across India.',
      },
      {
        question: 'Will I understand how to explain and defend the code during my viva examination?',
        answer: 'Yes! Our mentorship focuses on deep conceptual understanding. We conduct thorough walkthroughs of the codebase so you can confidently answer every question asked by external examiners.',
      },
      {
        question: 'Is the project deployed on a live domain for examiners to inspect?',
        answer: 'Yes. We guide you through deploying your completed project to a live public cloud URL with HTTPS so evaluators can test the system on their own devices.',
      },
    ],
  },
  'ai-automation': {
    slug: 'ai-automation',
    name: 'Enterprise Cloud AI & Automation',
    metaTitle: 'Enterprise Cloud AI & Automation Solutions | Intelligent Workflows | Bitso Innovations',
    metaDescription: 'Harness practical generative AI, machine learning pipelines, and autonomous workflow automation to accelerate enterprise business operations.',
    keywords: [
      'AI solutions company',
      'cloud AI automation',
      'business process automation',
      'generative AI for enterprise',
      'intelligent workflows',
    ],
    heroBadge: 'INTELLIGENT CLOUD AUTOMATION',
    headline: 'Transform Manual Workflows with Practical Business AI & Automation',
    subheadline: 'Integrate custom language models, autonomous data extractors, intelligent routing agents, and real-time analytics to supercharge business productivity.',
    primaryCtaText: 'Explore AI Solutions',
    features: [
      {
        title: 'Enterprise Document & Data Extraction',
        description: 'Automated invoice parsing, contract analysis, and customer order ingestion using modern multimodal AI models.',
        icon: 'sparkles',
      },
      {
        title: 'Autonomous Customer Support Agents',
        description: 'Context-aware chatbots integrated directly with your inventory, booking, and CRM databases for sub-second responses.',
        icon: 'messageCircle',
      },
      {
        title: 'Predictive Inventory & Demand Forecasting',
        description: 'Machine learning algorithms analyzing seasonal buying trends to prevent stockouts and optimize warehouse purchasing.',
        icon: 'trendingUp',
      },
      {
        title: 'Private & Secure AI Architecture',
        description: 'Enterprise data remains strictly confidential with localized vector databases and private API proxy routing.',
        icon: 'shield',
      },
    ],
    process: [
      { step: '01', title: 'Data Audit & Opportunity Mapping', desc: 'Identifying repetitive operational tasks and high-ROI automation opportunities.' },
      { step: '02', title: 'Model Selection & Prompt Engineering', desc: 'Selecting optimal lightweight models and fine-tuning prompt strategies for consistency.' },
      { step: '03', title: 'API Integration & Pipeline Build', desc: 'Embedding AI triggers into existing ERPs, databases, and customer touchpoints.' },
      { step: '04', title: 'Monitoring & Continuous Refinement', desc: 'Tracking accuracy, token usage, latency, and feedback loops in production.' },
    ],
    useCases: [
      {
        title: 'Automated WhatsApp Customer Support Agent',
        tag: 'Retail & Service Enterprise',
        description: '24/7 intelligent conversational assistant handling catalog search, appointment bookings, and order status updates.',
        metric: '85% First-Contact Resolution',
      },
      {
        title: 'Intelligent B2B Order Processing',
        tag: 'Wholesale Distribution',
        description: 'Extracting purchase order line items from PDF invoices directly into the warehouse ERP without manual typing.',
        metric: '90% Data Entry Time Saved',
      },
    ],
    faq: [
      {
        question: 'Does my business need large amounts of data to implement AI automation?',
        answer: 'Not necessarily! Modern foundation models and intelligent API agents can be integrated into existing workflows with zero prior dataset training.',
      },
      {
        question: 'How do you ensure company customer data remains private?',
        answer: 'We architect strict server-side proxy environments where private customer data is never used to train public models, and all interactions are encrypted in transit and at rest.',
      },
    ],
  },
  'location-delhi-laxmi-nagar': {
    slug: 'location-delhi-laxmi-nagar',
    name: 'Website Development in Laxmi Nagar, Delhi',
    metaTitle: 'Website Development Company in Laxmi Nagar East Delhi | Bitso Innovations',
    metaDescription: 'Premier website development company in Laxmi Nagar, East Delhi. We build fast, mobile-friendly business websites, e-commerce stores, and custom software for local enterprises.',
    keywords: [
      'website development company in Laxmi Nagar Delhi',
      'web design Laxmi Nagar East Delhi',
      'IT services company Laxmi Nagar',
      'software development Laxmi Nagar Delhi',
      'ecommerce website design East Delhi',
      'website developer near Laxmi Nagar metro',
    ],
    heroBadge: 'LOCAL IT PARTNER · LAXMI NAGAR, EAST DELHI',
    headline: 'Premier Website Development & IT Solutions in Laxmi Nagar, East Delhi',
    subheadline: 'Empowering East Delhi businesses, retailers, and startups with high-speed, SEO-optimized business websites, custom software, and responsive e-commerce portals with dedicated local support.',
    primaryCtaText: 'Schedule In-Person Consultation',
    features: [
      {
        title: 'Accessible Local Engineering Team',
        description: 'Our physical presence in Laxmi Nagar, New Delhi 110092 enables face-to-face architectural reviews and direct accountability with executive leadership.',
        icon: 'users',
      },
      {
        title: 'Local SEO & Google Maps Synergy',
        description: 'Built-in local schema, geo-coordinates, and on-page optimization designed to rank your business for East Delhi and Delhi NCR search intent.',
        icon: 'search',
      },
      {
        title: 'Fast Mobile Core Web Vitals',
        description: 'Lightning-fast loading on mobile networks (sub-second LCP) so local customers never drop off due to slow pages.',
        icon: 'zap',
      },
      {
        title: 'Turnkey Maintenance & Support',
        description: 'Local emergency support, domain renewals, security monitoring, and regular backups handled by our in-house engineering team.',
        icon: 'shield',
      },
    ],
    process: [
      { step: '01', title: 'Consultation in Laxmi Nagar', desc: 'Meet our team at our East Delhi office to discuss your business goals and technical specifications.' },
      { step: '02', title: 'Custom UI/UX & Architecture', desc: 'Crafting responsive Figma wireframes with clear conversion funnels and WhatsApp integration.' },
      { step: '03', title: 'Clean Full-Stack Build', desc: 'Developing with React, TypeScript, and modern backend APIs with automated testing.' },
      { step: '04', title: 'Launch & Google Business Sync', desc: 'Deploying to high-speed cloud infrastructure with complete Google Search Console indexing.' },
    ],
    useCases: [
      {
        title: 'Retail Stores & Wholesale Traders in East Delhi',
        tag: 'Local Commercial',
        description: 'Omnichannel inventory sync and digital catalog portals for businesses in Laxmi Nagar, Gandhi Nagar, and Preet Vihar.',
        metric: '98+ Mobile PageSpeed Score',
      },
      {
        title: 'Professional Service Firms & Clinics',
        tag: 'Service Providers',
        description: 'Appointment scheduling websites with instant WhatsApp notification triggers and Google Calendar sync.',
        metric: '3x More Online Client Inquiries',
      },
    ],
    faq: [
      {
        question: 'Where is Bitso Innovations located in Laxmi Nagar?',
        answer: 'Bitso Innovations is headquartered in Laxmi Nagar, New Delhi 110092. You can schedule an in-person meeting with our technical leadership team or connect via phone at +91 99903 66072.',
      },
      {
        question: 'Can you help our local business rank on Google in East Delhi?',
        answer: 'Yes! We configure local business Schema.org microdata, location landing pages, mobile speed optimization, and Google Search Console indexing to help you dominate local search queries.',
      },
    ],
  },
  'location-delhi-ncr': {
    slug: 'location-delhi-ncr',
    name: 'Custom Software Development in Delhi NCR',
    metaTitle: 'Custom Software Development Company in Delhi NCR | Bitso Innovations',
    metaDescription: 'Leading custom software development and IT consulting company in Delhi NCR. Bitso Innovations delivers enterprise ERPs, cloud platforms, and full-stack web applications.',
    keywords: [
      'custom software development company in Delhi NCR',
      'IT consulting services Delhi NCR',
      'MERN stack developers Delhi',
      'enterprise software development Delhi',
      'software development agency Gurgaon Noida Delhi',
    ],
    heroBadge: 'ENTERPRISE TECH PARTNER · DELHI NCR',
    headline: 'Enterprise Custom Software Development & IT Consulting in Delhi NCR',
    subheadline: 'Engineering scalable cloud software, custom ERPs, and high-concurrency web systems for businesses across New Delhi, Gurgaon, Noida, and Faridabad.',
    primaryCtaText: 'Request Executive Proposal',
    features: [
      {
        title: 'High-Concurrency Cloud Architecture',
        description: 'Microservices and Kubernetes architectures built for auto-scaling and high availability across distributed regional hubs.',
        icon: 'server',
      },
      {
        title: 'Custom ERP & Logistics Engines',
        description: 'Unified supply chain ledgers, automated GST invoice reconciliation, and real-time inventory management for Delhi NCR enterprises.',
        icon: 'database',
      },
      {
        title: 'Dedicated Senior Engineering SLAs',
        description: 'Direct executive oversight from Founder & President Aman and Technical / IT Head Tamanna Aggarwal with guaranteed response SLAs.',
        icon: 'award',
      },
      {
        title: 'Bank-Grade Cybersecurity Protocols',
        description: 'Zero-trust IAM, role-based access control (RBAC), and automated vulnerability scans safeguarding proprietary corporate data.',
        icon: 'shield',
      },
    ],
    process: [
      { step: '01', title: 'Executive Discovery & Feasibility', desc: 'Analyzing existing enterprise software bottlenecks, data flow schemas, and compliance requirements.' },
      { step: '02', title: 'System Architecture Specification', desc: 'Designing OpenAPI contracts, relational database schemas, and microservice topologies.' },
      { step: '03', title: 'Agile Milestone Sprints', desc: 'Two-week development sprints with live staging deployments and client feedback loops.' },
      { step: '04', title: 'Zero-Downtime Rollout & Support', desc: 'Production deployment with 24/7 telemetry monitoring, database backups, and maintenance SLAs.' },
    ],
    useCases: [
      {
        title: 'Delhi NCR Supply Chain & Logistics Network',
        tag: 'B2B Enterprise',
        description: 'Multi-warehouse dispatch routing, automated E-Way bill generation, and live fleet telemetry across the NCR region.',
        metric: '100% Automated GST Reconciliation',
      },
      {
        title: 'Corporate Financial & Advisory Portals',
        tag: 'Financial Services',
        description: 'Encrypted document vaults, role-based client review workflows, and instant multi-party audit trails.',
        metric: 'Sub-second API Query Execution',
      },
    ],
    faq: [
      {
        question: 'Do you serve clients across all of Delhi NCR including Noida and Gurgaon?',
        answer: 'Yes! Bitso Innovations works with mid-market businesses, startups, and large enterprises across New Delhi, Gurgaon, Noida, Greater Noida, and Faridabad.',
      },
      {
        question: 'What technologies do your software engineers specialize in?',
        answer: 'Our core stack includes React 19, TypeScript, Node.js, Express, Python, PostgreSQL, Google Firebase, Redis, Docker, and modern Cloud infrastructure.',
      },
    ],
  },
};
