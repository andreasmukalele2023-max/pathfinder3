import { useCallback, useEffect, useState } from "react";
import type { InstitutionKey } from "./points";

export interface ShortlistItem {
  instKey: InstitutionKey;
  courseName: string;
  faculty: string;
  duration: string;
  minPoints: number;
  addedAt: string;
}

const KEY = "points-matrix:shortlist";

function read(): ShortlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ShortlistItem[]) : [];
  } catch {
    return [];
  }
}

export function useShortlist() {
  const [items, setItems] = useState<ShortlistItem[]>([]);

  useEffect(() => {
    setItems(read());
  }, []);

  const persist = useCallback((next: ShortlistItem[]) => {
    setItems(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const has = useCallback(
    (instKey: InstitutionKey, courseName: string) =>
      items.some((i) => i.instKey === instKey && i.courseName === courseName),
    [items],
  );

  const toggle = useCallback(
    (item: Omit<ShortlistItem, "addedAt">) => {
      const exists = items.some((i) => i.instKey === item.instKey && i.courseName === item.courseName);
      persist(
        exists
          ? items.filter((i) => !(i.instKey === item.instKey && i.courseName === item.courseName))
          : [...items, { ...item, addedAt: new Date().toISOString() }],
      );
    },
    [items, persist],
  );

  const remove = useCallback(
    (instKey: InstitutionKey, courseName: string) =>
      persist(items.filter((i) => !(i.instKey === instKey && i.courseName === courseName))),
    [items, persist],
  );

  return { items, has, toggle, remove };
}
