"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FluidGradient from "./FluidGradient";
import { SVG_PATHS } from "./svg-paths";

type Phase =
    | "INITIAL"
    | "STROBE"
    | "FLEX_SPREAD"
    | "WORDMARK_CROSSFADE"
    | "COLOR_BUILDUP"
    | "SNAP_WHITE_BG"
    | "SNAP_BLACK_BG"
    | "FINAL";

const LETTERS = ["E", "V", "R", "Y", "T", "H", "I1", "N", "G", "SPACE", "A", "I2"];

export default function Hero() {
    const [phase, setPhase] = useState<Phase>("INITIAL");
    const [visibleLetters, setVisibleLetters] = useState<number>(0);

    useEffect(() => {
        // Sequence Timings
        const sequence = async () => {
            // Small initial delay
            await new Promise((r) => setTimeout(r, 500));
            setPhase("STROBE");

            // Reveal letters sequentially (200ms pop + 80ms stagger roughly)
            for (let i = 1; i <= LETTERS.length; i++) {
                setVisibleLetters(i);
                await new Promise((r) => setTimeout(r, 120));
            }

            await new Promise((r) => setTimeout(r, 200));
            setPhase("FLEX_SPREAD");
            await new Promise((r) => setTimeout(r, 800));

            setPhase("WORDMARK_CROSSFADE");
            await new Promise((r) => setTimeout(r, 400));

            setPhase("COLOR_BUILDUP");
            await new Promise((r) => setTimeout(r, 600));

            setPhase("SNAP_WHITE_BG");
            await new Promise((r) => setTimeout(r, 150));

            setPhase("SNAP_BLACK_BG");
            await new Promise((r) => setTimeout(r, 40));

            setPhase("FINAL");
        };

        sequence();
    }, []);

    const isStrobing = phase === "STROBE" || phase === "INITIAL";
    const isFlexSpread = phase === "FLEX_SPREAD";
    const showLetters = isStrobing || isFlexSpread;
    const showWordmark = phase === "WORDMARK_CROSSFADE" || phase === "COLOR_BUILDUP";
    const showColorBuildup = phase === "COLOR_BUILDUP";

    // Background states based on phase
    const getContainerBg = () => {
        if (phase === "SNAP_WHITE_BG") return "bg-white";
        if (phase === "SNAP_BLACK_BG") return "bg-black";
        if (phase === "FINAL") return "bg-white";
        return "bg-black";
    };

    const getLogoSvg = () => {
        if (phase === "SNAP_WHITE_BG") return "/Logos/evrything-ai-black.svg";
        if (phase === "SNAP_BLACK_BG") return "/Logos/evrything-ai-white.svg";
        if (phase === "FINAL") return "/Logos/evrything-ai-black.svg";
        return null;
    };

    const finalLogo = getLogoSvg();

    return (
        <div
            className={`relative w-full h-screen overflow-hidden flex items-center justify-center transition-colors duration-0 ${getContainerBg()}`}
        >
            {/* Background Layer: Fluid Gradient */}
            <AnimatePresence>
                {(phase === "INITIAL" ||
                    phase === "STROBE" ||
                    phase === "FLEX_SPREAD" ||
                    phase === "WORDMARK_CROSSFADE" ||
                    phase === "COLOR_BUILDUP") && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                filter: showColorBuildup ? "brightness(1.5) saturate(1.5)" : "brightness(1) saturate(1)",
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 z-0 bg-black"
                        >
                            <FluidGradient />
                        </motion.div>
                    )}
            </AnimatePresence>

            {/* Mask Layer: Svg Text Cutout using masking */}
            <AnimatePresence>
                {(phase === "INITIAL" ||
                    phase === "STROBE" ||
                    phase === "FLEX_SPREAD" ||
                    phase === "WORDMARK_CROSSFADE" ||
                    phase === "COLOR_BUILDUP") && (
                        <motion.div
                            className="absolute inset-0 z-10 pointer-events-none"
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* The SVG Stencil Full Screen Mask */}
                            <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                                <defs>
                                    <mask id="text-mask" x="0" y="0" width="100%" height="100%">
                                        {/* White background means let background through, Black means block it.
                      We want the screen black EXCEPT where letters are white.
                      So the rect is white, and the cutouts are black. */}
                                        <rect x="0" y="0" width="100%" height="100%" fill="white" />

                                        {showLetters && (
                                            <g className={`transition-all duration-500 ease-in-out font-bold uppercase font-sans ${isStrobing ? 'opacity-100' : 'opacity-100'}`} style={{ transformOrigin: "center" }}>
                                                {/* 
                          When strobing, center all text exactly in middle overlapping.
                          When spreading out, lay them out across the screen using a map.
                        */}
                                                {LETTERS.map((letter, idx) => {
                                                    if (idx >= visibleLetters) return null;
                                                    if (letter === "SPACE") return null;

                                                    // Calculate spread positions
                                                    const spreadWidth = 800;
                                                    const startX = (typeof window !== "undefined" ? window.innerWidth / 2 : 1000) - spreadWidth / 2 || 0;

                                                    // Spacing adjustments
                                                    let xPos;
                                                    if (isStrobing) {
                                                        xPos = "50%"; // Center everything during strobe
                                                    } else {
                                                        // Custom spacing for EVRYTHING AI, slightly tighter than default uniform distribution
                                                        const positions = [
                                                            0, 60, 120, 180, 240, 300, 360, 420, 480, // EVRYTHING
                                                            0, // SPACE 
                                                            600, 660 // AI
                                                        ];
                                                        xPos = startX + positions[idx];
                                                    }

                                                    // The provided SVGs are huge, scale them down
                                                    const scaleVal = isStrobing ? 2.5 : 0.8;

                                                    return (
                                                        <motion.g
                                                            key={`${letter}-${idx}`}
                                                            x={xPos}
                                                            y="50%"
                                                            initial={{ opacity: 0, scale: 0.5, x: xPos, y: "50%" }}
                                                            animate={{ opacity: 1, scale: scaleVal, x: xPos, y: "50%" }}
                                                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                                                        >
                                                            <path
                                                                d={SVG_PATHS[letter as keyof typeof SVG_PATHS]}
                                                                fill="black"
                                                                // Adjust translation so the huge negative coordinates of the original SVG center well
                                                                transform={`scale(1.2) translate(-120, 120)`}
                                                            />
                                                        </motion.g>
                                                    )
                                                })}
                                            </g>
                                        )}

                                        {showWordmark && (
                                            <motion.image
                                                href="/Logos/evrything-ai-full.svg"
                                                x="50%"
                                                y="50%"
                                                width="800"
                                                height="400"
                                                transform="translate(-400, -200)"
                                                fill="black"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ filter: "invert(1)" }} // SVG mask rule inverted
                                            />
                                        )}
                                    </mask>
                                </defs>
                                <rect
                                    x="0"
                                    y="0"
                                    width="100%"
                                    height="100%"
                                    fill="black"
                                    mask="url(#text-mask)"
                                />
                            </svg>
                        </motion.div>
                    )}
            </AnimatePresence>

            {/* Snap Final Logos */}
            {finalLogo && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto">
                    <img
                        src={finalLogo}
                        className="w-3/4 max-w-2xl object-contain"
                        alt="Evrything AI Logo"
                    />
                    {phase === "FINAL" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="mt-12 flex flex-col items-center space-y-6"
                        >
                            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-black text-center">
                                Build the future of AI locally.
                            </h2>
                            <button className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:scale-105 transition-transform cursor-pointer">
                                Explore Momentum OS
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
