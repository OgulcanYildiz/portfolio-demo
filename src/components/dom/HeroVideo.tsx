"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroTitle from "./HeroTitle";

export default function HeroVideo() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Map scroll progress to overlay opacity: starts at 0, ends at 0.8
    const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.8]);

    return (
        <section ref={containerRef} className="relative h-[200vh]">
            {/* Sticky video container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Video element */}
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/poster.jpg"
                >
                    {/* Placeholder: add actual video source when available */}
                    <source src="/hero.mp4" type="video/mp4" />
                </video>

                {/* Dark shift overlay */}
                <motion.div
                    className="absolute inset-0 bg-black pointer-events-none"
                    style={{ opacity: overlayOpacity }}
                />

                {/* Hero title overlay */}
                <HeroTitle />
            </div>
        </section>
    );
}
