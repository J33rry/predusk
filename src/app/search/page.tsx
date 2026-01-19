"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import type { SearchResults } from "@/lib/api-client";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error("Search failed");
      }
      const data: SearchResults = await res.json();
      setResults(data);
    } catch (err) {
      setError("Failed to search. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <nav className="flex gap-6 mb-12 text-sm font-medium">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Profile
          </Link>
          <Link href="/projects" className="text-gray-600 hover:text-gray-900">
            Projects
          </Link>
          <Link href="/search" className="text-blue-600 border-b-2 border-blue-600 pb-1">
            Search
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          <p className="text-gray-600">
            Search across profile, projects, and work experience
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by skill, keyword, or company..."
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Quick Search Suggestions */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {["TypeScript", "Python", "React", "API", "TechCorp"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Summary */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">
                Found {results.counts.total} result(s) for &quot;{results.query}&quot;
              </p>
              <p className="text-sm text-gray-600">
                {results.counts.profiles} profile(s), {results.counts.projects} project(s),{" "}
                {results.counts.work} work experience(s)
              </p>
            </div>

            {/* Profile Results */}
            {results.results.profiles.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                {results.results.profiles.map((profile) => (
                  <div key={profile.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{profile.name}</h3>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                    {profile.summary && (
                      <p className="mt-2 text-gray-700">{profile.summary}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Project Results */}
            {results.results.projects.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                <div className="space-y-4">
                  {results.results.projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Work Results */}
            {results.results.work.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
                <div className="space-y-4">
                  {results.results.work.map((work) => (
                    <div key={work.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{work.role}</h3>
                      <p className="text-sm text-gray-500">{work.company}</p>
                      {work.summary && (
                        <p className="text-sm text-gray-600 mt-1">{work.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {results.counts.total === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No results found for &quot;{results.query}&quot;
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-12 mt-12 border-t">
          <p>
            Built with Next.js, Drizzle ORM, and NeonDB •{" "}
            <a href="/api/search?q=python" className="text-blue-600 hover:underline">
              Search API
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
