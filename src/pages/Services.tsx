import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';
import InquiryModal from '../components/InquiryModal';
import ServiceCard from '../components/ServiceCard';
import SectionHeading from '../components/ui/SectionHeading';
import { Tabs } from '../components/ui/Tabs';
import { serviceCategories, services } from '../data/services';
import type { Service } from '../types';

export default function Services() {
  const [category, setCategory] = useState<string>('All');
  const [quoteFor, setQuoteFor] = useState<Service | null>(null);

  const visible = services.filter((s) => s.visible);
  const filtered =
    category === 'All' ? visible : visible.filter((s) => s.category === category);

  return (
    <div className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow="Services"
        title="Every service, certified"
        description="Transparent pricing, genuine materials and a written warranty on every job. Select a service to request a quote."
        stagger
      />

      <Tabs
        tabs={[{ id: 'All', label: `All (${visible.length})` }, ...serviceCategories.map((c) => ({ id: c, label: c }))]}
        active={category}
        onChange={setCategory}
        className="mb-10 justify-center"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((service, i) => (
          <ServiceCard
            key={service.id}
            service={service}
            onQuote={setQuoteFor}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-ash-500 animate-fade-up">
          No services in this category yet — check back soon.
        </p>
      )}

      <div className="noise-overlay relative mt-16 overflow-hidden rounded-3xl border border-white/[0.04] bg-carbon-900 p-8 sm:p-12 animate-fade-up">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(239,68,68,0.15), transparent 70%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">
              Not sure what your car needs?
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-ash-400">
              Tell us about your car and we will recommend the right service —
              no obligation, no upsell pressure.
            </p>
          </div>
          <a
            href="tel:+919825012345"
            className="btn btn-outline"
          >
            <CalendarCheck className="h-5 w-5" />
            Call {`+91 98250 12345`}
          </a>
        </div>
      </div>

      <InquiryModal
        open={quoteFor !== null}
        onClose={() => setQuoteFor(null)}
        subject={quoteFor?.name ?? ''}
        subjectType="service"
      />
    </div>
  );
}