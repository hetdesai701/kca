import type { BusinessSettings } from '../types';

export const settings: BusinessSettings = {
  businessName: 'Kiran Car Accessories',
  tagline: 'Premium Automotive Customization & Detailing',
  phone: '+91 98250 12345',
  whatsapp: '919825012345',
  email: 'hello@kirancaraccessories.in',
  address: 'Shop 12, Ring Road, Sector 11',
  city: 'Gandhinagar, Gujarat 382011',
  established: 2012,
  gstin: '24ABCDE1234F1Z5',
  hours: [
    { day: 'Monday', open: '09:30', close: '20:00' },
    { day: 'Tuesday', open: '09:30', close: '20:00' },
    { day: 'Wednesday', open: '09:30', close: '20:00' },
    { day: 'Thursday', open: '09:30', close: '20:00' },
    { day: 'Friday', open: '09:30', close: '20:00' },
    { day: 'Saturday', open: '09:30', close: '20:00' },
    { day: 'Sunday', open: '10:00', close: '18:00' },
  ],
  socials: [
    { label: 'Instagram', url: '#' },
    { label: 'Facebook', url: '#' },
    { label: 'YouTube', url: '#' },
    { label: 'Google Maps', url: '#' },
  ],
};

export const waLink = (text: string): string =>
  `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;

export const phoneHref = (): string => `tel:${settings.phone.replace(/[^\d+]/g, '')}`;
