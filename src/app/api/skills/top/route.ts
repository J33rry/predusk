import { db } from "@/db";
import { profiles, projects } from "@/db/schema";
import { sql } from "drizzle-orm";
import { jsonError, jsonSuccess } from "@/lib/api-utils";

export const dynamic = "force-dynamic";

// GET /api/skills/top - Get top skills across profile and projects
export async function GET() {
    try {
        // Get profile skills
        const profile = await db.query.profiles.findFirst();
        const profileSkills = profile?.skills || [];

        // Get all project skills and count occurrences
        const projectsResult = await db
            .select({ skills: projects.skills })
            .from(projects);

        // Count skill occurrences
        const skillCounts = new Map<string, number>();

        // Add profile skills with base count
        for (const skill of profileSkills) {
            skillCounts.set(
                skill.toLowerCase(),
                (skillCounts.get(skill.toLowerCase()) || 0) + 2,
            );
        }

        // Count project skill occurrences
        for (const row of projectsResult) {
            for (const skill of row.skills) {
                const key = skill.toLowerCase();
                skillCounts.set(key, (skillCounts.get(key) || 0) + 1);
            }
        }

        // Sort by count and return top skills
        const sortedSkills = Array.from(skillCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill, count]) => ({
                skill: skill.charAt(0).toUpperCase() + skill.slice(1),
                count,
            }));

        return jsonSuccess({
            topSkills: sortedSkills,
            totalUniqueSkills: skillCounts.size,
        });
    } catch (error) {
        console.error("GET /api/skills/top error:", error);
        return jsonError("Internal server error", 500);
    }
}
