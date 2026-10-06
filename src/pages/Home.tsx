import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChevronDown,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
} from 'lucide-react';
import Artwork from '../components/Artwork';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import InquiryModal from '../components/InquiryModal';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';
import ServiceCard from '../components/ServiceCard';
import SectionHeading from '../components/ui/SectionHeading';
import RatingStars from '../components/ui/RatingStars';
import { products } from '../data/products';
import { reviews } from '../data/reviews';
import { services } from '../data/services';
import { settings, waLink } from '../data/settings';
import { transformations } from '../data/transformations';
import { classNames } from '../utils/format';
import type { Product, Service, Transformation } from '../types';

interface EnquiryTarget {
  subject: string;
  subjectType: 'product' | 'service' | 'general';
}

const MARQUEE_BRANDS = [
  'XPEL',
  'Gtechniq',
  '3M',
  'Rotiform',
  'Brembo',
  'Pioneer',
  'JBL',
  'Hella',
  'Koni',
  'Garmin',
  'Kiran Exclusive',
];

const HERO_STATS = [
  { value: '12+', label: 'Years of craft' },
  { value: '8,500+', label: 'Cars transformed' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '100%', label: 'Genuine parts' },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'Genuine parts only', text: 'Every product is sourced from authorised channels with invoice-backed warranty.' },
  { icon: Wrench, title: 'Certified installation', text: 'XPEL & Gtechniq trained technicians, torque-calibrated and documented.' },
  { icon: BadgeCheck, title: 'Warranty-backed work', text: 'Up to 10 years on PPF and ceramic coatings — in writing, not in words.' },
];

