import type { ReactNode } from 'react';
import type { Tone } from '../types';
import { classNames } from '../utils/format';

const TONES: Record<Tone, [string, string, string]> = {
  crimson: ['#ef4444', '#991b1b', '#1a0505'],
  graphite: ['#4a505a', '#1a1d22', '#0a0a0a'],
  azure: ['#3b82f6', '#1e3a5f', '#0a1628'],
  amber: ['#f59e0b', '#5c3208', '#1a1003'],
  copper: ['#cd7f32', '#4a2c17', '#150b05'],
  emerald: ['#22c55e', '#0d4a38', '#04150f'],
  violet: ['#a855f7', '#351763', '#0d0718'],
  ruby: ['#e11d48', '#4a1220', '#12050a'],
  slate: ['#64748b', '#243141', '#0b1120'],
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface ArtworkProps {
  tone: Tone;
  seed?: number;
  className?: string;
  ring?: boolean;
  children?: ReactNode;
  animate?: boolean;
}

export default function Artwork({
  tone,
  seed = 1,
  className,
  ring = true,
  children,
  animate = true,
}: ArtworkProps) {
  const rand = mulberry32(seed * 1000 + 7);
  const [c0, c1, c2] = TONES[tone];
  const spotX = Math.round(15 + rand() * 70);
  const spotY = Math.round(10 + rand() * 60);
  const angle = Math.round(rand() * 360);
  const ringOffset = Math.round(rand() * 40 - 20);
  const base = `linear-gradient(${angle}deg, ${c0} 0%, ${c1} 52%, ${c2} 100%)`;
  const spot = `radial-gradient(ellipse 60% 45% at ${spotX}% ${spotY}%, rgba(255,255,255,0.18), transparent 70%)`;
  const sheen = `linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.12) 50%, transparent 58%)`;
  const mesh = `radial-gradient(circle at ${rand()*100}% ${rand()*100}%, rgba(239,68,68,0.15) 0%, transparent 50%),
                radial-gradient(circle at ${rand()*100}% ${rand()*100}%, rgba(185,28,28,0.1) 0%, transparent 40%)`;

  return (
    <div
      className={classNames('relative overflow-hidden', animate && 'animate-fade-up', className)}
      style={{ background: base }}
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ background: spot }} />
      <div className="absolute inset-0" style={{ background: sheen }} />
      <div className="absolute inset-0 opacity-[0.08]" style={{ background: mesh }} />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 10px)',
        }}
      />
      {ring && (
        <svg className="absolute inset-0 h-full w-full opacity-[0.12]" preserveAspectRatio="xMidYMid slice">
          <g stroke="white" strokeWidth="1" fill="none">
            <circle cx="50%" cy="50%" r="38%" />
            <circle cx="50%" cy="50%" r="28%" />
            <circle cx="50%" cy="50%" r="18%" />
          </g>
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2="50%"
              y2="calc(50% - 38%)"
              stroke="white"
              strokeWidth="1.5"
              transform={`rotate(${i * 60 + ringOffset} 50% 50%)`}
            />
          ))}
        </svg>
      )}
      {children}
    </div>
  );
}