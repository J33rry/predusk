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
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <nav className="flex gap-6 mb-12 text-sm font-medium">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Profiles
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
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
                    <p className="text-gray-600 mb-4">{profile.email}</p>
                    {profile.summary && (
                        <p className="text-lg text-gray-700 leading-relaxed">
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
                                    className="text-blue-600 hover:underline"
                                >
                                    GitHub
                                </a>
                            )}
                            {profile.links.linkedin && (
                                <a
                                    href={profile.links.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    LinkedIn
                                </a>
                            )}
                            {profile.links.portfolio && (
                                <a
                                    href={profile.links.portfolio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Portfolio
                                </a>
                            )}
                        </div>
                    )}
                </header>

                {/* Skills */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Education */}
                {profile.education.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {profile.education.map((edu, i) => (
                                <div
                                    key={i}
                                    className="border-l-4 border-blue-500 pl-4"
                                >
                                    <h3 className="font-semibold">
                                        {edu.school}
                                    </h3>
                                    {(edu.degree || edu.area) && (
                                        <p className="text-gray-600">
                                            {edu.degree}{" "}
                                            {edu.area && `in ${edu.area}`}
                                        </p>
                                    )}
                                    {(edu.startYear || edu.endYear) && (
                                        <p className="text-sm text-gray-500">
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
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {profile.work.map((work) => (
                                <div
                                    key={work.id}
                                    className="border-l-4 border-green-500 pl-4"
                                >
                                    <h3 className="font-semibold">
                                        {work.role}
                                    </h3>
                                    <p className="text-gray-600">
                                        {work.company}
                                        {work.location && ` • ${work.location}`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {work.startDate} -{" "}
                                        {work.endDate || "Present"}
                                    </p>
                                    {work.summary && (
                                        <p className="mt-2 text-gray-700">
                                            {work.summary}
                                        </p>
                                    )}
                                    {work.highlights.length > 0 && (
                                        <ul className="mt-2 list-disc list-inside text-gray-600 text-sm">
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
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">
                            Projects
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {profile.projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <h3 className="font-semibold mb-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {project.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                            >
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
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Repo
                                                </a>
                                            )}
                                            {project.links.demo && (
                                                <a
                                                    href={project.links.demo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Demo
                                                </a>
                                            )}
                                            {project.links.docs && (
                                                <a
                                                    href={project.links.docs}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
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
                <footer className="text-center text-sm text-gray-500 pt-8 border-t">
                    <p>
                        Built with Next.js, Drizzle ORM, and NeonDB •{" "}
                        <Link
                            href="/"
                            className="text-blue-600 hover:underline"
                        >
                            View all profiles
                        </Link>
                    </p>
                </footer>
            </div>
        </main>
    );
}
