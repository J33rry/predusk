import { NextRequest } from "next/server";
import { db } from "@/db";
import { profiles, projects, workExperiences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fullProfileSchema, profileUpdateSchema } from "@/lib/validators";
import { jsonError, jsonSuccess } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

// GET /api/profile - Get all profiles
export async function GET() {
    try {
        const results = await db.query.profiles.findMany({
            with: {
                projects: true,
                workExperiences: true,
            },
            orderBy: (profiles, { desc }) => [desc(profiles.createdAt)],
        });

        // Transform to expected shape
        const profilesList = results.map((result) => ({
            id: result.id,
            name: result.name,
            email: result.email,
            summary: result.summary,
            education: result.education,
            skills: result.skills,
            links: result.links,
            projects: result.projects.map((p) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                links: p.links,
                skills: p.skills,
            })),
            work: result.workExperiences.map((w) => ({
                id: w.id,
                role: w.role,
                company: w.company,
                location: w.location,
                startDate: w.startDate,
                endDate: w.endDate,
                summary: w.summary,
                highlights: w.highlights,
            })),
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        }));

        return jsonSuccess({
            profiles: profilesList,
            count: profilesList.length,
        });
    } catch (error) {
        console.error("GET /api/profile error:", error);
        return jsonError("Internal server error", 500);
    }
}

// POST /api/profile - Create a new profile
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = fullProfileSchema.safeParse(body);

        if (!parsed.success) {
            return jsonError(parsed.error.issues[0].message, 400);
        }

        const {
            projects: projectsInput,
            work: workInput,
            ...profileData
        } = parsed.data;

        // Check if email already exists
        const existing = await db.query.profiles.findFirst({
            where: eq(profiles.email, profileData.email),
        });

        if (existing) {
            return jsonError("A profile with this email already exists.", 409);
        }

        // Insert profile
        const [newProfile] = await db
            .insert(profiles)
            .values(profileData)
            .returning();

        // Insert projects if provided
        if (projectsInput && projectsInput.length > 0) {
            await db.insert(projects).values(
                projectsInput.map((p) => ({
                    ...p,
                    profileId: newProfile.id,
                })),
            );
        }

        // Insert work experiences if provided
        if (workInput && workInput.length > 0) {
            await db.insert(workExperiences).values(
                workInput.map((w) => ({
                    role: w.role,
                    company: w.company,
                    location: w.location,
                    startDate: w.startDate,
                    endDate: w.endDate,
                    summary: w.summary,
                    highlights: w.highlights,
                    profileId: newProfile.id,
                })),
            );
        }

        // Fetch complete profile
        const result = await db.query.profiles.findFirst({
            where: eq(profiles.id, newProfile.id),
            with: {
                projects: true,
                workExperiences: true,
            },
        });

        return jsonSuccess(result, 201);
    } catch (error) {
        console.error("POST /api/profile error:", error);
        return jsonError("Internal server error", 500);
    }
}

// PUT /api/profile - Update the profile
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = profileUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return jsonError(parsed.error.issues[0].message, 400);
        }

        // Find existing profile
        const existing = await db.query.profiles.findFirst();

        if (!existing) {
            return jsonError("Profile not found", 404);
        }

        // Update profile
        const [updated] = await db
            .update(profiles)
            .set({
                ...parsed.data,
                updatedAt: new Date(),
            })
            .where(eq(profiles.id, existing.id))
            .returning();

        // Fetch complete profile with relations
        const result = await db.query.profiles.findFirst({
            where: eq(profiles.id, updated.id),
            with: {
                projects: true,
                workExperiences: true,
            },
        });

        return jsonSuccess(result);
    } catch (error) {
        console.error("PUT /api/profile error:", error);
        return jsonError("Internal server error", 500);
    }
}
