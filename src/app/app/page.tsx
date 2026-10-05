"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { AgentFace, AgentState } from "@/components/AgentFace";
import Link from "next/link";

// ---------------------------------------------------------------------------
// SECTION COMPONENT
// ---------------------------------------------------------------------------
function Section({ index, setActiveSection, children }: { index: number, setActiveSection: (i: number) => void, children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (isInView) {
      setActiveSection(index);
    }
  }, [isInView, index, setActiveSection]);

  return (
    <section ref={ref} className="min-h-screen w-full flex items-center justify-center p-6 md:p-12 relative z-10">
      <div className="max-w-7xl w-full flex">
        {children}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------------------------------------
export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [faceState, setFaceState] = useState<AgentState>("idle");

  // Keep face state in sync with sections if not explicitly interacting
  useEffect(() => {
    if (activeSection === 0) setFaceState("idle");
    else if (activeSection === 1) setFaceState("thinking");
    else if (activeSection === 2) setFaceState("listening");
    else if (activeSection === 3) setFaceState("idle");
    else if (activeSection === 4) setFaceState("speaking");
  }, [activeSection]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Face positions depending on which section is active
  const faceVariants = {
    0: { x: "0%", y: "0%", scale: 1 },
    1: { x: "25vw", y: "-15vh", scale: 0.65 }, // Moves top right
    2: { x: "-25vw", y: "15vh", scale: 0.65 }, // Moves bottom left
    3: { x: "25vw", y: "15vh", scale: 0.65 },  // Moves bottom right
    4: { x: "-25vw", y: "-15vh", scale: 0.65 }, // Moves top left
  };

  // Mobile variants (face stays roughly center/top, just scales down a bit)
  const mobileFaceVariants = {
    0: { x: "0%", y: "0%", scale: 0.8 },
    1: { x: "0%", y: "-35vh", scale: 0.5 },
    2: { x: "0%", y: "-35vh", scale: 0.5 },
    3: { x: "0%", y: "-35vh", scale: 0.5 },
    4: { x: "0%", y: "-35vh", scale: 0.5 },
  };

  return (
    <div className="bg-black text-white selection:bg-white/20 font-sans min-h-screen relative overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-md border-b border-white/5">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          Momentum
        </Link>
        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Back to Home
        </Link>
      </nav>

      {/* Sticky Agent Face */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <motion.div
          animate={typeof window !== "undefined" && window.innerWidth < 768 ? mobileFaceVariants[activeSection as keyof typeof mobileFaceVariants] : faceVariants[activeSection as keyof typeof faceVariants]}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="relative pointer-events-auto"
        >
          {/* Subtle glow behind the face that changes color based on section */}
          <motion.div 
            className="absolute inset-0 blur-[100px] -z-10 rounded-full"
            animate={{
              backgroundColor: 
                activeSection === 1 ? "rgba(236, 72, 153, 0.2)" : // Pink
                activeSection === 2 ? "rgba(59, 130, 246, 0.2)" : // Blue
                activeSection === 3 ? "rgba(16, 185, 129, 0.2)" : // Emerald
                activeSection === 4 ? "rgba(249, 115, 22, 0.2)" : // Orange
                "rgba(255, 255, 255, 0.05)"
            }}
            transition={{ duration: 1 }}
          />
          <AgentFace state={faceState} size={180} />
        </motion.div>
      </div>

      {/* Hero Section (0) */}
      <Section index={0} setActiveSection={setActiveSection}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: activeSection === 0 ? 1 : 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center text-center mt-64 pointer-events-none"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05]">
            Intelligence that <br />
            <span className="text-zinc-500">does the work.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed mx-auto">
            Scroll down to see Momentum physically navigate and execute complex tasks across your applications.
          </p>
        </motion.div>
      </Section>

      {/* Creative Section (1) */}
      <Section index={1} setActiveSection={setActiveSection}>
        <div className={`w-full max-w-xl transition-all duration-700 ${activeSection === 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"} mr-auto`}>
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-pink-500/20 p-8 shadow-2xl pointer-events-auto">
            <h3 className="text-3xl font-medium text-white mb-2">Video Editor AI</h3>
            <p className="text-zinc-400 mb-6">Momentum perfectly syncs audio, adds effects, and renders your timeline.</p>
            
            <div className="h-40 bg-black/60 rounded-xl overflow-hidden relative border border-white/5 mb-6 flex flex-col justify-end p-2 gap-1">
               <motion.div className="h-6 bg-pink-500/40 rounded flex items-center px-2 text-[10px] text-pink-200"
                 animate={{ width: activeSection === 1 ? ["10%", "40%", "100%"] : "10%" }}
                 transition={{ duration: 3, ease: "easeInOut", repeat: activeSection === 1 ? Infinity : 0, repeatDelay: 1 }}
               >A-Roll.mp4</motion.div>
               <motion.div className="h-6 bg-rose-500/40 rounded flex items-center px-2 text-[10px] text-rose-200"
                 animate={{ width: activeSection === 1 ? ["0%", "60%", "90%"] : "0%" }}
                 transition={{ duration: 3, ease: "easeInOut", delay: 0.5, repeat: activeSection === 1 ? Infinity : 0, repeatDelay: 1 }}
               >B-Roll.mp4</motion.div>
            </div>
            
            <button 
              onMouseEnter={() => setFaceState("happy")}
              onMouseLeave={() => setFaceState("thinking")}
              className="w-full bg-pink-600 hover:bg-pink-500 transition-colors py-4 rounded-xl text-white font-medium text-lg"
            >
              Export Final Cut
            </button>
          </div>
        </div>
      </Section>

      {/* Admin Section (2) */}
      <Section index={2} setActiveSection={setActiveSection}>
        <div className={`w-full max-w-xl transition-all duration-700 ${activeSection === 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"} ml-auto`}>
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-blue-500/20 p-8 shadow-2xl pointer-events-auto">
            <h3 className="text-3xl font-medium text-white mb-2">Inbox Manager</h3>
            <p className="text-zinc-400 mb-6">Reads incoming emails, drafts replies, and clears your inbox autonomously.</p>
            
            <div className="flex flex-col gap-3 mb-6">
               <motion.div 
                 initial={{ opacity: 1, x: 0 }}
                 animate={activeSection === 2 ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
                 transition={{ delay: 1, duration: 0.5 }}
                 className="p-4 bg-black/60 border border-white/5 rounded-xl flex justify-between items-center"
               >
                 <span className="text-zinc-200 font-medium">Urgent: Q3 Report Data</span>
                 <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Drafting...</span>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 1, x: 0 }}
                 animate={activeSection === 2 ? { opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
                 transition={{ delay: 1.5, duration: 0.5 }}
                 className="p-4 bg-black/60 border border-white/5 rounded-xl flex justify-between items-center"
               >
                 <span className="text-zinc-200 font-medium">Reschedule lunch?</span>
                 <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Calendar Updated</span>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={activeSection === 2 ? { opacity: 1 } : { opacity: 0 }}
                 transition={{ delay: 2, duration: 0.5 }}
                 className="absolute inset-0 flex items-center justify-center pointer-events-none"
               >
                 <span className="text-blue-400 font-medium text-xl bg-blue-500/10 px-6 py-3 rounded-full border border-blue-500/20">
                   Inbox Zero Achieved ✨
                 </span>
               </motion.div>
            </div>
            
            <button 
              onMouseEnter={() => setFaceState("happy")}
              onMouseLeave={() => setFaceState("listening")}
              className="w-full bg-blue-600 hover:bg-blue-500 transition-colors py-4 rounded-xl text-white font-medium text-lg mt-6"
            >
              Process Next Batch
            </button>
          </div>
        </div>
      </Section>

      {/* Dev Section (3) */}
      <Section index={3} setActiveSection={setActiveSection}>
        <div className={`w-full max-w-xl transition-all duration-700 ${activeSection === 3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"} mr-auto`}>
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-emerald-500/20 p-8 shadow-2xl pointer-events-auto">
            <h3 className="text-3xl font-medium text-white mb-2">Code Architecture</h3>
            <p className="text-zinc-400 mb-6">Spots syntax errors, refactors architecture, and ships to production.</p>
            
            <div className="p-5 bg-black/80 rounded-xl font-mono text-sm border border-white/5 mb-6 h-36 flex flex-col justify-center">
               {faceState === "error" ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <span className="text-red-400">TypeError: Cannot read properties of undefined</span><br/>
                   <span className="text-zinc-500">  at processData (utils.ts:42)</span><br/>
                   <span className="text-zinc-500">  at Main (app.tsx:18)</span>
                 </motion.div>
               ) : faceState === "happy" ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <span className="text-emerald-400">✔ Successfully patched utils.ts</span><br/>
                   <span className="text-emerald-400">✔ All 42 tests passed</span><br/>
                   <span className="text-white mt-2 inline-block">Deploying to Vercel... 🚀</span>
                 </motion.div>
               ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <span className="text-zinc-300">Scanning codebase for vulnerabilities...</span><br/>
                   <span className="text-emerald-400 mt-2 inline-block">100% Secure. Systems nominal.</span>
                 </motion.div>
               )}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setFaceState("error")}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-red-500/30 transition-colors py-4 rounded-xl text-white font-medium text-lg"
              >
                Break Code
              </button>
              <button 
                onClick={() => setFaceState("happy")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 transition-colors py-4 rounded-xl text-white font-medium text-lg"
              >
                Auto-Fix
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Comm Section (4) */}
      <Section index={4} setActiveSection={setActiveSection}>
        <div className={`w-full max-w-xl transition-all duration-700 ${activeSection === 4 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"} ml-auto`}>
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] border border-orange-500/20 p-8 shadow-2xl pointer-events-auto">
            <h3 className="text-3xl font-medium text-white mb-2">Client Negotiation</h3>
            <p className="text-zinc-400 mb-6">Acts as your proxy in deals, handling back-and-forth messages.</p>
            
            <div className="flex flex-col gap-3 h-48 bg-black/60 rounded-xl p-4 overflow-hidden border border-white/5 mb-6 relative">
               <motion.div initial={{ opacity: 0, y: 10 }} animate={activeSection === 4 ? { opacity: 1, y: 0 } : {}} className="self-start bg-zinc-800 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm max-w-[85%] text-zinc-200">
                 Client: We need a 20% discount to proceed with the enterprise plan.
               </motion.div>
               
               <motion.div initial={{ opacity: 0, y: 10 }} animate={activeSection === 4 ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }} className="self-end bg-orange-600 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%] text-white">
                 Momentum: I can authorize 10% today, and I'll include our priority support package free for 6 months.
               </motion.div>

               <motion.div initial={{ opacity: 0, y: 10 }} animate={activeSection === 4 ? { opacity: 1, y: 0 } : {}} transition={{ delay: 2.5 }} className="self-start bg-zinc-800 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm max-w-[85%] text-zinc-200">
                 Client: That works. Send the contract over.
               </motion.div>
               
               <motion.div initial={{ opacity: 0, y: 10 }} animate={activeSection === 4 ? { opacity: 1, y: 0 } : {}} transition={{ delay: 3.5 }} className="self-end bg-orange-600 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%] text-white">
                 Momentum: Contract drafted and sent via DocuSign. Pleasure doing business! 🤝
               </motion.div>
            </div>
            
            <Link 
              href="/newagent"
              onMouseEnter={() => setFaceState("happy")}
              onMouseLeave={() => setFaceState("speaking")}
              className="flex items-center justify-center w-full bg-white text-black hover:bg-zinc-200 transition-colors py-4 rounded-xl font-bold text-lg"
            >
              Start Your Own Agent
            </Link>
          </div>
        </div>
      </Section>

      {/* Spacing at bottom */}
      <div className="h-32 w-full" />
    </div>
  );
}
