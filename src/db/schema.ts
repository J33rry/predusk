import {
    index,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type EducationEntry = {
    school: string;
    degree?: string;
    area?: string;
    startYear?: string;
    endYear?: string;
};

export type ProfileLinks = {
    github?: string | null;
    linkedin?: string | null;
    portfolio?: string | null;
    other?: string[];
};

export type ProjectLinks = {
    demo?: string | null;
    repo?: string | null;
    docs?: string | null;
    other?: string[];
};

export type WorkHighlight = {
    bullet: string;
};

export const profiles = pgTable(
    "profiles",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        email: text("email").notNull().unique(),
        summary: text("summary"),
        education: jsonb("education")
            .$type<EducationEntry[]>()
            .notNull()
            .default(sql`'[]'::jsonb`),
        skills: text("skills")
            .array()
            .notNull()
            .default(sql`ARRAY[]::text[]`),
        links: jsonb("links")
            .$type<ProfileLinks>()
            .notNull()
            .default(sql`'{}'::jsonb`),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        emailIdx: index("profiles_email_idx").on(table.email),
    }),
);

export const projects = pgTable(
    "projects",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        profileId: uuid("profile_id")
            .notNull()
            .references(() => profiles.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        description: text("description").notNull(),
        links: jsonb("links")
            .$type<ProjectLinks>()
            .notNull()
            .default(sql`'{}'::jsonb`),
        skills: text("skills")
            .array()
            .notNull()
            .default(sql`ARRAY[]::text[]`),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        profileIdx: index("projects_profile_idx").on(table.profileId),
    }),
);

export const workExperiences = pgTable(
    "work_experiences",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        profileId: uuid("profile_id")
            .notNull()
            .references(() => profiles.id, { onDelete: "cascade" }),
        role: text("role").notNull(),
        company: text("company").notNull(),
        location: text("location"),
        startDate: text("start_date"),
        endDate: text("end_date"),
        summary: text("summary"),
        highlights: jsonb("highlights")
            .$type<WorkHighlight[]>()
            .notNull()
            .default(sql`'[]'::jsonb`),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        profileIdx: index("work_experiences_profile_idx").on(table.profileId),
    }),
);

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
    projects: many(projects),
    workExperiences: many(workExperiences),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
    profile: one(profiles, {
        fields: [projects.profileId],
        references: [profiles.id],
    }),
}));

export const workExperiencesRelations = relations(
    workExperiences,
    ({ one }) => ({
        profile: one(profiles, {
            fields: [workExperiences.profileId],
            references: [profiles.id],
        }),
    }),
);

// Type exports
export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;
export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;
export type WorkExperience = InferSelectModel<typeof workExperiences>;
export type NewWorkExperience = InferInsertModel<typeof workExperiences>;