export default function Home() {
  const [enquiry, setEnquiry] = useState<EnquiryTarget | null>(null);
  const [activeTransformation, setActiveTransformation] =
    useState<Transformation>(transformations[0]);
  const [activeReview, setActiveReview] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setActiveReview((i) => (i + 1) % reviews.length),
      7000,
    );
    return () => clearInterval(id);
  }, [paused]);

  const openEnquiry = (subject: string, subjectType: EnquiryTarget['subjectType']) =>
    setEnquiry({ subject, subjectType });

  const featuredProducts = products.filter((p) => p.featured && p.visible).slice(0, 4);
  const featuredServices = services.filter((s) => s.featured && s.visible).slice(0, 4);
  const review = reviews[activeReview];

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <Artwork tone="crimson" seed={5} ring={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon-950/60 via-carbon-950/85 to-carbon-950" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 75% 30%, rgba(239,68,68,0.18), transparent 70%)',
          }}
        />
        <div className="container-x relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl stagger-children">
            <p className="eyebrow mb-5 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Gandhinagar · Ahmedabad
            </p>
            <h1
              className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Elevate every
              <br />
              <span className="text-gradient-crimson">drive you own.</span>
            </h1>
            <p
              className="mt-6 max-w-xl text-base leading-relaxed text-ash-300 sm:text-lg"
            >
              Premium ceramic coatings, self-healing PPF, forged alloys and
              studio-grade audio — installed by certified technicians in the
              heart of Gujarat.
            </p>
            <div
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/appointment"
                className="btn btn-primary btn-lg"
              >
                <CalendarCheck className="h-5 w-5" />
                Book Appointment
              </Link>
              <Link
                to="/products"
                className="btn btn-outline btn-lg"
              >
                Explore Products
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              <RatingStars rating={4.9} size={16} />
              <span className="text-sm text-ash-300">
                <span className="font-semibold text-white">4.9 rated</span> · 2,400+
                verified reviews
              </span>
            </div>
          </div>
        </div>
        <Link
          to="/services"
          aria-label="Scroll to services"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-ash-400 transition-colors duration-300 hover:text-crimson-300"
        >
          <ChevronDown className="h-7 w-7 animate-bounce" />
        </Link>
      </section>

      {/* ================= BRAND MARQUEE ================= */}
      <div className="border-y border-white/[0.04] bg-carbon-900/60 py-5">
        <div className="flex w-max animate-marquee gap-12">
          {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="flex items-center gap-3 font-display text-sm font-semibold uppercase tracking-[0.25em] text-ash-500"
            >
              <Star className="h-3 w-3 fill-crimson-500/40 text-crimson-500/40" />
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <section className="container-x -mt-2 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {HERO_STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="animate-fade-up rounded-2xl border border-white/[0.04] bg-carbon-900 p-6 text-center"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="font-display text-3xl font-bold text-crimson-400 sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-ash-500">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* ================= SERVICES ================= */}
      <section className="container-x py-24">
        <SectionHeading
          eyebrow="What we do"
          title="Precision services, showroom results"
          description="From 9H ceramic coats to full-grain leather cabins — every job is photographed, documented and warranty-backed."
          action={
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-crimson-300 hover:text-crimson-200 transition-colors"
            >
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          }
          stagger
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredServices.map((service: Service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              onQuote={(s) => openEnquiry(s.name, 'service')}
            />
          ))}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="border-y border-white/[0.04] bg-carbon-900/40 py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Featured collection"
            title="Premium products, hand-picked"
            description="Genuine, warranty-backed accessories from the brands professionals trust — fitted by our certified team."
            action={
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-crimson-300 hover:text-crimson-200 transition-colors"
              >
                Browse the catalogue <ArrowRight className="h-4 w-4" />
              </Link>
            }
            stagger
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product: Product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onEnquire={(p) => openEnquiry(p.name, 'product')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRANSFORMATIONS ================= */}
      <section className="container-x py-24">
        <SectionHeading
          eyebrow="Transformations"
          title="Real cars. Real results."
          description="Drag the slider to see the difference our studio makes — every transformation is done on-site in Gandhinagar."
          stagger
        />
        <div className="grid items-center gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.06] shadow-card">
              <BeforeAfterSlider
                beforeTone={activeTransformation.beforeTone}
                afterTone={activeTransformation.afterTone}
                seed={activeTransformation.seed}
                className="h-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-2">
            {transformations.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTransformation(t)}
                className={classNames(
                  'relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ease-butter',
                  activeTransformation.id === t.id
                    ? 'border-crimson-500/50 bg-crimson-500/[0.05] shadow-[0_0_24px_rgba(239,68,68,0.1)]'
                    : 'border-white/[0.04] bg-carbon-900 hover:border-white/10 hover:bg-carbon-800 hover:shadow-panel',
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-base font-semibold text-white">
                    {t.title}
                  </h3>
                  <span className="text-xs font-medium text-ash-500">{t.vehicle}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ash-400">
                  {t.description}
                </p>
                {activeTransformation.id === t.id && (
                  <div className="absolute right-4 bottom-4 h-2 w-2 rounded-full bg-crimson-500 animate-pulse" />
                )}
              </button>
            ))}
            <Link
              to="/gallery"
              className="mt-2 btn btn-outline"
            >
              View full gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS CAROUSEL ================= */}
      <section className="border-y border-white/[0.04] bg-carbon-900/40 py-24">
        <div
          className="container-x"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <SectionHeading
            eyebrow="Reviews"
            title="Trusted by Gujarat's car owners"
            description={`${settings.businessName} has kept Gandhinagar and Ahmedabad driving sharper since ${settings.establishment}.`}
            stagger
          />
          <div className="relative mx-auto max-w-3xl">
            <div
              key={review.id}
              className="noise-overlay animate-fade-up relative overflow-hidden rounded-3xl border border-white/[0.06] bg-carbon-900 p-8 sm:p-12"
            >
              <Artwork
                tone={services.find((s) => s.name === review.service)?.tone ?? 'graphite'}
                seed={review.name.length * 31}
                ring={false}
                className="absolute inset-0 opacity-[0.08]"
              />
              <div className="relative z-10 text-center">
                <RatingStars rating={review.rating} size={18} />
                <blockquote className="mt-5 font-display text-xl font-medium leading-relaxed text-white sm:text-2xl">
                  "{review.content}"
                </blockquote>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-crimson-500/20 font-display text-sm font-bold text-crimson-300">
                    {review.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    <p className="text-xs text-ash-500">
                      {review.vehicle} · {review.service}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              {reviews.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setActiveReview(i)}
                  aria-label={`Show review ${i + 1}`}
                  className={classNames(
                    'h-2 rounded-full transition-all duration-300 ease-butter',
                    i === activeReview ? 'w-8 bg-crimson-400' : 'w-2 bg-carbon-700 hover:bg-carbon-600',
                  )}
                />
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 text-sm font-semibold text-crimson-300 hover:text-crimson-200 transition-colors"
            >
              Read all reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="container-x grid gap-4 py-16 sm:grid-cols-3">
        {TRUST_ITEMS.map((item, i) => (
          <div
            key={item.title}
            className="animate-fade-up flex gap-4 rounded-2xl border border-white/[0.04] bg-carbon-900 p-6 transition-all duration-300 hover:border-crimson-500/30 hover:shadow-panel-hover"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-crimson-500/10">
              <item.icon className="h-5 w-5 text-crimson-400" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ash-400">{item.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ================= CTA BAND ================= */}
      <section className="container-x pb-24">
        <div className="noise-overlay relative overflow-hidden rounded-3xl bg-gradient-to-br from-crimson-700 via-crimson-600 to-crimson-500 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.25), transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
              Limited slots this week
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to transform your car?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Book a slot at our Ring Road studio. Coffee on us, your car in
              certified hands.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/appointment"
                className="btn btn-carbon btn-lg"
              >
                <CalendarCheck className="h-5 w-5" />
                Book Appointment
              </Link>
              <a
                href={waLink(`Hi ${settings.businessName}! I'd like to book a service.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/40"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      <InquiryModal
        open={enquiry !== null}
        onClose={() => setEnquiry(null)}
        subject={enquiry?.subject ?? ''}
        subjectType={enquiry?.subjectType ?? 'general'}
      />
    </div>
  );
}