"use client";

import { useState } from "react";

export default function HealthCheckModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const checkHealth = async () => {
        setIsOpen(true);
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await fetch("/api/health");
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError("Failed to fetch health status");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={checkHealth}
                className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
            >
                API Health
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-up">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-200/70">
                            <h2 className="text-xl font-semibold">
                                System Status
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-50 text-red-700 rounded-xl">
                                    {error}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div
                                            className={`w-3 h-3 rounded-full ${data?.status === "ok" ? "bg-green-500" : "bg-red-500"}`}
                                        ></div>
                                        <span className="font-semibold text-lg capitalize">
                                            {data?.status || "Unknown"}
                                        </span>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 font-mono text-sm border border-slate-200 overflow-x-auto">
                                        <pre className="text-slate-700">
                                            {JSON.stringify(data, null, 2)}
                                        </pre>
                                    </div>

                                    <p className="text-sm text-slate-500 text-center mt-4">
                                        Server time:{" "}
                                        {new Date().toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200/70 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
