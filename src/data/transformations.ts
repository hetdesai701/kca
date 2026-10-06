import type { Transformation } from '../types';

export const transformations: Transformation[] = [
  {
    id: 'tr-1',
    slug: 'liquid-mirror-nexon',
    title: 'Liquid Mirror',
    vehicle: 'Tata Nexon',
    description:
      'Two-stage machine polish followed by a 9H ceramic coat. Swirl marks erased, depth restored, water sheets off like mercury.',
    beforeTone: 'slate',
    afterTone: 'azure',
    seed: 101,
  },
  {
    id: 'tr-2',
    slug: 'stealth-creta',
    title: 'Stealth Wrap & PPF',
    vehicle: 'Hyundai Creta',
    description:
      'Full gloss-black PPF with self-healing top coat. Chips vanish with a heat gun, finish stays show-fresh for a decade.',
    beforeTone: 'graphite',
    afterTone: 'slate',
    seed: 202,
  },
  {
    id: 'tr-3',
    slug: 'cognac-cabin-seltos',
    title: 'Cognac Cabin',
    vehicle: 'Kia Seltos',
    description:
      'Full-grain Nappa leather, contrast stitching and acoustic deadening. A cabin that feels bespoke at every touch point.',
    beforeTone: 'slate',
    afterTone: 'copper',
    seed: 303,
  },
  {
    id: 'tr-4',
    slug: 'sound-of-silence-kushaq',
    title: 'The Sound of Silence',
    vehicle: 'Skoda Kushaq',
    description:
      'Studio-grade component speakers, DSP tuning and full sound deadening. Concert clarity at highway speed.',
    beforeTone: 'slate',
    afterTone: 'violet',
    seed: 404,
  },
];
