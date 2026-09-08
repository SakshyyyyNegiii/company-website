import {
  ServiceItem,
  FlagshipPillar,
  DigitalLoopStep,
  RoadmapMilestone,
  CorePillar,
} from '../types';

export const COMPANY_INFO = {
  name: 'Bitso Innovations',
  tagline: 'INNOVATIVE SOLUTIONS. DIGITAL FUTURE.',
  subheading: 'Engineering smarter systems for businesses ready to scale, automate, and compete.',
  flagshipTitle: 'E-commerce Platform Transformation for Brick-and-Mortar Retail Stores',
  specializations: ['AI', 'SOFTWARE', 'DIGITAL SOLUTIONS'],
  leadership: {
    name: 'Ch. Aman Pal',
    role: 'Co-Founder & Director',
    quote:
      'The future belongs to businesses that connect technology with execution. Let\'s build your digital advantage—together.',
  },
  contact: {
    phones: ['99903 66072', '93101 89235'],
    email: 'info@bitsoinnovations.com',
    website: 'www.bitsoinnovations.com',
    location: 'Laxmi Nagar, East Delhi, New Delhi-110092',
    fullAddress: 'Laxmi Nagar, East Delhi, New Delhi, India 110092',
  },
  keyMetrics: [
    { value: '40%', label: 'Overhead Reduction', note: 'Average operational cost savings delivered to enterprise clients' },
    { value: '500+', label: 'Store Onboarding', note: 'Regional stores targeted for digitization in Year 1 alone' },
    { value: '1 to 1,000', label: 'Store Scale Elasticity', note: 'Enterprise infrastructure built to grow without friction' },
    { value: '24/7', label: 'Proactive Support', note: 'Round-the-clock technical excellence & partnership' },
  ],
};

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: 'custom-software',
    category: 'core',
    title: 'Custom Software Development',
    description: 'Enterprise workflow automation, API-first architecture, bank-grade encryption.',
    bulletPoints: [
      'Enterprise workflow automation with bespoke modular logic',
      'Robust API-first architecture for seamless cross-system interoperability',
      'Bank-grade encryption protocols and zero-trust security standards',
    ],
    clientBenefit: '40% reduction in daily operational overheads',
    iconName: 'Code2',
  },
  {
    id: 'mobile-app',
    category: 'core',
    title: 'Mobile App Development',
    description: 'Native iOS/Android apps with ultra-smooth UI/UX and built-in behavior analytics.',
    bulletPoints: [
      'Native iOS & Android development with silky 60fps micro-interactions',
      'Built-in real-time behavior analytics for multi-channel customer retention',
      'Offline-first synchronization for uninterrupted frontline store operations',
    ],
    clientBenefit: 'Drives repeat purchases & higher daily active engagement',
    iconName: 'Smartphone',
  },
  {
    id: 'web-development',
    category: 'core',
    title: 'Web Development & Design',
    description: 'Scalable web architectures with lightning-fast Core Web Vitals & conversion optimization.',
    bulletPoints: [
      'Scalable web architectures tailored for sub-second page loads',
      'Lightning-fast Core Web Vitals optimization for superior Google rankings',
      'Heavy conversion rate optimization (CRO) frameworks for maximum ROI',
    ],
    clientBenefit: 'Sub-second response times & high-converting sales funnels',
    iconName: 'Globe',
  },
];

