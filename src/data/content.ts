import {
  ServiceItem,
  PortfolioItem,
  ProcessStep,
  LeadershipMember,
} from '../types';

export const COMPANY_INFO = {
  name: 'Bitso Innovations',
  headline: 'Building Digital Solutions That Move Your Business Forward.',
  subline: 'Enterprise-grade cloud architectures, high-concurrency web platforms, and autonomous AI automation engineered for sub-second latency and unstoppable business growth.',
  whyHeading: 'Why Bitso Innovations?',
  valueProposition: 'Client-focused • Modern technology • End-to-end solutions • Scalable development',
  ctaHeading: "Have an Idea? Let's Build It.",
  ctaSubline: "Let's turn your idea into a modern digital solution.",
  contact: {
    contactPerson: 'ch. AMAN',
    phones: ['+91 99903 66072'],
    rawPhones: ['9990366072'],
    phone: '+91 99903 66072',
    email: 'info.bitsoinnovations@gmail.com',
    website: 'www.bitsoinnovations.com',
    location: 'Laxmi Nagar, New Delhi, India 110092',
    instagram: 'https://www.instagram.com/bitso_i.t?stkn=djUwOTUzZ2MxOW90',
    instagramHandle: '@bitso_i.t',
  },
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bitso-innovations/?viewAsMember=true' },
    { label: 'Instagram', href: 'https://www.instagram.com/bitso_i.t?stkn=djUwOTUzZ2MxOW90' },
    { label: 'Twitter', href: 'https://twitter.com/bitsoinnovate' },
    { label: 'WhatsApp', href: 'https://wa.me/919990366072' },
  ],
};

// Exactly 5 concise services as requested
export const SERVICES: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Web Development',
    category: 'web',
    description: 'High-speed, conversion-focused web applications built on scalable modern frameworks.',
    focus: 'Fast Core Web Vitals · Dynamic SSR · Conversion UX',
    iconName: 'Globe',
  },
  {
    id: 'software-dev',
    title: 'Software Development',
    category: 'software',
    description: 'Bespoke enterprise software, API-first integrations, and automated operational backbones.',
    focus: 'Modular Microservices · Bank-Grade Security · Cloud Scale',
    iconName: 'Code2',
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    category: 'ai',
    description: 'Predictive intelligence, autonomous workflow pipelines, and custom LLM-powered integrations.',
    focus: 'Intelligent Agents · Process Automation · Predictive Data',
    iconName: 'Sparkles',
  },
  {
    id: 'app-dev',
    title: 'App Development',
    category: 'mobile',
    description: 'Native iOS & Android mobile apps engineered with fluid 60fps UX and real-time offline sync.',
    focus: 'Cross-Platform Excellence · Native Speed · Instant Sync',
    iconName: 'Smartphone',
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    category: 'design',
    description: 'Clean, research-backed user interfaces designed for frictionless engagement and retention.',
    focus: 'Design Systems · Interaction Design · User Research',
    iconName: 'Layout',
  },
];

// Exactly 4 genuine existing projects from current website
export const PORTFOLIO_PROJECTS: PortfolioItem[] = [
  {
    id: 'grocery-omnichannel',
    title: 'Omni-Channel Retail Grocery Chain',
    category: 'retail',
    categoryLabel: 'Retail & E-commerce',
    clientType: 'Multi-Outlet Supermarket (Delhi NCR)',
    summary: 'Cloud POS real-time sync with online catalog and 45-minute neighborhood delivery.',
    results: [
      '+34% sales volume in 90 days',
      'Zero discrepancy between shelf & app',
      'Sub-45 min local delivery SLA',
    ],
    techStack: ['React', 'Node.js', 'Cloud POS Sync', 'UPI Gateways'],
    metrics: { value: '+34%', label: 'Sales Growth in 90 Days' },
    badge: 'Live Platform',
    imageUrl: '/images/smart_retail_store_1788799895410.jpg',
  },
  {
    id: 'fashion-webstore',
    title: 'Fashion & Apparel Retail Network',
    category: 'fashion',
    categoryLabel: 'Retail & E-commerce',
    clientType: 'Apparel Brand (6 Outlets & Webstore)',
    summary: 'Sub-3s mobile storefront paired with unified customer loyalty and WhatsApp retention.',
    results: [
      '+48% repeat customer retention',
      'Mobile load time dropped to 1.6s',
      '4.2x digital platform capital efficiency',
    ],
    techStack: ['Next.js', 'Tailwind CSS', 'WhatsApp Cloud API', 'Cloud CDN'],
    metrics: { value: '+48%', label: 'Repeat Customer Retention' },
    badge: 'Enterprise Deployment',
    imageUrl: '/images/fashion_store_pos_1789233230487.jpg',
  },
  {
    id: 'wholesale-erp',
    title: 'B2B Wholesale & Distribution ERP',
    category: 'erp',
    categoryLabel: 'Enterprise ERP',
    clientType: 'Regional FMCG Distributor (Delhi NCR)',
    summary: 'Automated GST-compliant invoicing, credit limit controls, and multi-warehouse inventory ledger.',
    results: [
      '65% faster payment reconciliation',
      '100% automated GST e-way billing',
      'Real-time cashflow across 3 warehouses',
    ],
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    metrics: { value: '65%', label: 'Faster Payment Cycles' },
    badge: 'Custom ERP',
    imageUrl: '/images/enterprise_erp_1789233248383.jpg',
  },
  {
    id: 'courier-routing',
    title: 'Hyper-Local Courier Routing Mesh',
    category: 'logistics',
    categoryLabel: 'Logistics & Fleet',
    clientType: 'Express Delivery Fleet (80+ Riders)',
    summary: 'Proprietary batch routing algorithm linking store counters directly to nearest active riders.',
    results: [
      '42% logistics overhead reduction',
      'Sub-hour citywide transit guarantee',
      'Zero reliance on aggregator commissions',
    ],
    techStack: ['WebSockets', 'Redis Geo', 'Map Telemetry', 'Flutter App'],
    metrics: { value: '42%', label: 'Logistics Cost Savings' },
    badge: 'Proprietary Routing',
    imageUrl: '/images/hyperlocal_logistics_1788799912853.jpg',
  },
];

