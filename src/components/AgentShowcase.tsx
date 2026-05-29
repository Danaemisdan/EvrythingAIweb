"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValueEvent, MotionValue } from "framer-motion";
import { AgentFace, AgentState } from "./AgentFace";

// ── 30-second witty industry data ───────────────────────────────────────────
const DEMOS = [
  {
    agentState: "thinking" as AgentState,
    industry: "Sales",
    caption: "Closed 3 SaaS deals while you were in a meeting about why sales is slow.",
    action: "Sending follow-up #7 to Marcus Chen · AcmeCorp",
    app: "CRM",
    appColor: "#0077b5",
    url: "salesforce.com/leads/pipeline",
    items: [
      { label: "Marcus Chen — CTO, AcmeCorp",       status: "DEAL CLOSED",    c: "#22c55e" },
      { label: "Sarah Williams — VP Sales, Stripe",  status: "CALL BOOKED",    c: "#3b82f6" },
      { label: "Rahul Sharma — Founder, Scale.ai",   status: "PROPOSAL SENT",  c: "#f59e0b" },
    ],
    dockActive: 0,
  },
  {
    agentState: "speaking" as AgentState,
    industry: "Legal",
    caption: "Drafted 12 NDAs for your firm. Your paralegal thought you hired someone.",
    action: "Generating contract · Non-Disclosure Agreement v3",
    app: "Docs",
    appColor: "#4285f4",
    url: "docs.google.com/drafts/nda-template",
    items: [
      { label: "NDA — Nexus Ventures",         status: "SIGNED",    c: "#22c55e" },
      { label: "NDA — BlueRock Capital",       status: "SENT",      c: "#3b82f6" },
      { label: "Service Agreement — TechFlow", status: "DRAFTING",  c: "#f59e0b" },
    ],
    dockActive: 1,
  },
  {
    agentState: "surprised" as AgentState,
    industry: "E-commerce",
    caption: "Replied to 847 customer DMs. Each felt personal. Zero were written by you.",
    action: "Responding to @sneakerhead_official · Instagram",
    app: "Instagram",
    appColor: "#e1306c",
    url: "instagram.com/direct/inbox",
    items: [
      { label: "@sneakerhead_official — refund?",  status: "RESOLVED",   c: "#22c55e" },
      { label: "@maya.buys — where is my order?",  status: "REPLIED",    c: "#22c55e" },
      { label: "@luxehome — collab inquiry",        status: "ESCALATED",  c: "#f97316" },
    ],
    dockActive: 2,
  },
  {
    agentState: "thinking" as AgentState,
    industry: "Startups",
    caption: "Pitched 40 VCs your deck. 3 replied. You have dinner plans now.",
    action: "Sending cold email · Sequoia Capital partner@sequoia.com",
    app: "Gmail",
    appColor: "#ea4335",
    url: "mail.google.com/compose/vc-outreach",
    items: [
      { label: "Sequoia Capital — Roelof Botha",  status: "OPENED ×3",   c: "#22c55e" },
      { label: "a16z — Marc Andreessen",           status: "REPLIED",     c: "#6366f1" },
      { label: "Accel — Sonali De Rycker",         status: "SENT",        c: "#f59e0b" },
    ],
    dockActive: 3,
  },
  {
    agentState: "happy" as AgentState,
    industry: "Healthcare",
    caption: "Booked your clinic solid for 6 weeks. Your receptionist is shook.",
    action: "Confirming appointment · Dr. Patel Orthopedic Clinic",
    app: "Calendar",
    appColor: "#22c55e",
    url: "calendar.google.com/clinic-schedule",
    items: [
      { label: "Mon 9:00 AM — James Walker",    status: "CONFIRMED",  c: "#22c55e" },
      { label: "Mon 10:30 AM — Priya Nair",     status: "CONFIRMED",  c: "#22c55e" },
      { label: "Tue–Fri — 34 appointments",     status: "FILLED",     c: "#10b981" },
    ],
    dockActive: 4,
  },
  {
    agentState: "speaking" as AgentState,
    industry: "Real Estate",
    caption: "Found 23 buyers for your listings. Scheduled tours. Still 9am.",
    action: "Qualifying lead · 3BR Ocean View · $1.2M listing",
    app: "Zillow",
    appColor: "#006aff",
    url: "zillow.com/leads/active",
    items: [
      { label: "The Rodriguezes — 3BR Ocean View",   status: "TOURING SAT",  c: "#22c55e" },
      { label: "Tom Henderson — Downtown Loft",       status: "OFFER MADE",   c: "#3b82f6" },
      { label: "Meera Singh — Suburban Family Home",  status: "QUALIFIED",    c: "#f59e0b" },
    ],
    dockActive: 5,
  },
  {
    agentState: "surprised" as AgentState,
    industry: "Content",
    caption: "Posted, clipped, captioned, and grew 2k subs. You were at brunch.",
    action: "Uploading short · 'How I built a $1M business in 90 days'",
    app: "YouTube",
    appColor: "#ff0000",
    url: "studio.youtube.com/upload/shorts",
    items: [
      { label: "Reel — '5 AI tools you need'",     status: "+1.2K VIEWS",   c: "#22c55e" },
      { label: "Thread — startup lessons",          status: "+847 LIKES",    c: "#1da1f2" },
      { label: "Newsletter — issue #14",            status: "SENT · 4.2K",   c: "#f59e0b" },
    ],
    dockActive: 6,
  },
  {
    agentState: "idle" as AgentState,
    industry: "All of it.",
    caption: "No cloud. No subscriptions. No one watching. Just me. On your machine. Forever.",
    action: "Running locally · Qwen2.5-7B · 0 API calls · 0 data sent",
    app: "Terminal",
    appColor: "#a78bfa",
    url: "momentum.local/runtime",
    items: [
      { label: "Data sent to cloud",         status: "0 BYTES",    c: "#22c55e" },
      { label: "Monthly subscription cost",  status: "$0.00",      c: "#22c55e" },
      { label: "Tasks completed today",      status: "∞",          c: "#a78bfa" },
    ],
    dockActive: 7,
  },
];

