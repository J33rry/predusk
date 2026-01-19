import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { fetchProfile, fetchTopSkills } from "@/lib/api-client";
import ProfileActions from "@/components/ProfileActions";
import AuthHeader from "@/components/AuthHeader";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  const [profile, skillsData] = await Promise.all([
    fetchProfile(),
    fetchTopSkills(),
  ]);

  if (!profile) {
    return (
      <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Auth Header */}
          <div className="flex justify-end mb-8">
            <AuthHeader />
          </div>
          
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
            <p className="text-gray-600 mb-6">
              You don&apos;t have a profile yet. Create one to get started.
            </p>
            <ProfileActions profile={null} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Auth Header */}
        <div className="flex justify-end mb-4">
          <AuthHeader />
        </div>
        
        {/* Navigation */}
        <nav className="flex gap-6 mb-12 text-sm font-medium">
          <Link href="/" className="text-blue-600 border-b-2 border-blue-600 pb-1">
            Profile
          </Link>
          <Link href="/projects" className="text-gray-600 hover:text-gray-900">
            Projects
          </Link>
          <Link href="/search" className="text-gray-600 hover:text-gray-900">
            Search
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-gray-600 mb-4">{profile.email}</p>
            </div>
            <ProfileActions profile={profile} />
          </div>
          {profile.summary && (
            <p className="text-lg text-gray-700 leading-relaxed">{profile.summary}</p>
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
            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">{edu.school}</h3>
                  {(edu.degree || edu.area) && (
                    <p className="text-gray-600">
                      {edu.degree} {edu.area && `in ${edu.area}`}
                    </p>
                  )}
                  {(edu.startYear || edu.endYear) && (
                    <p className="text-sm text-gray-500">
                      {edu.startYear} - {edu.endYear || "Present"}
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
            <h2 className="text-2xl font-semibold mb-4">Experience</h2>
            <div className="space-y-6">
              {profile.work.map((work) => (
                <div key={work.id} className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">{work.role}</h3>
                  <p className="text-gray-600">
                    {work.company}
                    {work.location && ` • ${work.location}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {work.startDate} - {work.endDate || "Present"}
                  </p>
                  {work.summary && (
                    <p className="mt-2 text-gray-700">{work.summary}</p>
                  )}
                  {work.highlights.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-gray-600 text-sm">
                      {work.highlights.map((h, i) => (
                        <li key={i}>{h.bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Summary */}
        {profile.projects.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Projects</h2>
              <Link href="/projects" className="text-blue-600 hover:underline text-sm">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {profile.projects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{project.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Skills */}
        {skillsData.topSkills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Top Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {skillsData.topSkills.map((s) => (
                <div
                  key={s.skill}
                  className="p-3 bg-gray-50 rounded-lg text-center"
                >
                  <p className="font-medium">{s.skill}</p>
                  <p className="text-xs text-gray-500">{s.count} mentions</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-8 border-t">
          <p>
            Built with Next.js, Drizzle ORM, and NeonDB •{" "}
            <a href="/api/health" className="text-blue-600 hover:underline">
              API Health
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
