"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScroll, useMotionValueEvent, motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import * as THREE from "three";
import { projects } from "@/lib/data";
import ProjectCard from "./ProjectCard";

const ambientSpring = { stiffness: 40, damping: 30, restDelta: 0.001 };

export default function CollectionGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const scrollProgress = useRef(0);

    // Mouse parallax for header
    const mouseX = useMotionValue(0.5);
    const smoothMouseX = useSpring(mouseX, ambientSpring);
    const ambientOffsetX = useTransform(smoothMouseX, [0, 1], [15, -15]);

    // Track global scroll
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Track header scroll (dissolve effect)
    const { scrollYProgress: headerProgress } = useScroll({
        target: headerRef,
        offset: ["start end", "start 40%"],
    });

    // Sync MotionValue to ref for R3F
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        scrollProgress.current = latest;
    });

    // Header Scroll Utils
    const headerScale = useTransform(headerProgress, [0, 1], [0.96, 1]);
    const headerOpacity = useTransform(headerProgress, [0, 0.4, 1], [0, 0.5, 1]);
    const headerY = useTransform(headerProgress, [0, 1], [30, 0]);

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-black" onMouseMove={(e) => {
            mouseX.set(e.clientX / window.innerWidth);
        }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* TASK: Restore Collection Header Overlay */}
                <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
                    <motion.div
                        ref={headerRef}
                        className="max-w-7xl mx-auto px-8 pt-32 relative text-center"
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
                        <p className="mt-4 text-zinc-500 text-lg font-light max-w-md mx-auto">
                            A curated selection of works exploring form, shadow, and silence.
                        </p>
                    </motion.div>
                </div>

                <Canvas
                    camera={{ position: [0, 0, 18], fov: 35 }}
                    gl={{ antialias: true, alpha: false }}
                    dpr={[1, 1.5]}
                >
                    <color attach="background" args={["#000000"]} />
                    <fog attach="fog" args={["#000000", 12, 28]} />

                    <HelixScene scrollProgress={scrollProgress} />
                </Canvas>
            </div>
        </div>
    );
}

function HelixScene({
    scrollProgress,
}: {
    scrollProgress: React.MutableRefObject<number>;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const { width } = useThree((state) => state.viewport);
    const isMobile = width < 10;

    const CARDS_COUNT = projects.length;
    // Reduced spacing slightly to keep them tighter since we scaled down cards
    const SPACING_Y = isMobile ? 3.0 : 2.0;
    const RADIUS = isMobile ? 2.5 : 5.5;
    const TURNS = 2.0;
    const TOTAL_HEIGHT = CARDS_COUNT * SPACING_Y;

    const ANGLE_STEP = (Math.PI * 2 * TURNS) / CARDS_COUNT;

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const currentProgress = scrollProgress.current;

        // Move up
        const targetY = currentProgress * (TOTAL_HEIGHT - SPACING_Y * 2);
        const startY = -TOTAL_HEIGHT / 2 + (isMobile ? 2 : 5);
        groupRef.current.position.y = startY + targetY;

        // Rotate
        const targetRotation = currentProgress * Math.PI * 2;
        groupRef.current.rotation.y = targetRotation;
    });

    const cardData = useMemo(() => {
        return projects.map((project, i) => {
            const strandOffset = (i % 2) * Math.PI;
            const angle = i * ANGLE_STEP + strandOffset;

            const x = Math.cos(angle) * RADIUS;
            const z = Math.sin(angle) * RADIUS;
            const y = -i * SPACING_Y;

            // TASK: Fix "Mirrored" look
            // Previous: -angle - Math.PI / 2
            // If the card is facing "in", we see the backface which might be mirrored?
            // Let's rotate it to face OUT + 90deg offset correction if needed.
            // Usually facing center is: Math.atan2(x, z) ...
            // Let's try flipping the rotation 180deg from previous.

            // Previous: const rotY = -angle - Math.PI / 2;
            // New: Add PI to flip it around Y axis
            const rotY = -angle + Math.PI / 2;

            return {
                id: project.id,
                project,
                position: [x, y, z] as [number, number, number],
                rotation: [0, rotY, 0] as [number, number, number],
            };
        });
    }, [projects, RADIUS, SPACING_Y, ANGLE_STEP]);

    return (
        <group ref={groupRef}>
            {cardData.map((data, i) => (
                <ProjectCardWrapper
                    key={data.id}
                    data={data}
                    scrollProgress={scrollProgress}
                    index={i}
                />
            ))}
        </group>
    );
}

function ProjectCardWrapper({
    data,
    scrollProgress,
    index
}: {
    data: any,
    scrollProgress: React.MutableRefObject<number>,
    index: number
}) {
    const [opacity, setOpacity] = useState(1);
    const meshRef = useRef<THREE.Group>(null);
    const vec = useMemo(() => new THREE.Vector3(), []);
    const camera = useThree(state => state.camera);

    useFrame(() => {
        if (!meshRef.current) return;
        meshRef.current.getWorldPosition(vec);
        const dist = vec.distanceTo(camera.position);

        const FOG_NEAR = 12;
        const FOG_FAR = 28;

        let alpha = 1;
        if (dist > FOG_NEAR) {
            alpha = 1 - (dist - FOG_NEAR) / (FOG_FAR - FOG_NEAR);
        }
        if (dist < 4) alpha = 0;

        setOpacity(Math.max(0, Math.min(1, alpha)));
    });

    return (
        <group ref={meshRef} position={data.position} rotation={data.rotation}>
            <ProjectCard
                project={data.project}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                opacity={opacity}
            />
        </group>
    )
}
