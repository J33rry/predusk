import { z } from "zod";

const educationEntrySchema = z.object({
    school: z.string().min(1, "School is required"),
    degree: z.string().optional(),
    area: z.string().optional(),
    startYear: z.string().optional(),
    endYear: z.string().optional(),
});

const profileLinksSchema = z.object({
    github: z.string().url().nullable().optional(),
    linkedin: z.string().url().nullable().optional(),
    portfolio: z.string().url().nullable().optional(),
    other: z.array(z.string().url()).optional(),
});

const projectLinksSchema = z.object({
    demo: z.string().url().nullable().optional(),
    repo: z.string().url().nullable().optional(),
    docs: z.string().url().nullable().optional(),
    other: z.array(z.string().url()).optional(),
});

const workHighlightSchema = z.object({
    bullet: z.string().min(1),
});

export const profileCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    summary: z.string().optional(),
    education: z.array(educationEntrySchema).optional().default([]),
    skills: z.array(z.string()).optional().default([]),
    links: profileLinksSchema.optional().default({}),
});

export const profileUpdateSchema = profileCreateSchema.partial();

export const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    links: projectLinksSchema.optional().default({}),
    skills: z.array(z.string()).optional().default([]),
});

export const workExperienceSchema = z.object({
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(workHighlightSchema).optional().default([]),
});

export const fullProfileSchema = profileCreateSchema.extend({
    projects: z.array(projectSchema).optional().default([]),
    work: z.array(workExperienceSchema).optional().default([]),
});

export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;
export type FullProfileInput = z.infer<typeof fullProfileSchema>;
