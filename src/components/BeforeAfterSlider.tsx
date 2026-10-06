import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import type { Tone } from '../types';
import { classNames } from '../utils/format';
import Artwork from './Artwork';

interface BeforeAfterSliderProps {
  beforeTone: Tone;
  afterTone: Tone;
  seed?: number;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeTone,
  afterTone,
  seed = 1,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
}: BeforeAfterSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    update(e.clientX);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging) update(e.clientX);
  };

  const endDrag = () => setDragging(false);

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={classNames(
        'relative aspect-[16/10] cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-white/10',
        className,
      )}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos((p) => Math.max(4, p - 4));
        if (e.key === 'ArrowRight') setPos((p) => Math.min(96, p + 4));
      }}
    >
      <Artwork tone={afterTone} seed={seed} ring={false} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Artwork tone={beforeTone} seed={seed + 1} ring={false} className="absolute inset-0" />
      </div>
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white/80" />
        <div className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-card">
          <ChevronsLeftRight className="h-5 w-5 text-ink-950" />
        </div>
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
        {beforeLabel}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-gold-300 backdrop-blur">
        {afterLabel}
      </span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white/70 backdrop-blur">
        Drag to compare
      </span>
    </div>
  );
}
