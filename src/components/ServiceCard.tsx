import { Check, Clock, MessageCircle } from 'lucide-react';
import type { Service } from '../types';
import { formatINR } from '../utils/format';
import { ServiceIcon, ServiceCategoryIcon } from './ServiceIcon';

interface ServiceCardProps {
  service: Service;
  onQuote: (service: Service) => void;
}

export default function ServiceCard({ service, onQuote }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-card">
      <div className="relative h-28">
        <ServiceIcon category={service.category} tone={service.tone} className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900 to-transparent" />
        <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950/70 backdrop-blur">
          <ServiceCategoryIcon category={service.category} className="h-5 w-5 text-gold-300" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-white">{service.name}</h3>
        <p className="mt-1 text-sm text-zinc-400">{service.tagline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
          <span className="font-display text-sm font-bold text-gold-300">
            {formatINR(service.priceFrom)} – {formatINR(service.priceTo)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {service.duration}
          </span>
        </div>
        <ul className="mt-4 space-y-1.5">
          {service.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <button
            onClick={() => onQuote(service)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gold-500/40 px-4 py-2.5 text-sm font-semibold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-950"
          >
            <MessageCircle className="h-4 w-4" /> Get quote
          </button>
        </div>
      </div>
    </article>
  );
}
