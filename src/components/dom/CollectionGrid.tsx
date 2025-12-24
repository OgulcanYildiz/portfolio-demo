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
    const cardsContainerRef = useRef<HTMLDivElement>(null);
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

    // Section scroll for background
    const { scrollYProgress: sectionProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // TASK 2: Header scroll - overlaps with hero dissolve
    // Starts appearing while hero is still visible (early entry)
    const { scrollYProgress: headerProgress } = useScroll({
        target: headerRef,
        offset: ["start end", "start 40%"],
    });

    // TASK 3: Card rotation scroll - full section progress
    const { scrollYProgress: rotationProgress } = useScroll({
        target: cardsContainerRef,
        offset: ["start end", "end start"],
    });

    // Background transition
    const backgroundColor = useTransform(
        sectionProgress,
        [0, 0.15, 0.4, 0.7, 1],
        ["#000000", "#080808", "#0f0f0f", "#121212", "#0a0a0a"]
    );

    // TASK 2: Collection title crossfade with hero
    // Scales from 0.96 → 1.0, fades in early to overlap hero dissolve
    const headerScale = useTransform(headerProgress, [0, 1], [0.96, 1]);
    const headerOpacity = useTransform(headerProgress, [0, 0.4, 1], [0, 0.5, 1]);
    const headerY = useTransform(headerProgress, [0, 1], [30, 0]);

    // TASK 3: Unified card rotation (0 → 360 degrees over full scroll)
    // Very slow and subtle, applied via context to all cards
    const cardRotation = useTransform(rotationProgress, [0, 1], [0, 360]);

    // Ambient parallax
    const ambientOffsetX = useTransform(smoothMouseX, [0, 1], [15, -15]);

    // Star opacity
    const starsOpacity = useTransform(sectionProgress, [0, 0.15, 0.8, 1], [0.2, 0.5, 0.5, 0.2]);

    return (
        <motion.section
            ref={sectionRef}
            className="relative min-h-screen overflow-hidden"
            style={{ backgroundColor }}
        >
            {/* Gradient overlay for smooth transition from hero */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />

            {/* Ambient background */}
            {isMounted && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ opacity: starsOpacity }}
                >
                    <AmbientStars
                        mouseX={smoothMouseX}
                        mouseY={smoothMouseY}
                        scrollProgress={sectionProgress}
                    />
                </motion.div>
            )}

            {/* TASK 2: Collection header - crossfades with hero */}
            <motion.div
                ref={headerRef}
                className="max-w-7xl mx-auto px-8 mb-24 pt-48 relative z-10"
                style={{
                    scale: headerScale,
                    opacity: headerOpacity,
                    y: headerY,
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

            {/* TASK 3: Cards container with unified rotation */}
            <motion.div
                ref={cardsContainerRef}
                className="relative px-8 pb-32"
                style={{
                    x: ambientOffsetX,
                    perspective: 1200,
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
                            rotationProgress={cardRotation}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.section>
    );
}

// Ambient stars with scroll drift
function AmbientStars({
    mouseX,
    mouseY,
    scrollProgress,
}: {
    mouseX: ReturnType<typeof useSpring>;
    mouseY: ReturnType<typeof useSpring>;
    scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
    const stars = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: (i * 17) % 100,
        y: (i * 23) % 100,
        size: 1 + (i % 3) * 0.5,
        driftDirection: i % 2 === 0 ? 1 : -1,
    }));

    const layer1X = useTransform(mouseX, [0, 1], [20, -20]);
    const layer1Y = useTransform(mouseY, [0, 1], [15, -15]);
    const scrollDrift = useTransform(scrollProgress, [0, 1], [0, 30]);

    return (
        <>
            <motion.div
                className="absolute inset-0"
                style={{ x: layer1X, y: layer1Y }}
            >
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute rounded-full bg-white/20"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                            x: useTransform(scrollDrift, (d) => d * star.driftDirection * (star.id % 5) * 0.1),
                            y: useTransform(scrollDrift, (d) => d * ((star.id % 3) - 1) * 0.15),
                        }}
                    />
                ))}
            </motion.div>

            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                }}
            />
        </>
    );
}
