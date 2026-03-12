"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTextCycleProps {
    words: string[];
    interval?: number;
    className?: string; // e.g. text color or specific font styling
}

export function AnimatedTextCycle({ words, interval = 2500, className = "" }: AnimatedTextCycleProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const i = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, interval);
        return () => clearInterval(i);
    }, [words.length, interval]);

    return (
        <span className="relative inline-flex items-center justify-center overflow-hidden h-[1.3em] font-medium min-w-[3em]">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={index}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                    }}
                    className={`absolute block ${className}`}
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
            {/* Invisible measuring element to ensure the container stretches to the widest word */}
            <span className="invisible px-1">{words.reduce((a, b) => a.length > b.length ? a : b)}</span>
        </span>
    );
}