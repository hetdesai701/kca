import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck, Wrench } from 'lucide-react';
import Artwork from '../components/Artwork';
import InquiryModal from '../components/InquiryModal';
import ProductCard from '../components/ProductCard';
import RatingStars from '../components/ui/RatingStars';
import Badge from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { getProductBySlug, products } from '../data/products';
import { reviews } from '../data/reviews';
import { waLink } from '../data/settings';
import { formatINR } from '../utils/format';
import type { Product } from '../types';

const THUMB_SEEDS = [0, 1, 2];

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const [thumb, setThumb] = useState(0);
  const [tab, setTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  if (!product) {
    return (
      <div className="container-x py-32 text-center animate-fade-up">
        <h1 className="font-display text-3xl font-bold text-white">Product not found</h1>
        <p className="mt-3 text-ash-400">
          The product you are looking for may have been removed or renamed.
        </p>
        <Link
          to="/products"
          className="mt-6 btn btn-primary"
        >
          Browse products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const related: Product[] = products
    .filter((p) => p.visible && p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productReviews = reviews.filter((r) => r.approved).slice(0, 3);

  return (
    <div className="container-x py-10 lg:py-14">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-ash-500 animate-fade-up" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-crimson-300 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-crimson-300 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-ash-300">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.04] animate-fade-up">
            <Artwork
              tone={product.tone}
              seed={product.seed + THUMB_SEEDS[thumb]}
              className="aspect-[4/3]"
            />
            <div className="absolute left-4 top-4 flex gap-2">
              {product.isNew && <Badge variant="blue">New</Badge>}
              {product.featured && <Badge variant="crimson">Featured</Badge>}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {THUMB_SEEDS.map((offset, i) => (
              <button
                key={offset}
                onClick={() => setThumb(i)}
                aria-label={`View image ${i + 1}`}
                className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                  thumb === i ? 'border-crimson-500/60 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]' : 'border-white/[0.04] hover:border-white/20'
                }`}
              >
                <Artwork tone={product.tone} seed={product.seed + offset} className="aspect-[4/3]" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow animate-fade-up">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white animate-fade-up delay-100 sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 animate-fade-up delay-200">
            <RatingStars rating={product.rating} size={16} />
            <span className="text-sm text-ash-400">
              {product.rating} · {product.reviewCount} reviews
            </span>
            <span className="text-sm text-ash-600">·</span>
            <span className="text-sm text-ash-400">{product.brand}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3 animate-fade-up delay-300">
            <span className="font-display text-4xl font-bold text-white">
              {formatINR(product.price)}
            </span>
            {product.mrp && (
              <>
                <span className="text-lg text-ash-500 line-through">
                  {formatINR(product.mrp)}
                </span>
                <Badge variant="emerald">Save {discount}%</Badge>
              </>
            )}
          </div>
          <p className="mt-2 text-xs text-ash-500 animate-fade-up delay-400">
            Inclusive of all taxes · Free professional installation on most products
          </p>

          <p className="mt-6 text-base leading-relaxed text-ash-300 animate-fade-up delay-500">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up delay-600">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="btn btn-primary btn-lg"
            >
              <MessageCircle className="h-5 w-5" />
              Enquire now
            </button>
            <a
              href={waLink(`Hi! I'm interested in ${product.name} (${formatINR(product.price)}). Please share availability.`)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-lg"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>

          <ul className="mt-8 space-y-3 border-t border-white/[0.04] pt-6 animate-fade-up delay-700">
            {[
              { icon: ShieldCheck, text: '100% genuine, authorised-channel product' },
              { icon: Wrench, text: 'Certified installation by trained technicians' },
              { icon: BadgeCheck, text: 'Manufacturer warranty with invoice' },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm text-ash-300">
                <item.icon className="h-4 w-4 shrink-0 text-crimson-400" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <Tabs
          tabs={[
            { id: 'description', label: 'Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'reviews', label: `Reviews (${product.reviewCount})` },
          ]}
          active={tab}
          onChange={setTab}
        />
        <div className="mt-8 animate-fade-up rounded-3xl border border-white/[0.04] bg-carbon-900 p-6 sm:p-8" key={tab}>
          {tab === 'description' && (
            <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-ash-400">
              <p>{product.description}</p>
              <p>
                Installation takes place at our Ring Road studio in Gandhinagar.
                Most products are fitted within a few hours — book an appointment
                to reserve a bay and our lounge.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          {tab === 'specs' && (
            <dl className="grid gap-0 sm:grid-cols-2">
              {product.specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex justify-between gap-4 border-b border-white/[0.04] py-3 sm:flex-col sm:gap-1 ${
                    i % 2 === 0 ? 'sm:pr-6' : 'sm:pl-6'
                  }`}
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-ash-500">
                    {spec.label}
                  </dt>
                  <dd className="text-sm font-medium text-ash-200">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {tab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="font-display text-4xl font-bold text-white">
                  {product.rating}
                </span>
                <div>
                  <RatingStars rating={product.rating} size={16} />
                  <p className="mt-1 text-xs text-ash-500">
                    Based on {product.reviewCount} verified purchases
                  </p>
                </div>
              </div>
              {productReviews.map((review) => (
                <article key={review.id} className="border-b border-white/[0.04] pb-6 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{review.name}</p>
                      <p className="text-xs text-ash-500">{review.vehicle}</p>
                    </div>
                    <RatingStars rating={review.rating} size={13} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ash-400">
                    {review.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20 animate-fade-up">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              You may also like
            </h2>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-crimson-300 hover:text-crimson-200 transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                onEnquire={() => setEnquiryOpen(true)}
              />
            ))}
          </div>
        </div>
      )}

      <InquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        subject={product.name}
        subjectType="product"
      />
    </div>
  );
}