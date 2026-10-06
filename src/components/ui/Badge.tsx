import type { ReactNode } from 'react';
import { classNames } from '../../utils/format';

type Variant = 'crimson' | 'emerald' | 'ash' | 'red' | 'copper' | 'blue';

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export default function Badge({ variant = 'ash', className, children }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors',
        variant === 'crimson' && 'border-crimson-500/30 bg-crimson-500/10 text-crimson-300',
        variant === 'emerald' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        variant === 'ash' && 'border-white/10 bg-white/[0.04] text-ash-300',
        variant === 'red' && 'border-red-500/30 bg-red-500/10 text-red-300',
        variant === 'copper' && 'border-copper-400/30 bg-copper-400/10 text-copper-300',
        variant === 'blue' && 'border-sky-500/30 bg-sky-500/10 text-sky-300',
        className,
      )}
    >
      {children}
    </span>
  );
}