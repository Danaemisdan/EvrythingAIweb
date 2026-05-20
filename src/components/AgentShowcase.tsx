"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentFace, AgentState } from "./AgentFace";
import { X, Zap, Shield, DollarSign, Bot } from "lucide-react";

// ── Capabilities ─────────────────────────────────────────────────────────────
const CAPABILITIES = [
  {
    id: "outreach",
    agentState: "thinking" as AgentState,
    icon: Bot,
    headline: "Finds leads. Closes deals.",
    speech: "I autonomously scan the web, qualify prospects, and start real conversations — all without you lifting a finger.",
    color: "#fd5934",
    mockLabel: "Outreach Terminal",
    mockItems: ["Sarah Jenkins — VP of Sales", "David Chen — AI Director", "Elena Rodriguez — COO"],
    mockStatuses: ["QUALIFIED", "CONTACTED", "MEETING BOOKED"],
    mockStatusColors: ["#22c55e", "#3b82f6", "#f97316"],
  },
  {
    id: "local",
    agentState: "speaking" as AgentState,
    icon: Shield,
    headline: "Runs on your machine. Fully private.",
    speech: "Your data never leaves your computer. I run entirely on local hardware — no cloud, no API, no one watching.",
    color: "#6366f1",
    mockLabel: "Local Runtime",
    mockItems: ["Model: Qwen2.5-7B (local)", "Status: Running", "Memory: 4.2 GB used"],
    mockStatuses: ["ACTIVE", "ONLINE", "PRIVATE"],
    mockStatusColors: ["#22c55e", "#22c55e", "#a78bfa"],
  },
  {
    id: "automation",
    agentState: "surprised" as AgentState,
    icon: Zap,
    headline: "Automates every app you use.",
    speech: "LinkedIn, Gmail, Twitter, Notion — I connect to everything on your OS and take actions like a human would.",
    color: "#f59e0b",
    mockLabel: "Active Integrations",
    mockItems: ["LinkedIn Outreach", "Gmail Composer", "Twitter Engagement"],
    mockStatuses: ["RUNNING", "RUNNING", "SCHEDULED"],
    mockStatusColors: ["#22c55e", "#22c55e", "#f59e0b"],
  },
  {
    id: "pricing",
    agentState: "happy" as AgentState,
    icon: DollarSign,
    headline: "Pay once. Own it forever.",
    speech: "No subscription. No monthly fee. No rate limits. You buy Momentum OS once and I work for you indefinitely.",
    color: "#10b981",
    mockLabel: "Your License",
    mockItems: ["Momentum OS — Lifetime", "All future updates", "Unlimited usage"],
    mockStatuses: ["PAID", "INCLUDED", "∞"],
    mockStatusColors: ["#10b981", "#10b981", "#10b981"],
  },
];

// ── TTS helper ────────────────────────────────────────────────────────────────
function useTTS() {
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1.0;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Samantha") ||
      v.name.includes("Google UK English Female") ||
      v.name.includes("Karen") ||
      v.name.includes("Moira")
    ) || voices.find(v => v.lang.startsWith("en"));
    if (preferred) utter.voice = preferred;
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}

// ── Main component ────────────────────────────────────────────────────────────
type Phase = "sleeping" | "waking" | "open" | "closing";

