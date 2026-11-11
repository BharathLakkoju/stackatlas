import type { TrackMeta } from "./tracks-meta";

export const TRACK_IDS = [
  "dsa",
  "system-design",
  "js-ts",
  "python",
  "java",
  "cloud",
  "ai",
] as const;

export type TrackId = (typeof TRACK_IDS)[number];

export { TRACKS, TRACK_LIST, isTrackId } from "./tracks-meta";
export type { TrackMeta } from "./tracks-meta";
