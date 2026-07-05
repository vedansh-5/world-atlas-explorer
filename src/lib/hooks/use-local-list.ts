"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

const listenersByKey = new Map<string, Set<Listener>>();
const cacheByKey = new Map<string, string[]>();
const EMPTY_LIST: string[] = [];

function readFromStorage(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeToStorage(key: string, value: string[]) {
  cacheByKey.set(key, value);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  for (const listener of listenersByKey.get(key) ?? []) listener();
}

function getSnapshot(key: string): string[] {
  if (!cacheByKey.has(key)) {
    cacheByKey.set(key, readFromStorage(key));
  }
  return cacheByKey.get(key)!;
}

function subscribe(key: string, onStoreChange: Listener) {
  if (!listenersByKey.has(key)) listenersByKey.set(key, new Set());
  const set = listenersByKey.get(key)!;
  set.add(onStoreChange);

  function onStorageEvent(e: StorageEvent) {
    if (e.key === key) {
      cacheByKey.delete(key);
      onStoreChange();
    }
  }
  window.addEventListener("storage", onStorageEvent);

  return () => {
    set.delete(onStoreChange);
    window.removeEventListener("storage", onStorageEvent);
  };
}

/**
 * Reactive localStorage-backed list of strings, shared across every
 * component using the same key within the tab (not just cross-tab, which is
 * all the native `storage` event covers).
 */
export function useLocalList(key: string) {
  const items = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => getSnapshot(key),
    () => EMPTY_LIST
  );

  const set = useCallback(
    (next: string[]) => writeToStorage(key, next),
    [key]
  );

  const add = useCallback(
    (value: string, opts?: { max?: number; dedupe?: boolean }) => {
      const current = getSnapshot(key);
      const withoutDup = opts?.dedupe === false ? current : current.filter((v) => v !== value);
      const next = [value, ...withoutDup];
      set(opts?.max ? next.slice(0, opts.max) : next);
    },
    [key, set]
  );

  const remove = useCallback(
    (value: string) => {
      set(getSnapshot(key).filter((v) => v !== value));
    },
    [key, set]
  );

  const toggle = useCallback(
    (value: string, opts?: { max?: number }) => {
      const current = getSnapshot(key);
      if (current.includes(value)) {
        set(current.filter((v) => v !== value));
      } else {
        const next = [...current, value];
        set(opts?.max ? next.slice(-opts.max) : next);
      }
    },
    [key, set]
  );

  const has = useCallback((value: string) => items.includes(value), [items]);

  const clear = useCallback(() => set([]), [set]);

  return { items, add, remove, toggle, has, clear, set };
}
