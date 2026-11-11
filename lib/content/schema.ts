import { z } from "zod";
import { TRACK_IDS } from "./tracks";

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export type Difficulty = z.infer<typeof difficultySchema>;

export const contentKindSchema = z.enum([
  "lesson",
  "cheatsheet",
  "interview",
  "daily",
  "blog",
  "lab",
  "changelog",
  "compare",
]);
export type ContentKind = z.infer<typeof contentKindSchema>;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "lastReviewed must be YYYY-MM-DD");

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");

export const baseFrontmatterSchema = z.object({
  title: z.string().min(3),
  slug: slugSchema,
  kind: contentKindSchema,
  summary: z.string().min(20).max(280),
  tags: z.array(z.string().min(1)).min(1),
  estimatedMinutes: z.number().int().positive(),
  lastReviewed: isoDate,
  related: z.array(slugSchema).default([]),
});

export const lessonFrontmatterSchema = baseFrontmatterSchema.extend({
  kind: z.literal("lesson"),
  track: z.enum(TRACK_IDS),
  module: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  order: z.number().int().positive(),
  difficulty: difficultySchema,
  prerequisites: z.array(slugSchema).default([]),
  root: z.boolean().default(false),
  compareWith: z.array(slugSchema).default([]),
});

export const cheatsheetFrontmatterSchema = baseFrontmatterSchema.extend({
  kind: z.literal("cheatsheet"),
  track: z.enum(TRACK_IDS),
  difficulty: difficultySchema.default("intermediate"),
});

export const interviewFrontmatterSchema = baseFrontmatterSchema.extend({
  kind: z.literal("interview"),
  track: z.enum(TRACK_IDS),
  difficulty: difficultySchema,
  followUps: z.array(z.string().min(8)).min(1),
});

export const dailyFrontmatterSchema = baseFrontmatterSchema.extend({
  kind: z.literal("daily"),
  track: z.enum(TRACK_IDS),
  publishedAt: isoDate,
});

export const blogFrontmatterSchema = baseFrontmatterSchema.extend({
  kind: z.literal("blog"),
  track: z.enum(TRACK_IDS).optional(),
  difficulty: difficultySchema.optional(),
});

export const labFrontmatterSchema = baseFrontmatterSchema.extend({
  kind: z.literal("lab"),
  track: z.enum(TRACK_IDS),
  labId: z.enum(["dsa-visualizer", "consistent-hashing", "rag-chunking"]),
});

export const changelogFrontmatterSchema = baseFrontmatterSchema.extend({
  kind: z.literal("changelog"),
});

export const compareFrontmatterSchema = baseFrontmatterSchema.extend({
  kind: z.literal("compare"),
  left: slugSchema,
  right: slugSchema,
  track: z.enum(TRACK_IDS),
});

export const frontmatterSchema = z.discriminatedUnion("kind", [
  lessonFrontmatterSchema,
  cheatsheetFrontmatterSchema,
  interviewFrontmatterSchema,
  dailyFrontmatterSchema,
  blogFrontmatterSchema,
  labFrontmatterSchema,
  changelogFrontmatterSchema,
  compareFrontmatterSchema,
]);

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;
export type CheatsheetFrontmatter = z.infer<typeof cheatsheetFrontmatterSchema>;
export type InterviewFrontmatter = z.infer<typeof interviewFrontmatterSchema>;
export type DailyFrontmatter = z.infer<typeof dailyFrontmatterSchema>;
export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;
export type LabFrontmatter = z.infer<typeof labFrontmatterSchema>;
export type ChangelogFrontmatter = z.infer<typeof changelogFrontmatterSchema>;
export type CompareFrontmatter = z.infer<typeof compareFrontmatterSchema>;
export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type LoadedDocument<T extends Frontmatter = Frontmatter> = {
  frontmatter: T;
  body: string;
  filePath: string;
};

export { isTrackId } from "./tracks";

export const quizQuestionSchema = z.object({
  prompt: z.string().min(8),
  choices: z.array(z.string().min(1)).min(2).max(6),
  answer: z.number().int().min(0),
  explanation: z.string().min(8),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const roadmapNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  lessonSlug: slugSchema.optional(),
  description: z.string().min(8),
  children: z.array(z.string()).default([]),
});

export const roadmapSchema = z.object({
  slug: slugSchema,
  title: z.string().min(3),
  role: z.string().min(3),
  summary: z.string().min(20),
  estimatedWeeks: z.number().int().positive(),
  nodes: z.array(roadmapNodeSchema).min(4),
});

export type Roadmap = z.infer<typeof roadmapSchema>;
