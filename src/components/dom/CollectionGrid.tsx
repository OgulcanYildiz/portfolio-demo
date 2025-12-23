"use client";

import { useRef, useEffect, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
} from "framer-motion";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

const ambientSpring = { stiffness: 40, damping: 30, restDelta: 0.001 };

export default function CollectionGrid() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const smoothMouseX = useSpring(mouseX, ambientSpring);
    const smoothMouseY = useSpring(mouseY, ambientSpring);

    useEffect(() => {
        setIsMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Section scroll progress for background
    const { scrollYProgress: sectionProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Header scroll progress for entry animation
    const { scrollYProgress: headerProgress } = useScroll({
        target: headerRef,
        offset: ["start end", "start center"],
    });

    // Background color transition
    const backgroundColor = useTransform(
        sectionProgress,
        [0, 0.3, 0.7, 1],
        ["#1a1a1a", "#141414", "#0a0a0a", "#000000"]
    );

    // SCROLL-IN: Header slides UP from below (starts at +150px)
    const headerY = useTransform(headerProgress, [0, 1], [150, 0]);
    const headerOpacity = useTransform(headerProgress, [0, 0.5, 1], [0, 0.6, 1]);

    // Ambient parallax
    const ambientOffsetX = useTransform(smoothMouseX, [0, 1], [25, -25]);
    const ambientOffsetY = useTransform(smoothMouseY, [0, 1], [18, -18]);

    const starsOpacity = useTransform(sectionProgress, [0, 0.2, 0.8, 1], [0.4, 0.8, 0.8, 0.4]);

    return (
        <motion.section
            ref={sectionRef}
            className="relative min-h-screen overflow-hidden"
            style={{ backgroundColor }}
        >
            {/* Negative margin to create overlap with Hero */}
            <div className="-mt-32 pt-32">
                {/* Ambient background */}
                {isMounted && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ opacity: starsOpacity }}
                    >
                        <AmbientStars mouseX={smoothMouseX} mouseY={smoothMouseY} />
                    </motion.div>
                )}

                {/* Section header - SCROLL-IN from below */}
                <motion.div
                    ref={headerRef}
                    className="max-w-7xl mx-auto px-8 mb-24 pt-32 relative z-10"
                    style={{
                        y: headerY,
                        opacity: headerOpacity,
                        x: ambientOffsetX,
                    }}
                >
                    <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight">
                        Collection
                    </h2>
                    <p className="mt-4 text-zinc-500 text-lg font-light max-w-md">
                        A curated selection of works exploring form, shadow, and silence.
                    </p>
                </motion.div>

                {/* 3D container with parallax */}
                <motion.div
                    className="relative px-8 pb-32"
                    style={{
                        perspective: "1200px",
                        perspectiveOrigin: "center center",
                        x: ambientOffsetX,
                    }}
                >
                    <div
                        className="relative flex flex-col items-center gap-24 w-full"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                                totalItems={projects.length}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}

// Ambient stars
function AmbientStars({
    mouseX,
    mouseY,
}: {
    mouseX: ReturnType<typeof useSpring>;
    mouseY: ReturnType<typeof useSpring>;
}) {
    const stars = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: (i * 17) % 100,
        y: (i * 23) % 100,
        size: 1.5 + (i % 4) * 0.8,
    }));

    const layer1X = useTransform(mouseX, [0, 1], [40, -40]);
    const layer1Y = useTransform(mouseY, [0, 1], [30, -30]);
    const layer2X = useTransform(mouseX, [0, 1], [20, -20]);
    const layer2Y = useTransform(mouseY, [0, 1], [15, -15]);

    return (
        <>
            <motion.div
                className="absolute inset-0"
                style={{ x: layer1X, y: layer1Y }}
            >
                {stars.slice(0, 40).map((star) => (
                    <div
                        key={star.id}
                        className="absolute rounded-full bg-white/30"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                        }}
                    />
                ))}
            </motion.div>

            <motion.div
                className="absolute inset-0"
                style={{ x: layer2X, y: layer2Y }}
            >
                {stars.slice(40, 80).map((star) => (
                    <div
                        key={star.id}
                        className="absolute rounded-full bg-white/40"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size * 1.3,
                            height: star.size * 1.3,
                        }}
                    />
                ))}
            </motion.div>

            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                }}
            />
        </>
    );
}
