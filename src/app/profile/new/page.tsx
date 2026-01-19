import Link from "next/link";
import AddProfileForm from "@/components/AddProfileForm";

export const dynamic = "force-dynamic";

export default function NewProfilePage() {
    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 page-shell">
            <div className="max-w-4xl mx-auto">
                <nav className="flex flex-wrap gap-3 mb-10 text-sm font-medium">
                    <Link href="/" className="nav-pill">
                        ← Back to Profiles
                    </Link>
                    <Link href="/projects" className="nav-pill">
                        Projects
                    </Link>
                    <Link href="/search" className="nav-pill">
                        Search
                    </Link>
                </nav>

                <AddProfileForm />
            </div>
        </main>
    );
}