export function AgentShowcase() {
  const [phase, setPhase] = useState<Phase>("sleeping");
  const [agentState, setAgentState] = useState<AgentState>("sleeping");
  const [activeCapIdx, setActiveCapIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const { speak, stop } = useTTS();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clear = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  // Wake on click
  const handleWake = () => {
    if (phase !== "sleeping") return;
    clear();
    setPhase("waking");
    setAgentState("idle");
    timerRef.current = setTimeout(() => {
      setAgentState("thinking");
      timerRef.current = setTimeout(() => {
        setPhase("open");
        setActiveCapIdx(0);
        setIsAutoPlaying(true);
      }, 800);
    }, 500);
  };

  // Close window
  const handleClose = () => {
    clear();
    stop();
    setIsAutoPlaying(false);
    setPhase("closing");
    setAgentState("sleeping");
    timerRef.current = setTimeout(() => setPhase("sleeping"), 700);
  };

  // Speak + auto-advance when window opens
  useEffect(() => {
    if (phase !== "open" || !isAutoPlaying) return;
    const cap = CAPABILITIES[activeCapIdx];
    setAgentState(cap.agentState);
    speak(cap.speech, () => {
      if (!isAutoPlaying) return;
      timerRef.current = setTimeout(() => {
        const next = activeCapIdx + 1;
        if (next < CAPABILITIES.length) {
          setActiveCapIdx(next);
        } else {
          setIsAutoPlaying(false);
          setAgentState("idle");
        }
      }, 1200);
    });
    return () => { clear(); stop(); };
  }, [phase, activeCapIdx, isAutoPlaying, speak, stop]);

  // Manual tab select
  const selectCap = (i: number) => {
    clear();
    stop();
    setIsAutoPlaying(false);
    setActiveCapIdx(i);
    const cap = CAPABILITIES[i];
    setAgentState(cap.agentState);
    speak(cap.speech);
  };

  useEffect(() => () => { clear(); stop(); }, [stop]);

  const isSleeping = phase === "sleeping" || phase === "closing";
  const cap = CAPABILITIES[activeCapIdx];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-4 select-none">

      {/* ── Agent face ── */}
      <motion.div
        className="relative"
        style={{ cursor: isSleeping ? "pointer" : "default" }}
        onClick={handleWake}
        whileHover={isSleeping ? { scale: 1.04 } : {}}
        whileTap={isSleeping ? { scale: 0.96 } : {}}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
      >
        <AgentFace
          state={agentState}
          size={260}
          className="md:!w-[300px] md:!h-[300px]"
        />

        {/* Pulse ring */}
        <AnimatePresence>
          {isSleeping && (
            <motion.div
              key="ring"
              className="absolute inset-[-10px] rounded-[3.8rem] border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.95, 1.08, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Wake label */}
        <AnimatePresence>
          {isSleeping && (
            <motion.div
              key="label"
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
            >
              <span className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/12 bg-white/[0.04] backdrop-blur-md text-white/50 text-[13px] font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                Tap to wake the agent
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Capability window ── */}
      <AnimatePresence>
        {phase === "open" && (
          <motion.div
            key="window"
            initial={{ opacity: 0, scale: 0.92, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.94, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[780px] rounded-2xl overflow-hidden"
            style={{
              background: "rgba(18,18,20,0.92)",
              backdropFilter: "blur(40px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.06) inset",
            }}
          >
            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.07]"
              style={{ background: "rgba(255,255,255,0.025)" }}>
              <div className="flex items-center gap-2">
                <button onClick={handleClose}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center group">
                  <X className="w-1.5 h-1.5 text-[#8B0000] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-white/30 text-[12px] font-medium tracking-wide"
                style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
                Momentum OS — What I can do
              </span>
              <div className="w-16" />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.015)" }}>
              {CAPABILITIES.map((c, i) => {
                const Icon = c.icon;
                return (
                  <button key={c.id} onClick={() => selectCap(i)}
                    className="relative flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-medium transition-all duration-200"
                    style={{
                      color: i === activeCapIdx ? c.color : "rgba(255,255,255,0.35)",
                      fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
                    }}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:block">{c.icon === Bot ? "Outreach" : c.icon === Shield ? "Private" : c.icon === Zap ? "Automation" : "Pricing"}</span>
                    {i === activeCapIdx && (
                      <motion.div layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                        style={{ background: c.color }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeCapIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-5"
                >
                  {/* Headline */}
                  <h3 className="text-white text-[22px] font-semibold tracking-tight leading-snug"
                    style={{ fontFamily: "-apple-system, 'SF Pro Display', sans-serif" }}>
                    {cap.headline}
                  </h3>

                  {/* Mock UI card */}
                  <div className="rounded-xl overflow-hidden border border-white/[0.08]"
                    style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                      <span className="text-white/50 text-[11px] font-semibold tracking-widest uppercase"
                        style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
                        {cap.mockLabel}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-medium"
                        style={{ color: cap.color }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cap.color }} />
                        LIVE
                      </span>
                    </div>
                    <div className="divide-y divide-white/[0.05]">
                      {cap.mockItems.map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.3 }}
                          className="flex items-center justify-between px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                              style={{ background: `${cap.color}22`, border: `1px solid ${cap.color}44` }}>
                              {item[0]}
                            </div>
                            <span className="text-white/80 text-[13px]"
                              style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
                              {item}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{
                              color: cap.mockStatusColors[i],
                              background: `${cap.mockStatusColors[i]}15`,
                              border: `1px solid ${cap.mockStatusColors[i]}30`,
                            }}>
                            {cap.mockStatuses[i]}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Video placeholder */}
                  <div className="rounded-xl border border-white/[0.07] overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.02)", aspectRatio: "16/5" }}>
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-transparent border-l-white/30 ml-0.5" />
                      </div>
                      <span className="text-white/20 text-[11px] font-medium tracking-wide"
                        style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
                        Demo video coming soon
                      </span>
                    </div>
                  </div>

                  {/* Progress dots */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {CAPABILITIES.map((_, i) => (
                      <motion.button key={i} onClick={() => selectCap(i)}
                        animate={{ width: i === activeCapIdx ? 20 : 5, opacity: i === activeCapIdx ? 1 : 0.25 }}
                        style={{ height: 5, borderRadius: 999, background: cap.color }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
