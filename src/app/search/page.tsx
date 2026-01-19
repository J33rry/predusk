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
            const res = await fetch(
                `/api/search?q=${encodeURIComponent(query)}`,
            );
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
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 page-shell">
            <div className="max-w-5xl mx-auto">
                {/* Navigation */}
                <nav className="flex flex-wrap gap-3 mb-10 text-sm font-medium">
                    <Link href="/" className="nav-pill">
                        Profiles
                    </Link>
                    <Link href="/projects" className="nav-pill">
                        Projects
                    </Link>
                    <Link href="/search" className="nav-pill nav-pill-active">
                        Search
                    </Link>
                </nav>

                {/* Header */}
                <header className="mb-8 glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
                    <p className="badge-soft mb-3 inline-flex">Discovery</p>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 section-title">
                        <span className="gradient-text">
                            Search the talent graph
                        </span>
                    </h1>
                    <p className="text-slate-700">
                        Search across profiles, projects, and work experience
                    </p>
                </header>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col md:flex-row gap-3 glass-card rounded-2xl p-4 md:p-5 animate-fade-up">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by skill, keyword, or company..."
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white/80"
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </form>

                {/* Quick Search Suggestions */}
                <div className="mb-8 glass-card rounded-2xl p-4 md:p-5 animate-fade-up">
                    <p className="text-sm text-slate-600 mb-2">
                        Try searching for:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "TypeScript",
                            "Python",
                            "React",
                            "API",
                            "TechCorp",
                        ].map((term) => (
                            <button
                                key={term}
                                onClick={() => {
                                    setQuery(term);
                                }}
                                className="chip hover:bg-slate-200"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-8 animate-fade-in">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="skeleton h-16" />
                        <div className="skeleton h-32" />
                        <div className="skeleton h-32" />
                    </div>
                )}

                {/* Results */}
                {results && !loading && (
                    <div className="space-y-8">
                        {/* Summary */}
                        <div className="p-4 bg-blue-50 rounded-xl text-slate-800">
                            <p className="font-medium">
                                Found {results.counts.total} result(s) for
                                &quot;{results.query}&quot;
                            </p>
                            <p className="text-sm text-gray-600">
                                {results.counts.profiles} profile(s),{" "}
                                {results.counts.projects} project(s),{" "}
                                {results.counts.work} work experience(s)
                            </p>
                        </div>

                        {/* Profile Results */}
                        {results.results.profiles.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4 section-title">
                                    Profiles
                                </h2>
                                {results.results.profiles.map((profile) => (
                                    <div
                                        key={profile.id}
                                        className="p-5 rounded-2xl glass-card card-hover animate-fade-up"
                                    >
                                        <h3 className="font-medium">
                                            {profile.name}
                                        </h3>
                                        <p className="text-sm text-slate-700">
                                            {profile.email}
                                        </p>
                                        {profile.summary && (
                                            <p className="mt-2 text-slate-800">
                                                {profile.summary}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-1 mt-2">
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
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Project Results */}
                        {results.results.projects.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4 section-title">
                                    Projects
                                </h2>
                                <div className="space-y-4">
                                    {results.results.projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="p-5 rounded-2xl glass-card card-hover animate-fade-up"
                                        >
                                            <h3 className="font-medium">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-slate-700 mt-1">
                                                {project.description}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {project.skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="chip"
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
                                <h2 className="text-xl font-semibold mb-4 section-title">
                                    Work Experience
                                </h2>
                                <div className="space-y-4">
                                    {results.results.work.map((work) => (
                                        <div
                                            key={work.id}
                                            className="p-5 rounded-2xl glass-card card-hover animate-fade-up"
                                        >
                                            <h3 className="font-medium">
                                                {work.role}
                                            </h3>
                                            <p className="text-sm text-slate-700">
                                                {work.company}
                                            </p>
                                            {work.summary && (
                                                <p className="text-sm text-slate-700 mt-1">
                                                    {work.summary}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* No Results */}
                        {results.counts.total === 0 && (
                            <div className="text-center py-8 glass-card rounded-2xl animate-fade-in">
                                <p className="text-slate-700">
                                    No results found for &quot;{results.query}
                                    &quot;
                                </p>
                                <p className="text-sm text-slate-600 mt-2">
                                    Try different keywords or check your
                                    spelling
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 pt-10 mt-12 border-t border-slate-200/60">
                    <p>
                        Built with Next.js, Drizzle ORM, and NeonDB •{" "}
                        <a
                            href="/api/search?q=python"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                        >
                            Search API
                        </a>
                    </p>
                </footer>
            </div>
        </main>
    );
}
