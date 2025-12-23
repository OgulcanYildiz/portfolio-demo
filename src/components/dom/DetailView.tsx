"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/lib/data";

interface DetailViewProps {
    project: Project;
}

export default function DetailView({ project }: DetailViewProps) {
    return (
        <motion.div
            className="min-h-screen bg-black text-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Back navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-300"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    <span className="font-light tracking-wide">Back</span>
                </Link>
            </nav>

            {/* Main content */}
            <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-16 py-32">
                {/* Large visual */}
                <motion.div
                    className="relative w-full max-w-4xl aspect-[16/10] mb-16"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="absolute inset-0 bg-zinc-900 rounded-xl overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950"
                            style={{
                                backgroundImage: `url(${project.thumbnail})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                        {/* Ambient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                </motion.div>

                {/* Project info */}
                <motion.div
                    className="max-w-2xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <p className="text-xs text-zinc-500 font-light tracking-[0.25em] uppercase mb-4">
                        {project.category} — {project.year}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight mb-8">
                        {project.title}
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed">
                        {project.description}
                    </p>
                </motion.div>

                {/* Project number */}
                <motion.div
                    className="mt-16 text-zinc-600/40 font-mono text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    {project.id} / 08
                </motion.div>
            </main>
        </motion.div>
    );
}
