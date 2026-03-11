"use client";

import React, { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionTemplate,
} from "framer-motion";
import Image from "next/image";

const FEATURES = [
    {
        icon: "⚡",
        title: "Always On, Always Learning",
        desc: "Momentum OS runs quietly in the background, learning your habits and adapting to your workflow in real time.",
    },
    {
        icon: "🧠",
        title: "Context-Aware AI",
        desc: "Every action is understood in context. No setup, no prompts — it just knows what you need before you ask.",
    },
    {
        icon: "🎯",
        title: "Built for Deep Focus",
        desc: "Distraction blocking, session planning, and flow-state detection — all wired directly into the OS layer.",
    },
];

export default function MomentumScrollSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    // Clip path — starts as small centered oval (logo-like), expands to full viewport
    const insetY = useTransform(scrollYProgress, [0, 0.8], [44, 0]);
    const insetX = useTransform(scrollYProgress, [0, 0.8], [46, 0]);
    const roundedness = useTransform(scrollYProgress, [0, 0.6], [999, 0]);
    const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;

    // Logo scale: small → normal as section enters
    const logoScale = useTransform(scrollYProgress, [0, 0.4], [0.4, 1]);
    const logoOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    // Content fades in after clip path mostly opens
    const contentOpacity = useTransform(scrollYProgress, [0.55, 0.9], [0, 1]);
    const contentY = useTransform(scrollYProgress, [0.55, 0.9], [40, 0]);

    return (
        // Tall container to give scroll travel room
        <div
            ref={containerRef}
            className="relative min-h-[250vh] w-full bg-black"
        >
            {/* Sticky viewport that pins while container scrolls past */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* The expanding stencil panel */}
                <motion.div
                    style={{ clipPath }}
                    className="absolute inset-0 bg-black flex flex-col items-center justify-center"
                >
                    {/* Momentum OS Logo — visible in the "stencil shrunk" phase */}
                    <motion.div
                        style={{ scale: logoScale, opacity: logoOpacity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                    >
                        <Image
                            src="/momentum-logo.svg"
                            alt="Momentum OS"
                            width={120}
                            height={120}
                            className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 brightness-0 invert"
                            priority
                        />
                    </motion.div>

                    {/* Feature content — fades in once the stencil is fully open */}
                    <motion.div
                        style={{ opacity: contentOpacity, y: contentY }}
                        className="relative z-20 w-full max-w-5xl mx-auto px-6 sm:px-10 flex flex-col items-center text-center"
                    >
                        <p className="text-white/40 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase mb-4 sm:mb-6">
                            How It Works
                        </p>
                        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight mb-4 sm:mb-6 max-w-3xl">
                            Your computer,{" "}
                            <span className="text-white/50">supercharged by AI.</span>
                        </h2>
                        <p className="text-white/40 text-base sm:text-lg max-w-xl font-light leading-relaxed mb-12 sm:mb-16">
                            Momentum OS sits at the OS layer — not a browser extension, not an
                            app. It sees everything, learns everything, and acts on your
                            behalf.
                        </p>

                        {/* Feature grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl">
                            {FEATURES.map((f) => (
                                <div
                                    key={f.title}
                                    className="flex flex-col items-center sm:items-start text-center sm:text-left bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 backdrop-blur-sm"
                                >
                                    <span className="text-2xl mb-3">{f.icon}</span>
                                    <h3 className="text-white text-base font-medium mb-2">
                                        {f.title}
                                    </h3>
                                    <p className="text-white/40 text-sm font-light leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
