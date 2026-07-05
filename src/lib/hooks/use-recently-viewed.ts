"use client";

import { useLocalList } from "./use-local-list";

const KEY = "wae:recently-viewed";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const { items, add, clear } = useLocalList(KEY);
  return {
    recentlyViewed: items,
    recordView: (cca3: string) => add(cca3, { max: MAX_ITEMS }),
    clearRecentlyViewed: clear,
  };
}
