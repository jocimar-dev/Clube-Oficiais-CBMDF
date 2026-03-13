import { defineCollection, z } from "astro:content";

const news = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    pdfUrl: z.string().optional(),
  }),
});

const events = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    time: z.string().optional(),
    location: z.string(),
    status: z.enum(["agenda", "comemorativo", "social"]),
    cover: z.string(),
    highlights: z.array(z.string()).default([]),
    registrationUrl: z.string().optional(),
    sortOrder: z.number().default(0),
  }),
});

const documents = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    documentType: z.string(),
    issuedAt: z.string().optional(),
    file: z.string(),
    summary: z.string(),
    audience: z.string(),
    featured: z.boolean().default(false),
    ctaLabel: z.string().optional(),
    category: z.enum(["membership", "regulation", "newsletter"]),
  }),
});

const leadership = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    role: z.string(),
    board: z.enum(["diretoria-executiva", "conselho-deliberativo", "conselho-fiscal"]),
    term: z.string(),
    order: z.number(),
    rank: z.string(),
    bio: z.string().optional(),
  }),
});

export const collections = {
  news,
  events,
  documents,
  leadership,
};
