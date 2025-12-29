"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScroll, useMotionValueEvent, motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import * as THREE from "three";
import ProjectCard from "./ProjectCard";

const ambientSpring = { stiffness: 40, damping: 30, restDelta: 0.001 };

interface Project {
    id: string;
    slug: string;
    title: string;
    category: string;
    year: string;
    thumbnail: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function CollectionGrid({ projects }: { projects: Project[] }) {
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

    // TASK: Canvas Opacity for Smooth Entry
    // Fade in the 3D scene as we scroll past the hero video
    const sceneOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        // TASK: Negative Margin Overlap
        // Pull the entire section up by 30vh to overlap the Hero video
        // Remove bg-black so the video shows through the top transparent part
        <div ref={containerRef} className="relative h-[400vh] -mt-[30vh] z-10" onMouseMove={(e) => {
            mouseX.set(e.clientX / window.innerWidth);
        }}>
            {/* TASK: Magic Cursor Effect */}
            <MagicCursor />

            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* TASK: Smooth Transition Gradient Backdrop
                    Instead of a simple top mask, this MAIN background ensures:
                    1. Top is transparent (video visible underneath)
                    2. Middle blends to black
                    3. Bottom is solid black (Collection background)
                */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-black pointer-events-none -z-10" />

                {/* TASK: Restore Collection Header Overlay (z-20 to sit above gradient) */}
                <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
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

                <motion.div style={{ opacity: sceneOpacity }} className="w-full h-full">
                    <Canvas
                        camera={{ position: [0, 0, 18], fov: 35 }}
                        gl={{ antialias: true, alpha: false }}
                        dpr={[1, 1.5]}
                    >
                        <color attach="background" args={["#000000"]} />
                        <fog attach="fog" args={["#000000", 12, 28]} />

                        <HelixScene scrollProgress={scrollProgress} projects={projects} />
                    </Canvas>
                </motion.div>
            </div>
        </div>
    );
}

// TASK: Magic Cursor Component
function MagicCursor() {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mouseX.set(e.clientX - 128); // Center the 256px glow
            mouseY.set(e.clientY - 128);
        }
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, [mouseX, mouseY]);

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    return (
        <motion.div
            className="fixed top-0 left-0 w-64 h-64 pointer-events-none z-50 mix-blend-screen"
            style={{ x, y }}
        >
            <div className="w-full h-full bg-white/10 rounded-full blur-3xl opacity-40" />
        </motion.div>
    );
}

function HelixScene({
    scrollProgress,
    projects,
}: {
    scrollProgress: React.MutableRefObject<number>;
    projects: Project[];
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

        // TASK: Fluid Exit 
        // We want the last card to exit the top of the viewport.
        // Viewport height in 3D units at z=0 (approx) for FOV 35 @ distance 18 is ~12 units.
        const VIEWPORT_HEIGHT_3D = 12;

        // Total travel needs to cover the Helix Height PLUS the viewport height so it clears.
        // Adding extra buffer to be safe.
        const TOTAL_TRAVEL = TOTAL_HEIGHT + VIEWPORT_HEIGHT_3D + 5;

        // Move up
        const targetY = currentProgress * TOTAL_TRAVEL;
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

            // TASK: Fix "Mirrored" look (flipped 180deg)
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
        <>
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
            {/* TASK: Directional Warp Particles */}
            <WarpParticles scrollProgress={scrollProgress} />
        </>
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

function WarpParticles({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
    const count = 300;
    const mesh = useRef<THREE.Points>(null);
    const lastScroll = useRef(0);

    const [positions] = useState(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 40; // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 60; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 40; // z
        }
        return pos;
    });

    useFrame((state, delta) => {
        if (!mesh.current) return;

        const currentScroll = scrollProgress.current;
        const scrollDelta = currentScroll - lastScroll.current;
        lastScroll.current = currentScroll;

        // Direction multiplier: 
        // If scrolling down (delta > 0), stars move UP (+Y)
        // If scrolling up (delta < 0), stars move DOWN (-Y)
        const velocity = scrollDelta * 80;

        const positionsAttr = mesh.current.geometry.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < count; i++) {
            let y = positionsAttr.getY(i);

            // Move particles: Default small drift + velocity
            y += 0.02 + velocity;

            // Infinite Recycle
            if (y > 30) y = -30;
            if (y < -30) y = 30;

            positionsAttr.setY(i, y);
        }

        positionsAttr.needsUpdate = true;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#ffffff"
                transparent
                opacity={0.4}
                sizeAttenuation={true}
            />
        </points>
    );
}
