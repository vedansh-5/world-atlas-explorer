"use client";

import { useLocalList } from "./use-local-list";

const KEY = "wae:favorites";

export function useFavorites() {
  const { items, toggle, has, remove } = useLocalList(KEY);
  return {
    favorites: items,
    isFavorite: has,
    toggleFavorite: (cca3: string) => toggle(cca3),
    removeFavorite: remove,
  };
}
