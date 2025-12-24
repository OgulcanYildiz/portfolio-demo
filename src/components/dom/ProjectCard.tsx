"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useSpring, useTransform } from "framer-motion";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
    project: Project;
    position: [number, number, number];
    rotation: [number, number, number];
    opacity: number;
}

// Motion springs for hover interactions
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
    position,
    rotation,
    opacity,
}: ProjectCardProps) {
    const isMobile = useIsMobile();
    const [isHovered, setIsHovered] = useState(false);

    // Example hover spring
    const hoverScale = useSpring(isHovered ? 1.05 : 1, hoverSpring);
    const hoverBrightness = useSpring(isHovered ? 1.15 : 1, hoverSpring);

    return (
        <group position={position} rotation={rotation}>
            <Html
                transform
                occlude="blending" // Occlude when behind other objects (if visual mesh exists)
                style={{
                    transition: "opacity 0.2s",
                    opacity: opacity, // Fade based on depth
                    pointerEvents: opacity < 0.3 ? "none" : "auto", // Disable interaction if too deep
                }}
                // Add a slight scaling factor for better resolution
                // Reduced by 30% per user request: Mobile 0.4*0.7=0.28, Desktop 1*0.7=0.7
                scale={isMobile ? 0.28 : 0.7}
            >
                <motion.div
                    className="relative w-72 h-80 md:w-80 md:h-96 cursor-pointer select-none"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        scale: hoverScale,
                    }}
                >
                    <Link
                        href={`/works/${project.slug}`}
                        className="block absolute inset-0 rounded-xl overflow-hidden"
                        draggable={false}
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

                            {/* Hover highlight */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none transition-colors duration-300"
                                style={{
                                    backgroundColor: isHovered
                                        ? "rgba(255,255,255,0.03)"
                                        : "transparent",
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
            </Html>
        </group>
    );
}
