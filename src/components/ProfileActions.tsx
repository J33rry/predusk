"use client";

import { useState } from "react";
import type { Profile } from "@/lib/api-client";

interface ProfileActionsProps {
  profile: Profile | null;
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

export default function ProfileActions({ profile }: ProfileActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "update">("create");

  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile?.name || "",
    email: profile?.email || "",
    summary: profile?.summary || "",
    skills: profile?.skills?.join(", ") || "",
    github: profile?.links?.github || "",
    linkedin: profile?.links?.linkedin || "",
    portfolio: profile?.links?.portfolio || "",
  });

  const openModal = (actionMode: "create" | "update") => {
    setMode(actionMode);
    if (actionMode === "update" && profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        summary: profile.summary || "",
        skills: profile.skills?.join(", ") || "",
        github: profile.links?.github || "",
        linkedin: profile.links?.linkedin || "",
        portfolio: profile.links?.portfolio || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        summary: "",
        skills: "",
        github: "",
        linkedin: "",
        portfolio: "",
      });
    }
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

      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch("/api/profile", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${mode} profile`);
      }

      setSuccess(
        mode === "create"
          ? "Profile created successfully!"
          : "Profile updated successfully!"
      );

      // Refresh the page after a short delay to show the updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        {!profile && (
          <button
            onClick={() => openModal("create")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Profile
          </button>
        )}
        {profile && (
          <button
            onClick={() => openModal("update")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {mode === "create" ? "Create Profile" : "Update Profile"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="john@example.com"
                />
              </div>

              {/* Summary */}
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="A brief professional summary..."
                />
              </div>

              {/* Skills */}
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="TypeScript, React, Node.js"
                />
              </div>

              {/* Links Section */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Links</p>

                <div>
                  <label
                    htmlFor="github"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    id="github"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="portfolio"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading
                    ? "Saving..."
                    : mode === "create"
                    ? "Create Profile"
                    : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
