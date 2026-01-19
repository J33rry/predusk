"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteProfileButtonProps {
    profileId: string;
    profileName?: string | null;
}

export default function DeleteProfileButton({
    profileId,
    profileName,
}: DeleteProfileButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Delete ${profileName || "this profile"}? This action cannot be undone.`,
        );

        if (!confirmed) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/profile/${profileId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete profile");
            }

            router.push("/");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start gap-2">
            <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
            >
                {isLoading ? "Deleting..." : "Delete Profile"}
            </button>
            {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
    );
}
