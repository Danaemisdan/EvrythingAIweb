"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentFace, AgentState } from "./AgentFace";

// ── 30-second witty industry slideshow ───────────────────────────────────────
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

const DOCK_ICONS = ["💼", "📄", "📱", "📧", "🏥", "🏠", "🎬", "⚡"];

// ── TTS: tries pre-generated Kokoro audio first, falls back to Web Speech ─────
function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback((text: string, idx: number, onEnd?: () => void) => {
    // Try pre-generated Kokoro audio
    const src = `/audio/demo-${idx}.mp3`;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onended = () => onEnd?.();
    audio.onerror = () => {
      // Fallback: Web Speech API with best available voice
      if (!("speechSynthesis" in window)) { onEnd?.(); return; }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.88; u.pitch = 1.0; u.volume = 1;
      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(v =>
          ["Samantha","Karen","Moira","Fiona","Tessa"].some(n => v.name.includes(n))
        ) || voices.find(v => v.lang.startsWith("en-") && v.localService);
        if (v) u.voice = v;
        if (onEnd) u.onend = onEnd;
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
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function AgentShowcase() {
  const [active, setActive]       = useState(false);
  const [demoIdx, setDemoIdx]     = useState(0);
  const [agentState, setAgentState] = useState<AgentState>("sleeping");
  const { speak, stop }           = useTTS();
  const timer                     = useRef<NodeJS.Timeout | null>(null);
  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  const runDemo = useCallback((idx: number) => {
    if (idx >= DEMOS.length) {
      stop();
      setAgentState("sleeping");
      timer.current = setTimeout(() => { setActive(false); }, 1400);
      return;
    }
    const d = DEMOS[idx];
    setDemoIdx(idx);
    setAgentState(d.agentState);
    speak(d.caption, idx, () => {
      timer.current = setTimeout(() => runDemo(idx + 1), 1000);
    });
  }, [speak, stop]);

  const wake = () => {
    if (active) return;
    clear(); stop();
    setActive(true);
    setAgentState("idle");
    setDemoIdx(0);
    timer.current = setTimeout(() => {
      setAgentState("thinking");
      timer.current = setTimeout(() => runDemo(0), 600);
    }, 500);
  };

  const end = () => { clear(); stop(); setAgentState("sleeping"); timer.current = setTimeout(() => setActive(false), 600); };

  useEffect(() => () => { clear(); stop(); }, [stop]);

  const demo = DEMOS[demoIdx];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none px-4">

      {/* Purple ambient glow — always present, shifts on active */}
      <motion.div
        className="absolute pointer-events-none"
        animate={active
          ? { top: "2%", scale: 0.5, opacity: 0.5 }
          : { top: "50%", scale: 1, opacity: 1, y: "-50%" }}
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
        style={{
          width: 700, height: 700, left: "50%", x: "-50%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,255,0.38) 0%, rgba(80,20,200,0.16) 40%, transparent 70%)",
          filter: "blur(32px)",
          zIndex: 0,
        }}
      />

      {/* Agent face */}
      <motion.div
        className="relative z-20"
        animate={active ? { y: -210, scale: 0.62 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
        onClick={!active ? wake : undefined}
        style={{ cursor: !active ? "pointer" : "default" }}
        whileHover={!active ? { scale: 1.04 } : {}}
        whileTap={!active ? { scale: 0.97 } : {}}
      >
        <AgentFace state={agentState} size={300} />

        {/* Pulse ring */}
        <AnimatePresence>
          {!active && (
            <motion.div key="r" className="absolute rounded-[3.6rem] border border-white/[0.08]"
              style={{ inset: -16 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.93, 1.09, 0.93] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Wake pill */}
      <AnimatePresence>
        {!active && (
          <motion.button key="pill" onClick={wake}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-10 z-10 flex items-center gap-2 px-6 py-3 rounded-full border border-white/12 bg-white/[0.04] text-white/50 text-[14px] font-medium tracking-wide hover:border-white/25 hover:text-white/80 transition-all duration-300"
            style={{ backdropFilter: "blur(16px)", fontFamily: "-apple-system,'SF Pro Text',sans-serif" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/35 animate-pulse" />
            Tap to see Momentum in action
          </motion.button>
        )}
      </AnimatePresence>

      {/* macOS desktop window */}
      <AnimatePresence>
        {active && (
          <motion.div key="win"
            initial={{ opacity: 0, y: 100, scale: 0.93 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: 70, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 200, damping: 28, delay: 0.08 }}
            className="absolute z-10 rounded-2xl overflow-hidden"
            style={{
              top: "50%", width: "min(760px, 92vw)",
              background: "rgba(10,10,14,0.92)",
              backdropFilter: "blur(48px) saturate(200%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 60px 140px rgba(0,0,0,0.85), inset 0 0 0 0.5px rgba(255,255,255,0.04)",
            }}>

            {/* ── Window chrome ── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex gap-1.5">
                <button onClick={end} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md mx-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: demo.appColor }} />
                <AnimatePresence mode="wait">
                  <motion.span key={demoIdx} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }} className="text-white/30 text-[11px] font-mono truncate">
                    {demo.url}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex gap-1.5 shrink-0 mr-1">
                {DEMOS.map((_, i) => (
                  <motion.div key={i}
                    animate={{ width: i === demoIdx ? 16 : 4, opacity: i === demoIdx ? 1 : 0.2 }}
                    style={{ height: 4, borderRadius: 999, background: demo.appColor }}
                    transition={{ duration: 0.25 }} />
                ))}
              </div>
            </div>

            {/* ── Desktop area ── */}
            <div className="relative overflow-hidden" style={{ height: 300 }}>
              {/* Wallpaper */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, #0d0d18 0%, #0a0a12 50%, #080810 100%)" }} />

              {/* Subtle grid */}
              <div className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }} />

              {/* ── App window inside desktop ── */}
              <AnimatePresence mode="wait">
                <motion.div key={demoIdx}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute rounded-xl overflow-hidden"
                  style={{
                    left: "50%", top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "78%",
                    background: "rgba(18,18,24,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 0 0.5px ${demo.appColor}20`,
                  }}>

                  {/* App titlebar */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]"
                    style={{ background: `linear-gradient(90deg, ${demo.appColor}18, transparent)` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                        style={{ background: demo.appColor, color: "#fff" }}>
                        {demo.app[0]}
                      </div>
                      <span className="text-white/60 text-[11px] font-semibold">{demo.app}</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.span key={demoIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-1.5 text-[10px] font-semibold"
                        style={{ color: demo.appColor }}>
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: demo.appColor }} />
                        MOMENTUM ACTIVE
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* App content */}
                  <div className="p-3 flex flex-col gap-1.5">
                    <div className="text-white/25 text-[9px] font-mono tracking-widest uppercase mb-1">{demo.action}</div>
                    {demo.items.map((item, i) => (
                      <motion.div key={`${demoIdx}-${i}`}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.05]"
                        style={{ background: "rgba(255,255,255,0.025)" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background: `${item.c}18`, border: `1px solid ${item.c}30`, color: item.c }}>
                            {item.label[0]}
                          </div>
                          <span className="text-white/70 text-[11px] truncate max-w-[220px]">{item.label}</span>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2"
                          style={{ color: item.c, background: `${item.c}14`, border: `1px solid ${item.c}28` }}>
                          {item.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ── macOS Dock ── */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <div className="flex items-end gap-1.5 px-3 py-2 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                  }}>
                  {DOCK_ICONS.map((icon, i) => (
                    <motion.div key={i}
                      animate={i === demo.dockActive
                        ? { scale: 1.4, y: -6 }
                        : { scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="relative w-8 h-8 rounded-xl flex items-center justify-center text-base"
                      style={{
                        background: i === demo.dockActive
                          ? `linear-gradient(135deg, ${DEMOS[i]?.appColor ?? "#6d28ff"}44, ${DEMOS[i]?.appColor ?? "#6d28ff"}22)`
                          : "rgba(255,255,255,0.06)",
                        border: i === demo.dockActive ? `1px solid ${DEMOS[i]?.appColor ?? "#6d28ff"}50` : "1px solid rgba(255,255,255,0.08)",
                        boxShadow: i === demo.dockActive ? `0 0 16px ${DEMOS[i]?.appColor ?? "#6d28ff"}40` : "none",
                      }}>
                      {icon}
                      {i === demo.dockActive && (
                        <div className="absolute -bottom-1.5 w-1 h-1 rounded-full"
                          style={{ background: DEMOS[i]?.appColor ?? "#6d28ff" }} />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Caption bar ── */}
            <div className="px-5 py-3 border-t border-white/[0.05]"
              style={{ background: "rgba(255,255,255,0.012)" }}>
              <AnimatePresence mode="wait">
                <motion.p key={demoIdx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-white/55 text-[13px] leading-relaxed"
                  style={{ fontFamily: "-apple-system,'SF Pro Text',sans-serif" }}>
                  <span className="text-white/25 text-[10px] font-bold tracking-widest uppercase mr-2"
                    style={{ color: demo.appColor }}>{demo.industry}</span>
                  {demo.caption}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* ── End Agent Mode ── */}
            <div className="flex justify-center py-3 border-t border-white/[0.05]">
              <button onClick={end}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold transition-all hover:brightness-115 active:scale-95"
                style={{
                  color: "#fd5934", background: "rgba(253,89,52,0.09)",
                  border: "1px solid rgba(253,89,52,0.25)",
                  fontFamily: "-apple-system,'SF Pro Text',sans-serif",
                }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                End Agent Mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
