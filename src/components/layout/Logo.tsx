import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Kiran Car Accessories — home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson-600 shadow-[0_0_24px_rgba(239,68,68,0.3)] transition-all duration-300 hover:shadow-[0_0_32px_rgba(239,68,68,0.5)] hover:scale-105">
        <svg viewBox="0 0 64 64" className="h-5.5 w-5.5" aria-hidden="true">
          <path
            d="M32 7 L38.5 25.5 L57 32 L38.5 38.5 L32 57 L25.5 38.5 L7 32 L25.5 25.5 Z"
            fill="#000"
          />
          <circle cx="32" cy="32" r="4.5" fill="#ef4444" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold tracking-wide text-white">
          KIRAN
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-crimson-400">
          Car Accessories
        </span>
      </span>
    </Link>
  );
}