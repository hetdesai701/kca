import {
  Armchair,
  Disc,
  Gauge,
  Layers,
  Lightbulb,
  Shield,
  SprayCan,
  Sparkles,
  Volume2,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { Tone } from '../types';
import Artwork from './Artwork';

const ICONS: Record<string, LucideIcon> = {
  'Ceramic Coating': Sparkles,
  'Paint Protection': Shield,
  Detailing: SprayCan,
  'Alloy Wheels': Disc,
  'Audio & Electronics': Volume2,
  'Tinting & Films': Layers,
  Lighting: Lightbulb,
  Interior: Armchair,
  Performance: Gauge,
};

function getIcon(category: string): LucideIcon {
  return ICONS[category] ?? Wrench;
}

/** Renders the cinematic artwork band for a service category. */
export function ServiceIcon({ category, tone = 'graphite', className }: { category: string; tone?: Tone; className?: string }) {
  return <Artwork tone={tone} seed={category.length * 13} ring={false} className={className} />;
}

/** Renders the category's Lucide icon. */
export function ServiceCategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = getIcon(category);
  return <Icon className={className} />;
}