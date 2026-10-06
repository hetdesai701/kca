import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import Artwork from '../components/Artwork';
import Lightbox from '../components/Lightbox';
import SectionHeading from '../components/ui/SectionHeading';
import Badge from '../components/ui/Badge';
import { gallery } from '../data/gallery';
import { classNames } from '../utils/format';

const RATIO_CLASS = {
  tall: 'aspect-[3/4]',
  wide: 'aspect-[16/10]',
  square: 'aspect-square',
} as const;

export default function GalleryPage() {
  const [category, setCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];
  const filtered =
    category === 'All' ? gallery : gallery.filter((g) => g.category === category);

  return (
    <div className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow="Gallery"
        title="Recent transformations"
        description="A glimpse of real work from our Ring Road studio — coatings, PPF, cabins and audio. Select any image for the full view."
        stagger
      />

      <div className="mb-8 flex flex-wrap justify-center gap-2 animate-fade-up delay-200">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={classNames(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
              category === c
                ? 'border-crimson-500/60 bg-crimson-500/10 text-crimson-300 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                : 'border-white/10 text-ash-400 hover:border-white/20 hover:text-ash-200 hover:bg-white/[0.03]',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ash-500 animate-fade-up">
          Nothing in this category yet — new work goes up every week.
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setLightboxIndex(i)}
              className={classNames(
                'group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.04] text-left transition-all duration-300 hover:border-crimson-500/30 hover:shadow-panel-hover',
                RATIO_CLASS[item.ratio],
              )}
              aria-label={`${item.title} — ${item.vehicle}`}
            >
              <Artwork
                tone={item.tone}
                seed={item.seed}
                className="absolute inset-0 transition-transform duration-500 ease-butter group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/90 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
              {item.beforeTone && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-crimson-300 backdrop-blur">
                  <ArrowLeftRight className="h-3 w-3" /> Before / After
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <Badge className="mb-2">{item.category}</Badge>
                <p className="font-display text-base font-semibold text-white">
                  {item.title}
                </p>
                <p className="text-xs text-ash-400">{item.vehicle}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}