"use client";

import { useState } from "react";
import Link from "next/link";

interface ProfileFormData {
    name: string;
    email: string;
    summary: string;
    skills: string;
    github: string;
    linkedin: string;
    portfolio: string;
}

export default function AddProfileForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<ProfileFormData>({
        name: "",
        email: "",
        summary: "",
        skills: "",
        github: "",
        linkedin: "",
        portfolio: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                summary: formData.summary || undefined,
                skills: formData.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                links: {
                    github: formData.github || null,
                    linkedin: formData.linkedin || null,
                    portfolio: formData.portfolio || null,
                },
            };

            const res = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create profile");
            }

            setSuccess("Profile created successfully!");
            setFormData({
                name: "",
                email: "",
                summary: "",
                skills: "",
                github: "",
                linkedin: "",
                portfolio: "",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="glass-card rounded-2xl p-6 md:p-8 animate-fade-up">
            <div className="flex flex-col gap-2 mb-6">
                <p className="badge-soft inline-flex w-fit">New Profile</p>
                <h1 className="text-2xl md:text-3xl font-semibold section-title">
                    Add a new profile
                </h1>
                <p className="text-slate-600 text-sm">
                    Fill in the details below to create a profile.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="summary"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Summary
                    </label>
                    <textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                        placeholder="A brief description about yourself..."
                    />
                </div>

                <div>
                    <label
                        htmlFor="skills"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Skills (comma-separated)
                    </label>
                    <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="JavaScript, React, Node.js"
                    />
                </div>

                <div className="border-t border-slate-200/70 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Social Links
                    </h3>

                    <div className="mb-3">
                        <label
                            htmlFor="github"
                            className="block text-sm text-gray-600 mb-1"
                        >
                            GitHub
                        </label>
                        <input
                            type="url"
                            id="github"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="https://github.com/username"
                        />
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="linkedin"
                            className="block text-sm text-gray-600 mb-1"
                        >
                            LinkedIn
                        </label>
                        <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="portfolio"
                            className="block text-sm text-gray-600 mb-1"
                        >
                            Portfolio
                        </label>
                        <input
                            type="url"
                            id="portfolio"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="https://yourportfolio.com"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm">
                        {success}
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <Link href="/" className="button-secondary text-center">
                        Back to Profiles
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="button-primary"
                    >
                        {isLoading ? "Creating..." : "Create Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
