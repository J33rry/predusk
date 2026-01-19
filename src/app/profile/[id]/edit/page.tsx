import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditProfileForm from "@/components/EditProfileForm";

export const dynamic = "force-dynamic";

interface ProfileEditPageProps {
    params: Promise<{ id: string }>;
}

async function getProfile(id: string) {
    const result = await db.query.profiles.findFirst({
        where: eq(profiles.id, id),
    });

    if (!result) return null;

    return {
        id: result.id,
        name: result.name,
        email: result.email,
        summary: result.summary,
        skills: result.skills,
        links: result.links,
    };
}

export default async function ProfileEditPage({
    params,
}: ProfileEditPageProps) {
    const { id } = await params;
    const profile = await getProfile(id);

    if (!profile) {
        notFound();
    }

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 page-shell">
            <div className="max-w-4xl mx-auto">
                <nav className="flex flex-wrap gap-3 mb-10 text-sm font-medium">
                    <Link href={`/profile/${profile.id}`} className="nav-pill">
                        ← Back to Profile
                    </Link>
                    <Link href="/" className="nav-pill">
                        Profiles
                    </Link>
                    <Link href="/projects" className="nav-pill">
                        Projects
                    </Link>
                    <Link href="/search" className="nav-pill">
                        Search
                    </Link>
                </nav>

                <EditProfileForm profile={profile} />
            </div>
        </main>
    );
}