export const ADVANCED_STACK: ServiceItem[] = [
  {
    id: 'crm-erp',
    category: 'advanced',
    title: 'CRM | ERP Solutions',
    description: 'Centralized business operations with modular ledger management and automated client billing.',
    bulletPoints: [
      'Centralized business operations unifying sales, inventory, and procurement',
      'Modular multi-entity ledger management for accurate financial accounting',
      'Automated client billing and GST-compliant invoicing for complete visibility',
    ],
    clientBenefit: 'Real-time visibility over enterprise cashflow & stock',
    iconName: 'Database',
  },
  {
    id: 'cloud-digital',
    category: 'advanced',
    title: 'Cloud & Digital Solutions',
    description: 'Multi-cloud architecture on AWS/Azure with containerized Docker deployment and cybersecurity.',
    bulletPoints: [
      'Resilient multi-cloud architectures deployed on AWS and Microsoft Azure',
      'Containerized microservices via Docker & Kubernetes for zero downtime',
      'Strict cybersecurity compliance, automatic failovers, and proactive monitoring',
    ],
    clientBenefit: '99.99% uptime with enterprise-level fault tolerance',
    iconName: 'Cloud',
  },
  {
    id: 'ai-automation',
    category: 'advanced',
    title: 'AI & Business Automation',
    description: 'Predictive analytics and intelligent workflows with custom LLM integrations.',
    bulletPoints: [
      'Predictive analytics engines forecasting consumer demand and supply bottlenecks',
      'Intelligent robotic workflows automating repetitive manual data entry tasks',
      'Custom LLM integrations for autonomous customer service and data-driven decision making',
    ],
    clientBenefit: 'Autonomous operational speed & predictive market advantage',
    iconName: 'Cpu',
  },
];

export const FLAGSHIP_PILLARS: FlagshipPillar[] = [
  {
    id: 'pillar-1',
    number: '01',
    title: 'Smart Retail Management',
    description: 'Cloud POS sync and centralized inventory management across all locations in real time.',
    badge: 'Real-Time Sync',
    features: [
      'Multi-outlet inventory unification preventing overselling and dead stock',
      'Instant POS cloud synchronization within milliseconds across all cash counters',
      'Live stock alerts and automated supplier purchase order generation',
    ],
    iconName: 'Laptop',
  },
  {
    id: 'pillar-2',
    number: '02',
    title: 'Custom E-Commerce Platforms',
    description: 'High-conversion checkout with secure localized payment gateways built for Indian retail.',
    badge: 'High Conversion',
    features: [
      'Native Indian payment gateway integration (UPI, QR, Cards, EMI, NetBanking)',
      'Sub-3-second mobile-first checkout flows tuned for quick neighborhood ordering',
      'Bespoke branded storefront showcasing real-time shelf availability',
    ],
    iconName: 'ShoppingBag',
  },
  {
    id: 'pillar-3',
    number: '03',
    title: 'Hyper-Local Logistics APIs',
    description: 'Zero-delay routing for rapid same-day fulfillment at the neighborhood level.',
    badge: 'Same-Day Dispatch',
    features: [
      'Zero-delay dispatch routing linking physical stores to nearest delivery partners',
      'Geofenced neighborhood radius delivery tracking with live SMS/WhatsApp updates',
      'Batch fulfillment algorithms for efficient local courier cost reduction',
    ],
    iconName: 'Truck',
  },
  {
    id: 'pillar-4',
    number: '04',
    title: 'Customer Analytics & Loyalty',
    description: 'Automated WhatsApp/SMS promotional campaigns that drive repeat purchase behavior.',
    badge: 'Retention Engine',
    features: [
      'Automated personalized WhatsApp broadcast campaigns for localized promotions',
      'Tiered digital membership and loyalty points synced between store & online checkout',
      'Predictive repeat re-order triggers based on customer purchasing rhythms',
    ],
    iconName: 'Users',
  },
];

