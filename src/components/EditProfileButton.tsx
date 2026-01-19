"use client";

import { useState } from "react";

interface ProfileLinks {
    github?: string | null;
    linkedin?: string | null;
    portfolio?: string | null;
}

interface EditProfileButtonProps {
    profile: {
        id: string;
        name: string;
        email: string;
        summary?: string | null;
        skills: string[];
        links?: ProfileLinks | null;
    };
}

interface ProfileFormData {
    name: string;
    email: string;
    summary: string;
    skills: string;
    github: string;
    linkedin: string;
    portfolio: string;
}

export default function EditProfileButton({ profile }: EditProfileButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<ProfileFormData>({
        name: profile.name,
        email: profile.email,
        summary: profile.summary || "",
        skills: profile.skills?.join(", ") || "",
        github: profile.links?.github || "",
        linkedin: profile.links?.linkedin || "",
        portfolio: profile.links?.portfolio || "",
    });

    const openModal = () => {
        setFormData({
            name: profile.name,
            email: profile.email,
            summary: profile.summary || "",
            skills: profile.skills?.join(", ") || "",
            github: profile.links?.github || "",
            linkedin: profile.links?.linkedin || "",
            portfolio: profile.links?.portfolio || "",
        });
        setError(null);
        setSuccess(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
        setSuccess(null);
    };

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

            const res = await fetch(`/api/profile/${profile.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            setSuccess("Profile updated successfully!");

            setTimeout(() => {
                window.location.reload();
            }, 1200);
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
        <>
            <button onClick={openModal} className="button-secondary">
                Edit Profile
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 animate-fade-in">
                    <div className="relative z-[10000] bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-up">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200/70">
                            <h2 className="text-xl font-semibold">
                                Edit Profile
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                    rows={3}
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

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
