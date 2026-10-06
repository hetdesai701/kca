import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import type { GalleryItem } from '../types';
import Artwork from './Artwork';
import Badge from './ui/Badge';

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export default function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const item = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % items.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, items.length, onClose, onIndexChange]);

  if (!item) return null;

  const prev = () => onIndexChange((index - 1 + items.length) % items.length);
  const next = () => onIndexChange((index + 1) % items.length);

  return createPortal(
    <div className="fixed inset-0 z-[95] flex flex-col items-center justify-center p-4 sm:p-8">
      <div
        className="absolute inset-0 animate-fade-in bg-black/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <button
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="relative z-10 w-full max-w-4xl animate-fade-up">
        <div className="relative h-[58vh] overflow-hidden rounded-2xl border border-white/10 sm:h-[64vh]">
          <Artwork tone={item.tone} seed={item.seed} className="absolute inset-0" />
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur transition-colors hover:bg-gold-500 hover:text-ink-950"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur transition-colors hover:bg-gold-500 hover:text-ink-950"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-gold-400" />
              {item.vehicle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge>{item.category}</Badge>
            <span className="text-xs font-medium text-zinc-500">
              {index + 1} / {items.length}
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
