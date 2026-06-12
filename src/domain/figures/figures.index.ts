// 镜心 · 人物库索引

import { FIGURES_EAST_LITERATI } from './figures.east-literati';
import { FIGURES_EAST_STATEMAN } from './figures.east-statesman';
import { FIGURES_EAST_SCIENTIST } from './figures.east-scientist';
import { FIGURES_WEST_PHILOSOPHER } from './figures.west-philosopher';
import { FIGURES_WEST_SCIENTIST } from './figures.west-scientist';
import type { Figure, DomainId } from './figure.types';

const FIGURES_BY_DOMAIN: Record<DomainId, readonly Figure[]> = {
  'east-literati': FIGURES_EAST_LITERATI,
  'east-statesman': FIGURES_EAST_STATEMAN,
  'east-scientist': FIGURES_EAST_SCIENTIST,
  'west-philosopher': FIGURES_WEST_PHILOSOPHER,
  'west-scientist': FIGURES_WEST_SCIENTIST,
};

export function figuresForDomain(d: DomainId): readonly Figure[] {
  return FIGURES_BY_DOMAIN[d];
}

export const ALL_FIGURES: readonly Figure[] = [
  ...FIGURES_EAST_LITERATI,
  ...FIGURES_EAST_STATEMAN,
  ...FIGURES_EAST_SCIENTIST,
  ...FIGURES_WEST_PHILOSOPHER,
  ...FIGURES_WEST_SCIENTIST,
];
