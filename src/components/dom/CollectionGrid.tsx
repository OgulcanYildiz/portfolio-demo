"use client";

import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

export default function CollectionGrid() {
    return (
        <section className="relative min-h-screen py-32 bg-black">
            {/* Section header */}
            <div className="max-w-7xl mx-auto px-8 mb-24">
                <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight">
                    Collection
                </h2>
                <p className="mt-4 text-zinc-500 text-lg font-light max-w-md">
                    A curated selection of works exploring form, shadow, and silence.
                </p>
            </div>

            {/* Spiral / DNA grid container */}
            <div className="relative flex flex-col items-center gap-24 px-8">
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>

            {/* Bottom spacer for scroll continuation */}
            <div className="h-32" />
        </section>
    );
}
