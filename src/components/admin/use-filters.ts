import { useEffect, useState } from "react";

/**
 * Both keys are optional so that links into these routes — and into their
 * detail children, which inherit the schema — do not all have to spell out a
 * filter they do not care about.
 */
export type AdminSearch = { q?: string | undefined; status?: string | undefined };

/**
 * Shared search validation for the four admin list routes. Keeping the filters
 * in the URL means the browser's back button returns to the list the operator
 * was looking at, instead of resetting it to "everything".
 */
export function validateAdminSearch(search: Record<string, unknown>): AdminSearch {
  const out: AdminSearch = {};
  const q = search["q"];
  const status = search["status"];
  if (typeof q === "string" && q) out.q = q;
  if (typeof status === "string" && status && status !== "all") out.status = status;
  return out;
}

/**
 * Holds the text box's own value so typing stays responsive, and only pushes it
 * to the URL (and therefore to the query) once typing pauses.
 */
export function useDebouncedQuery(value: string, commit: (next: string) => void, ms = 300) {
  const [draft, setDraft] = useState(value);

  // Follow the URL when it changes from outside the box (back button, reset).
  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft === value) return;
    const timer = setTimeout(() => commit(draft), ms);
    return () => clearTimeout(timer);
    // `commit` is a fresh closure on every render; depending on it would reset
    // the timer on each keystroke and never fire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, value, ms]);

  return [draft, setDraft] as const;
}
