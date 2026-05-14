"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentFace, AgentState } from "./AgentFace";

const CAPABILITIES = [
  {
    state: "thinking" as AgentState,
    text: "I can find and qualify your leads — locally, no API bills, no rate limits.",
  },
  {
    state: "speaking" as AgentState,
    text: "I write and send cold outreach that actually sounds human. Because I think like one.",
  },
  {
    state: "happy" as AgentState,
    text: "I run entirely on your machine. Your data never leaves. Ever.",
  },
  {
    state: "surprised" as AgentState,
    text: "You pay once. I work forever. No subscriptions. No monthly retainers.",
  },
  {
    state: "speaking" as AgentState,
    text: "I can manage your LinkedIn, Twitter, emails — all at once, all on autopilot.",
  },
];

type ShowcasePhase = "sleeping" | "waking" | "talking" | "sleeping_again";

export function AgentShowcase() {
  const [phase, setPhase] = useState<ShowcasePhase>("sleeping");
  const [agentState, setAgentState] = useState<AgentState>("sleeping");
  const [capabilityIndex, setCapabilityIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
    if (sequenceRef.current) clearTimeout(sequenceRef.current);
  };

  // Typewriter effect
  const typeText = (text: string, onDone: () => void) => {
    setDisplayText("");
    setIsTyping(true);
    let i = 0;
    const tick = () => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
        typeTimerRef.current = setTimeout(tick, 22);
      } else {
        setIsTyping(false);
        onDone();
      }
    };
    tick();
  };

  const runSequence = (index: number) => {
    if (index >= CAPABILITIES.length) {
      // All done — go back to sleep
      setAgentState("sleeping");
      setDisplayText("");
      sequenceRef.current = setTimeout(() => setPhase("sleeping_again"), 800);
      return;
    }

    const cap = CAPABILITIES[index];
    setCapabilityIndex(index);
    setAgentState(cap.state);

    typeText(cap.text, () => {
      // Hold for reading
      sequenceRef.current = setTimeout(() => {
        setDisplayText("");
        sequenceRef.current = setTimeout(() => runSequence(index + 1), 400);
      }, 2800);
    });
  };

  const handleWake = () => {
    if (phase !== "sleeping" && phase !== "sleeping_again") return;
    clearAllTimers();
    setPhase("waking");
    setAgentState("idle");

    sequenceRef.current = setTimeout(() => {
      setAgentState("thinking");
      sequenceRef.current = setTimeout(() => {
        setPhase("talking");
        runSequence(0);
      }, 900);
    }, 600);
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const isSleeping = phase === "sleeping" || phase === "sleeping_again";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 select-none px-4">
      {/* Agent face */}
      <motion.div
        className="relative cursor-pointer"
        onClick={handleWake}
        whileHover={isSleeping ? { scale: 1.04 } : {}}
        whileTap={isSleeping ? { scale: 0.97 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <AgentFace
          state={agentState}
          isShuttered={false}
          isVoiceMode={false}
          className="w-[220px] h-[220px] md:w-[280px] md:h-[280px]"
        />

        {/* Pulse ring when sleeping */}
        <AnimatePresence>
          {isSleeping && (
            <motion.div
              key="pulse"
              className="absolute inset-0 rounded-[3rem] border border-white/10"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: [0, 0.5, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Label / speech bubble */}
      <div className="min-h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isSleeping ? (
            <motion.button
              key="wake-label"
              onClick={handleWake}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/60 text-sm font-medium tracking-wide hover:border-white/30 hover:text-white/90 transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
              Tap to wake the agent
            </motion.button>
          ) : phase === "waking" ? (
            <motion.p
              key="waking-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white/40 text-sm font-medium tracking-widest uppercase"
            >
              Waking up…
            </motion.p>
          ) : (
            <motion.div
              key="speech"
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[520px] text-center"
            >
              <p
                className="text-white text-xl md:text-2xl font-medium tracking-tight leading-snug"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
              >
                {displayText}
                {isTyping && (
                  <span className="inline-block w-[2px] h-[1.1em] bg-white/70 ml-0.5 align-middle animate-pulse" />
                )}
              </p>
              {/* Capability dots */}
              <div className="flex items-center justify-center gap-1.5 mt-5">
                {CAPABILITIES.map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full bg-white"
                    animate={{
                      width: i === capabilityIndex ? 20 : 5,
                      opacity: i === capabilityIndex ? 1 : 0.25,
                    }}
                    style={{ height: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
