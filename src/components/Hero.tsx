"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { E_DOTS } from "./e-dots";
import { V_DOTS } from "./v-dots";
import { R_DOTS } from "./r-dots";
import { Y_DOTS } from "./y-dots";
import { T_DOTS } from "./t-dots";
import { H_DOTS } from "./h-dots";
import { I_DOTS } from "./i-dots";
import { N_DOTS } from "./n-dots";
import { G_DOTS } from "./g-dots";
import { A_DOTS } from "./a-dots";
import { I2_DOTS } from "./i2-dots";
import { DynamicWaveCanvas } from "./dynamic-wave-canvas-background";
import { FaApple, FaWindows, FaAndroid } from "react-icons/fa";
import { ShineBorder } from "./ui/shine-border";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Geometrical Bounding Box Extractor
function getPathsBounds(paths: string[]) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    paths.forEach(p => {
        const coords = p.match(/-?\d+\.?\d*/g);
        if (!coords) return;
        for (let i = 0; i < coords.length; i += 2) {
            const x = parseFloat(coords[i]);
            const y = parseFloat(coords[i + 1]);
            if (!isNaN(x)) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
            }
            if (!isNaN(y)) {
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    });
    return {
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2,
        width: maxX - minX,
        height: maxY - minY
    };
}

const ALPHABET: Record<string, string[]> = {
    E: E_DOTS,
    V: V_DOTS,
    R: R_DOTS,
    Y: Y_DOTS,
    T: T_DOTS,
    H: H_DOTS,
    I: I_DOTS,
    N: N_DOTS,
    G: G_DOTS,
    A: A_DOTS,
    i: I2_DOTS,
};
const STENCIL_KEYS = Object.keys(ALPHABET) as Array<keyof typeof ALPHABET>;

// Final Sequential Timeline mapping
const TIMINGS: Record<string, number> = {
    E: 0,
    V: 800,
    R: 600,
    Y: 450,
    T: 350,
    H: 250,
    I: 200,
    N: 150,
    G: 120,
    A: 100,
    i: 600,

    // EVRYTHING Ai End States
    LOGO_WHITE_BG_1: 500,
    LOGO_BLACK_BG_2: 500,
    LOGO_WHITE_BG_3: 1000,

    // Smooth Transition sequence
    INTRO_TEXT: 2000, // Background blacken instantly, "Introducing" blurs/fades in
    CANVAS_AND_LOGO: 2000, // Introducing fades out. Wave slides up. Logo anchors center.
    MOMENTUM_LOCK: 0, // Logo seamlessly floats up. Title fades below.
};

const STEP_KEYS = [
    ...STENCIL_KEYS,
    "LOGO_WHITE_BG_1",
    "LOGO_BLACK_BG_2",
    "LOGO_WHITE_BG_3",
    "INTRO_TEXT",
    "CANVAS_AND_LOGO",
    "MOMENTUM_LOCK"
];

const BOUNDS = Object.fromEntries(
    Object.entries(ALPHABET).map(([k, paths]) => [k, getPathsBounds(paths)])
);
const REF_HEIGHT = BOUNDS['E'].height;

