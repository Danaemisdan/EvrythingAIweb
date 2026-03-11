"use client";

import React, { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionTemplate,
} from "framer-motion";
import Image from "next/image";
import { FaApple } from "react-icons/fa";

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
        offset: ["start start", "end end"],
    });

    // ── Hero text/button: blur + fade OUT on early scroll ──────────────────────
    const textOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
    const textBlurRaw = useTransform(scrollYProgress, [0, 0.22], [0, 20]);
    const textFilter = useMotionTemplate`blur(${textBlurRaw}px)`;
    const textY = useTransform(scrollYProgress, [0, 0.22], [0, -30]);

    // ── Stencil clip-path: logo-sized pill → full viewport ─────────────────────
    const insetY = useTransform(scrollYProgress, [0.1, 0.75], [44, 0]);
    const insetX = useTransform(scrollYProgress, [0.1, 0.75], [47, 0]);
    const roundedness = useTransform(scrollYProgress, [0.1, 0.65], [400, 0]);
    const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${roundedness}px)`;

    // ── Feature content: fades in once stencil is mostly open ──────────────────
    const contentOpacity = useTransform(scrollYProgress, [0.5, 0.88], [0, 1]);
    const contentY = useTransform(scrollYProgress, [0.5, 0.88], [40, 0]);

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-black"
            style={{ minHeight: "230vh" }}
        >
            {/* Sticky viewport that pins while the container scrolls */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

                {/* ── Layer 1: Hero content that blurs out (z-20, above stencil) ── */}
                <motion.div
                    style={{ opacity: textOpacity, filter: textFilter, y: textY }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none px-4"
                >
                    <Image
                        src="/momentum-logo.svg"
                        alt="Momentum OS"
                        width={100}
                        height={100}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-5 drop-shadow-2xl"
                        priority
                    />
                    <h2 className="text-white text-4xl sm:text-5xl md:text-[5.5rem] lg:text-[7rem] font-normal tracking-tight leading-none mb-4 text-center max-w-4xl">
                        Momentum OS
                    </h2>
                    <p className="text-white/50 text-sm sm:text-base md:text-lg font-light mb-8 text-center max-w-xs sm:max-w-sm">
                        Turn your computer into an AI growth engine.
                    </p>
                    <span className="flex items-center gap-2 border border-white/25 rounded-full px-5 py-2.5 text-white text-sm font-medium">
                        <FaApple className="w-4 h-4 shrink-0" />
                        Download for macOS
                    </span>
                </motion.div>

                {/* ── Layer 2: Expanding stencil (z-10, clips from logo to full) ─ */}
                <motion.div
                    style={{ clipPath }}
                    className="absolute inset-0 z-10 bg-black"
                >
                    {/* Feature content inside the expanding stencil */}
                    <motion.div
                        style={{ opacity: contentOpacity, y: contentY }}
                        className="w-full h-full flex flex-col items-center justify-center px-6 sm:px-10"
                    >
                        <p className="text-white/30 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase mb-3 sm:mb-5">
                            How It Works
                        </p>
                        <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight leading-tight mb-4 sm:mb-6 text-center max-w-3xl">
                            Your computer,{" "}
                            <span className="text-white/40">supercharged by AI.</span>
                        </h3>
                        <p className="text-white/35 text-sm sm:text-base max-w-md font-light leading-relaxed mb-10 sm:mb-14 text-center">
                            Momentum OS sits at the OS layer — not a browser extension, not an
                            app. It sees everything, learns everything, and acts on your behalf.
                        </p>

                        {/* Feature cards grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl">
                            {FEATURES.map((f) => (
                                <div
                                    key={f.title}
                                    className="flex flex-col items-center sm:items-start text-center sm:text-left bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-6"
                                >
                                    <span className="text-2xl mb-3">{f.icon}</span>
                                    <h4 className="text-white text-sm sm:text-base font-medium mb-2">
                                        {f.title}
                                    </h4>
                                    <p className="text-white/35 text-xs sm:text-sm font-light leading-relaxed">
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
