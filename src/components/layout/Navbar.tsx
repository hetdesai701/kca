import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CalendarCheck, Menu, MessageCircle, X } from 'lucide-react';
import { classNames } from '../../utils/format';
import { settings, waLink } from '../../data/settings';
import Logo from './Logo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
  { to: '/appointment', label: 'Book Appointment' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={classNames(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-butter',
        scrolled
          ? 'border-b border-white/[0.04] bg-carbon-950/90 backdrop-blur-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]'
          : 'bg-transparent',
      )}
    >
      <div className="container-x flex h-16 items-center justify-between lg:h-[72px]">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                classNames(
                  'relative text-sm font-medium transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-crimson-500 after:transition-all after:duration-300',
                  isActive
                    ? 'text-crimson-300 after:w-full'
                    : 'text-ash-300 hover:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={waLink(`Hi ${settings.businessName}! I need assistance.`)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <Link
            to="/appointment"
            className="btn btn-primary btn-sm"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Appointment
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-ash-300 hover:bg-white/5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={classNames(
          'overflow-hidden transition-[max-height] duration-400 ease-butter lg:hidden',
          open ? 'max-h-[520px]' : 'max-h-0',
        )}
      >
        <nav
          className="container-x flex flex-col gap-1 border-t border-white/[0.04] bg-carbon-950/95 py-4 backdrop-blur-2xl"
          aria-label="Mobile"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                classNames(
                  'rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-crimson-500/10 text-crimson-300'
                    : 'text-ash-300 hover:bg-white/5 hover:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/appointment"
            className="mt-2 btn btn-primary"
          >
            <CalendarCheck className="h-4 w-4" />
            Book Appointment
          </Link>
          <a
            href={waLink(`Hi ${settings.businessName}! I need assistance.`)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 btn btn-outline"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
        </nav>
      </div>
    </header>
  );
}