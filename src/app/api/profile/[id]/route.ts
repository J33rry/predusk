import { NextRequest } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { profileUpdateSchema } from "@/lib/validators";
import { jsonError, jsonSuccess } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT /api/profile/:id - Update a profile by id
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const body = await request.json();
        const parsed = profileUpdateSchema.safeParse(body);

        if (!parsed.success) {
            return jsonError(parsed.error.issues[0].message, 400);
        }

        const { id } = await params;

        const existing = await db.query.profiles.findFirst({
            where: eq(profiles.id, id),
        });

        if (!existing) {
            return jsonError("Profile not found", 404);
        }

        if (parsed.data.email) {
            const emailOwner = await db.query.profiles.findFirst({
                where: and(
                    eq(profiles.email, parsed.data.email),
                    ne(profiles.id, id),
                ),
            });

            if (emailOwner) {
                return jsonError(
                    "A profile with this email already exists.",
                    409,
                );
            }
        }

        const [updated] = await db
            .update(profiles)
            .set({
                ...parsed.data,
                updatedAt: new Date(),
            })
            .where(eq(profiles.id, id))
            .returning();

        return jsonSuccess(updated);
    } catch (error) {
        console.error("PUT /api/profile/:id error:", error);
        return jsonError("Internal server error", 500);
    }
}
