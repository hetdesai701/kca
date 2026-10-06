import type { Review } from '../types';
import { formatDate } from '../utils/format';
import Badge from './ui/Badge';
import RatingStars from './ui/RatingStars';

const AVATAR_TONES = [
  'bg-gold-500/20 text-gold-300',
  'bg-sky-500/20 text-sky-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-violet-500/20 text-violet-300',
];

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ReviewCard({ review }: { review: Review }) {
  const avatarTone = AVATAR_TONES[review.name.length % AVATAR_TONES.length];
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-ink-900 p-6 transition-colors hover:border-white/15">
      <div className="flex items-center justify-between">
        <RatingStars rating={review.rating} size={14} />
        <span className="text-xs text-zinc-500">{formatDate(review.date)}</span>
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-white">{review.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{review.content}</p>
      <div className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${avatarTone}`}
          aria-hidden="true"
        >
          {initials(review.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-200">{review.name}</p>
          <p className="truncate text-xs text-zinc-500">{review.vehicle}</p>
        </div>
        <Badge className="ml-auto shrink-0">{review.service}</Badge>
      </div>
    </article>
  );
}