// ── TTS Hook: plays pre-generated Kokoro audio first, falls back to Web Speech ─────
function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = useCallback((text: string, idx: number, onEnd?: () => void) => {
    setIsPlaying(true);
    // Try pre-generated Kokoro audio
    const src = `/audio/demo-${idx}.mp3`;
    const audio = new Audio(src);
    audioRef.current = audio;
    
    audio.onended = () => {
      setIsPlaying(false);
      onEnd?.();
    };
    
    audio.onerror = () => {
      // Fallback: Web Speech API with best available voice
      if (!("speechSynthesis" in window)) {
        setIsPlaying(false);
        onEnd?.();
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.88; u.pitch = 1.0; u.volume = 1;
      
      u.onend = () => {
        setIsPlaying(false);
        onEnd?.();
      };
      u.onerror = () => {
        setIsPlaying(false);
        onEnd?.();
      };

      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(v =>
          ["Samantha","Karen","Moira","Fiona","Tessa"].some(n => v.name.includes(n))
        ) || voices.find(v => v.lang.startsWith("en-") && v.localService);
        if (v) u.voice = v;
        window.speechSynthesis.speak(u);
      };
      
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = trySpeak;
      } else {
        trySpeak();
      }
    };
    audio.play().catch(() => audio.onerror?.(new Event("error")));
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop, isPlaying };
}

// ── Voice Waveform Equalizer Component ──────────────────────────────────────────
function Equalizer({ isSpeaking }: { isSpeaking: boolean }) {
  const bars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="flex items-center gap-1.5 h-10 mt-6 justify-center">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-[#6d28ff] to-[#a78bfa]"
          style={{
            boxShadow: "0 0 10px rgba(109,40,255,0.5)",
          }}
          animate={isSpeaking ? {
            height: [10, Math.random() * 32 + 10, 10],
          } : {
            height: 4
          }}
          transition={isSpeaking ? {
            duration: Math.random() * 0.4 + 0.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.04
          } : {
            duration: 0.3
          }}
        />
      ))}
    </div>
  );
}

