import { Link } from 'react-router-dom';
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { settings } from '../../data/settings';
import { services } from '../../data/services';
import Logo from './Logo';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  YouTube: Youtube,
  'Google Maps': MapPin,
};

const EXPLORE = [
  { to: '/about', label: 'About us' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/appointment', label: 'Book appointment' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const today = new Date().getDay();
  const hoursToday = settings.hours[(today + 6) % 7] ?? settings.hours[0];

  return (
    <footer className="border-t border-white/[0.04] bg-carbon-900">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ash-400">
            {settings.tagline}. Serving car owners across Gandhinagar and Ahmedabad
            since {settings.established} — genuine parts, certified installation,
            and a lounge that treats you like family.
          </p>
          <div className="mt-5 flex gap-2">
            {settings.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.label] ?? Globe;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-ash-400 transition-all duration-200 hover:border-crimson-500/50 hover:text-crimson-300 hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
            Explore
          </h4>
          <ul className="mt-4 space-y-2.5">
            {EXPLORE.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-ash-400 transition-colors duration-200 hover:text-crimson-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
            Popular services
          </h4>
          <ul className="mt-4 space-y-2.5">
            {services.slice(0, 6).map((service) => (
              <li key={service.id}>
                <Link
                  to="/services"
                  className="text-sm text-ash-400 transition-colors duration-200 hover:text-crimson-300"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
            Visit us
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-ash-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-crimson-400" />
              <span>
                {settings.address}
                <br />
                {settings.city}
              </span>
            </li>
            <li>
              <a href="tel:+919825012345" className="flex items-center gap-2.5 transition-colors duration-200 hover:text-crimson-300">
                <Phone className="h-4 w-4 shrink-0 text-crimson-400" />
                {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 transition-colors duration-200 hover:text-crimson-300"
              >
                <Mail className="h-4 w-4 shrink-0 text-crimson-400" />
                {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-crimson-400" />
              <span>
                Open today · {hoursToday.open} – {hoursToday.close}
                <br />
                <span className="text-xs text-ash-500">Mon–Sat 09:30–20:00 · Sun 10:00–18:00</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-ash-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.businessName}. All rights reserved.
          </p>
          <p>
            GSTIN: {settings.gstin} · Crafted for drivers in Gujarat
          </p>
        </div>
      </div>
    </footer>
  );
}

function Globe(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}