export default function Hero() {
    const [stepIndex, setStepIndex] = useState(0);
    const [hasVisited, setHasVisited] = useState<boolean | null>(null);
    const [osLabel, setOsLabel] = useState<"macOS" | "Windows" | "iOS" | "Android">("Windows");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const visited = sessionStorage.getItem("evrything-visited");
        if (visited) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHasVisited(true);
            setStepIndex(STEP_KEYS.indexOf("LOGO_WHITE_BG_3"));
        } else {
            setHasVisited(false);
            sessionStorage.setItem("evrything-visited", "true");
        }

        // Hydrate hardware sniffing
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/i.test(userAgent)) {
            setOsLabel("iOS");
        } else if (/android/i.test(userAgent)) {
            setOsLabel("Android");
        } else if (/macintosh|mac os x/i.test(userAgent)) {
            setOsLabel("macOS");
        } else {
            setOsLabel("Windows");
        }
    }, []);

    const step = STEP_KEYS[stepIndex];
    const isLogoPhase = stepIndex >= STEP_KEYS.indexOf("LOGO_WHITE_BG_1") && stepIndex <= STEP_KEYS.indexOf("LOGO_WHITE_BG_3");
    const isMomentumPhase = stepIndex >= STEP_KEYS.indexOf("INTRO_TEXT");
    const isCanvasPhase = stepIndex >= STEP_KEYS.indexOf("CANVAS_AND_LOGO");

    const [randomStarts] = useState(() => {
        return ALPHABET["E"].map(() => {
            const side = Math.floor(Math.random() * 4);
            const distance = 800;
            switch (side) {
                case 0: return { x: (Math.random() - 0.5) * distance, y: -distance };
                case 1: return { x: distance, y: (Math.random() - 0.5) * distance };
                case 2: return { x: (Math.random() - 0.5) * distance, y: distance };
                case 3: return { x: -distance, y: -distance };
                default: return { x: 0, y: distance };
            }
        });
    });

    // Sequence execution timeline
    useEffect(() => {
        if (hasVisited === null) return;
        if (step === "MOMENTUM_LOCK") return;

        if (step !== "E") {
            const duration = TIMINGS[step];
            const timeout = setTimeout(() => {
                setStepIndex((prev) => prev + 1);
            }, duration);
            return () => clearTimeout(timeout);
        }
    }, [step, hasVisited]);

    if (hasVisited === null) {
        return <div className="w-full h-screen bg-black" />; // SSR placeholder preventing hydration flash
    }

    const isWhiteBG = ["V", "Y", "H", "N", "A", "LOGO_WHITE_BG_1", "LOGO_WHITE_BG_3"].includes(step);
    const bgColorClass = isWhiteBG ? "bg-white" : "bg-black";
    const bgTransitionClass = isMomentumPhase ? "transition-colors duration-[1500ms] ease-in-out" : "transition-none duration-0";

    return (
        <div className={`relative w-full h-screen overflow-hidden ${bgTransitionClass} ${bgColorClass}`}>

            {/* Phase 3: Dynamic WebGL and OS Layer */}
            <AnimatePresence>
                {isMomentumPhase && (
                    <motion.div
                        key="momentum-layer"
                        className="absolute inset-0 z-0 flex flex-col items-center justify-center font-[-apple-system,BlinkMacSystemFont,'SF_Pro',sans-serif]"
                    >
                        {/* Slide up canvas aggressively from bottom */}
                        <AnimatePresence>
                            {isCanvasPhase && (
                                <motion.div
                                    className="absolute inset-0 z-0"
                                    initial={{ y: "100%" }}
                                    animate={{ y: "0%" }}
                                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <DynamicWaveCanvas className="z-0" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                            <AnimatePresence mode="wait">
                                {step === "INTRO_TEXT" && (
                                    <motion.div
                                        key="intro-text"
                                        className="absolute text-white text-5xl md:text-7xl lg:text-8xl tracking-tight font-medium"
                                        initial={{ opacity: 0, filter: "blur(15px)", scale: 0.95 }}
                                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                        exit={{ opacity: 0, filter: "blur(20px)", scale: 1.05, transition: { duration: 0.6 } }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                    >
                                        {"Introducing".split("").map((char, index) => (
                                            <motion.span
                                                key={index}
                                                className="inline-block"
                                                initial={{ rotateX: -90, opacity: 0, y: 10 }}
                                                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: 0.1 + (index * 0.05),
                                                    type: "spring",
                                                    stiffness: 150,
                                                    damping: 20
                                                }}
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Unified Logo Component to prevent double-mount jump glitch */}
                            <AnimatePresence>
                                {isCanvasPhase && (
                                    <motion.div
                                        key="unified-momentum-sequence"
                                        className="absolute flex flex-col items-center justify-center w-full px-4"
                                    >
                                        <motion.div
                                            // 1. Instantly pop dead center (y:0) when `CANVAS_AND_LOGO` fires
                                            // 2. ONLY move (y:-140) when `MOMENTUM_LOCK` finally fires 2 seconds later
                                            initial={{ scale: 0.9, opacity: 0, y: 0 }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                y: step === "MOMENTUM_LOCK" ? -140 : 0
                                            }}
                                            transition={{
                                                opacity: { duration: 0.8 },
                                                scale: { duration: 0.8, ease: "easeOut" },
                                                y: { duration: 1, ease: [0.16, 1, 0.3, 1] } // Apple spring vertical translation
                                            }}
                                            className="mb-6 xl:mb-8"
                                        >
                                            <Image
                                                src="/momentum-logo.svg"
                                                alt="Momentum OS"
                                                width={400}
                                                height={400}
                                                className="w-full max-w-[60vw] sm:max-w-[300px] xl:max-w-[350px] h-auto drop-shadow-2xl"
                                                priority
                                            />
                                        </motion.div>

                                        {/* Typography cascade triggers conditionally inside the master container */}
                                        <AnimatePresence>
                                            {step === "MOMENTUM_LOCK" && (
                                                <motion.div
                                                    key="momentum-type"
                                                    initial={{ opacity: 0, filter: "blur(15px)" }}
                                                    animate={{ opacity: 1, filter: "blur(0px)" }}
                                                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                                                    className="absolute flex flex-col items-center text-center space-y-1 top-1/2 mt-4"
                                                >
                                                    <h1 className="text-white text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] leading-none font-normal tracking-tight mb-3 sm:mb-4 max-w-4xl z-10 px-4">
                                                        Momentum OS
                                                    </h1>
                                                    <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl font-light leading-relaxed mb-8 z-10 px-6 text-center">
                                                        Turn your computer into an AI growth engine.
                                                    </p>

                                                    <div className="pt-4 sm:pt-6 flex flex-col items-center z-50">
                                                        <button
                                                            onClick={() => setShowPopup(true)}
                                                            className="aurora-download-btn group relative bg-transparent border border-white/30 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-full font-medium text-sm md:text-base transition-all duration-500 hover:border-transparent flex items-center gap-2.5 w-fit mx-auto self-center justify-center shrink-0"
                                                        >
                                                            {(osLabel === "macOS" || osLabel === "iOS") && <FaApple className="w-4 h-4 shrink-0" />}
                                                            {osLabel === "Windows" && <FaWindows className="w-4 h-4 shrink-0" />}
                                                            {osLabel === "Android" && <FaAndroid className="w-4 h-4 shrink-0" />}
                                                            Download for {osLabel}
                                                            <span className="aurora-glow-ring"></span>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Phases 1 & 2: Legacy Evrything Stencils */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                {!isLogoPhase && !isMomentumPhase && (
                    <svg
                        viewBox="0 0 375 375"
                        className="w-full max-w-[90vw] sm:max-w-[600px] h-auto overflow-visible origin-center"
                    >
                        <g transform={`translate(187.5, 187.5) scale(${REF_HEIGHT / (BOUNDS[step]?.height || 1)}) translate(${- (BOUNDS[step]?.cx || 0)}, ${- (BOUNDS[step]?.cy || 0)})`}>
                            <g fill={["V", "Y", "H", "N", "A"].includes(step) ? "#000000" : (step === "A" || step === "i") ? "#fd5934" : "#ffffff"}>
                                {step in ALPHABET && ALPHABET[step as string].map((dotPath, i) => {
                                    if (dotPath.length < 10) return null;

                                    if (step === "E") {
                                        return (
                                            <motion.path
                                                key={`e-${i}`}
                                                initial={{ opacity: 0, x: randomStarts[i].x, y: randomStarts[i].y, scale: 0.2, d: dotPath }}
                                                animate={{ opacity: 1, x: 0, y: 0, scale: 1, d: dotPath }}
                                                transition={{
                                                    type: "tween",
                                                    ease: [0.33, 1, 0.68, 1],
                                                    duration: 0.8,
                                                    delay: i * 0.1,
                                                }}
                                                onAnimationComplete={() => {
                                                    if (i === ALPHABET["E"].length - 1) {
                                                        setTimeout(() => {
                                                            setStepIndex((prev) => prev + 1);
                                                        }, 600);
                                                    }
                                                }}
                                            />
                                        );
                                    }

                                    return <path key={`${step}-${i}`} d={dotPath} />;
                                })}
                            </g>
                        </g>
                    </svg>
                )}

                {isLogoPhase ? (
                    <div className="relative w-[90vw] max-w-[800px] flex items-center justify-center flex-shrink-0">
                        {step === "LOGO_BLACK_BG_2" ? (
                            <Image
                                src="/logo-white.svg"
                                alt="Evrything AI Final Logo"
                                width={800}
                                height={800}
                                className="w-full h-auto max-w-full"
                                priority
                            />
                        ) : (
                            <Image
                                src="/logo-black.svg"
                                alt="Evrything AI Final Logo"
                                width={800}
                                height={800}
                                className="w-full h-auto max-w-full"
                                priority
                            />
                        )}
                    </div>
                ) : null}
            </div>

            {/* Custom Coming Soon Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
                            onClick={() => setShowPopup(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-md shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                        >
                            <div className="w-full max-w-md shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                                <ShineBorder borderWidth={2} duration={4} gradient="from-blue-500 via-red-500 to-teal-400" className="w-full">
                                    <Card className="relative h-full rounded-2xl p-8 gap-8 border-0 ring-0 text-left">
                                        <CardHeader className="p-0">
                                            <div className="flex flex-col gap-3 self-stretch">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-2xl font-medium text-primary flex items-center gap-2">
                                                        <Image
                                                            src="/20.svg"
                                                            alt="Momentum OS Logo"
                                                            width={28}
                                                            height={28}
                                                            className="w-7 h-7 shrink-0 object-contain"
                                                        />
                                                        Pre-order Momentum OS
                                                    </CardTitle>
                                                </div>
                                                <CardDescription className="text-base font-normal max-w-2xl text-muted-foreground">
                                                    Secure your lifetime license today.
                                                </CardDescription>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex flex-col flex-1 gap-8 p-0 mt-8">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-foreground text-4xl sm:text-5xl font-medium">
                                                    $30
                                                </span>
                                                <span className="text-muted-foreground text-base font-normal">
                                                    forever
                                                </span>
                                            </div>

                                            <Separator />

                                            <ul className="flex flex-col gap-4 flex-1 mt-4">
                                                <li className="flex items-center gap-3 text-base font-normal text-muted-foreground">
                                                    <Check className="size-4 text-primary shrink-0" />
                                                    7 day free trial, cancel anytime
                                                </li>
                                            </ul>

                                            <button
                                                type="button"
                                                onClick={(e) => e.preventDefault()}
                                                className="w-full h-12 mt-4 text-base font-medium rounded-full cursor-not-allowed opacity-50 bg-[#09090b] text-white flex items-center justify-center transition-none"
                                            >
                                                Coming soon
                                            </button>
                                        </CardContent>
                                    </Card>
                                </ShineBorder>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
