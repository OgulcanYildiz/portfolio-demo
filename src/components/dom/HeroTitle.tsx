"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroTitle() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of the hero section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // TASK 1: Hero text depth dissolve
    // Scale down (1 → 0.85), fade out, subtle Y movement (+40px)
    // Feels like receding into depth, not sliding away

    const titleScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.85]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.4, 0]);
    const titleY = useTransform(scrollYProgress, [0, 0.8], [0, 40]);

    const subtitleScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.88]);
    const subtitleOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.3, 0]);
    const subtitleY = useTransform(scrollYProgress, [0, 0.7], [0, 35]);

    const indicatorOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.4, 0]);
    const indicatorY = useTransform(scrollYProgress, [0, 0.4], [0, 20]);
    const indicatorScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

    return (
        <motion.div
            ref={containerRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
            {/* Main title - depth dissolve */}
            <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight text-center"
                style={{
                    scale: titleScale,
                    opacity: titleOpacity,
                    y: titleY,
                }}
            >
                <span className="block text-white/90">Nöbetçi</span>
                <span className="block text-white/70 mt-2">Grafiker</span>
            </motion.h1>

            {/* Subtitle - depth dissolve */}
            <motion.p
                className="mt-8 text-sm md:text-base text-white/40 font-light tracking-[0.3em]"
                style={{
                    scale: subtitleScale,
                    opacity: subtitleOpacity,
                    y: subtitleY,
                }}
            >
                Deneyimin Tasarımla Buluştuğu Yer
            </motion.p>

            {/* Scroll indicator - dissolves first */}
            <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2"
                style={{
                    opacity: indicatorOpacity,
                    y: indicatorY,
                    scale: indicatorScale,
                }}
            >
                <motion.div
                    className="flex flex-col items-center gap-3"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-[10px] text-white/30 font-light tracking-[0.2em] uppercase">
                        Keşfet
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
