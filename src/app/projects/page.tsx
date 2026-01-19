import Link from "next/link";
import { fetchProjects, fetchTopSkills } from "@/lib/api-client";

export const dynamic = "force-dynamic";

interface ProjectsPageProps {
    searchParams: Promise<{ skill?: string }>;
}

export default async function ProjectsPage({
    searchParams,
}: ProjectsPageProps) {
    const params = await searchParams;
    const skill = params.skill;

    const [projectsData, skillsData] = await Promise.all([
        fetchProjects(skill),
        fetchTopSkills(),
    ]);

    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 page-shell">
            <div className="max-w-5xl mx-auto">
                {/* Navigation */}
                <nav className="flex flex-wrap gap-3 mb-10 text-sm font-medium">
                    <Link href="/" className="nav-pill">
                        Profiles
                    </Link>
                    <Link href="/projects" className="nav-pill nav-pill-active">
                        Projects
                    </Link>
                    <Link href="/search" className="nav-pill">
                        Search
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-8 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                    <p className="badge-soft mb-3 inline-flex">
                        Work Highlights
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 section-title">
                        <span className="gradient-text">Project Showcase</span>
                    </h1>
                    <p className="text-slate-700">
                        {skill
                            ? `Showing ${projectsData.count} project(s) with skill: "${skill}"`
                            : `Showing all ${projectsData.count} projects`}
                    </p>
                </header>

                {/* Skill Filters */}
                <section className="mb-8 glass-card rounded-2xl p-5 md:p-6 animate-fade-up">
                    <h2 className="text-sm font-medium text-slate-600 mb-3">
                        Filter by skill:
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/projects"
                            className={`chip ${!skill ? "nav-pill-active" : ""}`}
                        >
                            All
                        </Link>
                        {skillsData.topSkills.slice(0, 8).map((s) => (
                            <Link
                                key={s.skill}
                                href={`/projects?skill=${encodeURIComponent(s.skill)}`}
                                className={`chip ${
                                    skill?.toLowerCase() ===
                                    s.skill.toLowerCase()
                                        ? "nav-pill-active"
                                        : ""
                                }`}
                            >
                                {s.skill}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Projects List */}
                {projectsData.projects.length > 0 ? (
                    <section className="space-y-6">
                        {projectsData.projects.map((project) => (
                            <article
                                key={project.id}
                                className="p-6 rounded-2xl glass-card card-hover animate-fade-up"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">
                                            {project.title}
                                        </h2>
                                        <p className="text-slate-700 mb-4">
                                            {project.description}
                                        </p>
                                    </div>
                                    <span className="badge-soft">
                                        Case Study
                                    </span>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.skills.map((s) => (
                                        <Link
                                            key={s}
                                            href={`/projects?skill=${encodeURIComponent(s)}`}
                                            className="chip"
                                        >
                                            {s}
                                        </Link>
                                    ))}
                                </div>

                                {/* Links */}
                                {project.links && (
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {project.links.repo && (
                                            <a
                                                href={project.links.repo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                            >
                                                Repository →
                                            </a>
                                        )}
                                        {project.links.demo && (
                                            <a
                                                href={project.links.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                            >
                                                Live Demo →
                                            </a>
                                        )}
                                        {project.links.docs && (
                                            <a
                                                href={project.links.docs}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                            >
                                                Docs →
                                            </a>
                                        )}
                                    </div>
                                )}
                            </article>
                        ))}
                    </section>
                ) : (
                    <div className="text-center py-12 glass-card rounded-2xl animate-fade-up">
                        <p className="text-slate-700">
                            No projects found matching your criteria.
                        </p>
                        <Link
                            href="/projects"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline mt-2 inline-block font-medium"
                        >
                            View all projects
                        </Link>
                    </div>
                )}

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 pt-10 mt-12 border-t border-slate-200/60">
                    <p>
                        Built with Next.js, Drizzle ORM, and NeonDB •{" "}
                        <a
                            href="/api/projects"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                        >
                            Projects API
                        </a>
                    </p>
                </footer>
            </div>
        </main>
    );
}
