import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/ui/SectionHeading';
import { Select } from '../components/ui/Field';
import InquiryModal from '../components/InquiryModal';
import { productBrands, productCategories, products } from '../data/products';
import { classNames, formatINR } from '../utils/format';
import type { Product } from '../types';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const MAX_PRICE = 100000;

export default function Products() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [brand, setBrand] = useState('All');
  const [sort, setSort] = useState<SortKey>('featured');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [loading, setLoading] = useState(true);
  const [enquiry, setEnquiry] = useState<Product | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [query, category, brand, sort, maxPrice]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products
      .filter((p) => p.visible)
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => brand === 'All' || p.brand === brand)
      .filter((p) => p.price <= maxPrice)
      .filter(
        (p) =>
          !q ||
          [p.name, p.category, p.brand, p.shortDescription, ...p.tags]
            .join(' ')
            .toLowerCase()
            .includes(q),
      );
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [query, category, brand, sort, maxPrice]);

  const hasFilters =
    query.trim() !== '' || category !== 'All' || brand !== 'All' || maxPrice < MAX_PRICE;

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
    setBrand('All');
    setMaxPrice(MAX_PRICE);
  };

  const fillPct = (maxPrice / MAX_PRICE) * 100;

  return (
    <div className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow="The collection"
        title="Premium accessories, curated"
        description="Genuine products from the brands professionals trust — every item fitted by our certified team with a written warranty."
        stagger
      />

      {/* Search + selects */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row animate-fade-up">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ash-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories…"
            className="input-dark pl-11 pr-10"
            aria-label="Search products"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ash-500 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <Select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-40 select-dark" aria-label="Filter by brand">
            <option value="All">All brands</option>
            {productBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="w-44 select-dark" aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </Select>
        </div>
      </div>

      {/* Category chips */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden animate-fade-up delay-100">
        {['All', ...productCategories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={classNames(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
              category === c
                ? 'border-crimson-500/60 bg-crimson-500/10 text-crimson-300 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                : 'border-white/10 text-ash-400 hover:border-white/20 hover:text-ash-200 hover:bg-white/[0.03]',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Price range */}
      <div className="mb-10 animate-fade-up delay-200 flex items-center gap-4 rounded-2xl border border-white/[0.04] bg-carbon-900 px-5 py-4">
        <SlidersHorizontal className="h-4 w-4 shrink-0 text-crimson-400" />
        <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-ash-400">
          Max price
        </span>
        <input
          type="range"
          min={5000}
          max={MAX_PRICE}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="slider-crimson flex-1"
          style={{ '--fill': `${fillPct}%` } as CSSProperties}
          aria-label="Maximum price"
        />
        <span className="w-20 text-right font-display text-sm font-bold text-crimson-300">
          {formatINR(maxPrice)}
        </span>
      </div>

      <p className="mb-6 text-sm text-ash-500" role="status">
        {loading
          ? 'Searching the catalogue…'
          : `${filtered.length} product${filtered.length === 1 ? '' : 's'} found`}
      </p>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products match your filters"
          description="Try a different search term, or widen the price range and categories."
          action={
            hasFilters ? (
              <button
                onClick={clearFilters}
                className="btn btn-primary"
              >
                <X className="h-4 w-4" /> Clear all filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onEnquire={setEnquiry}
            />
          ))}
        </div>
      )}

      <InquiryModal
        open={enquiry !== null}
        onClose={() => setEnquiry(null)}
        subject={enquiry?.name ?? ''}
        subjectType="product"
      />
    </div>
  );
}