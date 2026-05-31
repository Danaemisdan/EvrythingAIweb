"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentFace, AgentState } from "./AgentFace";

// ── TTS Hook: plays pre-generated Kokoro audio tracks ──────────────────────
function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = useCallback((idx: number, onEnd?: () => void) => {
    setIsPlaying(true);
    const src = `/audio/demo-${idx}.mp3`;
    const audio = new Audio(src);
    audioRef.current = audio;
    
    audio.onended = () => {
      setIsPlaying(false);
      onEnd?.();
    };
    
    audio.onerror = () => {
      setIsPlaying(false);
      onEnd?.();
    };
    audio.play().catch(() => {
      setIsPlaying(false);
      onEnd?.();
    });
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { speak, stop, isPlaying };
}

// ── SVG Liquid Glass Filter Component ──────────────────────────────────────────
const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="120"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

// ── Glass Effect Wrapper Component ───────────────────────────────────────────
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  onMouseEnter,
  onMouseLeave,
}) => {
  const glassStyle = {
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.25), 0 0 32px rgba(0, 0, 0, 0.15)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    ...style,
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative flex overflow-hidden cursor-pointer transition-all duration-500 ${className}`}
      style={glassStyle}
    >
      {/* Liquid Glass Distortion Layer */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-3xl"
        style={{
          backdropFilter: "blur(8px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      {/* Frosted Base tint */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: "rgba(255, 255, 255, 0.03)" }}
      />
      {/* Specular Light Double Inset borders */}
      <div
        className="absolute inset-0 z-20 rounded-3xl overflow-hidden pointer-events-none"
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.08), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.04)",
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-30 w-full h-full flex flex-col">{children}</div>
    </div>
  );
};

// ── Voice Waveform Equalizer Component ──────────────────────────────────────────
function Equalizer({ isSpeaking, accentColor }: { isSpeaking: boolean; accentColor: string }) {
  const bars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <div className="flex items-center gap-1.5 h-10 mt-5 justify-center">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: isSpeaking ? accentColor : "rgba(255, 255, 255, 0.15)",
            boxShadow: isSpeaking ? `0 0 10px ${accentColor}` : "none",
            transition: "background-color 0.3s ease",
          }}
          animate={isSpeaking ? {
            height: [8, Math.random() * 28 + 8, 8],
          } : {
            height: 4
          }}
          transition={isSpeaking ? {
            duration: Math.random() * 0.35 + 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.03
          } : {
            duration: 0.3
          }}
        />
      ))}
    </div>
  );
}

// ── The 4 Workspace Categories/Capabilities ──────────────────────────────────
const CAPABILITIES = [
  {
    title: "Work Assigned",
    description: "Tasks & issues sync'd to board",
    dialogue: "I already assigned today’s tasks. Open the damn board and finish them.",
    accentColor: "#6d28ff", // Tech Purple
    specs: ["Git PR tracker", "Jira/Linear board sync", "Status reports"]
  },
  {
    title: "Calendar Cleaned",
    description: "Decluttering useless meetings",
    dialogue: "I cleaned the schedule. Don’t add another useless meeting and ruin it.",
    accentColor: "#c96442", // Action Orange
    specs: ["Duplicate filter", "Focus time blocker", "Smart rescheduling"]
  },
  {
    title: "Deals Tracked",
    description: "Warm pipelines & cash status",
    dialogue: "We have warm leads waiting. Stop behaving like revenue is optional.",
    accentColor: "#10b981", // Emerald Green
    specs: ["Stripe triggers", "Follow-up triggers", "Hubspot CRM sync"]
  },
  {
    title: "Gaps Identified",
    description: "Project blockers & velocity logs",
    dialogue: "I found the blocker. It’s not strategy. It’s people delaying obvious work.",
    accentColor: "#ea4335", // Alert Red
    specs: ["Friction alerts", "Dependency checks", "Deliverables checks"]
  }
];

// ── Main Component ────────────────────────────────────────────────────────────
interface AgentShowcaseProps {
  scrollYProgress?: any;
}

export function AgentShowcase({ scrollYProgress }: AgentShowcaseProps = {}) {
  const [active, setActive] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>("sleeping");
  
  const { speak, stop, isPlaying } = useTTS();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Trigger wake greeting
  const wake = () => {
    if (active) return;
    setActive(true);
    setAgentState("idle");
    stop();
    speak(0); // Plays Dialogue 0 (Greeting)
  };

  // Mouse hover events for the 4 capability cards
  const handleMouseEnter = (idx: number) => {
    if (!active) return;
    setHoveredIdx(idx);
    setAgentState("speaking");
    stop();
    speak(idx + 1); // Plays dialogue matching capability index
  };

  const handleMouseLeave = () => {
    if (!active) return;
    setHoveredIdx(null);
    setAgentState("idle");
    stop();
  };

  // Reset demo environment
  const resetDemo = () => {
    stop();
    setActive(false);
    setAgentState("sleeping");
    setHoveredIdx(null);
  };

  // Active theme specs
  const activeColor = hoveredIdx !== null ? CAPABILITIES[hoveredIdx].accentColor : "#a78bfa";
  const currentFaceState = isPlaying ? "speaking" : agentState;
  
  const activeDialogueText = hoveredIdx !== null 
    ? CAPABILITIES[hoveredIdx].dialogue 
    : "I just completed this. Today the developer is not available, but I can complete the project by taking all the requirements from the client.";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none px-4 lg:px-8">
      <GlassFilter />

      {/* Background Soft Glow Ring — adapts color smoothly on hover */}
      <motion.div
        className="absolute pointer-events-none transition-all duration-[600ms]"
        style={{
          width: 700, height: 700, left: "50%", top: "50%", x: "-50%", y: "-50%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeColor}22 0%, rgba(10,10,14,0) 70%)`,
          filter: "blur(54px)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-[1150px] flex flex-col items-center gap-6">
        
        {/* Top Header System Status bar */}
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex justify-between items-center px-4"
            >
              <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest text-white/35 uppercase">
                <span>[ system status active ]</span>
                <span className="hidden md:inline">•</span>
                <span className="text-emerald-400 font-semibold">0 cloud bytes sent (local only)</span>
              </div>
              <button
                onClick={resetDemo}
                className="text-[10px] font-mono tracking-widest text-white/40 hover:text-white/80 transition-colors uppercase border border-white/10 hover:border-white/20 px-3 py-1 rounded-full"
              >
                Reset Standby
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Twin Panel Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch justify-center">
          
          {/* 1. LEFT COLUMN: Agent Face & Local Hardware Spec telemetry */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            <motion.div
              onClick={!active ? wake : undefined}
              className={`relative rounded-[3.6rem] transition-all duration-500 ${
                !active 
                  ? "cursor-pointer active:scale-[0.98]" 
                  : "cursor-default"
              }`}
              animate={active ? { scale: 0.82, y: -10 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 22 }}
            >
              <AgentFace state={currentFaceState} size={280} />
              
              {/* Standby Pulse */}
              <AnimatePresence>
                {!active && (
                  <motion.div
                    key="sleep-pulse"
                    className="absolute rounded-[3.6rem] border border-white/[0.08]"
                    style={{ inset: -15 }}
                    animate={{ opacity: [0, 0.7, 0], scale: [0.94, 1.1, 0.94] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Standby System Prompt / Voice Waveform */}
            <AnimatePresence mode="wait">
              {!active ? (
                <motion.div
                  key="standby-prompt"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={wake}
                  className="flex flex-col items-center gap-2 mt-8 text-center cursor-pointer"
                >
                  <span className="text-[10px] font-mono tracking-[0.35em] text-[#a78bfa] uppercase animate-pulse">
                    [ Standby Mode ]
                  </span>
                  <p className="text-white/40 text-[13px] tracking-wide max-w-[280px]">
                    Click the agent container to wake and open workspace dashboard.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="equalizer-wrapper"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full flex flex-col items-center mt-3 text-center"
                >
                  <Equalizer isSpeaking={isPlaying} accentColor={activeColor} />
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* 2. RIGHT COLUMN: 4 Workspace Capability Cards in Liquid Glass */}
          <div className="lg:col-span-7 flex flex-col justify-center min-h-[360px] lg:min-h-0">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key="active-capabilities"
                  initial={{ opacity: 0, x: 40, filter: "blur(15px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 40, filter: "blur(15px)" }}
                  className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {CAPABILITIES.map((cap, idx) => (
                    <GlassEffect
                      key={idx}
                      onMouseEnter={() => handleMouseEnter(idx)}
                      onMouseLeave={handleMouseLeave}
                      className={`h-[150px] p-5 rounded-3xl transition-all duration-300 relative ${
                        hoveredIdx === idx ? "shadow-[0_0_30px_rgba(255,255,255,0.02)] scale-[1.02]" : "scale-100"
                      }`}
                      style={{
                        borderColor: hoveredIdx === idx ? `${cap.accentColor}50` : "rgba(255,255,255,0.06)",
                        boxShadow: hoveredIdx === idx ? `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${cap.accentColor}0f` : "none",
                      }}
                    >
                      {/* Top Accent corner bar */}
                      <div 
                        className="absolute top-0 right-0 w-8 h-8 rounded-tr-3xl rounded-bl-xl opacity-20 transition-opacity duration-300"
                        style={{ background: cap.accentColor }}
                      />

                      <div className="flex flex-col h-full">
                        <div className="flex flex-col gap-0.5">
                          <span 
                            className="text-[9px] font-mono tracking-widest uppercase transition-colors"
                            style={{ color: hoveredIdx === idx ? cap.accentColor : "rgba(255,255,255,0.4)" }}
                          >
                            Capability // 0{idx + 1}
                          </span>
                          <h4 className="text-[15px] font-bold text-white mt-0.5">{cap.title}</h4>
                          <p className="text-[11px] text-white/50 font-normal leading-tight mt-1">{cap.description}</p>
                        </div>
                        
                        {/* Specs bullet tags */}
                        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                          {cap.specs.slice(0, 2).map((spec, i) => (
                            <span 
                              key={i} 
                              className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/[0.04] bg-white/[0.01] text-white/35"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </GlassEffect>
                  ))}
                </motion.div>
              ) : (
                <div className="hidden lg:flex items-center justify-center h-full text-center text-white/10 font-mono select-none">
                  <div className="flex flex-col gap-2">
                    <span className="text-4xl">❖</span>
                    <span className="text-[10px] tracking-[0.25em] uppercase">dashboard standby</span>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* 3. BOTTOM SECTION: Sarcastic Dialogue Display Card */}
        <div className="w-full mt-6 flex justify-center min-h-[120px] lg:min-h-0">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={hoveredIdx !== null ? hoveredIdx : "greeting"}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                transition={{ duration: 0.38 }}
                className="w-full max-w-[860px] text-center rounded-[2.2rem]"
              >
                <GlassEffect 
                  className="p-6 sm:p-7 transition-colors duration-500 rounded-3xl"
                  style={{
                    borderColor: hoveredIdx !== null ? `${CAPABILITIES[hoveredIdx].accentColor}25` : "rgba(255,255,255,0.06)",
                    boxShadow: hoveredIdx !== null ? `0 20px 50px rgba(0,0,0,0.65), 0 0 30px ${CAPABILITIES[hoveredIdx].accentColor}0a` : "none"
                  }}
                >
                  <p 
                    className="text-white/95 text-base sm:text-lg font-medium leading-relaxed tracking-tight select-text"
                    style={{
                      textShadow: hoveredIdx !== null ? `0 0 30px ${CAPABILITIES[hoveredIdx].accentColor}10` : "none"
                    }}
                  >
                    &ldquo;{activeDialogueText}&rdquo;
                  </p>
                </GlassEffect>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
export default AgentShowcase;
