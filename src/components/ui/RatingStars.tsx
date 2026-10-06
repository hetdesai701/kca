import { Star } from 'lucide-react';
import { classNames } from '../../utils/format';

interface RatingStarsProps {
  rating: number;
  size?: number;
  className?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function RatingStars({ rating, size = 16, className, interactive = false, onChange }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    const fill = Math.min(100, Math.max(0, (rating - i + 1) * 100));
    return (
      <span
        key={i}
        className="relative inline-block cursor-pointer"
        style={{ width: size, height: size }}
        onClick={() => interactive && onChange?.(i)}
        onMouseEnter={() => interactive && onChange?.(i)}
      >
        <Star className="absolute inset-0 text-ash-700" style={{ width: size, height: size }} />
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
          <Star className="fill-crimson-400 text-crimson-400" style={{ width: size, height: size }} />
        </span>
      </span>
    );
  });

  return (
    <span className={classNames('inline-flex items-center gap-0.5', className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {stars}
    </span>
  );
}