// Simple linear 4-step process
export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Discover',
    shortDesc: 'Deep dive into your business workflows, user needs, and technical requirements.',
  },
  {
    step: '02',
    title: 'Design',
    shortDesc: 'Crafting user-centric UI/UX prototypes and robust system architectures.',
  },
  {
    step: '03',
    title: 'Develop',
    shortDesc: 'Iterative, agile engineering using modern tech stacks with continuous quality assurance.',
  },
  {
    step: '04',
    title: 'Launch',
    shortDesc: 'Seamless production deployment, performance optimization, and proactive support.',
  },
];

// Official Leadership Team
export const LEADERSHIP_MEMBERS: LeadershipMember[] = [
  {
    id: 'aman',
    name: 'Aman',
    designation: 'Founder and President',
    department: 'Executive Leadership & Strategy',
    bio: 'Visionary entrepreneur directing Bitso Innovations’ technological vision, enterprise partnerships, and end-to-end digital transformation for modern businesses.',
    phone: '+91 99903 66072',
    rawPhone: '9990366072',
    email: 'info.bitsoinnovations@gmail.com',
    linkedin: 'https://www.linkedin.com/company/bitso-innovations/?viewAsMember=true',
    image: '/images/aman_founder.jpg',
    fallbackImage: '/images/director_portrait.jpg',
    initials: 'AM',
    responsibilities: [
      'Corporate Strategy & Governance',
      'Client Solutions & Architecture',
      'Long-Term Technology Roadmap'
    ],
  },
  {
    id: 'jitender',
    name: 'Jitender',
    designation: 'Vice President of Business Development',
    department: 'Business Development & Strategic Alliances',
    bio: 'Leading strategic market expansion, commercial partnerships, and enterprise client relationships to scale Bitso Innovations’ digital solutions nationwide.',
    phone: '+91 95602 03642',
    rawPhone: '9560203642',
    email: 'info.bitsoinnovations@gmail.com',
    linkedin: 'https://www.linkedin.com/company/bitso-innovations/?viewAsMember=true',
    image: '/images/jitender_vp.jpg',
    fallbackImage: '/images/enterprise_erp.jpg',
    initials: 'JT',
    responsibilities: [
      'Enterprise Client Partnerships',
      'Strategic Commercial Growth',
      'Market Penetration & Client Success'
    ],
  },
  {
    id: 'tamanna',
    name: 'Tamanna',
    designation: 'Technical / IT Head',
    department: 'Engineering & Technology Operations',
    bio: 'Driving technical architecture, agile software delivery, cloud systems, and AI engineering standards across all enterprise web and mobile solutions.',
    phone: '+91 98111 04327',
    rawPhone: '9811104327',
    email: 'info.bitsoinnovations@gmail.com',
    linkedin: 'https://www.linkedin.com/company/bitso-innovations/?viewAsMember=true',
    image: '/images/tamanna_it_head.jpg',
    fallbackImage: '/images/smart_retail_store.jpg',
    initials: 'TM',
    responsibilities: [
      'Full-Stack Architecture & Cloud Scale',
      'IT Infrastructure & DevOps Quality',
      'Agile Engineering Delivery'
    ],
  },
];

// Official Legal & Operational Disclaimer
export const OFFICIAL_DISCLAIMER = {
  title: 'Disclaimer',
  heading: 'BITSO Innovations is an independent Information Technology (IT) company',
  subheading: 'specializing in technology solutions, software development, website development, and other IT-related services.',
  clarification: 'We hereby clarify that our company has no association, affiliation, or involvement with cryptocurrency trading, forex trading, investment schemes, or any related financial trading activities. We do not provide trading services, investment advice, or financial brokerage services.',
  representation: 'Any individual, organization, or third party claiming to represent our company in connection with cryptocurrency, forex trading, or investment-related activities does so without our authorization, unless explicitly stated otherwise by us in writing.',
  operationScope: 'Our company operates solely as an IT and technology service provider. We shall not be held responsible for any financial transactions, losses, or commitments made by individuals or entities falsely using our company’s name.',
  contactNotice: 'For official information about our services, please contact us only through our authorized communication channels.',
  authorizedChannels: {
    website: 'www.bitsoinnovations.com',
    email: 'info.bitsoinnovations@gmail.com',
    phone: '+91 99903 66072',
    instagram: '@bitso_i.t',
  },
};
