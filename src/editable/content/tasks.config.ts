import type { TaskKey } from "@/lib/site-config";

export const slot4TaskSupport = {
  article: false,
  classified: false,
  sbm: false,
  profile: false,
  pdf: true,
  listing: true,
  image: false,
} satisfies Record<TaskKey, boolean>;

// Internal-only developer notes about each surface. Not user-visible.
export const slot4TaskNotes = {
  article: "Field journal — article archive and detail backlinks",
  classified: "Noticeboard — short-form archive and detail backlinks",
  sbm: "Shelf — bookmarked resources archive and detail backlinks",
  profile: "Neighbours — profile archive and detail backlinks",
  pdf: "Field Notes — reference file archive and detail backlinks",
  listing: "Community Directory — record archive and detail backlinks",
  image: "Contact sheet — gallery archive and detail backlinks",
} satisfies Record<TaskKey, string>;
