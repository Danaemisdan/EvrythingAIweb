const fs = require('fs');

const code = `"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import Link from "next/link";
import { AgentFace, AgentState } from "@/components/AgentFace";
import { Code2, Scissors, CalendarDays } from "lucide-react";

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [faceState, setFaceState] = useState<AgentState>("idle");

  // --- Intro Scroll ---
  const introRef = useRef<HTMLDivElement>(null);
  const introProgress = useMotionValue(0);
  
  // --- How It Looks Scroll ---
  const howRef = useRef<HTMLDivElement>(null);

  // --- Horizontal Scroll ---
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const [hProgress, setHProgress] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      
      // 1. Intro Progress
      if (introRef.current) {
        const rect = introRef.current.getBoundingClientRect();
        let progress = -rect.top / rect.height;
        progress = Math.max(0, Math.min(1, progress));
        introProgress.set(progress);
      }

      // 2. Determine global active section
      let newSection = 0;
      
      if (howRef.current && horizontalScrollRef.current) {
         const howRect = howRef.current.getBoundingClientRect();
         const hRect = horizontalScrollRef.current.getBoundingClientRect();
         
         if (howRect.top > vh * 0.5) {
            newSection = 0; // Intro
         } else if (howRect.top <= vh * 0.5 && hRect.top > vh * 0.5) {
            newSection = 1; // How it looks
         } else {
            // Inside Horizontal or Conclusion
            const totalScrollable = hRect.height - vh;
            let progress = -hRect.top / totalScrollable;
            progress = Math.max(0, Math.min(1, progress));
            setHProgress(progress);
            
            if (hRect.bottom < vh * 0.5) {
               newSection = 7; // Conclusion
            } else {
               if (progress < 0.2) newSection = 2; // Panel 1 (Engineering)
               else if (progress < 0.4) newSection = 3; // Panel 2 (3D Auto)
               else if (progress < 0.6) newSection = 4; // Panel 3 (Game Dev)
               else if (progress < 0.8) newSection = 5; // Panel 4 (Marketing)
               else newSection = 6; // Panel 5 (Meetings)
               
               const segmentProgress = (progress % 0.2) * 5;
               if (segmentProgress > 0.6) setAnimationStep(2);
               else if (segmentProgress > 0.3) setAnimationStep(1);
               else setAnimationStep(0);
            }
         }
      }
      
      setActiveSection(newSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portalScale = useTransform(introProgress, [0, 0.1, 0.6, 1], [1, 1, 80, 200]);
  const portalOpacity = useTransform(introProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);
  const faceOpacityIntro = useTransform(introProgress, [0, 0.02, 1], [1, 0, 0]);
  const heroOpacity = useTransform(introProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(introProgress, [0, 0.15], [0, -50]);

  // Sync face state
  useEffect(() => {
    if (activeSection === 0) setFaceState("idle");
    else if (activeSection === 1) setFaceState("listening"); // Mac screen
    else if (activeSection === 2) setFaceState(animationStep === 1 ? "error" : "thinking");
    else if (activeSection >= 3 && activeSection <= 6) setFaceState("thinking");
    else if (activeSection === 7) setFaceState("idle");
  }, [activeSection, animationStep]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Global Face Coordinates
  const faceVariants = {
    0: { x: "0px", y: "-15vh", scale: 1 },
    1: { x: "0px", y: "-22vh", scale: 0.35 },  // Top center of Mac Mockup
    2: { x: "0px", y: "-40vh", scale: 0.25 },  // Locked to top of viewport for horizontal scroll
    3: { x: "0px", y: "-40vh", scale: 0.25 },
    4: { x: "0px", y: "-40vh", scale: 0.25 },
    5: { x: "0px", y: "-40vh", scale: 0.25 },
    6: { x: "0px", y: "-40vh", scale: 0.25 },
    7: { x: "0px", y: "-30vh", scale: 1 },     // Top of conclusion
  };

  return (
    <div className="bg-black text-white selection:bg-white/20 font-sans min-h-screen relative overflow-x-clip">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-md border-b border-white/5 mix-blend-difference">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">Momentum</Link>
        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Back to Home</Link>
      </nav>

      {/* SINGLE STICKY MOVING FACE */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <motion.div
          animate={faceVariants[activeSection as keyof typeof faceVariants]}
          transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.8 }}
          className="relative pointer-events-auto"
        >
          {activeSection === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center">
              <motion.div
                style={{ scale: portalScale, opacity: portalOpacity }}
                className="w-[54px] h-[56px] bg-white rounded-[12px] origin-center shadow-[0_0_80px_rgba(255,255,255,1)]"
              />
            </div>
          )}
          
          <motion.div 
            style={{ opacity: activeSection === 0 ? faceOpacityIntro as any : 1 }}
            className={activeSection === 0 ? "" : "transition-opacity duration-1000 ease-in drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"}
          >
            <AgentFace state={faceState} size={180} />
          </motion.div>
        </motion.div>
      </div>

      {/* 1. WHAT IS MOMENTUM */}
      <div ref={introRef} className="h-[250vh] w-full absolute top-0 left-0 z-0" />
      <motion.div 
        style={{ opacity: heroOpacity, y: heroY }}
        className="fixed inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-20 mt-[25vh]"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05]">
          Intelligence that <br />
          <span className="text-zinc-500">does the work.</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed mx-auto">
          Scroll down to enter the portal and see Momentum execute complex tasks across applications.
        </p>
      </motion.div>
      <div className="h-[250vh]" />

      <div className="relative z-40 bg-black">
        <div className="min-h-screen flex flex-col items-center justify-center px-6 md:px-24 text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] max-w-5xl mb-8">
            Momentum is not an assistant. <br/>It's a relentless personal friend.
          </h2>
          <p className="text-2xl md:text-3xl text-zinc-500 max-w-4xl leading-relaxed">
            It doesn't just execute a task once and leave. It stays by your side, continuously learns your workflows, and autonomously drives your software day and night.
          </p>
        </div>

        {/* 2. HOW IT LOOKS & HOW TO USE IT */}
        <div ref={howRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-zinc-950 relative border-t border-zinc-900">
           <div className="max-w-4xl text-center mb-16 relative z-10">
             <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-sm font-medium mb-8 inline-block">Native OS Integration</div>
             <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">Always there when you need it.</h2>
             <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
               Summon it instantly by saying <span className="text-white italic">"Momentum, are you there?"</span> or just hit <kbd className="bg-zinc-800 px-3 py-1 rounded-md font-mono text-sm border border-zinc-700 text-white mx-1">Cmd + M</kbd>. Even better, Momentum can autonomously detect when you're struggling with a task and drop down from your menu bar to offer a hand.
             </p>
           </div>
           
           {/* Huge Mac Mockup */}
           <div className="w-full max-w-6xl aspect-[16/10] bg-black rounded-[2rem] border-[16px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col">
              {/* Fake Mac Header */}
              <div className="h-7 bg-black/40 backdrop-blur-md border-b border-white/10 w-full flex items-center px-4 text-[11px] font-medium text-white/80 justify-between absolute top-0 z-20">
                 <div className="flex gap-4 items-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z"/></svg>
                    <span>File</span><span>Edit</span><span>View</span><span>Window</span>
                 </div>
                 <div className="flex gap-4 items-center">
                    <span>100%</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    <span>Mon 9:41 AM</span>
                 </div>
              </div>
              <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center relative flex flex-col justify-between pt-8 items-center pb-4">
                 {/* The Momentum Dropdown Widget */}
                 <div className="w-[400px] h-32 bg-black/50 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center gap-6 relative z-10 -mt-2">
                    <div className="w-20 h-20 rounded-full relative flex items-center justify-center shrink-0">
                       <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                       {/* Face flies here */}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-white font-medium text-lg mb-1">Momentum</div>
                      <div className="text-sm text-zinc-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                        Listening for commands...
                      </div>
                    </div>
                 </div>

                 {/* The Mac Dock */}
                 <div className="h-16 px-4 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl flex items-center gap-4 relative z-10 mt-auto">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">🌐</div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-xl text-white">✉️</div>
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-xl text-white">👾</div>
                    <div className="w-1 px-px h-10 bg-white/20 rounded-full mx-1" />
                    <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center text-xl">⚙️</div>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. APPLICATIONS (HORIZONTAL SCROLL - 5 PANELS) */}
        <div ref={horizontalScrollRef} className="relative h-[500vh] w-full border-t border-zinc-900">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center">
            
            {/* The global face moves to y: -40vh here and Stays locked at the top! */}

            <motion.div 
              style={{ x: \`-\${hProgress * 80}%\` }}
              className="flex w-[500vw] h-full pt-20" /* Added pt-20 to push content down below the locked face */
            >
              
              {/* PANEL 1: ENGINEERING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">VS Code</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Terminal</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">GitHub</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Software <br/>Engineering.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum doesn't just write snippets. It physically drives your IDE, reads your entire repository, runs local tests, and pushes bug fixes while you sleep.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col h-[500px] text-sm">
                      <div className="flex bg-[#2d2d2d] items-center px-4 py-2 border-b border-[#3c3c3c]">
                         <div className="flex gap-1.5 mr-4"><div className="w-3 h-3 rounded-full bg-[#ff5f56]" /><div className="w-3 h-3 rounded-full bg-[#ffbd2e]" /><div className="w-3 h-3 rounded-full bg-[#27c93f]" /></div>
                         <div className="text-[#cccccc] text-xs font-mono">auth.ts — momentum-core</div>
                      </div>
                      <div className="flex flex-1 overflow-hidden">
                        <div className="w-12 bg-[#1e1e1e] flex flex-col items-center py-4 gap-4 border-r border-[#3c3c3c]">
                           <div className="w-6 h-6 bg-zinc-700/50 rounded" />
                           <div className="w-6 h-6 bg-zinc-700/50 rounded" />
                        </div>
                        <div className="flex-1 p-4 font-mono text-[#d4d4d4] flex flex-col relative">
                           <div><span className="text-[#569cd6]">import</span> {'{'} <span className="text-[#9cdcfe]">createHash</span> {'}'} <span className="text-[#569cd6]">from</span> <span className="text-[#ce9178]">'crypto'</span>;</div>
                           <div className="mt-2"><span className="text-[#569cd6]">export async function</span> <span className="text-[#dcdcaa]">verifyToken</span>(token: <span className="text-[#4ec9b0]">string</span>) {'{'}</div>
                           <div className="ml-4"><span className="text-[#569cd6]">const</span> decoded = <span className="text-[#569cd6]">await</span> <span className="text-[#dcdcaa]">jwt_decode</span>(token);</div>
                           <AnimatePresence>
                             {animationStep >= 1 && activeSection === 2 && (
                               <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4 text-[#f14c4c] bg-[#f14c4c]/10 px-1 inline-block">
                                 // TypeError: jwt_decode is not a function
                               </motion.div>
                             )}
                             {animationStep === 2 && activeSection === 2 && (
                               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-4 text-[#4fc1ff] bg-[#4fc1ff]/10 px-1 inline-block mt-2">
                                 <span className="text-[#569cd6]">const</span> decoded = <span className="text-[#569cd6]">await</span> <span className="text-[#4ec9b0]">jwt</span>.<span className="text-[#dcdcaa]">verify</span>(token, <span className="text-[#4fc1ff]">process.env.SECRET</span>);
                               </motion.div>
                             )}
                           </AnimatePresence>
                           <div>{'}'}</div>
                           <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#1e1e1e] border-t border-[#3c3c3c] p-3 overflow-hidden flex flex-col justify-end">
                              <div className="text-[#cccccc]">~/projects/momentum-core <span className="text-[#27c93f]">main</span></div>
                              {animationStep >= 1 && activeSection === 2 && <div className="text-[#f14c4c]">$ npm run test <br/>✖ 1 failing (TypeError)</div>}
                              {animationStep === 2 && activeSection === 2 && <div className="text-[#27c93f]">$ momentum fix <br/>Applying patch to auth.ts... <br/>✔ 1 passing. Pushing to origin/main.</div>}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 2: CAD & 3D */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">AutoCAD</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">SolidWorks</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Blender</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Automobile & <br/>3D Design.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">From complex engine meshes to complete automobile designing. Momentum clicks through CAD menus, sets physical constraints, and processes aerodynamic simulations completely autonomously.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col h-[500px] text-xs text-zinc-300">
                       <div className="h-10 bg-[#2a2a2a] border-b border-zinc-700 flex items-center px-4 justify-between">
                          <div className="flex gap-4 items-center">
                            <div className="font-medium text-white text-sm">SolidDesign Pro 2026</div>
                            <div className="flex gap-4 text-zinc-400"><span>File</span><span>Edit</span><span>Sketch</span><span>Features</span><span>Evaluate</span></div>
                          </div>
                       </div>
                       <div className="flex-1 flex overflow-hidden">
                          {/* Sidebar */}
                          <div className="w-56 bg-[#252525] border-r border-zinc-700 p-3 flex flex-col gap-2">
                             <div className="font-semibold text-zinc-300 mb-3 uppercase tracking-wider text-[10px]">Assembly Tree</div>
                             <div className="flex items-center gap-2"><div className="w-4 h-4 bg-zinc-600 rounded-sm flex items-center justify-center">-</div> Chassis_V8_Main</div>
                             <div className="flex items-center gap-2 ml-4 text-blue-400"><div className="w-3 h-3 border border-blue-500 rounded-full" /> Powertrain_Block</div>
                             <div className="flex items-center gap-2 ml-4"><div className="w-3 h-3 bg-zinc-600/50 rounded-sm" /> Suspension_Mounts</div>
                             <div className="flex items-center gap-2 ml-4"><div className="w-3 h-3 bg-zinc-600/50 rounded-sm" /> Aerodynamics_Mesh</div>
                          </div>
                          {/* Rich HTML/SVG 3D Wireframe */}
                          <div className="flex-1 bg-[#111] relative flex items-center justify-center overflow-hidden">
                             {/* CSS Grid overlay */}
                             <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)' }} />
                             
                             {/* SVg Wireframe Car */}
                             <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                <svg width="300" height="150" viewBox="0 0 300 150">
                                   <path d="M40 100 L60 60 L120 45 L210 45 L255 65 L285 100 Z" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
                                   <path d="M60 60 L95 60 L120 45" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
                                   <circle cx="85" cy="100" r="18" fill="none" stroke="#10b981" strokeWidth="3" />
                                   <circle cx="235" cy="100" r="18" fill="none" stroke="#10b981" strokeWidth="3" />
                                   <line x1="40" y1="100" x2="285" y2="100" stroke="#3b82f6" strokeWidth="2" />
                                   <path d="M120 45 L120 100 M210 45 L210 100" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
                                </svg>
                             </div>
                             
                             <AnimatePresence>
                               {animationStep >= 1 && activeSection === 3 && (
                                  <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="absolute top-1/4 right-8 bg-[#252525] border border-blue-500 rounded shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 w-48 z-10 backdrop-blur-md">
                                     <div className="font-semibold text-white mb-3 border-b border-zinc-600 pb-2">Mesh Tolerance</div>
                                     <div className="flex justify-between items-center mb-2"><span>Clearance:</span> <span className="bg-black px-2 py-1 text-emerald-400 border border-emerald-500/30 rounded">0.05mm</span></div>
                                     <div className="flex justify-between items-center mb-2 text-zinc-400"><span>Faces:</span> <span>12,404</span></div>
                                     <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden"><div className="w-[85%] h-full bg-blue-500" /></div>
                                  </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 3: GAME DEV */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Unreal Engine</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Unity</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Game Dev & <br/>Environments.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Building worlds takes hours. Momentum places assets, bakes lighting, adjusts collision meshes, and writes C# game logic scripts natively inside your engine's editor.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-[#1a1a1a] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col h-[500px] text-xs text-zinc-300">
                       <div className="h-10 bg-[#252525] border-b border-black flex items-center px-4 gap-6 font-medium">
                          <span className="text-white">UnrealEditor</span>
                          <span className="text-zinc-500">File</span><span className="text-zinc-500">Edit</span><span className="text-zinc-500">Window</span>
                       </div>
                       <div className="flex-1 flex overflow-hidden">
                          {/* Outliner */}
                          <div className="w-48 bg-[#202020] border-r border-black p-2 flex flex-col gap-1 overflow-y-auto">
                             <div className="bg-[#353535] text-white px-2 py-1 mb-2 font-bold rounded-sm text-[10px]">OUTLINER</div>
                             <div className="px-2 py-1 hover:bg-[#353535] rounded-sm cursor-pointer">DirectionalLight</div>
                             <div className="px-2 py-1 hover:bg-[#353535] rounded-sm cursor-pointer">SkySphere</div>
                             <div className="px-2 py-1 bg-[#155a8a] text-white rounded-sm cursor-pointer flex justify-between"><span>PlayerStart</span> <span className="text-yellow-400">★</span></div>
                             <div className="px-2 py-1 hover:bg-[#353535] rounded-sm cursor-pointer text-zinc-500">PostProcessVolume</div>
                          </div>
                          {/* Viewport */}
                          <div className="flex-1 relative flex flex-col">
                             <div className="h-8 bg-[#2a2a2a] border-b border-black flex items-center px-2 gap-2 text-[10px]">
                               <div className="px-2 py-1 bg-[#404040] rounded text-white">Perspective</div>
                               <div className="px-2 py-1 bg-[#404040] rounded text-white">Lit</div>
                             </div>
                             <div className="flex-1 bg-[#111] relative overflow-hidden flex items-center justify-center">
                                {/* Grid */}
                                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '50px 50px', transform: 'perspective(400px) rotateX(70deg) scale(2)', transformOrigin: 'top center' }} />
                                
                                {/* Real CSS 3D Cube */}
                                <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
                                   <motion.div 
                                     animate={{ rotateX: [0, 360], rotateY: [0, 360] }} 
                                     transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                     className="w-24 h-24 relative"
                                     style={{ transformStyle: 'preserve-3d' }}
                                   >
                                      <div className="absolute inset-0 border border-emerald-400/50 bg-emerald-500/10" style={{ transform: 'translateZ(48px)' }} />
                                      <div className="absolute inset-0 border border-emerald-400/50 bg-emerald-500/10" style={{ transform: 'rotateY(180deg) translateZ(48px)' }} />
                                      <div className="absolute inset-0 border border-emerald-400/50 bg-emerald-500/10" style={{ transform: 'rotateY(90deg) translateZ(48px)' }} />
                                      <div className="absolute inset-0 border border-emerald-400/50 bg-emerald-500/10" style={{ transform: 'rotateY(-90deg) translateZ(48px)' }} />
                                      <div className="absolute inset-0 border border-emerald-400/50 bg-emerald-500/10" style={{ transform: 'rotateX(90deg) translateZ(48px)' }} />
                                      <div className="absolute inset-0 border border-emerald-400/50 bg-emerald-500/10" style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} />
                                   </motion.div>
                                </div>
                                
                                {/* Momentum Context */}
                                <AnimatePresence>
                                 {animationStep >= 1 && activeSection === 4 && (
                                   <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute bottom-4 right-4 bg-[#252525] border border-orange-500 p-3 rounded shadow-lg">
                                     <div className="text-orange-400 font-bold mb-1">Momentum Event Graph</div>
                                     <div className="text-white">Adding OnComponentBeginOverlap...</div>
                                   </motion.div>
                                 )}
                                </AnimatePresence>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 4: MARKETING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Meta Ads</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">X / Twitter</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">HubSpot</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Marketing & <br/>Analytics.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum doesn't just draft tweets. It physically logs into your Ads Manager, duplicates underperforming campaigns, adjusts A/B testing budgets, and generates daily ROI reports.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-2xl flex flex-col h-[500px] text-sm text-zinc-800">
                      <div className="h-14 bg-zinc-50 border-b border-zinc-200 flex items-center px-6 justify-between">
                         <div className="font-bold text-lg text-blue-600 flex items-center gap-2">
                           <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">M</div> Ads Manager
                         </div>
                         <div className="px-3 py-1.5 bg-zinc-200 rounded text-xs font-medium">Campaigns</div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col gap-6 bg-zinc-50/50">
                         {/* Stats Grid */}
                         <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm">
                              <div className="text-zinc-500 text-xs mb-1">Spend</div>
                              <div className="text-xl font-bold">$4,250.00</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm">
                              <div className="text-zinc-500 text-xs mb-1">Conversions</div>
                              <div className="text-xl font-bold">142</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm">
                              <div className="text-zinc-500 text-xs mb-1">CPA</div>
                              <div className="text-xl font-bold text-emerald-600">$29.92</div>
                            </div>
                         </div>
                         
                         {/* Table */}
                         <div className="bg-white border border-zinc-200 rounded-lg flex-1 overflow-hidden flex flex-col">
                            <div className="flex bg-zinc-100 border-b border-zinc-200 p-3 text-xs font-semibold text-zinc-600">
                               <div className="flex-1">Campaign Name</div>
                               <div className="w-24 text-right">Budget</div>
                               <div className="w-24 text-right">Status</div>
                            </div>
                            <div className="flex p-3 border-b border-zinc-100 items-center text-xs">
                               <div className="flex-1 font-medium">Q4_Retargeting_US</div>
                               <div className="w-24 text-right text-zinc-500">$100/day</div>
                               <div className="w-24 text-right"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Active</span></div>
                            </div>
                            <div className="flex p-3 border-b border-zinc-100 items-center text-xs relative overflow-hidden">
                               <div className="flex-1 font-medium">Lookalike_1%_EU</div>
                               <div className="w-24 text-right text-zinc-500">$50/day</div>
                               <div className="w-24 text-right"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Paused</span></div>
                               
                               {/* Momentum Edit Animation */}
                               <AnimatePresence>
                                 {animationStep >= 1 && activeSection === 5 && (
                                   <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-blue-50/90 border-2 border-blue-500 flex items-center px-3 justify-between">
                                      <div className="text-blue-700 font-medium text-xs flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                        Momentum: Duplicating campaign...
                                      </div>
                                      <div className="text-xs bg-white border border-blue-200 px-2 py-1 rounded text-blue-600">Setting budget to $75/day</div>
                                   </motion.div>
                                 )}
                               </AnimatePresence>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 5: COMMUNICATIONS / MEETINGS */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Zoom</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">WhatsApp</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Slack</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Meetings & <br/>Communications.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">It literally attends meetings for you. Momentum can join Zoom calls, transcribe discussions, extract action items, and immediately message your team on WhatsApp or Slack with the updates.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex h-[500px] text-sm text-zinc-200">
                      
                      {/* Zoom Side */}
                      <div className="flex-1 border-r border-zinc-800 flex flex-col bg-black">
                         <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 font-bold text-white text-xs gap-2">
                           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Recording
                         </div>
                         <div className="flex-1 p-2 grid grid-cols-2 grid-rows-2 gap-2">
                            {/* Zoom User 1 (Active Speaking) */}
                            <div className="bg-zinc-800 rounded flex flex-col items-center justify-center relative border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-2xl font-medium mb-2">SC</div>
                              <div className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-white absolute bottom-2 left-2">Sarah (Client)</div>
                              {/* Audio wave */}
                              <div className="absolute top-2 right-2 flex gap-1 items-center h-4">
                                <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-green-400 rounded-full" />
                                <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-green-400 rounded-full" />
                                <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-green-400 rounded-full" />
                              </div>
                            </div>
                            
                            {/* Zoom User 2 */}
                            <div className="bg-zinc-800 rounded flex flex-col items-center justify-center relative">
                              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-2xl font-medium mb-2">ME</div>
                              <div className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-white absolute bottom-2 left-2">Mark (Engineering)</div>
                            </div>
                            
                            {/* Zoom User 3 */}
                            <div className="bg-zinc-800 rounded flex flex-col items-center justify-center relative">
                              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-2xl font-medium mb-2">ED</div>
                              <div className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-white absolute bottom-2 left-2">Elena (Design)</div>
                            </div>
                            
                            {/* Momentum AI Bot */}
                            <div className="bg-zinc-900 rounded border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden">
                              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-2 border border-zinc-700">
                                <div className="w-4 h-4 bg-white rounded-md shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                              </div>
                              <div className="text-zinc-500 font-medium text-xs">Momentum AI</div>
                              <div className="text-[10px] text-zinc-600 mt-1">Taking notes...</div>
                            </div>
                         </div>
                      </div>

                      {/* WhatsApp Side */}
                      <div className="w-[40%] flex flex-col bg-[#0b141a]">
                         <div className="h-12 bg-[#202c33] flex items-center px-4 gap-3">
                           <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-medium">ME</div>
                           <div className="font-medium text-white text-xs">Mark (Engineering)</div>
                         </div>
                         <div className="flex-1 p-4 flex flex-col gap-3 justify-end overflow-hidden bg-[#0b141a] relative">
                            {/* Pattern */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                            
                            <AnimatePresence>
                              {animationStep >= 1 && activeSection === 6 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#005c4b] text-[#e9edef] p-2 rounded-lg rounded-tr-sm self-end max-w-[90%] text-xs shadow-sm relative z-10">
                                   Hey Mark, based on the client call just now, Sarah approved the V2 mockups. She wants the API integration done by Friday. 
                                   <div className="text-[9px] text-[#8696a0] text-right mt-1">11:42 AM</div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                         <div className="h-12 bg-[#202c33] flex items-center px-4 relative z-10">
                           <div className="w-full h-8 bg-[#2a3942] rounded-full px-4 flex items-center text-[#8696a0] text-xs">Type a message</div>
                         </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>

        {/* 4. CONCLUSION: NO SUBSCRIPTIONS */}
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)]" />
           <div className="relative z-10 max-w-4xl flex flex-col items-center">
             <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-sm font-medium mb-8">A Revolutionary Proposition</div>
             <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8">Own your workforce. <br/>Don't rent it.</h2>
             <p className="text-2xl text-zinc-300 max-w-3xl leading-relaxed mb-12">
               We believe software should belong to you. SaaS companies are charging massive monthly fees for simple API wrappers. Momentum uses zero APIs. It runs 100% locally on your machine, respects your absolute privacy, and works tirelessly inside your native applications.
               <br/><br/>
               <span className="text-white font-medium">A single, one-time fee of $30. Yours forever.</span>
             </p>
             <Link href="/newagent" className="inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
               Deploy Momentum for $30
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/app/page.tsx', code);
