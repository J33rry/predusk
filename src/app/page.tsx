import Link from "next/link";
import { fetchProfiles, fetchTopSkills } from "@/lib/api-client";
import AddProfileButton from "@/components/AddProfileButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const [profilesData, skillsData] = await Promise.all([
        fetchProfiles(),
        fetchTopSkills(),
    ]);

    const { profiles } = profilesData;

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <nav className="flex gap-6 mb-12 text-sm font-medium">
                    <Link
                        href="/"
                        className="text-blue-600 border-b-2 border-blue-600 pb-1"
                    >
                        Profiles
                    </Link>
                    <Link
                        href="/projects"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Projects
                    </Link>
                    <Link
                        href="/search"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Search
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Profiles
                            </h1>
                            <p className="text-gray-600">
                                {profiles.length} profile
                                {profiles.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                        <AddProfileButton />
                    </div>
                </header>

                {/* Profiles List */}
                {profiles.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">
                            No profiles yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add your first profile to get started.
                        </p>
                        <AddProfileButton />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {profiles.map((profile) => (
                            <Link
                                key={profile.id}
                                href={`/profile/${profile.id}`}
                                className="block p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold mb-1">
                                            {profile.name}
                                        </h2>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {profile.email}
                                        </p>
                                        {profile.summary && (
                                            <p className="text-gray-700 line-clamp-2 mb-4">
                                                {profile.summary}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills
                                                .slice(0, 5)
                                                .map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            {profile.skills.length > 5 && (
                                                <span className="px-2 py-1 text-gray-500 text-xs">
                                                    +{profile.skills.length - 5}{" "}
                                                    more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Links */}
                                    <div className="flex gap-2 ml-4">
                                        {profile.links?.github && (
                                            <span className="text-xs text-gray-500">
                                                GitHub
                                            </span>
                                        )}
                                        {profile.links?.linkedin && (
                                            <span className="text-xs text-gray-500">
                                                LinkedIn
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t flex gap-4 text-sm text-gray-500">
                                    <span>
                                        {profile.projects.length} project
                                        {profile.projects.length !== 1
                                            ? "s"
                                            : ""}
                                    </span>
                                    <span>
                                        {profile.work.length} work experience
                                        {profile.work.length !== 1 ? "s" : ""}
                                    </span>
                                    <span>
                                        {profile.education.length} education
                                        {profile.education.length !== 1
                                            ? "s"
                                            : ""}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Top Skills */}
                {skillsData.topSkills.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">
                            Top Skills Across All Profiles
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {skillsData.topSkills.map((s) => (
                                <div
                                    key={s.skill}
                                    className="p-3 bg-gray-50 rounded-lg text-center"
                                >
                                    <p className="font-medium">{s.skill}</p>
                                    <p className="text-xs text-gray-500">
                                        {s.count} mentions
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 pt-12 mt-12 border-t">
                    <p>
                        Built with Next.js, Drizzle ORM, and NeonDB •{" "}
                        <a
                            href="/api/health"
                            className="text-blue-600 hover:underline"
                        >
                            API Health
                        </a>
                    </p>
                </footer>
            </div>
        </main>
    );
}
