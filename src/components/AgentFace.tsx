"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type AgentState = "idle" | "thinking" | "speaking" | "happy" | "surprised" | "listening" | "error" | "sleeping" | "paused";

interface AgentFaceProps {
  state: AgentState;
  isShuttered?: boolean;
  isVoiceMode?: boolean;
  className?: string;
  size?: number; // face container size in px
}

const EyeStates: Record<AgentState, any> = {
  idle:      { height: 56, width: 16, borderRadius: 8,  rotate: 0,  y: 0,   transition: { type: "spring", bounce: 0.3, duration: 0.5 } },
  listening: { height: 64, width: 22, borderRadius: 11, rotate: 0,  y: 0,   transition: { type: "spring", bounce: 0.4, duration: 0.4 } },
  thinking:  { height: 56, width: 16, borderRadius: 8,  rotate: 0,  y: -10, transition: { type: "spring", bounce: 0.2, duration: 0.6 } },
  speaking:  { height: 46, width: 20, borderRadius: 10, rotate: 0,  y: 0,   transition: { type: "spring", bounce: 0.2, duration: 0.4 } },
  happy:     { height: 10, width: 44, borderRadius: 5,  rotate: 0,  y: -6,  transition: { type: "spring", bounce: 0.5, duration: 0.5 } },
  surprised: { height: 54, width: 54, borderRadius: 27, rotate: 0,  y: -10, transition: { type: "spring", bounce: 0.6, duration: 0.4 } },
  error:     { height: 7,  width: 36, borderRadius: 4,  rotate: 0,  y: 4,   transition: { type: "spring", bounce: 0.3, duration: 0.4 } },
  sleeping:  { height: 4,  width: 30, borderRadius: 2,  rotate: 0,  y: 6,   transition: { type: "spring", bounce: 0.2, duration: 0.8 } },
  paused:    { height: 56, width: 16, borderRadius: 8,  rotate: 0,  y: 0,   transition: { type: "spring", bounce: 0, duration: 0.1 } },
};

export function AgentFace({ state, isShuttered = false, isVoiceMode = false, className, size = 280 }: AgentFaceProps) {
  const currentEye = EyeStates[state] || EyeStates.idle;
  const [isBlinking, setIsBlinking] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 180, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 180, mass: 0.5 });
  const eyeOffsetX = useTransform(smoothX, [-1000, 1000], [-22, 22]);
  const eyeOffsetY = useTransform(smoothY, [-1000, 1000], [-22, 22]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      mouseX.set(dist < 500 ? dx : 0);
      mouseY.set(dist < 500 ? dy : 0);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    const cycle = () => {
      if (!["happy", "error", "sleeping", "paused"].includes(state) && !isShuttered) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 130);
      }
      id = setTimeout(cycle, Math.random() * 4000 + 2500);
    };
    id = setTimeout(cycle, 2500);
    return () => clearTimeout(id);
  }, [state, isShuttered]);

  const leftRot  = state === "happy" ? 15  : state === "error" ? 20  : currentEye.rotate;
  const rightRot = state === "happy" ? -15 : state === "error" ? -20 : currentEye.rotate;

  const eyeGap = Math.round(size * 0.135); // proportional gap

  return (
    <div
      className={cn(
        "relative rounded-[3rem] overflow-hidden flex items-center justify-center bg-[#070708] border-[3px] border-[#1c1c1e]",
        className
      )}
      style={{
        width: size, height: size,
        boxShadow: "0 0 80px rgba(255,255,255,0.07), 0 30px 60px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.9)",
      }}
    >
      {/* Top glass sheen */}
      <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-white/[0.07] to-transparent pointer-events-none -translate-y-3 scale-x-110" />
      {/* Noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.06] mix-blend-overlay pointer-events-none" />

      <motion.div
        style={{
          x: ["sleeping", "error", "paused"].includes(state) || isShuttered || isVoiceMode ? 0 : eyeOffsetX,
          y: ["sleeping", "error", "paused"].includes(state) || isShuttered || isVoiceMode ? 0 : eyeOffsetY,
          gap: eyeGap,
        }}
        className="relative z-10 flex items-center justify-center"
      >
        {[leftRot, rightRot].map((rot, i) => (
          <motion.div
            key={i}
            animate={(isBlinking
              ? { height: 3, transition: { duration: 0.09 } }
              : { ...currentEye, rotate: rot }) as any}
            className="bg-white origin-center"
            style={{ boxShadow: "0 0 28px rgba(255,255,255,0.65), 0 0 56px rgba(255,255,255,0.28)" }}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {isShuttered && (
          <>
            {[{ from: "-100%", to: "0%", pos: "top-0", border: "border-b-2", align: "items-end pb-2" },
              { from: "100%",  to: "0%", pos: "bottom-0", border: "border-t-2", align: "items-start pt-2" }
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ y: s.from }} animate={{ y: s.to }} exit={{ y: s.from }}
                transition={{ type: "spring", bounce: 0.15, stiffness: 220, damping: 22 }}
                className={`absolute ${s.pos} left-0 w-full h-[50.5%] bg-[#1a1a1c] z-50 ${s.border} border-[#2a2a2c] flex ${s.align} justify-center`}
              >
                <div className="w-1/4 h-1 bg-black/50 rounded-full" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
