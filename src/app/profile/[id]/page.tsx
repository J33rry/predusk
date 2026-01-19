import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
    params: Promise<{ id: string }>;
}

async function getProfile(id: string) {
    const result = await db.query.profiles.findFirst({
        where: eq(profiles.id, id),
        with: {
            projects: true,
            workExperiences: true,
        },
    });

    if (!result) return null;

    return {
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
    };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;
    const profile = await getProfile(id);

    if (!profile) {
        notFound();
    }

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 page-shell">
            <div className="max-w-5xl mx-auto">
                {/* Navigation */}
                <nav className="flex flex-wrap gap-3 mb-10 text-sm font-medium">
                    <Link href="/" className="nav-pill">
                        ← Back to Profiles
                    </Link>
                    <Link href="/projects" className="nav-pill">
                        Projects
                    </Link>
                    <Link href="/search" className="nav-pill">
                        Search
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-12 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="badge-soft mb-3 inline-flex">
                                Profile
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 section-title">
                                <span className="gradient-text">
                                    {profile.name}
                                </span>
                            </h1>
                            <p className="text-slate-700 mb-4">
                                {profile.email}
                            </p>
                            {profile.summary && (
                                <p className="text-lg text-slate-800 leading-relaxed">
                                    {profile.summary}
                                </p>
                            )}

                            {/* Links */}
                            {profile.links && (
                                <div className="flex gap-4 mt-4">
                                    {profile.links.github && (
                                        <a
                                            href={profile.links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                    {profile.links.linkedin && (
                                        <a
                                            href={profile.links.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                    {profile.links.portfolio && (
                                        <a
                                            href={profile.links.portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                        >
                                            Portfolio
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex items-start">
                            <Link
                                href={`/profile/${profile.id}/edit`}
                                className="button-secondary"
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Skills */}
                <section className="mb-12 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                    <h2 className="text-2xl font-semibold mb-4 section-title">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                            <span key={skill} className="badge-soft">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Education */}
                {profile.education.length > 0 && (
                    <section className="mb-12 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                        <h2 className="text-2xl font-semibold mb-4 section-title">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {profile.education.map((edu, i) => (
                                <div
                                    key={i}
                                    className="border-l-4 border-indigo-400 pl-4"
                                >
                                    <h3 className="font-semibold">
                                        {edu.school}
                                    </h3>
                                    {(edu.degree || edu.area) && (
                                        <p className="text-slate-700">
                                            {edu.degree}{" "}
                                            {edu.area && `in ${edu.area}`}
                                        </p>
                                    )}
                                    {(edu.startYear || edu.endYear) && (
                                        <p className="text-sm text-slate-600">
                                            {edu.startYear} -{" "}
                                            {edu.endYear || "Present"}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Work Experience */}
                {profile.work.length > 0 && (
                    <section className="mb-12 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                        <h2 className="text-2xl font-semibold mb-4 section-title">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {profile.work.map((work) => (
                                <div
                                    key={work.id}
                                    className="border-l-4 border-purple-400 pl-4"
                                >
                                    <h3 className="font-semibold">
                                        {work.role}
                                    </h3>
                                    <p className="text-slate-700">
                                        {work.company}
                                        {work.location && ` • ${work.location}`}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {work.startDate} -{" "}
                                        {work.endDate || "Present"}
                                    </p>
                                    {work.summary && (
                                        <p className="mt-2 text-slate-800">
                                            {work.summary}
                                        </p>
                                    )}
                                    {work.highlights.length > 0 && (
                                        <ul className="mt-2 list-disc list-inside text-slate-700 text-sm">
                                            {work.highlights.map(
                                                (
                                                    h: { bullet: string },
                                                    i: number,
                                                ) => (
                                                    <li key={i}>{h.bullet}</li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {profile.projects.length > 0 && (
                    <section className="mb-12 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                        <h2 className="text-2xl font-semibold mb-4 section-title">
                            Projects
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {profile.projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-4 rounded-xl bg-white/80 card-hover"
                                >
                                    <h3 className="font-semibold mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-slate-700 mb-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {project.skills.map((skill) => (
                                            <span key={skill} className="chip">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    {project.links && (
                                        <div className="flex gap-3 text-sm">
                                            {project.links.repo && (
                                                <a
                                                    href={project.links.repo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                                >
                                                    Repo
                                                </a>
                                            )}
                                            {project.links.demo && (
                                                <a
                                                    href={project.links.demo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                                >
                                                    Demo
                                                </a>
                                            )}
                                            {project.links.docs && (
                                                <a
                                                    href={project.links.docs}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                                >
                                                    Docs
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 pt-10 border-t border-slate-200/60">
                    <p>
                        Built with Next.js, Drizzle ORM, and NeonDB •{" "}
                        <Link
                            href="/"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                        >
                            View all profiles
                        </Link>
                    </p>
                </footer>
            </div>
        </main>
    );
}
