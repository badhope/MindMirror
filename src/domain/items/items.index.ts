// 镜心 · 题库索引

import { ITEMS_EAST_LITERATI } from './items.east-literati';
import { ITEMS_EAST_STATEMAN } from './items.east-statesman';
import { ITEMS_EAST_SCIENTIST } from './items.east-scientist';
import { ITEMS_WEST_PHILOSOPHER } from './items.west-philosopher';
import { ITEMS_WEST_SCIENTIST } from './items.west-scientist';
import type { Item } from './item.types';
import type { DomainId } from '../figures/figure.types';

const ITEMS_BY_DOMAIN: Record<DomainId, readonly Item[]> = {
  'east-literati': ITEMS_EAST_LITERATI,
  'east-statesman': ITEMS_EAST_STATEMAN,
  'east-scientist': ITEMS_EAST_SCIENTIST,
  'west-philosopher': ITEMS_WEST_PHILOSOPHER,
  'west-scientist': ITEMS_WEST_SCIENTIST,
};

export function itemsForDomain(d: DomainId): readonly Item[] {
  return ITEMS_BY_DOMAIN[d];
}

export const ALL_ITEMS: readonly Item[] = [
  ...ITEMS_EAST_LITERATI,
  ...ITEMS_EAST_STATEMAN,
  ...ITEMS_EAST_SCIENTIST,
  ...ITEMS_WEST_PHILOSOPHER,
  ...ITEMS_WEST_SCIENTIST,
];
