import Link from "next/link";
import { fetchProjects, fetchTopSkills } from "@/lib/api-client";

export const dynamic = "force-dynamic";

interface ProjectsPageProps {
  searchParams: Promise<{ skill?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const skill = params.skill;
  
  const [projectsData, skillsData] = await Promise.all([
    fetchProjects(skill),
    fetchTopSkills(),
  ]);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <nav className="flex gap-6 mb-12 text-sm font-medium">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Profile
          </Link>
          <Link href="/projects" className="text-blue-600 border-b-2 border-blue-600 pb-1">
            Projects
          </Link>
          <Link href="/search" className="text-gray-600 hover:text-gray-900">
            Search
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-gray-600">
            {skill
              ? `Showing ${projectsData.count} project(s) with skill: "${skill}"`
              : `Showing all ${projectsData.count} projects`}
          </p>
        </header>

        {/* Skill Filters */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Filter by skill:</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/projects"
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !skill
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </Link>
            {skillsData.topSkills.slice(0, 8).map((s) => (
              <Link
                key={s.skill}
                href={`/projects?skill=${encodeURIComponent(s.skill)}`}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  skill?.toLowerCase() === s.skill.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                className="p-6 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((s) => (
                    <Link
                      key={s}
                      href={`/projects?skill=${encodeURIComponent(s)}`}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors"
                    >
                      {s}
                    </Link>
                  ))}
                </div>

                {/* Links */}
                {project.links && (
                  <div className="flex gap-4 text-sm">
                    {project.links.repo && (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Repository →
                      </a>
                    )}
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Live Demo →
                      </a>
                    )}
                    {project.links.docs && (
                      <a
                        href={project.links.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
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
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found matching your criteria.</p>
            <Link href="/projects" className="text-blue-600 hover:underline mt-2 inline-block">
              View all projects
            </Link>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-12 mt-12 border-t">
          <p>
            Built with Next.js, Drizzle ORM, and NeonDB •{" "}
            <a href="/api/projects" className="text-blue-600 hover:underline">
              Projects API
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
