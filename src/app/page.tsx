import Link from "next/link";
import { fetchProfiles, fetchTopSkills } from "@/lib/api-client";
import AddProfileButton from "@/components/AddProfileButton";
import HealthCheckModal from "@/components/HealthCheckModal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const [profilesData, skillsData] = await Promise.all([
        fetchProfiles(),
        fetchTopSkills(),
    ]);

    const { profiles } = profilesData;

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 page-shell">
            <div className="max-w-5xl mx-auto">
                {/* Navigation */}
                <nav className="flex flex-wrap gap-3 mb-10 text-sm font-medium">
                    <Link href="/" className="nav-pill nav-pill-active">
                        Profiles
                    </Link>
                    <Link href="/projects" className="nav-pill">
                        Projects
                    </Link>
                    <Link href="/search" className="nav-pill">
                        Search
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-10 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="badge-soft mb-3 inline-flex">
                                Talent Hub
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 section-title">
                                <span className="gradient-text">
                                    Profiles Directory
                                </span>
                            </h1>
                            <p className="text-slate-700">
                                {profiles.length} profile
                                {profiles.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                        <div className="animate-float">
                            <AddProfileButton />
                        </div>
                    </div>
                </header>

                {/* Profiles List */}
                {profiles.length === 0 ? (
                    <div className="text-center py-16 glass-card rounded-2xl animate-fade-up">
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
                                className="block p-6 rounded-2xl glass-card card-hover animate-fade-up"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold mb-1">
                                            {profile.name}
                                        </h2>
                                        <p className="text-slate-700 text-sm mb-3">
                                            {profile.email}
                                        </p>
                                        {profile.summary && (
                                            <p className="text-slate-800 line-clamp-2 mb-4">
                                                {profile.summary}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills
                                                .slice(0, 5)
                                                .map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="badge-soft"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            {profile.skills.length > 5 && (
                                                <span className="chip">
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
                                <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-wrap gap-4 text-sm text-slate-700">
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
                    <section className="mt-12 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                        <h2 className="text-2xl font-semibold mb-4 section-title">
                            Top Skills Across All Profiles
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {skillsData.topSkills.map((s) => (
                                <div
                                    key={s.skill}
                                    className="p-3 bg-white/70 rounded-xl text-center card-hover"
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
                <footer className="text-center text-sm text-gray-500 pt-10 mt-12 border-t border-slate-200/60">
                    <p>
                        Built with Next.js, Drizzle ORM, and NeonDB •{" "}
                        <HealthCheckModal />
                    </p>
                </footer>
            </div>
        </main>
    );
}
