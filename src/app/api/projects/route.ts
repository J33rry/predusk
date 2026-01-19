import { NextRequest } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { sql, arrayContains } from "drizzle-orm";
import { jsonError, jsonSuccess } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

// GET /api/projects?skill=python
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get("skill");

    let result;

    if (skill) {
      // Filter projects by skill (case-insensitive)
      const skillLower = skill.toLowerCase();
      result = await db
        .select()
        .from(projects)
        .where(
          sql`EXISTS (
            SELECT 1 FROM unnest(${projects.skills}) AS s 
            WHERE LOWER(s) = ${skillLower}
          )`
        );
    } else {
      // Return all projects
      result = await db.select().from(projects);
    }

    return jsonSuccess({
      count: result.length,
      skill: skill || null,
      projects: result.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        links: p.links,
        skills: p.skills,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return jsonError("Internal server error", 500);
  }
}
