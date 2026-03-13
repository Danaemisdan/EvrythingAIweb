"use client";

import React from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

export function LeadGeneration() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-white px-4">
            <h2 
                className="text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] font-bold tracking-tight text-center leading-[1.1] mb-8 font-[-apple-system,BlinkMacSystemFont,'SF_Pro',sans-serif] drop-shadow-2xl"
                style={{ textShadow: "0 4px 60px rgba(0,0,0,0.8)" }}
            >
                Finds leads.<br />
                <span className="text-[#fd5934]">Does the talking.</span>
            </h2>
            <div className="max-w-xl text-center">
                <p className="text-[#a0a0a0] text-lg sm:text-xl font-medium tracking-tight">
                    Momentum OS autonomously sources qualified leads, engages them in human-like conversation, and pushes them down the funnel while you sleep.
                </p>
            </div>
        </div>
    );
}