interface AgentShowcaseProps {
  scrollYProgress?: MotionValue<number>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AgentShowcase({ scrollYProgress }: AgentShowcaseProps) {
  const [active, setActive] = useState(false);
  const [demoIdx, setDemoIdx] = useState(0);
  const [agentState, setAgentState] = useState<AgentState>("sleeping");
  const { speak, stop, isPlaying } = useTTS();
  const [lastPlayedIdx, setLastPlayedIdx] = useState<number>(-1);

  // Monitor scroll progress if provided
  useMotionValueEvent(scrollYProgress || new MotionValue(0), "change", (latest) => {
    if (!scrollYProgress) return;
    
    // Agent is active between scroll progress 0.35 and 0.61
    const start = 0.35;
    const end = 0.61;
    const range = end - start;
    
    if (latest >= start && latest <= end) {
      setActive(true);
      const rel = (latest - start) / range;
      const idx = Math.min(7, Math.floor(rel * 8));
      setDemoIdx(idx);
      setAgentState(DEMOS[idx].agentState);
    } else {
      setActive(false);
      setAgentState("sleeping");
    }
  });

  // Handle TTS narration triggered by scroll position changes
  useEffect(() => {
    if (active && demoIdx >= 0 && demoIdx < 8) {
      if (demoIdx !== lastPlayedIdx) {
        stop();
        const timer = setTimeout(() => {
          speak(DEMOS[demoIdx].caption, demoIdx);
          setLastPlayedIdx(demoIdx);
        }, 200); // 200ms debounce
        return () => clearTimeout(timer);
      }
    } else {
      stop();
      setLastPlayedIdx(-1);
    }
  }, [demoIdx, active, speak, stop, lastPlayedIdx]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const demo = DEMOS[demoIdx];

  // Dynamic eye state: use speaking state when TTS audio is playing
  const currentFaceState = active 
    ? (isPlaying ? "speaking" : agentState)
    : "sleeping";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none px-4 lg:px-8">
      
      {/* Dynamic Background Ambient Light Glow — morphs color to match active app */}
      <motion.div
        className="absolute pointer-events-none transition-all duration-[800ms]"
        animate={active
          ? { scale: 0.85, opacity: 0.45 }
          : { scale: 1, opacity: 0.35 }}
        style={{
          width: 700, height: 700, left: "50%", top: "50%", x: "-50%", y: "-50%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${active ? demo.appColor : "rgba(109,40,255,1)"}38 0%, rgba(20,20,30,0) 70%)`,
          filter: "blur(48px)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-[1300px] flex flex-col items-center justify-center">
        
        {/* Main Grid Container — Left Panel, Center Face, Right Panel */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
          
          {/* 1. Left Column: HUD Panel (Objective & Status) */}
          <div className="lg:col-span-4 h-full flex items-center justify-center lg:justify-end min-h-[300px] lg:min-h-0">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={demoIdx}
                  initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                  className="w-full max-w-[360px] flex flex-col gap-4 border border-white/[0.06] bg-[#070709]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] shadow-2xl relative overflow-hidden"
                  style={{
                    boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 40px ${demo.appColor}0a`,
                    borderColor: `${demo.appColor}22`,
                  }}
                >
                  {/* Neon top border light */}
                  <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono tracking-[0.25em] text-white/30 uppercase">
                      MOMENTUM OS // ACTIVE_AGENT
                    </span>
                    <h4 className="text-2xl font-bold tracking-tight text-white mt-1">
                      {demo.industry}
                    </h4>
                  </div>

                  <div className="flex flex-col gap-2.5 p-4 rounded-2xl border border-white/[0.05] bg-white/[0.015] backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
                        style={{
                          background: demo.appColor,
                          boxShadow: `0 0 10px ${demo.appColor}`,
                        }}
                      />
                      <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">
                        Target Channel
                      </span>
                    </div>
                    <div className="text-white text-[15px] font-bold">{demo.app}</div>
                    <div className="text-white/30 text-xs font-mono select-all truncate">{demo.url}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-white/30 text-[10px] font-mono uppercase tracking-wider">
                      Current Objective
                    </span>
                    <div
                      className="text-xs font-mono font-medium p-3.5 rounded-xl border border-white/[0.06] leading-relaxed break-words"
                      style={{
                        color: demo.appColor,
                        background: `${demo.appColor}06`,
                        borderColor: `${demo.appColor}15`,
                      }}
                    >
                      &gt; {demo.action}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. Center Column: Agent Face & Speech Equalizer Wave */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-6">
            <motion.div
              className="relative"
              animate={active ? { scale: 0.85, y: -10 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 22 }}
            >
              <AgentFace state={currentFaceState} size={280} />
              
              {/* Standby Pulse Ring when sleeping */}
              <AnimatePresence>
                {!active && (
                  <motion.div
                    key="sleep-ring"
                    className="absolute rounded-[3.6rem] border border-white/[0.08]"
                    style={{ inset: -20 }}
                    animate={{ opacity: [0, 0.7, 0], scale: [0.93, 1.12, 0.93] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Standby System Prompt / Voice Equalizer */}
            <AnimatePresence mode="wait">
              {!active ? (
                <motion.div
                  key="standby-prompt"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-2.5 mt-8 text-center"
                >
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[#a78bfa] uppercase animate-pulse">
                    [ SYSTEM STANDBY ]
                  </span>
                  <p className="text-white/40 text-[13px] tracking-wide max-w-[280px]">
                    Scroll down to trigger the local agent and start OS runtime.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="equalizer-wrapper"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Equalizer isSpeaking={isPlaying} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Right Column: HUD Panel (Real-Time Execution Logs) */}
          <div className="lg:col-span-4 h-full flex items-center justify-center lg:justify-start min-h-[300px] lg:min-h-0">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={demoIdx}
                  initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                  className="w-full max-w-[360px] flex flex-col gap-4 border border-white/[0.06] bg-[#070709]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] shadow-2xl relative overflow-hidden"
                  style={{
                    boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 40px ${demo.appColor}0a`,
                    borderColor: `${demo.appColor}22`,
                  }}
                >
                  {/* Neon top border light */}
                  <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono tracking-[0.25em] text-white/30 uppercase">
                      OS RUNTIME // EXEC_LOGS
                    </span>
                    <h4 className="text-sm font-semibold tracking-wide text-white/60 mt-1 uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live Thread
                    </h4>
                  </div>

                  <div className="flex flex-col gap-3">
                    {demo.items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08, type: "spring", stiffness: 140, damping: 18 }}
                        className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-white/[0.015]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background: `${item.c}14`, border: `1px solid ${item.c}25`, color: item.c }}
                          >
                            {item.label[0]}
                          </div>
                          <span className="text-white/70 text-[12px] font-medium truncate">
                            {item.label}
                          </span>
                        </div>
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 border"
                          style={{ color: item.c, background: `${item.c}0b`, borderColor: `${item.c}20` }}
                        >
                          {item.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* 4. Bottom Row: Caption Card (Dynamic text description) */}
        <div className="w-full mt-10 lg:mt-12 flex justify-center min-h-[140px] lg:min-h-0">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={demoIdx}
                initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[840px] text-center p-6 lg:p-7 rounded-[2rem] border border-white/[0.06] bg-black/60 backdrop-blur-2xl relative overflow-hidden"
                style={{
                  boxShadow: `0 30px 70px rgba(0,0,0,0.65), 0 0 50px ${demo.appColor}0c`,
                  borderColor: `${demo.appColor}22`,
                }}
              >
                {/* Micro glow halo */}
                <div
                  className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full pointer-events-none filter blur-[32px] opacity-15 transition-colors duration-500"
                  style={{ background: demo.appColor }}
                />

                <p className="text-white/90 text-lg sm:text-[20px] font-medium leading-relaxed tracking-tight select-text">
                  {demo.caption}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
