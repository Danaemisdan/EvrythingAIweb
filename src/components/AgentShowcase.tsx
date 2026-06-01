"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AgentFace, AgentState } from "./AgentFace";
import MacOSMenuBar from "./mac-os-menu-bar";
import MacOSDock from "./mac-os-dock";
import { GlassFilter } from "./liquid-glass";

// ── TTS: tries pre-generated Kokoro audio first, falls back to Web Speech ─────
function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback((text: string, idx: number, onEnd?: () => void) => {
    if (idx < 0) {
      // Direct Web Speech API fallback for custom voice lines
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
      return;
    }

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

interface AgentShowcaseProps {
  isVisible?: boolean;
}

const dockIcons = [
  { id: "finder", name: "Finder", icon: "/app-icons/finder.png" },
  { id: "chatgpt", name: "ChatGPT", icon: "/app-icons/chatgpt.png" },
  { id: "claude", name: "Claude", icon: "/app-icons/claude.png" },
  { id: "safari", name: "Safari", icon: "/app-icons/safari.png" },
  { id: "messages", name: "Messages", icon: "/app-icons/messages.png" },
  { id: "mail", name: "Mail", icon: "/app-icons/mail.png" },
  { id: "maps", name: "Maps", icon: "/app-icons/maps.png" },
  { id: "photos", name: "Photos", icon: "/app-icons/photos.png" },
  { id: "launchpad", name: "Launchpad", icon: "/app-icons/launchpad.png" },
  { id: "music", name: "Music", icon: "/app-icons/music.png" },
  { id: "podcasts", name: "Podcasts", icon: "/app-icons/podcasts.png" },
  { id: "tv", name: "TV", icon: "/app-icons/tv.png" },
  { id: "appstore", name: "App Store", icon: "/app-icons/appstore.png" },
  { id: "notes", name: "Notes", icon: "/app-icons/notes.png" },
  { id: "vscode", name: "VS Code", icon: "/app-icons/vscode.png" },
  { id: "settings", name: "Settings", icon: "/app-icons/settings.png" },
  { id: "steam", name: "Steam", icon: "/app-icons/steam.png" },
];

// ── Main ──────────────────────────────────────────────────────────────────────
export function AgentShowcase({ isVisible = false }: AgentShowcaseProps) {
  const [active, setActive]       = useState(false);
  const [agentState, setAgentState] = useState<AgentState>("sleeping");
  const [subtitle, setSubtitle]   = useState("");
  const [hasWokenUp, setHasWokenUp] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const { speak, stop }           = useTTS();
  const timer                     = useRef<NodeJS.Timeout | null>(null);
  
  const clear = () => { if (timer.current) clearTimeout(timer.current); };

  const wake = useCallback(() => {
    if (active || hasWokenUp) return;
    clear(); stop();
    setActive(true);
    setHasWokenUp(true);
    setAgentState("idle");
    setSubtitle("");
    setShowDesktop(false);
    
    // After 2 seconds, start speaking
    timer.current = setTimeout(() => {
      setAgentState("speaking");
      setSubtitle("Why the hell you wake up?");
      speak("Why the hell you wake up?", 8);
      
      timer.current = setTimeout(() => {
        setSubtitle("What you need?");
        speak("What you need?", 9);
        
        timer.current = setTimeout(() => {
          setSubtitle("Fine You wakeup, here is your screen...");
          speak("Fine You wakeup, here is your screen...", 10);
          
          timer.current = setTimeout(() => {
            setAgentState("idle");
            setSubtitle("");
            setShowDesktop(true);
          }, 3500);
        }, 3000);
      }, 3000);
    }, 2000);
  }, [active, hasWokenUp, speak, stop]);

  const end = () => { 
    clear(); 
    stop(); 
    setAgentState("sleeping"); 
    setSubtitle("");
    setHasWokenUp(false);
    setActive(false);
    setShowDesktop(false);
  };

  useEffect(() => {
    if (isVisible) {
      if (!hasWokenUp && !active) {
        const t = setTimeout(() => {
          wake();
        }, 2000);
        return () => clearTimeout(t);
      }
    } else {
      // Reset agent to sleeping when user scrolls away
      end();
    }
  }, [isVisible, hasWokenUp, active, wake]);

  useEffect(() => () => { clear(); stop(); }, [stop]);

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none ${showDesktop ? "" : "px-4"}`}>
      {/* Background change when desktop appears */}
      <AnimatePresence>
        {showDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("/images/wallpaper.jpg")`,
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <GlassFilter />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purple ambient glow — shifts on active */}
      <motion.div
        className="pointer-events-none absolute"
        animate={active
          ? showDesktop ? { opacity: 0 } : { scale: 1.1, opacity: 0.7 }
          : { scale: 1, opacity: 0.5 }}
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
        style={{
          width: 700, height: 700, left: "50%", x: "-50%", top: "50%", y: "-50%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,255,0.38) 0%, rgba(80,20,200,0.16) 40%, transparent 70%)",
          filter: "blur(32px)",
          zIndex: 0,
        }}
      />

      {/* MacOS Menu Bar */}
      <AnimatePresence>
        {showDesktop && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 left-0 right-0 z-50"
          >
            <MacOSMenuBar appName="Mac OS" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent face */}
      <motion.div
        className="relative z-40"
        drag={showDesktop}
        dragConstraints={{ left: -500, right: 500, top: -240, bottom: 200 }}
        dragElastic={0.2}
        dragMomentum={false}
        animate={active 
          ? showDesktop ? { scale: 0.85, y: -200 } : { scale: 1.05 } 
          : { scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
        onClick={!active ? wake : undefined}
        style={{ cursor: !active ? "pointer" : showDesktop ? "grab" : "default" }}
        whileHover={!active ? { scale: 1.04 } : {}}
        whileTap={!active ? { scale: 0.97 } : showDesktop ? { cursor: "grabbing" } : {}}
      >
        <AgentFace state={agentState} size={210} />

        {/* Pulse ring */}
        <AnimatePresence>
          {!active && (
            <motion.div key="r" className="absolute rounded-[2.5rem] border border-white/[0.08]"
              style={{ inset: -12 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.93, 1.09, 0.93] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtitle speech bubble */}
      <AnimatePresence>
        {active && subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`absolute z-50 px-8 py-4 rounded-3xl border border-white/[0.08] bg-white/[0.02] text-white/90 text-lg font-medium tracking-wide text-center ${showDesktop ? "top-32" : "mt-10 relative"}`}
            style={{
              backdropFilter: "blur(20px)",
              fontFamily: "-apple-system,'SF Pro Display','SF Pro Text',sans-serif",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            }}
          >
            {subtitle}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MacOS Dock */}
      <AnimatePresence>
        {showDesktop && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 z-50"
          >
            <MacOSDock apps={dockIcons} onAppClick={(id) => console.log('Clicked', id)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
