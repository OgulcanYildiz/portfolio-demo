"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroTitle() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of the hero container (parent)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // SCROLL-OUT: Title moves UP and fades as user scrolls
    // Starts at 0, moves up to -200px by 80% scroll
    const titleY = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -80, -200]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [1, 0.7, 0]);

    // SCROLL-OUT: Subtitle with slightly different timing
    const subtitleY = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -60, -150]);
    const subtitleOpacity = useTransform(scrollYProgress, [0, 0.35, 0.7], [1, 0.6, 0]);

    // SCROLL-OUT: Scroll indicator fades first
    const indicatorOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.5, 0]);
    const indicatorY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);

    // Subtle blur effect as content exits
    const blur = useTransform(scrollYProgress, [0.3, 0.7], [0, 4]);

    return (
        <motion.div
            ref={containerRef}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
            {/* Main title - SCROLL-OUT */}
            <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight text-center"
                style={{
                    y: titleY,
                    opacity: titleOpacity,
                    filter: useTransform(blur, (b) => `blur(${b}px)`),
                }}
            >
                <motion.span className="block text-white/90">Digital</motion.span>
                <motion.span className="block text-white/70 mt-2">Museum</motion.span>
            </motion.h1>

            {/* Subtitle - SCROLL-OUT with offset */}
            <motion.p
                className="mt-8 text-sm md:text-base text-white/40 font-light tracking-[0.3em] uppercase"
                style={{
                    y: subtitleY,
                    opacity: subtitleOpacity,
                    filter: useTransform(blur, (b) => `blur(${b * 0.8}px)`),
                }}
            >
                A Curated Experience
            </motion.p>

            {/* Scroll indicator - FIRST to fade */}
            <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2"
                style={{
                    opacity: indicatorOpacity,
                    y: indicatorY,
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
