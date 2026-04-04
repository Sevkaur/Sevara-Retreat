import { createAnonClient } from "@/lib/supabase/anon";
import { CONTENT_REGISTRY, defaultContentMap } from "@/lib/content-registry";

export type SiteContentMap = Record<string, string>;

export async function getSiteContent(): Promise<SiteContentMap> {
  const base = defaultContentMap();
  const supabase = createAnonClient();
  if (!supabase) {
    return base;
  }

  const { data, error } = await supabase.from("site_content").select("element_id, value");
  if (error || !data) {
    return base;
  }

  const merged = { ...base };
  for (const row of data) {
    if (row.element_id && typeof row.value === "string") {
      merged[row.element_id] = row.value;
    }
  }
  return merged;
}

export function getEntryMeta(elementId: string) {
  return CONTENT_REGISTRY.find((e) => e.element_id === elementId);
}
