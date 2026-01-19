"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthHeader() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex gap-4 items-center">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex gap-4 items-center">
        <span className="text-sm text-gray-600">
          {session.user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-center">
      <Link
        href="/login"
        className="px-3 py-1 text-sm text-blue-600 hover:underline"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Register
      </Link>
    </div>
  );
}