export const DIGITAL_LOOP_STEPS: DigitalLoopStep[] = [
  {
    step: '01',
    title: 'Physical Store',
    tagline: 'Physical presence and local brand equity',
    description: 'Harness existing footfall, trust, and neighborhood relationships as an unassailable competitive advantage.',
    metrics: 'Local trust & immediate stock foundation',
  },
  {
    step: '02',
    title: 'Digital Catalog',
    tagline: 'Live product listings with real-time inventory',
    description: 'Physical shelf stock automatically mirrors on an ultra-fast digital showcase accessible anywhere on smartphones.',
    metrics: 'Zero discrepancies between shelf and screen',
  },
  {
    step: '03',
    title: 'Order & Payment',
    tagline: 'Secure, localized multi-gateway checkout',
    description: 'Seamless checkout via instant UPI, credit/debit, and cash options tailored to Indian consumer habits.',
    metrics: '< 45s checkout completion rate',
  },
  {
    step: '04',
    title: 'Delivery',
    tagline: 'Hyper-local same-day logistics fulfillment',
    description: 'Automated dispatch routes orders from the nearest brick-and-mortar hub straight to customers within hours.',
    metrics: 'Same-day neighborhood fulfillment',
  },
  {
    step: '05',
    title: 'Loyal Customer',
    tagline: 'Automated retention via WhatsApp/SMS campaigns',
    description: 'Data-driven engagement loops with customized offers ensure customer lifetime value increases continually.',
    metrics: '35%+ boost in repeat purchase frequency',
  },
];

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    yearRange: '2026–2027',
    phase: 'Year 1',
    title: 'Foundation & Local Retail Digitization',
    description: 'Onboarding 500+ regional stores onto the Bitso digital infrastructure platform.',
    deliverables: [
      'Launch of unified Cloud POS & E-commerce suite for Delhi NCR & tier-1 retail hubs',
      'Establishment of plug-and-play onboarding kits for regional grocery & apparel chains',
      'Integration with leading Indian payment aggregators and local courier networks',
    ],
    status: 'active',
  },
  {
    yearRange: '2027–2028',
    phase: 'Year 2',
    title: 'AI Automation Integration',
    description: 'Smart predictive inventory management and automated AI chatbots for customer engagement.',
    deliverables: [
      'Rollout of proprietary AI demand-forecasting algorithms to eliminate overstocking',
      'Multilingual conversational AI chatbots deployed on WhatsApp for 24/7 ordering',
      'Automated dynamic pricing and personalized promotional engines',
    ],
    status: 'upcoming',
  },
  {
    yearRange: '2028–2029',
    phase: 'Year 3',
    title: 'Pan-India Logistics Grid',
    description: 'Scaling local delivery API networks to tier-2 and tier-3 cities across India.',
    deliverables: [
      'Nationwide routing mesh interconnecting 150+ regional transit hubs',
      'Sub-hour micro-fulfillment partnerships in emerging metropolitan clusters',
      'Unified logistics dashboard for real-time fleet telemetry and SLA monitoring',
    ],
    status: 'upcoming',
  },
  {
    yearRange: '2029–2030',
    phase: 'Year 4',
    title: 'Enterprise Cross-Border Capabilities',
    description: 'Multi-currency and localized international shipping frameworks for global commerce.',
    deliverables: [
      'Multi-currency checkout and automated FX hedging for domestic exporters',
      'Cross-border customs and automated clearance document generation',
      'Global CDN acceleration for seamless international customer experiences',
    ],
    status: 'upcoming',
  },
  {
    yearRange: '2030–2031',
    phase: 'Year 5',
    title: 'Global Tech Ecosystem Leader',
    description: 'Launching decentralized web3 security protocols and autonomous supply chain systems.',
    deliverables: [
      'Decentralized cryptographic verification of product authenticity & provenance',
      'Autonomous smart contract settlements across multi-tier supplier networks',
      'Global enterprise deployment recognized as the standard omni-channel infrastructure',
    ],
    status: 'upcoming',
  },
];

export const CORE_PILLARS: CorePillar[] = [
  {
    title: 'Founding Team Mentorship',
    description: 'Direct access to visionary leadership and strategic guidance from day one of your digital transformation journey.',
    highlight: 'Founder-level strategic oversight on every rollout',
    iconName: 'Sparkles',
  },
  {
    title: 'Highly Scalable Architecture',
    description: 'Enterprise-grade infrastructure built to grow with your business — from 1 store to 1,000 locations without friction.',
    highlight: 'Zero latency degradation under peak flash traffic',
    iconName: 'Layers',
  },
  {
    title: '24/7 Proactive Support',
    description: 'Round-the-clock technical excellence and true partnership — we don\'t just deliver, we stay and scale with you.',
    highlight: 'Dedicated response engineering SLA',
    iconName: 'Headphones',
  },
];
