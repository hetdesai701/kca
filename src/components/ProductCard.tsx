import { Link } from 'react-router-dom';
import { Eye, MessageCircle } from 'lucide-react';
import type { Product } from '../types';
import Artwork from './Artwork';
import Badge from './ui/Badge';
import RatingStars from './ui/RatingStars';
import { classNames, formatINR } from '../utils/format';

interface ProductCardProps {
  product: Product;
  onEnquire: (product: Product) => void;
}

export default function ProductCard({ product, onEnquire }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-card">
      <Link to={`/products/${product.slug}`} className="relative block" aria-label={product.name}>
        <Artwork
          tone={product.tone}
          seed={product.seed}
          className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.isNew && <Badge variant="blue">New</Badge>}
          {product.featured && <Badge variant="gold">Featured</Badge>}
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-950/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white">
            <Eye className="h-3.5 w-3.5" /> Quick view
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${product.slug}`}
              className="font-display text-base font-semibold leading-snug text-white hover:text-gold-300"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 truncate text-xs text-zinc-500">
              {product.category} · {product.brand}
            </p>
          </div>
          <RatingStars rating={product.rating} size={12} className="mt-1 shrink-0" />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{product.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="min-w-0">
            <span className="font-display text-lg font-bold text-white">
              {formatINR(product.price)}
            </span>
            {product.mrp && (
              <span className="ml-2 text-xs text-zinc-500 line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>
          <button
            onClick={() => onEnquire(product)}
            className={classNames(
              'inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gold-500/10 px-3 py-2',
              'text-xs font-semibold text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-950',
            )}
            aria-label={`Enquire about ${product.name}`}
          >
            <MessageCircle className="h-3.5 w-3.5" /> Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
