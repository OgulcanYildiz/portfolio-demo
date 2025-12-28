"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navItems = [
    { label: "ANASAYFA", href: "/" },
    { label: "KOLEKSİYONLAR", href: "#collections" },
    { label: "HAKKIMIZDA", href: "#about" },
    { label: "İLETİŞİM", href: "#contact" },
];

export default function Navigation() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 px-8 py-6 md:px-12 md:py-8"
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            initial="visible"
            transition={{ duration: 0.35, ease: "easeInOut" }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group relative z-50">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-18 h-18"
                    >
                        <img
                            src="/logo.png"
                            alt="Nö Logo"
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                </Link>

                {/* Navigation items */}
                <ul className="hidden md:flex items-center gap-12">
                    {navItems.map((item, index) => (
                        <li key={item.label}>
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.7 + index * 0.1,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <Link href={item.href} className="relative group block py-2">
                                    {/* Text with STRONGER hover */}
                                    <motion.span
                                        className="text-xs font-light tracking-[0.2em] text-white/80 group-hover:text-white transition-colors duration-200"
                                        whileHover={{ y: -2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.label}
                                    </motion.span>

                                    {/* VISIBLE underline on hover */}
                                    <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-white/60 group-hover:w-full transition-all duration-300 ease-out" />

                                    {/* Glow effect on hover */}
                                    <span className="absolute inset-0 -mx-3 -my-2 rounded opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity duration-300" />
                                </Link>
                            </motion.div>
                        </li>
                    ))}
                </ul>

                {/* Mobile menu button with hover */}
                <motion.button
                    className="md:hidden text-white/50 hover:text-white transition-colors duration-200 p-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </motion.button>
            </div>
        </motion.nav>
    );
}
