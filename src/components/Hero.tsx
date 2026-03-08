"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { E_DOTS } from "./e-dots";
import { V_DOTS } from "./v-dots";

export default function Hero() {
    const [isComplete, setIsComplete] = useState(false);

    // Pre-calculate random entry points for the 16 dots so they don't jitter on re-renders
    const randomStarts = useMemo(() => {
        return E_DOTS.map(() => {
            const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
            const distance = 800; // Decreased distance so they don't fly quite as fast
            switch (side) {
                case 0: return { x: (Math.random() - 0.5) * distance, y: -distance };
                case 1: return { x: distance, y: (Math.random() - 0.5) * distance };
                case 2: return { x: (Math.random() - 0.5) * distance, y: distance };
                case 3: return { x: -distance, y: (Math.random() - 0.5) * distance };
                default: return { x: 0, y: distance };
            }
        });
    }, []);

    return (
        <div
            className={`w-full h-screen flex items-center justify-center overflow-hidden ${isComplete ? "bg-white" : "bg-black"}`}
        >
            {/* Wrap everything in a motion group to scale the SVG to a proper readable size */}
            <motion.svg
                viewBox="0 -280 260 280"
                // w-full with a max width keeps it mobile responsive, and overflow-visible removes the blue clipping boundary
                className="w-full max-w-[60vw] sm:max-w-[400px] h-auto overflow-visible"
                initial={{ opacity: 1 }}
            >
                <g fill={isComplete ? "#000000" : "#ffffff"}>
                    {!isComplete && E_DOTS.map((dotPath, i) => {
                        // Very last dot might be just an 'M...' ending, ignore it if too short
                        if (dotPath.length < 10) return null;

                        const start = randomStarts[i];

                        return (
                            <motion.path
                                key={`e-${i}`}
                                // Start entirely offscreen from a random edge
                                initial={{ opacity: 0, x: start.x, y: start.y, scale: 0.2, d: dotPath }}
                                // Move into their exact predefined native SVG coordinates
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 1,
                                    d: dotPath
                                }}
                                // Solid, fast snap into place with absolutely zero bounce
                                transition={{
                                    type: "tween",
                                    ease: [0.33, 1, 0.68, 1], // Sturdy easeOutCubic curve
                                    duration: 0.8, // Slower flight so it's visible
                                    delay: i * 0.1, // Slower staggered delay
                                }}
                                // Wait exactly 0.2 seconds after the E locks into place, then hard cut to V array
                                onAnimationComplete={() => {
                                    if (i === E_DOTS.length - 1) {
                                        setTimeout(() => setIsComplete(true), 200);
                                    }
                                }}
                            />
                        );
                    })}
                    {isComplete && V_DOTS.map((dotPath, i) => {
                        if (dotPath.length < 10) return null;
                        return <path key={`v-${i}`} d={dotPath} />;
                    })}
                </g>
            </motion.svg>
        </div>
    );
}
