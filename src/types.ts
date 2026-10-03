export type SectionId = 'home' | 'services' | 'work' | 'contact';
export type SlideId = SectionId; // Backwards-compatible alias

export interface ServiceItem {
  id: string;
  title: string;
  category: 'web' | 'software' | 'ai' | 'mobile' | 'design';
  description: string;
  focus: string;
  iconName: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'retail' | 'fashion' | 'erp' | 'logistics';
  categoryLabel: string;
  clientType: string;
  summary: string;
  results: string[];
  techStack: string[];
  metrics: { value: string; label: string };
  badge: string;
  imageUrl: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  shortDesc: string;
}

export interface Appointment {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  businessName?: string;
  businessType?: string;
  storesCount?: string;
  interest: string;
  preferredDate?: string;
  timeSlot?: string;
  meetingType?: 'video' | 'phone' | 'in-person';
  message: string;
  status: 'pending' | 'confirmed' | 'in_discussion' | 'completed' | 'cancelled';
  createdAt?: any;
  updatedAt?: any;
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

export interface UserInquiry {
  id?: string;
  userId?: string | null;
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt?: any;
  status?: string;
}

