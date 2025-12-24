"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroTitle() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of the hero container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // TASK 1: Hero text dissolves by sinking inward + fading
    // Slow, cinematic timing - feels absorbed into space

    // Title: subtle downward sink (0 → +60px) with slow fade
    const titleY = useTransform(scrollYProgress, [0, 0.6, 1], [0, 30, 60]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 0.5, 0]);
    const titleScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.97]);

    // Subtitle: slightly faster dissolve, same direction
    const subtitleY = useTransform(scrollYProgress, [0, 0.5, 0.9], [0, 25, 50]);
    const subtitleOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7], [1, 0.4, 0]);
    const subtitleScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.98]);

    // Scroll indicator: first to dissolve
    const indicatorY = useTransform(scrollYProgress, [0, 0.3], [0, 20]);
    const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 0.5, 0]);

    return (
        <motion.div
            ref={containerRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
            {/* Main title - sinks and dissolves */}
            <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight text-center"
                style={{
                    y: titleY,
                    opacity: titleOpacity,
                    scale: titleScale,
                }}
            >
                <span className="block text-white/90">Digital</span>
                <span className="block text-white/70 mt-2">Museum</span>
            </motion.h1>

            {/* Subtitle - sinks and dissolves */}
            <motion.p
                className="mt-8 text-sm md:text-base text-white/40 font-light tracking-[0.3em] uppercase"
                style={{
                    y: subtitleY,
                    opacity: subtitleOpacity,
                    scale: subtitleScale,
                }}
            >
                A Curated Experience
            </motion.p>

            {/* Scroll indicator - first to dissolve */}
            <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2"
                style={{
                    y: indicatorY,
                    opacity: indicatorOpacity,
                }}
            >
                <motion.div
                    className="flex flex-col items-center gap-3"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-[10px] text-white/30 font-light tracking-[0.2em] uppercase">
                        Scroll
                    </span>
                    <svg
                        className="w-4 h-4 text-white/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
