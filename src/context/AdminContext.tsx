import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  Appointment,
  AppointmentStatus,
  GalleryItem,
  Message,
  Product,
  Review,
  Service,
} from '../types';
import { products as seedProducts } from '../data/products';
import { services as seedServices } from '../data/services';
import { gallery as seedGallery } from '../data/gallery';
import { reviews as seedReviews } from '../data/reviews';

export const DEMO_EMAIL = 'admin@kirancaraccessories.in';
export const DEMO_PASSWORD = 'KiranAdmin@2026';

interface AdminContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  products: Product[];
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProduct: (id: string, field: 'featured' | 'visible') => void;
  services: Service[];
  saveService: (service: Service) => void;
  deleteService: (id: string) => void;
  toggleService: (id: string, field: 'featured' | 'visible') => void;
  galleryItems: GalleryItem[];
  addGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  appointments: Appointment[];
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  messages: Message[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  reviews: Review[];
  setReviewApproval: (id: string, approved: boolean) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString();

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const seedAppointments: Appointment[] = [
  {
    id: 'ap-1',
    reference: 'KCA-APT-K8X2P',
    name: 'Rahul Verma',
    phone: '+91 98250 11223',
    vehicle: 'Hyundai Creta',
    service: 'Ceramic Coating',
    date: inDays(1),
    time: '11:00',
    notes: 'Black car, prefers morning slot.',
    status: 'Pending',
    createdAt: daysAgo(0),
  },
  {
    id: 'ap-2',
    reference: 'KCA-APT-M3Q8R',
    name: 'Priya Nair',
    phone: '+91 98250 33445',
    vehicle: 'Tata Nexon',
    service: 'Signature Full Detail',
    date: inDays(1),
    time: '14:00',
    status: 'Confirmed',
    createdAt: daysAgo(1),
  },
  {
    id: 'ap-3',
    reference: 'KCA-APT-T7W1D',
    name: 'Arjun Mehta',
    phone: '+91 98250 55667',
    vehicle: 'Honda City',
    service: 'Alloy Wheel Fitting & Balancing',
    date: inDays(2),
    time: '10:00',
    notes: 'Bringing 4 wheels in boxes.',
    status: 'Pending',
    createdAt: daysAgo(1),
  },
  {
    id: 'ap-4',
    reference: 'KCA-APT-P2L9C',
    name: 'Neha Gupta',
    phone: '+91 98250 77889',
    vehicle: 'Kia Seltos',
    service: 'Leather Seat Fitting',
    date: inDays(3),
    time: '16:30',
    status: 'Confirmed',
    createdAt: daysAgo(2),
  },
  {
    id: 'ap-5',
    reference: 'KCA-APT-H4B6V',
    name: 'Farhan Ali',
    phone: '+91 98250 99001',
    vehicle: 'MG Hector',
    service: 'Car Audio & Video Installation',
    date: inDays(-1),
    time: '12:30',
    status: 'Completed',
    createdAt: daysAgo(3),
  },
];

const seedMessages: Message[] = [
  {
    id: 'msg-1',
    name: 'Vikram Singh',
    phone: '+91 98250 24680',
    subject: 'Bulk / fleet enquiry',
    body: 'We run a cab fleet of 12 vehicles in Ahmedabad. Do you offer corporate rates for ceramic coating across all cars?',
    read: false,
    createdAt: daysAgo(0),
  },
  {
    id: 'msg-2',
    name: 'Rohan Das',
    phone: '+91 98250 13579',
    subject: 'General inquiry',
    body: 'Is the 20-inch Rotiform wheel in stock for a Honda City? What is the delivery time?',
    read: false,
    createdAt: daysAgo(0),
  },
  {
    id: 'msg-3',
    name: 'Kavya Rao',
    phone: '+91 98250 86420',
    subject: 'Warranty claim',
    body: 'My ceramic coat from 8 months ago is peeling near the fuel lid. Can we schedule a warranty check?',
    read: false,
    createdAt: daysAgo(1),
  },
  {
    id: 'msg-4',
    name: 'Aditya Nair',
    phone: '+91 98250 97531',
    subject: 'Product availability',
    body: 'Do you have the Garmin Dash Cam 67W available for pickup this week?',
    read: true,
    createdAt: daysAgo(1),
  },
  {
    id: 'msg-5',
    name: 'Sana Sheikh',
    phone: '+91 98250 75315',
    subject: 'Service booking',
    body: 'Booked a full detail for my Innova on Saturday. Will you have an open slot in the afternoon?',
    read: true,
    createdAt: daysAgo(2),
  },
  {
    id: 'msg-6',
    name: 'Meera Iyer',
    phone: '+91 98250 64208',
    subject: 'Feedback',
    body: 'The detailing team did a wonderful job. Only suggestion: a follow-up call after service would be nice.',
    read: true,
    createdAt: daysAgo(3),
  },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [services, setServices] = useState<Service[]>(seedServices);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(seedGallery);
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [messages, setMessages] = useState<Message[]>(seedMessages);

  const login = useCallback((email: string, password: string): boolean => {
    if (
      email.trim().toLowerCase() === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setIsAuthenticated(false), []);

  const saveProduct = useCallback((product: Product) => {
    setProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev],
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleProduct = useCallback(
    (id: string, field: 'featured' | 'visible') => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p)),
      );
    },
    [],
  );

  const saveService = useCallback((service: Service) => {
    setServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.map((s) => (s.id === service.id ? service : s))
        : [service, ...prev],
    );
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleService = useCallback(
    (id: string, field: 'featured' | 'visible') => {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: !s[field] } : s)),
      );
    },
    [],
  );

  const addGalleryItem = useCallback((item: GalleryItem) => {
    setGalleryItems((prev) => [item, ...prev]);
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const setAppointmentStatus = useCallback(
    (id: string, status: AppointmentStatus) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    },
    [],
  );

  const markRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }, []);

  const setReviewApproval = useCallback((id: string, approved: boolean) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved } : r)),
    );
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      isAuthenticated,
      login,
      logout,
      products,
      saveProduct,
      deleteProduct,
      toggleProduct,
      services,
      saveService,
      deleteService,
      toggleService,
      galleryItems,
      addGalleryItem,
      deleteGalleryItem,
      appointments,
      setAppointmentStatus,
      messages,
      markRead,
      markAllRead,
      reviews,
      setReviewApproval,
    }),
    [
      isAuthenticated,
      login,
      logout,
      products,
      saveProduct,
      deleteProduct,
      toggleProduct,
      services,
      saveService,
      deleteService,
      toggleService,
      galleryItems,
      addGalleryItem,
      deleteGalleryItem,
      appointments,
      setAppointmentStatus,
      messages,
      markRead,
      markAllRead,
      reviews,
      setReviewApproval,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
