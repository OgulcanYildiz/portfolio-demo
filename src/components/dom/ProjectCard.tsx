"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
} from "framer-motion";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
    project: Project;
    index: number;
    totalItems: number;
}

// Motion springs
const positionSpring = { stiffness: 50, damping: 40, restDelta: 0.001 };
const opacitySpring = { stiffness: 30, damping: 50, restDelta: 0.001 };
const hoverSpring = { stiffness: 200, damping: 25, restDelta: 0.001 };

const CYLINDER_RADIUS = 300;

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
}: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = useState(false);

    // Mouse position for tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, hoverSpring);
    const smoothMouseY = useSpring(mouseY, hoverSpring);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!cardRef.current || isMobile) return;
            const rect = cardRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            mouseX.set((x - 0.5) * 2);
            mouseY.set((y - 0.5) * 2);
        },
        [mouseX, mouseY, isMobile]
    );

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    // STRONGER HOVER: ±6-8° tilt, clearly visible
    const hoverRotateX = useTransform(smoothMouseY, [-1, 1], [8, -8]);
    const hoverRotateY = useTransform(smoothMouseX, [-1, 1], [-8, 8]);

    // STRONGER HOVER: +80px Z depth
    const hoverZ = useSpring(isHovered ? 80 : 0, hoverSpring);

    // STRONGER HOVER: 1.15× brightness
    const hoverBrightness = useSpring(isHovered ? 1.15 : 1, hoverSpring);

    // STRONGER HOVER: visible scale on hover
    const hoverScale = useSpring(isHovered ? 1.05 : 1, hoverSpring);

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, positionSpring);
    const opacityProgress = useSpring(scrollYProgress, opacitySpring);

    // Cylinder calculations
    const baseAngleOffset = (index / totalItems) * Math.PI * 0.5;
    const angle = useTransform(smoothProgress, [0, 0.5, 1], [
        baseAngleOffset + Math.PI * 0.4,
        baseAngleOffset,
        baseAngleOffset - Math.PI * 0.4,
    ]);

    const cylinderX = useTransform(angle, (a) => {
        const amplitude = isMobile ? 60 : 150;
        return Math.sin(a) * amplitude;
    });

    const cylinderZ = useTransform(angle, (a) => {
        const radius = isMobile ? CYLINDER_RADIUS * 0.5 : CYLINDER_RADIUS;
        return (Math.cos(a) - 1) * radius * 0.5;
    });

    const baseRotateY = useTransform(angle, (a) => {
        const maxRotation = isMobile ? 15 : 25;
        return -Math.sin(a) * maxRotation;
    });

    const parallaxMultiplier = 1 + (index % 3) * 0.08;
    const yOffset = useTransform(
        smoothProgress,
        [0, 1],
        [40 * parallaxMultiplier, -40 * parallaxMultiplier]
    );

    // ENHANCED FOCUS: stronger scale difference
    const baseScale = useTransform(cylinderZ, [-CYLINDER_RADIUS * 0.5, 0], [0.75, 1]);

    // ENHANCED FOCUS: much stronger opacity contrast
    const baseOpacity = useTransform(
        opacityProgress,
        [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1],
        [0.1, 0.2, 0.4, 0.7, 1, 0.7, 0.4, 0.2, 0.1]
    );

    const depthOpacity = useTransform(
        cylinderZ,
        [-CYLINDER_RADIUS * 0.5, -CYLINDER_RADIUS * 0.2, 0],
        [0.4, 0.7, 1]
    );

    const combinedOpacity = useTransform(
        [baseOpacity, depthOpacity],
        ([base, depth]) => (base as number) * (depth as number)
    );

    const opacity = useSpring(combinedOpacity, opacitySpring);

    // ENHANCED FOCUS: stronger darkness overlay for non-centered cards
    const overlayOpacity = useTransform(
        opacityProgress,
        [0, 0.3, 0.5, 0.7, 1],
        [0.8, 0.4, 0, 0.4, 0.8]
    );

    // Z-INDEX: Cards closer to front get higher z-index for clickability
    const zIndexValue = useTransform(cylinderZ, [-CYLINDER_RADIUS * 0.5, 0], [0, 10]);

    return (
        <motion.div
            ref={cardRef}
            className="relative w-72 h-80 md:w-80 md:h-96 cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                x: cylinderX,
                y: yOffset,
                z: cylinderZ,
                rotateY: baseRotateY,
                scale: baseScale,
                opacity,
                transformStyle: "preserve-3d",
                zIndex: zIndexValue,
                // CRITICAL: Ensure pointer events work
                pointerEvents: "auto",
            }}
        >
            {/* Inner card with hover transforms */}
            <motion.div
                className="absolute inset-0"
                style={{
                    rotateX: isMobile ? 0 : hoverRotateX,
                    rotateY: isMobile ? 0 : hoverRotateY,
                    z: hoverZ,
                    scale: hoverScale,
                    transformStyle: "preserve-3d",
                }}
            >
                <Link
                    href={`/works/${project.slug}`}
                    className="block absolute inset-0 rounded-xl overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Card background with brightness */}
                    <motion.div
                        className="absolute inset-0 bg-zinc-900"
                        style={{
                            filter: useTransform(hoverBrightness, (b) => `brightness(${b})`),
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

                        {/* STRONGER HOVER GLOW */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                opacity: useSpring(isHovered ? 1 : 0, hoverSpring),
                                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                boxShadow: "inset 0 0 40px rgba(255,255,255,0.15)",
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

                    {/* VISIBLE BORDER ON HOVER */}
                    <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                            opacity: useSpring(isHovered ? 1 : 0, hoverSpring),
                            border: "1px solid rgba(255,255,255,0.2)",
                        }}
                    />
                </Link>
            </motion.div>
        </motion.div>
    );
}
