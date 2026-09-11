export interface ServiceItem {
  id: string;
  title: string;
  category: 'core' | 'advanced';
  description: string;
  bulletPoints: string[];
  clientBenefit?: string;
  iconName: string;
}

export interface FlagshipPillar {
  id: string;
  number: string;
  title: string;
  description: string;
  features: string[];
  iconName: string;
  badge: string;
}

export interface DigitalLoopStep {
  step: string;
  title: string;
  tagline: string;
  description: string;
  metrics: string;
}

export interface RoadmapMilestone {
  yearRange: string;
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
  status: 'active' | 'upcoming';
}

export interface CorePillar {
  title: string;
  description: string;
  highlight: string;
  iconName: string;
}

export interface InquiryFormData {
  fullName: string;
  businessName: string;
  businessType: string;
  phone: string;
  email: string;
  storesCount: string;
  interest: string;
  message: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  role?: string;
  createdAt?: string | number;
}

export interface Appointment {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  businessName: string;
  businessType: string;
  storesCount: string;
  interest: string;
  preferredDate: string;
  timeSlot: string;
  meetingType: 'video' | 'phone' | 'in-person';
  message: string;
  status: 'pending' | 'confirmed' | 'in_discussion' | 'completed' | 'cancelled';
  createdAt?: any;
  updatedAt?: any;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'retail' | 'erp' | 'logistics' | 'ai';
  categoryLabel: string;
  clientType: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  techStack: string[];
  metrics: { value: string; label: string };
  badge: string;
}

export type SlideId = 'home' | 'about' | 'services' | 'why-us' | 'portfolio' | 'contact';
