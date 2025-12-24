"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    MotionValue,
} from "framer-motion";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
    project: Project;
    index: number;
    totalItems: number;
    rotationProgress?: MotionValue<number>;
}

// Motion springs
const positionSpring = { stiffness: 50, damping: 40, restDelta: 0.001 };
const opacitySpring = { stiffness: 30, damping: 50, restDelta: 0.001 };
const hoverSpring = { stiffness: 300, damping: 30, restDelta: 0.001 };

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
}

export default function ProjectCard({
    project,
    index,
    totalItems,
    rotationProgress,
}: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = useState(false);

    // TASK 3: Apply unified rotation from parent (very subtle per card)
    // Each card gets a fraction of the total rotation for variety
    const cardRotation = rotationProgress
        ? useTransform(rotationProgress, (r) => r * 0.02 * ((index % 3) - 1))
        : undefined;

    // Hover effects
    const hoverScale = useSpring(isHovered ? 1.03 : 1, hoverSpring);
    const hoverBrightness = useSpring(isHovered ? 1.08 : 1, hoverSpring);

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, positionSpring);
    const opacityProgress = useSpring(scrollYProgress, opacitySpring);

    // Horizontal offset (alternating)
    const isEven = index % 2 === 0;
    const xOffset = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        isEven
            ? [isMobile ? -30 : -80, 0, isMobile ? 30 : 80]
            : [isMobile ? 30 : 80, 0, isMobile ? -30 : -80]
    );

    // Vertical parallax
    const parallaxMultiplier = 1 + (index % 3) * 0.08;
    const yOffset = useTransform(
        smoothProgress,
        [0, 1],
        [40 * parallaxMultiplier, -40 * parallaxMultiplier]
    );

    // Scale based on center proximity
    const baseScale = useTransform(
        opacityProgress,
        [0, 0.3, 0.5, 0.7, 1],
        [0.92, 0.96, 1, 0.96, 0.92]
    );

    // Opacity
    const opacity = useTransform(
        opacityProgress,
        [0, 0.15, 0.4, 0.6, 0.85, 1],
        [0.2, 0.5, 1, 1, 0.5, 0.2]
    );

    // Darkness overlay
    const overlayOpacity = useTransform(
        opacityProgress,
        [0, 0.35, 0.5, 0.65, 1],
        [0.6, 0.2, 0, 0.2, 0.6]
    );

    return (
        <motion.div
            ref={cardRef}
            className="relative w-72 h-80 md:w-80 md:h-96 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                x: xOffset,
                y: yOffset,
                scale: baseScale,
                opacity,
                // TASK 3: Apply subtle rotateZ
                rotate: cardRotation,
            }}
        >
            {/* Card with hover transforms */}
            <motion.div
                className="absolute inset-0"
                style={{ scale: hoverScale }}
            >
                <Link
                    href={`/works/${project.slug}`}
                    className="block absolute inset-0 rounded-xl overflow-hidden"
                >
                    {/* Card background */}
                    <motion.div
                        className="absolute inset-0 bg-zinc-900 rounded-xl overflow-hidden transition-shadow duration-500"
                        style={{
                            filter: useTransform(hoverBrightness, (b) => `brightness(${b})`),
                            boxShadow: isHovered
                                ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                                : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {/* Thumbnail */}
                        <div
                            className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950"
                            style={{
                                backgroundImage: `url(${project.thumbnail})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />

                        {/* Ambient gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Depth darkness overlay */}
                        <motion.div
                            className="absolute inset-0 bg-black pointer-events-none"
                            style={{ opacity: overlayOpacity }}
                        />

                        {/* Hover highlight */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none transition-colors duration-300"
                            style={{
                                backgroundColor: isHovered ? "rgba(255,255,255,0.03)" : "transparent",
                            }}
                        />
                    </motion.div>

                    {/* Card content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                        <p className="text-[10px] md:text-xs text-zinc-400 font-light tracking-[0.2em] uppercase mb-2">
                            {project.category} — {project.year}
                        </p>
                        <h3 className="text-lg md:text-xl font-light text-white tracking-tight leading-snug">
                            {project.title}
                        </h3>
                    </div>

                    {/* Index indicator */}
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 text-[10px] md:text-xs text-zinc-500/60 font-mono z-10">
                        {project.id}
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}
