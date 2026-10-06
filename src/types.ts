export type Tone =
  | 'graphite'
  | 'azure'
  | 'amber'
  | 'copper'
  | 'emerald'
  | 'violet'
  | 'ruby'
  | 'slate';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  mrp?: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  isNew?: boolean;
  visible: boolean;
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  tags: string[];
  tone: Tone;
  seed: number;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  priceFrom: number;
  priceTo: number;
  duration: string;
  features: string[];
  tone: Tone;
  featured: boolean;
  visible: boolean;
}

export interface GalleryItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  vehicle: string;
  tone: Tone;
  seed: number;
  ratio: 'tall' | 'wide' | 'square';
  beforeTone?: Tone;
}

export interface Review {
  id: string;
  name: string;
  vehicle: string;
  service: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  approved: boolean;
}

export interface Transformation {
  id: string;
  slug: string;
  title: string;
  vehicle: string;
  description: string;
  beforeTone: Tone;
  afterTone: Tone;
  seed: number;
}

export interface BusinessSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  established: number;
  gstin: string;
  hours: { day: string; open: string; close: string }[];
  socials: { label: string; url: string }[];
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email?: string;
  vehicle: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}
