"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentFace, AgentState } from "./AgentFace";

const DEMOS = [
  {
    agentState: "thinking" as AgentState,
    speech: "Let me show you what I can do. I'm scanning LinkedIn for qualified prospects right now.",
    url: "linkedin.com/search/results/people",
    content: "linkedin",
  },
  {
    agentState: "speaking" as AgentState,
    speech: "Found 12 leads. Writing personalised outreach — no templates, each one unique.",
    url: "mail.google.com/compose",
    content: "gmail",
  },
  {
    agentState: "happy" as AgentState,
    speech: "Meeting booked. All local. No cloud. No subscriptions. Just results.",
    url: "calendar.google.com",
    content: "calendar",
  },
  {
    agentState: "surprised" as AgentState,
    speech: "I connect to every app on your OS — LinkedIn, Gmail, Twitter, Notion, all of them.",
    url: "momentum.local/integrations",
    content: "integrations",
  },
];

function MockScreen({ content }: { content: string }) {
  if (content === "linkedin") return (
    <div className="w-full h-full bg-[#0a0a0f] p-4 flex flex-col gap-3">
      <div className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-1">Scanning LinkedIn · 12 prospects found</div>
      {[
        { name: "Sarah Jenkins", role: "VP of Sales, Acme Corp", badge: "QUALIFIED", c: "#22c55e" },
        { name: "David Chen",    role: "Director of AI, NovaTech", badge: "CONTACTING", c: "#3b82f6" },
        { name: "Elena Rodriguez", role: "COO, Scale.io",         badge: "MEETING BOOKED", c: "#f97316" },
      ].map((p, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.35 }}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/[0.06]"
          style={{ background: "rgba(255,255,255,0.025)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{ background: `${p.c}18`, border: `1px solid ${p.c}35`, color: p.c }}>{p.name[0]}</div>
            <div>
              <div className="text-white/85 text-[12px] font-medium leading-none mb-0.5">{p.name}</div>
              <div className="text-white/30 text-[10px]">{p.role}</div>
            </div>
          </div>
          <span className="text-[9px] font-bold px-2 py-1 rounded-full"
            style={{ color: p.c, background: `${p.c}15`, border: `1px solid ${p.c}30` }}>{p.badge}</span>
        </motion.div>
      ))}
    </div>
  );

  if (content === "gmail") return (
    <div className="w-full h-full bg-[#0a0a0f] p-4 flex flex-col gap-3">
      <div className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-1">Composing outreach · Sarah Jenkins</div>
      <div className="rounded-lg border border-white/[0.07] p-3 flex flex-col gap-2.5" style={{ background: "rgba(255,255,255,0.025)" }}>
        {[["To", "sarah.jenkins@acmecorp.com"], ["Re", "Quick question about your Q3 growth strategy"]].map(([k, v]) => (
          <div key={k} className="flex gap-2 items-center border-b border-white/[0.05] pb-2">
            <span className="text-white/25 text-[10px] w-5">{k}</span>
            <span className="text-white/60 text-[12px]">{v}</span>
          </div>
        ))}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white/50 text-[12px] leading-relaxed">
          Hi Sarah, I came across your recent post about scaling outbound — really resonated with our approach. Would love 15 minutes to show you what's been working for us
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
            className="inline-block w-0.5 h-3.5 bg-white/40 ml-0.5 align-middle" />
        </motion.p>
      </div>
      <div className="flex justify-end">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold" style={{ background: "#1a73e8", color: "#fff" }}>
          Sending
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
        </motion.div>
      </div>
    </div>
  );

  if (content === "calendar") return (
    <div className="w-full h-full bg-[#0a0a0f] p-4 flex flex-col gap-3">
      <div className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-1">Meeting confirmed</div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="rounded-lg border border-[#22c55e]/25 p-4 flex flex-col gap-1.5" style={{ background: "rgba(34,197,94,0.05)" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[#22c55e] text-[10px] font-bold tracking-wider uppercase">Booked</span>
        </div>
        <div className="text-white text-[15px] font-semibold">30-min Intro Call · Sarah Jenkins</div>
        <div className="text-white/40 text-[12px]">Tomorrow · 3:00 PM – 3:30 PM IST</div>
        <div className="text-white/25 text-[11px] mt-1">Google Meet link sent automatically</div>
      </motion.div>
      <div className="flex items-center justify-center gap-4 mt-1">
        {["0 API calls", "0 subscriptions", "100% local"].map((t, i) => (
          <motion.span key={t} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
            className="text-white/20 text-[10px] font-medium">{t}</motion.span>
        ))}
      </div>
    </div>
  );

  // integrations
  return (
    <div className="w-full h-full bg-[#0a0a0f] p-4 flex flex-col gap-2">
      <div className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-1">Active integrations</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: "LinkedIn",  status: "RUNNING",    c: "#0077b5" },
          { name: "Gmail",     status: "RUNNING",    c: "#ea4335" },
          { name: "Twitter",   status: "SCHEDULED",  c: "#1da1f2" },
          { name: "Notion",    status: "STANDBY",    c: "#ffffff" },
          { name: "Slack",     status: "RUNNING",    c: "#4a154b" },
          { name: "HubSpot",   status: "MONITORING", c: "#ff7a59" },
        ].map((item, i) => (
          <motion.div key={item.name} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/[0.06]"
            style={{ background: "rgba(255,255,255,0.025)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.c }} />
              <span className="text-white/70 text-[11px] font-medium">{item.name}</span>
            </div>
            <span className="text-[9px] font-bold" style={{ color: item.status === "RUNNING" ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function useTTS() {
  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 1.0; u.volume = 1;
    // Prefer natural-sounding macOS / Google voices
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find(v => ["Samantha", "Karen", "Moira", "Google UK English Female", "Fiona"].some(n => v.name.includes(n)))
             || voices.find(v => v.lang.startsWith("en") && !v.name.toLowerCase().includes("robot"));
      if (v) u.voice = v;
    };
    load();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", load, { once: true });
    }
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  return { speak, stop };
}

type Phase = "sleeping" | "active";

export function AgentShowcase() {
  const [phase, setPhase]       = useState<Phase>("sleeping");
  const [agentState, setAgentState] = useState<AgentState>("sleeping");
  const [demoIdx, setDemoIdx]   = useState(0);
  const { speak, stop }         = useTTS();
  const timer                   = useRef<NodeJS.Timeout | null>(null);
  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  const runDemo = useCallback((idx: number) => {
    if (idx >= DEMOS.length) {
      // Loop done — go back to sleep
      stop();
      setAgentState("sleeping");
      timer.current = setTimeout(() => setPhase("sleeping"), 1200);
      return;
    }
    setDemoIdx(idx);
    setAgentState(DEMOS[idx].agentState);
    speak(DEMOS[idx].speech, () => {
      timer.current = setTimeout(() => runDemo(idx + 1), 1200);
    });
  }, [speak, stop]);

  const wake = () => {
    if (phase === "active") return;
    clear(); stop();
    setPhase("active");
    setAgentState("idle");
    setDemoIdx(0);
    timer.current = setTimeout(() => {
      setAgentState("thinking");
      timer.current = setTimeout(() => runDemo(0), 600);
    }, 500);
  };

  const endMode = () => {
    clear(); stop();
    setAgentState("sleeping");
    timer.current = setTimeout(() => setPhase("sleeping"), 700);
  };

  useEffect(() => () => { clear(); stop(); }, [stop]);

  const isActive  = phase === "active";
  const demo      = DEMOS[demoIdx];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Purple ambient glow (sleeping only) */}
      <AnimatePresence>
        {!isActive && (
          <motion.div key="glow" className="absolute pointer-events-none z-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 1 }}
            style={{
              width: 560, height: 560, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(96,40,230,0.32) 0%, rgba(60,20,160,0.14) 45%, transparent 72%)",
              filter: "blur(24px)",
            }} />
        )}
      </AnimatePresence>

      {/* Agent face — centered sleeping, floats to top when active */}
      <motion.div
        className="relative z-20"
        animate={isActive ? { y: -190, scale: 0.55 } : { y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
        onClick={!isActive ? wake : undefined}
        style={{ cursor: !isActive ? "pointer" : "default" }}
        whileHover={!isActive ? { scale: 1.05 } : {}}
        whileTap={!isActive ? { scale: 0.96 } : {}}
      >
        <AgentFace state={agentState} size={210} />

        {/* Pulse ring */}
        <AnimatePresence>
          {!isActive && (
            <motion.div key="ring"
              className="absolute rounded-[3.2rem] border border-white/[0.09]"
              style={{ inset: -12 }}
              animate={{ opacity: [0, 0.65, 0], scale: [0.93, 1.1, 0.93] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* "Tap to wake" pill */}
      <AnimatePresence>
        {!isActive && (
          <motion.button key="pill" onClick={wake}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 z-10 flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.04] text-white/45 text-[13px] font-medium tracking-wide hover:border-white/22 hover:text-white/70 transition-all duration-300"
            style={{ fontFamily: "-apple-system,'SF Pro Text',sans-serif", backdropFilter: "blur(12px)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
            Tap to see Momentum in action
          </motion.button>
        )}
      </AnimatePresence>

      {/* Screencast window */}
      <AnimatePresence>
        {isActive && (
          <motion.div key="window"
            initial={{ opacity: 0, y: 90, scale: 0.94 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 220, damping: 30, delay: 0.1 }}
            className="absolute z-10 w-[min(660px,90vw)] rounded-2xl overflow-hidden"
            style={{
              top: "50%",
              background: "rgba(12,12,16,0.9)",
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 50px 120px rgba(0,0,0,0.8), inset 0 0 0 0.5px rgba(255,255,255,0.04)",
            }}>

            {/* Window chrome */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.018)" }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              {/* URL bar */}
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md mx-3"
                style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.span key={demoIdx} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }} className="text-white/30 text-[11px] font-mono truncate">
                    {demo.url}
                  </motion.span>
                </AnimatePresence>
              </div>
              {/* Step dots */}
              <div className="flex gap-1.5 shrink-0">
                {DEMOS.map((_, i) => (
                  <motion.div key={i}
                    animate={{ width: i === demoIdx ? 18 : 5, opacity: i === demoIdx ? 1 : 0.28 }}
                    style={{ height: 5, borderRadius: 999, background: "#7c3aed" }}
                    transition={{ duration: 0.3 }} />
                ))}
              </div>
            </div>

            {/* Demo content */}
            <div className="h-[240px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={demoIdx} className="absolute inset-0"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
                  <MockScreen content={demo.content} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* End Agent Mode */}
            <div className="flex justify-center py-3 border-t border-white/[0.05]"
              style={{ background: "rgba(255,255,255,0.012)" }}>
              <button onClick={endMode}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 hover:brightness-115 active:scale-95"
                style={{
                  color: "#fd5934",
                  background: "rgba(253,89,52,0.1)",
                  border: "1px solid rgba(253,89,52,0.28)",
                  fontFamily: "-apple-system,'SF Pro Text',sans-serif",
                }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                End Agent Mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
