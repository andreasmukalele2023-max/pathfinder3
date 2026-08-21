import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { SubjectEntry } from "./points";
import type { ShortlistItem } from "./shortlist";

export type SyncState = "idle" | "loading" | "saving" | "saved" | "error";

/**
 * Keeps the learner's grades + shortlist mirrored in Lovable Cloud while signed in.
 * On first sign-in the remote row wins if it already has grades, otherwise the
 * local (guest) progress is pushed up so nothing is lost.
 */
export function useCloudProgress({
  user,
  entries,
  setEntries,
  shortlist,
  setShortlist,
}: {
  user: User | null;
  entries: SubjectEntry[];
  setEntries: (e: SubjectEntry[]) => void;
  shortlist: ShortlistItem[];
  setShortlist: (s: ShortlistItem[]) => void;
}) {
  const [state, setState] = useState<SyncState>("idle");
  const hydrated = useRef<string | null>(null);
  const latest = useRef({ entries, shortlist });
  latest.current = { entries, shortlist };

  // Pull on sign-in
  useEffect(() => {
    if (!user) {
      hydrated.current = null;
      setState("idle");
      return;
    }
    if (hydrated.current === user.id) return;
    let cancelled = false;
    setState("loading");
    (async () => {
      const { data, error } = await supabase
        .from("learner_progress")
        .select("entries, shortlist")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setState("error");
        return;
      }
      const remoteEntries = (data?.entries as SubjectEntry[] | null) ?? [];
      const remoteShortlist = (data?.shortlist as ShortlistItem[] | null) ?? [];
      const remoteHasData = remoteEntries.some((e) => e.subject && e.grade) || remoteShortlist.length > 0;
      if (remoteHasData) {
        if (remoteEntries.length) setEntries(remoteEntries);
        setShortlist(remoteShortlist);
      } else {
        await supabase.from("learner_progress").upsert({
          user_id: user.id,
          entries: latest.current.entries as unknown as never,
          shortlist: latest.current.shortlist as unknown as never,
        });
      }
      hydrated.current = user.id;
      setState("saved");
    })();
    return () => {
      cancelled = true;
    };
  }, [user, setEntries, setShortlist]);

  // Debounced push on change
  useEffect(() => {
    if (!user || hydrated.current !== user.id) return;
    setState("saving");
    const t = setTimeout(async () => {
      const { error } = await supabase.from("learner_progress").upsert({
        user_id: user.id,
        entries: entries as unknown as never,
        shortlist: shortlist as unknown as never,
      });
      setState(error ? "error" : "saved");
    }, 800);
    return () => clearTimeout(t);
  }, [user, entries, shortlist]);

  return state;
}
