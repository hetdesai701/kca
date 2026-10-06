import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import Artwork from '../components/Artwork';
import SectionHeading from '../components/ui/SectionHeading';
import { settings } from '../data/settings';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Genuine parts only',
    text: 'No grey market film, no look-alike leather. Every product is authorised and invoice-backed.',
  },
  {
    icon: Wrench,
    title: 'Certified technicians',
    text: 'XPEL and Gtechniq trained fitters. Torque-calibrated, pattern-cut, documented.',
  },
  {
    icon: HeartHandshake,
    title: 'Transparent pricing',
    text: 'Quotes before we start, photos before and after, and zero surprise line items.',
  },
  {
    icon: BadgeCheck,
    title: 'Warranty-backed work',
    text: 'Up to 10 years on films and coatings — stamped, signed and registered with the brand.',
  },
  {
    icon: Sparkles,
    title: 'Showroom standards',
    text: 'A dust-controlled bay, filtered water and a checklist that would embarrass a dealership.',
  },
  {
    icon: MapPin,
    title: 'Rooted in Gandhinagar',
    text: 'A local studio serving Ahmedabad and Gandhinagar since 2012 — not a franchise, a family.',
  },
];

const TIMELINE = [
  {
    year: '2012',
    title: 'A single bay on Ring Road',
    text: 'Kiran opens a two-bay wash shop with one belief: treat every car like it is your own.',
  },
  {
    year: '2015',
    title: 'The detailing studio',
    text: 'Machine polishing, clay bars and interior restoration added. Word spreads through colony societies.',
  },
  {
    year: '2018',
    title: 'Certified for ceramic & PPF',
    text: 'Gtechniq and XPEL certifications arrive. The studio invests in a dust-controlled bay.',
  },
  {
    year: '2021',
    title: 'Audio & electronics lab',
    text: 'A dedicated fitment lab for head units, speakers and DSP tuning opens next door.',
  },
  {
    year: '2024',
    title: 'The wheel wall & lounge',
    text: 'Alloy fitting rig, TPMS check and a customer lounge with Wi-Fi and proper coffee.',
  },
  {
    year: '2026',
    title: '8,500 cars transformed',
    text: 'Twelve years, two cities, one standard. The next chapter is yours.',
  },
];

export default function About() {
  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden">
        <Artwork tone="crimson" seed={9} ring={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon-950/60 via-carbon-950/85 to-carbon-950" />
        <div className="container-x relative z-10 py-20 lg:py-28">
          <p className="eyebrow mb-4">Our story</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            A Gandhinagar institution since{' '}
            <span className="text-gradient-crimson">{settings.established}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ash-300 sm:text-lg">
            {settings.businessName} began as a two-bay wash shop on Ring Road with
            one belief — that a car deserves the same care as the home it parks in.
            Today we are the region's trusted studio for ceramic coatings, PPF,
            forged wheels and studio-grade audio, without ever losing the personal
            touch.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container-x py-20">
        <SectionHeading
          eyebrow="What we stand for"
          title="Six promises, every single car"
          description="Premium work is not about price tags — it is about process. Here is what you can hold us to."
          stagger
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value, i) => (
            <div
              key={value.title}
              className="animate-fade-up rounded-2xl border border-white/[0.04] bg-carbon-900 p-6 transition-all duration-300 hover:border-crimson-500/30 hover:shadow-panel-hover"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-500/10">
                <value.icon className="h-5 w-5 text-crimson-400" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ash-400">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y border-white/[0.04] bg-carbon-900/40 py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="The journey"
            title="Twelve years on Ring Road"
          />
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-crimson-500/60 via-white/10 to-transparent" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="relative flex gap-5 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="absolute left-0 top-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-crimson-500/40 bg-carbon-950 font-display text-xs font-bold text-crimson-300">
                    {item.year.slice(2)}
                  </span>
                  <div className="ml-14 flex-1 rounded-2xl border border-white/[0.04] bg-carbon-900 p-5 sm:p-6">
                    <p className="font-display text-sm font-bold text-crimson-300">
                      {item.year}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ash-400">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20">
        <div className="noise-overlay relative overflow-hidden rounded-3xl border border-white/[0.04] bg-carbon-900">
          <Artwork tone="crimson" seed={14} ring={false} className="absolute inset-0 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/80 to-transparent" />
          <div className="relative z-10 flex flex-col items-start gap-8 p-8 sm:p-14 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Visit the studio</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Come see the difference a decade makes
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ash-400 sm:text-base">
                {settings.address}, {settings.city}. Open daily — walk in for a
                quote, or book a slot and we will have coffee waiting.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/appointment"
                className="btn btn-primary btn-lg"
              >
                <CalendarCheck className="h-5 w-5" />
                Book Appointment
              </Link>
              <Link
                to="/contact"
                className="btn btn-outline btn-lg"
              >
                Contact us
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}