import type { SiteContentMap } from "@/lib/site-content";

/** Callback condivisi tra sezioni in modalità admin (WYSIWYG) */
export type SiteEditHandlers = {
  onTextChange: (elementId: string, value: string) => void;
  onUpload: (elementId: string, file: File) => Promise<void>;
  /** Svuota un campo immagine/video in DB (sito pubblico aggiornato subito). */
  onClearMedia?: (elementId: string) => Promise<void>;
};

export type WithSiteEdit = {
  content: SiteContentMap;
  editMode?: boolean;
  edit?: SiteEditHandlers;
};
