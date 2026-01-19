export default function Loading() {
    return (
        <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 page-shell">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="skeleton h-24" />
                <div className="skeleton h-20" />
                <div className="space-y-4">
                    <div className="skeleton h-36" />
                    <div className="skeleton h-36" />
                    <div className="skeleton h-36" />
                </div>
            </div>
        </main>
    );
}
