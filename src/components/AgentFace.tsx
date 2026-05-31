"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type AgentState = "idle" | "thinking" | "speaking" | "happy" | "surprised" | "listening" | "error" | "sleeping";

interface AgentFaceProps {
  state: AgentState;
  isShuttered?: boolean;
  isVoiceMode?: boolean;
  className?: string;
  size?: number; // face container size in px
}

const EyeStates = {
  idle:      { height: 20, width: 54, borderRadius: 10, rotate: 0,  y: 0,   transition: { type: "spring", bounce: 0.3, duration: 0.5 } },
  listening: { height: 26, width: 62, borderRadius: 13, rotate: 0,  y: 0,   transition: { type: "spring", bounce: 0.4, duration: 0.4 } },
  thinking:  { height: 20, width: 54, borderRadius: 10, rotate: 0,  y: -8, transition: { type: "spring", bounce: 0.2, duration: 0.6 } },
  speaking:  { height: 24, width: 50, borderRadius: 12, rotate: 0,  y: 0,   transition: { type: "spring", bounce: 0.2, duration: 0.4 } },
  happy:     { height: 12, width: 52, borderRadius: 6,  rotate: 0,  y: -6,  transition: { type: "spring", bounce: 0.5, duration: 0.5 } },
  surprised: { height: 48, width: 48, borderRadius: 24, rotate: 0,  y: -8,  transition: { type: "spring", bounce: 0.6, duration: 0.4 } },
  error:     { height: 8,  width: 44, borderRadius: 4,  rotate: 0,  y: 4,   transition: { type: "spring", bounce: 0.3, duration: 0.4 } },
  sleeping:  { height: 4,  width: 36, borderRadius: 2,  rotate: 0,  y: 0,   transition: { type: "spring", bounce: 0.2, duration: 0.8 } },
};

export function AgentFace({ state, isShuttered = false, isVoiceMode = false, className, size = 280 }: AgentFaceProps) {
  const currentEye = EyeStates[state] || EyeStates.idle;
  const [isBlinking, setIsBlinking] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 180, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 180, mass: 0.5 });
  const eyeOffsetX = useTransform(smoothX, [-1000, 1000], [-18, 18]);
  const eyeOffsetY = useTransform(smoothY, [-1000, 1000], [-18, 18]);

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
      if (!["happy", "error", "sleeping"].includes(state) && !isShuttered) {
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

  const rotateX = useTransform(smoothY, [-1000, 1000], [12, -12]);
  const rotateY = useTransform(smoothX, [-1000, 1000], [-12, 12]);

  const eyeGap = Math.round(size * 0.11); // proportional gap

  return (
    <motion.div
      className={cn(
        "relative rounded-[3.6rem] overflow-hidden flex items-center justify-center transition-all duration-500 origin-center",
        state === "sleeping" 
          ? "bg-[#0c0915] border-[3px] border-[#581c87]/30 shadow-[0_0_60px_rgba(88,28,135,0.2)]" 
          : "bg-[#100d20] border-[3px] border-[#a855f7] shadow-[0_0_80px_rgba(168,85,247,0.45)]",
        className
      )}
      style={{
        width: size, height: size,
        rotateX: ["sleeping", "error"].includes(state) || isShuttered || isVoiceMode ? 0 : rotateX,
        rotateY: ["sleeping", "error"].includes(state) || isShuttered || isVoiceMode ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {/* Outer casing metallic bezel */}
      <div className="absolute inset-0 border-[6px] border-[#1b152d] rounded-[3.3rem] pointer-events-none z-20" style={{ transform: "translateZ(5px)" }} />
      <div className="absolute inset-[6px] border border-[#2d254c]/60 rounded-[3rem] pointer-events-none z-20" style={{ transform: "translateZ(10px)" }} />

      {/* Screen Faceplate inside the casing */}
      <div 
        className="absolute inset-[7px] bg-[#07050d] rounded-[2.9rem] overflow-hidden flex items-center justify-center z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.95)]"
        style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }}
      >
        {/* Ambient background particles (like stars/sparkles in AIbot2.mp4) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute w-1 h-1 bg-[#d8b4fe] rounded-full top-[20%] left-[15%] animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute w-1 h-1 bg-[#d8b4fe] rounded-full bottom-[25%] right-[20%] animate-ping" style={{ animationDuration: '4.5s' }} />
        </div>

        {/* Specular glare overlay (diagonal gloss sheen) */}
        <div 
          className="absolute top-0 left-0 w-full h-[65%] bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.07] pointer-events-none"
          style={{
            clipPath: "ellipse(100% 60% at 50% 0%)"
          }}
        />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none" />

        {/* Eyes Group */}
        <motion.div
          style={{
            x: ["sleeping", "error"].includes(state) || isShuttered || isVoiceMode ? 0 : eyeOffsetX,
            y: ["sleeping", "error"].includes(state) || isShuttered || isVoiceMode ? 0 : eyeOffsetY,
            gap: eyeGap,
            transform: "translateZ(30px)",
          }}
          className="relative z-10 flex items-center justify-center"
        >
          {[leftRot, rightRot].map((rot, i) => (
            <motion.div
              key={i}
              animate={(isBlinking
                ? { height: 4, transition: { duration: 0.09 } }
                : { ...currentEye, rotate: rot }) as any}
              className="bg-[#fbf7ff] origin-center"
              style={{ 
                boxShadow: "0 0 16px #c084fc, 0 0 32px #8b5cf6, 0 0 60px rgba(139, 92, 246, 0.6), inset 0 2px 3px #ffffff"
              }}
            />
          ))}
        </motion.div>
      </div>

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
    </motion.div>
  );
}
