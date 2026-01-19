import { NextRequest } from "next/server";
import { db } from "@/db";
import { profiles, projects, workExperiences } from "@/db/schema";
import { sql, ilike, or } from "drizzle-orm";
import { jsonError, jsonSuccess } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

// GET /api/search?q=keyword
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return jsonError("Query parameter 'q' is required", 400);
    }

    const searchTerm = `%${query.toLowerCase()}%`;

    // Search in profiles
    const profileResults = await db
      .select()
      .from(profiles)
      .where(
        or(
          sql`LOWER(${profiles.name}) LIKE ${searchTerm}`,
          sql`LOWER(${profiles.summary}) LIKE ${searchTerm}`,
          sql`EXISTS (
            SELECT 1 FROM unnest(${profiles.skills}) AS s 
            WHERE LOWER(s) LIKE ${searchTerm}
          )`
        )
      );

    // Search in projects
    const projectResults = await db
      .select()
      .from(projects)
      .where(
        or(
          sql`LOWER(${projects.title}) LIKE ${searchTerm}`,
          sql`LOWER(${projects.description}) LIKE ${searchTerm}`,
          sql`EXISTS (
            SELECT 1 FROM unnest(${projects.skills}) AS s 
            WHERE LOWER(s) LIKE ${searchTerm}
          )`
        )
      );

    // Search in work experiences
    const workResults = await db
      .select()
      .from(workExperiences)
      .where(
        or(
          sql`LOWER(${workExperiences.role}) LIKE ${searchTerm}`,
          sql`LOWER(${workExperiences.company}) LIKE ${searchTerm}`,
          sql`LOWER(${workExperiences.summary}) LIKE ${searchTerm}`
        )
      );

    return jsonSuccess({
      query,
      results: {
        profiles: profileResults.map((p) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          summary: p.summary,
          skills: p.skills,
        })),
        projects: projectResults.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          skills: p.skills,
        })),
        work: workResults.map((w) => ({
          id: w.id,
          role: w.role,
          company: w.company,
          summary: w.summary,
        })),
      },
      counts: {
        profiles: profileResults.length,
        projects: projectResults.length,
        work: workResults.length,
        total: profileResults.length + projectResults.length + workResults.length,
      },
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return jsonError("Internal server error", 500);
  }
}
