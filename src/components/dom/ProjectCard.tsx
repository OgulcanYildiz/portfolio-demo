"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
    project: Project;
    index: number;
}

// Spring configuration for damped, cinematic motion
const springConfig = {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
};

// Custom hook for responsive breakpoint
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });

    // Smoothed scroll progress for less twitchy motion
    const smoothProgress = useSpring(scrollYProgress, springConfig);

    // Determine if this card is on the left or right of the center axis
    const isLeft = index % 2 === 0;

    // Base horizontal offset: responsive values
    const baseX = isMobile ? (isLeft ? -28 : 28) : (isLeft ? -100 : 100);

    // Curved X movement with extended range for smoother entry/exit
    // Uses 5-point curve for gentler transitions at edges
    const curveX = useTransform(
        smoothProgress,
        [0, 0.15, 0.5, 0.85, 1],
        [baseX * 0.3, baseX * 0.5, 0, baseX * 0.5, baseX * 0.3]
    );

    // Parallax Y offset: subtler multipliers for refined depth
    const parallaxMultiplier = 1 + (index % 3) * 0.1;
    const yOffset = useTransform(
        smoothProgress,
        [0, 1],
        [60 * parallaxMultiplier, -60 * parallaxMultiplier]
    );

    // Scale: enhanced center emphasis with gentler outer states
    // Center card scales to 1.02 for subtle "focus" feeling
    const scale = useTransform(
        smoothProgress,
        [0, 0.3, 0.5, 0.7, 1],
        [0.88, 0.94, 1.02, 0.94, 0.88]
    );

    // Opacity: smoother gradient with stronger center presence
    const opacity = useTransform(
        smoothProgress,
        [0, 0.15, 0.4, 0.6, 0.85, 1],
        [0.3, 0.6, 1, 1, 0.6, 0.3]
    );

    return (
        <motion.div
            ref={cardRef}
            className="relative w-72 h-80 md:w-80 md:h-96 cursor-pointer group"
            style={{
                x: curveX,
                y: yOffset,
                scale,
                opacity,
            }}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: (index % 4) * 0.1,
            }}
        >
            {/* Card background with enhanced depth shadow */}
            <div className="absolute inset-0 bg-zinc-900 rounded-xl overflow-hidden shadow-2xl shadow-black/40">
                {/* Placeholder gradient for missing thumbnails */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950"
                    style={{
                        backgroundImage: `url(${project.thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Ambient glow layer for centered cards */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Subtle hover overlay with longer transition */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-700" />
            </div>

            {/* Card content with refined typography */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <p className="text-[10px] md:text-xs text-zinc-400 font-light tracking-[0.2em] uppercase mb-2">
                    {project.category} — {project.year}
                </p>
                <h3 className="text-lg md:text-xl font-light text-white tracking-tight leading-snug">
                    {project.title}
                </h3>
            </div>

            {/* Index indicator with refined styling */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 text-[10px] md:text-xs text-zinc-500/60 font-mono">
                {project.id}
            </div>
        </motion.div>
    );
}
