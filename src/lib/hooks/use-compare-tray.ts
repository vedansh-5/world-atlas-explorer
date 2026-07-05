"use client";

import { useLocalList } from "./use-local-list";

const KEY = "wae:compare";
const MAX_ITEMS = 2;

export function useCompareTray() {
  const { items, toggle, has, clear, remove } = useLocalList(KEY);
  return {
    compareList: items,
    isComparing: has,
    isFull: items.length >= MAX_ITEMS,
    toggleCompare: (cca3: string) => toggle(cca3, { max: MAX_ITEMS }),
    removeFromCompare: remove,
    clearCompare: clear,
    maxItems: MAX_ITEMS,
  };
}
