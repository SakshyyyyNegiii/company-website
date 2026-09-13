export interface FaqItem {
  id: string;
  category: 'scalability' | 'migration' | 'security' | 'timelines' | 'integrations';
  categoryLabel: string;
  question: string;
  summary: string;
  detailedAnswer: string;
  takeaways: string[];
  graphicBadge: string;
  metricBadge?: { label: string; value: string };
}

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'scale-multi-store',
    category: 'scalability',
    categoryLabel: 'Scalability & Cloud',
    question: 'How seamlessly does Bitso architecture scale as we expand from 1 store to 50+ locations?',
    summary: 'Our cloud-native microservices scale elastically with zero code rewrites or database migrations.',
    detailedAnswer:
      'Bitso Innovations employs a distributed containerized architecture (Kubernetes / Docker) paired with read-replica cloud database clusters. Each newly added retail location or warehouse node is provisioned in minutes via automated infrastructure templates. Traffic spikes during festive sales (such as Diwali or Black Friday) trigger sub-second auto-scaling without performance degradation.',
    takeaways: [
      'Multi-region read replicas ensure local counter latency stays <40ms',
      'Automated tenant isolation guarantees cross-store data integrity',
      'Tested to handle 10,000+ simultaneous checkout requests per second',
    ],
    graphicBadge: 'Elastic Mesh',
    metricBadge: { label: 'Scale Elasticity', value: '1 to 1,000+ Nodes' },
  },
  {
    id: 'zero-downtime-migration',
    category: 'migration',
    categoryLabel: 'Zero-Downtime Migration',
    question: 'Can we transition our legacy POS/ERP data without interrupting daily store sales?',
    summary: 'Yes. We run a dual-write replication pipeline that keeps your existing checkout counters 100% operational.',
    detailedAnswer:
      'We recognize that retail operations cannot afford a single minute of store blackout. Our phased migration protocol uses real-time CDC (Change Data Capture) connectors that shadow-sync legacy Tally, Busy, or local SQL databases to our cloud platform in the background. Once data parity reaches 100%, we execute an instant off-peak cutover with zero downtime and roll-back safety locks.',
    takeaways: [
      'Zero interruption to frontline customer billing during checkout',
      'Automated data sanitization & historical catalog deduplication',
      'Parallel fallback pipeline active for 14 days post-cutover',
    ],
    graphicBadge: 'CDC Shadow-Sync',
    metricBadge: { label: 'Migration Downtime', value: '0 Minutes' },
  },
  {
    id: 'offline-resilience',
    category: 'scalability',
    categoryLabel: 'Offline Resilience',
    question: 'What happens if our retail outlet loses broadband or local internet connection?',
    summary: 'Frontline billing operates uninterrupted in offline mode and auto-syncs when reconnecting.',
    detailedAnswer:
      'Our point-of-sale edge engines are built with local SQLite and IndexedDB caching. Cashiers can continue scanning barcodes, generating GST-compliant thermal invoices, and accepting cash or local payments without an active internet connection. As soon as the network returns, an intelligent two-way conflict-resolution protocol commits local transactions to the central cloud ledger within seconds.',
    takeaways: [
      'Full offline barcode lookup and invoice generation preserved',
      'Autonomous queueing ensures no lost transactions or bill numbers',
      'Instant cloud ledger reconciliation upon internet reconnection',
    ],
    graphicBadge: 'Offline-First Edge',
    metricBadge: { label: 'Billing Continuity', value: '100% Uptime' },
  },
  {
    id: 'data-security-compliance',
    category: 'security',
    categoryLabel: 'Security & Compliance',
    question: 'How is proprietary customer data, transaction records, and inventory pricing safeguarded?',
    summary: 'Bank-grade AES-256 encryption, zero-trust RBAC permissions, and strict Indian compliance standards.',
    detailedAnswer:
      'Security is engineered into every packet. All API endpoints enforce mTLS and zero-trust authentication. Customer PII (Personally Identifiable Information) and payment tokens are salted and encrypted at rest using AES-256. Access is managed through granular Role-Based Access Control (RBAC), ensuring cashier staff only view necessary point-of-sale screens while margins and P&L remain restricted to authorized executives.',
    takeaways: [
      'Full alignment with RBI digital payment data storage mandates',
      'Automated hourly encrypted offsite cloud database backups',
      'Granular audit logging tracking every invoice alteration and stock adjustment',
    ],
    graphicBadge: 'AES-256 Zero-Trust',
    metricBadge: { label: 'Security Grade', value: 'Bank-Level' },
  },
  {
    id: 'rollout-timeline',
    category: 'timelines',
    categoryLabel: 'Timelines & Rollout',
    question: 'What is the implementation timeline, and when can we expect measurable operational impact?',
    summary: 'Production deployment takes 4 to 6 weeks, with measurable overhead reduction in the very first billing cycle.',
    detailedAnswer:
      'Our structured 4-phase rollout gets your core catalog and central inventory live in under 30 days. By automating manual reconciliations between physical shelves, WhatsApp orders, and courier dispatch, clients typically experience an immediate 35–45% reduction in administrative labor overhead. Frontline teams achieve streamlined multi-store operational parity in 1.2 to 3.8 months.',
    takeaways: [
      'Rapid 4 to 6 week sprint from discovery to production launch',
      'Immediate elimination of double-entry paperwork & courier leakage',
      'Streamlined operations across all physical stores within the first quarter',
    ],
    graphicBadge: 'Fast-Track Value',
    metricBadge: { label: 'Go-Live Speed', value: '30 - 45 Days' },
  },
  {
    id: 'hardware-logistics-integrations',
    category: 'integrations',
    categoryLabel: 'Hardware & Integrations',
    question: 'Does Bitso integrate with our existing thermal printers, UPI soundboxes, and courier services?',
    summary: 'Universal hardware bridge drivers and pre-built logistics webhooks work with standard retail gear.',
    detailedAnswer:
      'You do not need to replace your existing shop-floor hardware. Bitso provides plug-and-play drivers for standard ESC/POS USB and Bluetooth thermal printers, 1D/2D barcode guns, and biometric clocks. Furthermore, our logistics mesh comes pre-integrated with Indian hyperlocal couriers (Dunzo, Porter, Shiprocket, Borzo) and payment processors (Razorpay, PhonePe, PineLabs, Paytm Soundbox).',
    takeaways: [
      'No expensive mandatory hardware upgrade required for deployment',
      'Automated dispatch dispatching nearest hyperlocal courier within 90 seconds',
      'Instant payment confirmation webhooks synced directly to cash drawer',
    ],
    graphicBadge: 'Plug & Play APIs',
    metricBadge: { label: 'Hardware Compatibility', value: '99% Standard' },
  },
];
