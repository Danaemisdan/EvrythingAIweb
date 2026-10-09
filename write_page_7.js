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
    1: { x: "0px", y: "4vh", scale: 0.35 },    // Snapped perfectly into the Mac screen dropdown widget
    2: { x: "0px", y: "-35vh", scale: 0.45 },  // Locked to top center of screen while horizontally scrolling
    3: { x: "0px", y: "-35vh", scale: 0.45 },
    4: { x: "0px", y: "-35vh", scale: 0.45 },
    5: { x: "0px", y: "-35vh", scale: 0.45 },
    6: { x: "0px", y: "-35vh", scale: 0.45 },
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
        <div className="min-h-screen flex items-center justify-center px-6 md:px-24">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] max-w-5xl text-center">
            Momentum is not an assistant. It's a relentless personal friend. <br/>
            <span className="text-zinc-500 block mt-8 text-2xl md:text-3xl max-w-4xl mx-auto font-normal">It doesn't just do a task once and leave. It stays by your side, learns your unique workflows, and autonomously drives your software day and night.</span>
          </h2>
        </div>

        {/* 2. HOW IT LOOKS & HOW TO USE IT */}
        <div ref={howRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-zinc-950 relative border-t border-zinc-900 overflow-hidden">
           {/* Soft glow behind Mac mockup */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
           
           <div className="max-w-4xl text-center mb-16 relative z-10">
             <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-sm font-medium mb-8 inline-block">Native OS Integration</div>
             <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">Always there when you need it.</h2>
             <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
               Summon it instantly by saying <span className="text-white italic">"Momentum, are you there?"</span> or just hit <kbd className="bg-zinc-800 px-3 py-1 rounded-md font-mono text-sm border border-zinc-700 text-white mx-1">Cmd + M</kbd>. Momentum continuously watches your screen and can autonomously offer help when you're stuck.
             </p>
           </div>
           
           {/* Huge Mac Mockup */}
           <div className="w-full max-w-6xl aspect-[16/10] bg-black rounded-[2rem] border-[16px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col z-10">
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
              <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center relative flex flex-col items-center pt-8 pb-4">
                 
                 {/* The Momentum Dropdown Widget */}
                 <div className="w-[420px] h-32 bg-black/60 backdrop-blur-3xl border border-white/20 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex items-center gap-6 relative z-10 -mt-2">
                    <div className="w-20 h-20 rounded-full relative flex items-center justify-center shrink-0">
                       <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                       {/* Global Face flies into here */}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-white font-medium text-lg mb-1">Momentum AI</div>
                      <div className="text-sm text-zinc-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                        Listening for commands...
                      </div>
                    </div>
                 </div>

                 {/* The Mac Dock */}
                 <div className="h-16 px-4 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl flex items-center gap-4 relative z-10 mt-auto mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer">🌐</div>
                    <div className="w-12 h-12 bg-blue-500/80 rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer">✉️</div>
                    <div className="w-12 h-12 bg-purple-500/80 rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer">👾</div>
                    <div className="w-1 px-px h-10 bg-white/20 rounded-full mx-1" />
                    <div className="w-12 h-12 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer">⚙️</div>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. APPLICATIONS (HORIZONTAL SCROLL - 5 PANELS) */}
        <div ref={horizontalScrollRef} className="relative h-[500vh] w-full border-t border-zinc-900">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center">
            
            <motion.div 
              style={{ x: \`-\${hProgress * 80}%\` }}
              className="flex w-[500vw] h-full pt-16" 
            >
              
              {/* PANEL 1: ENGINEERING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">VS Code</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Terminal</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Software <br/>Engineering.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum physically drives your IDE. It reads your entire repository, runs local tests, debugging errors in the terminal, and pushes bug fixes while you sleep.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-zinc-800 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col h-[500px] text-sm relative">
                      {/* Premium IDE Image Background */}
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-left opacity-30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent" />
                      
                      <div className="flex bg-[#2d2d2d]/80 backdrop-blur items-center px-4 py-2 border-b border-[#3c3c3c] relative z-10">
                         <div className="flex gap-1.5 mr-4"><div className="w-3 h-3 rounded-full bg-[#ff5f56]" /><div className="w-3 h-3 rounded-full bg-[#ffbd2e]" /><div className="w-3 h-3 rounded-full bg-[#27c93f]" /></div>
                         <div className="text-[#cccccc] text-xs font-mono">auth.ts — momentum-core</div>
                      </div>
                      
                      {/* Momentum Action Overlay */}
                      <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl z-20 min-w-[280px]">
                         <div className="flex items-center gap-3 mb-3">
                           <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                           <span className="text-white font-medium text-sm">Momentum AI</span>
                         </div>
                         <div className="text-zinc-300 text-xs font-mono">
                           <AnimatePresence mode="wait">
                              {animationStep === 0 && <motion.span key="1" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>$ npm run test</motion.span>}
                              {animationStep === 1 && <motion.span key="2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-red-400">✖ 1 failing (TypeError)</motion.span>}
                              {animationStep === 2 && <motion.span key="3" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-emerald-400">✔ 1 passing. Pushing to origin/main.</motion.span>}
                           </AnimatePresence>
                         </div>
                         <div className="w-full h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden"><motion.div className="h-full bg-emerald-500" animate={{ width: animationStep === 2 ? "100%" : "60%" }} /></div>
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
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Automobile & <br/>3D Design.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum clicks through CAD menus, sets physical constraints, and processes aerodynamic simulations completely autonomously. It's like having a senior industrial designer on staff.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-zinc-700 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col h-[500px] relative">
                       <div className="h-10 bg-[#2a2a2a]/90 backdrop-blur border-b border-zinc-700 flex items-center px-4 justify-between relative z-10">
                          <div className="flex gap-4 items-center">
                            <div className="font-medium text-white text-sm">SolidDesign Pro 2026</div>
                            <div className="flex gap-4 text-zinc-400 text-xs"><span>File</span><span>Edit</span><span>Sketch</span><span>Features</span></div>
                          </div>
                       </div>
                       
                       {/* High Quality Real Background */}
                       <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
                          <div className="absolute inset-0 bg-black/40" />
                          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                          
                          {/* Momentum Action Overlay */}
                          <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl z-20 min-w-[250px]">
                             <div className="flex items-center gap-3 mb-3">
                               <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                               <span className="text-white font-medium text-sm">Momentum AI</span>
                             </div>
                             <div className="text-zinc-300 text-xs">Adjusting aerodynamic mesh...</div>
                             <div className="flex justify-between text-xs mt-3 text-zinc-500">
                               <span>Drag Coeff:</span> <span className="text-blue-400">0.24cd</span>
                             </div>
                             <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden"><motion.div className="h-full bg-blue-500" animate={{ width: animationStep >= 1 ? "100%" : "30%" }} /></div>
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
                    <div className="w-full bg-[#1a1a1a] rounded-xl overflow-hidden border border-zinc-800 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col h-[500px] relative">
                       <div className="h-10 bg-[#252525]/90 backdrop-blur border-b border-black flex items-center px-4 gap-6 font-medium relative z-10 text-xs">
                          <span className="text-white">UnrealEditor</span>
                          <span className="text-zinc-500">File</span><span className="text-zinc-500">Edit</span><span className="text-zinc-500">Window</span>
                       </div>
                       
                       {/* High Quality Real Background */}
                       <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
                          <div className="absolute inset-0 bg-black/20" />
                          
                          {/* Momentum Action Overlay */}
                          <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl z-20 min-w-[250px]">
                             <div className="flex items-center gap-3 mb-3">
                               <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                               <span className="text-white font-medium text-sm">Momentum AI</span>
                             </div>
                             <div className="text-zinc-300 text-xs">Baking lighting for 'Exterior_Main'...</div>
                             <div className="w-full h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden"><motion.div className="h-full bg-orange-500" animate={{ width: animationStep === 2 ? "100%" : "45%" }} /></div>
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
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">HubSpot</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Marketing & <br/>Analytics.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum physically logs into your Ads Manager, duplicates underperforming campaigns, adjusts A/B testing budgets, and generates daily ROI reports for you.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col h-[500px] relative">
                       <div className="h-14 bg-zinc-50/90 backdrop-blur border-b border-zinc-200 flex items-center px-6 justify-between relative z-10">
                          <div className="font-bold text-lg text-blue-600 flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">M</div> Ads Manager
                          </div>
                       </div>
                       
                       {/* High Quality Real Background */}
                       <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-left">
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
                          
                          {/* Momentum Action Overlay */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl border border-zinc-200 p-6 rounded-2xl shadow-2xl z-20 w-[320px]">
                             <div className="flex items-center gap-3 mb-4">
                               <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                               <span className="text-zinc-900 font-bold text-sm">Momentum AI</span>
                             </div>
                             <div className="text-zinc-600 text-sm mb-4">Duplicating underperforming ad set and increasing daily budget by 15% based on ROAS threshold.</div>
                             <div className="flex gap-2">
                               <div className="px-3 py-1.5 bg-zinc-100 rounded text-xs font-medium text-zinc-500">CPA: $24.50</div>
                               <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-bold">New Budget: $150</div>
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
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Meetings & <br/>Comms.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">It literally attends meetings for you. Momentum joins Zoom calls, extracts action items, and immediately messages your team on WhatsApp with the updates.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex h-[500px] text-sm text-zinc-200">
                      
                      {/* Zoom Side (Pure HTML) */}
                      <div className="flex-1 border-r border-zinc-800 flex flex-col bg-[#111]">
                         <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 font-bold text-white text-xs gap-2">
                           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Recording
                         </div>
                         <div className="flex-1 p-3 grid grid-cols-2 grid-rows-2 gap-3">
                            {/* Zoom User 1 (Active Speaking) */}
                            <div className="bg-zinc-800 rounded-lg flex flex-col items-center justify-center relative border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)] overflow-hidden">
                              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold mb-2">SC</div>
                              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white font-medium">Sarah (Client)</div>
                              <div className="absolute top-2 right-2 flex gap-1 items-center h-4">
                                <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-green-400 rounded-full" />
                                <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-green-400 rounded-full" />
                                <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-green-400 rounded-full" />
                              </div>
                            </div>
                            
                            {/* Zoom User 2 */}
                            <div className="bg-zinc-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-2xl font-bold mb-2">ME</div>
                              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white font-medium">Mark (Eng)</div>
                            </div>
                            
                            {/* Momentum AI Bot */}
                            <div className="bg-zinc-900 rounded-lg border border-zinc-700/50 flex flex-col items-center justify-center relative overflow-hidden col-span-2">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                  <div className="w-3 h-3 bg-black rounded-sm" />
                                </div>
                                <span className="font-bold text-white text-sm">Momentum AI</span>
                              </div>
                              <div className="text-xs text-emerald-400">Transcribing and extracting action items...</div>
                            </div>
                         </div>
                      </div>

                      {/* WhatsApp Side */}
                      <div className="w-[45%] flex flex-col bg-[#0b141a]">
                         <div className="h-14 bg-[#202c33] flex items-center px-4 gap-3 border-b border-zinc-800">
                           <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-bold">ME</div>
                           <div className="font-medium text-white text-sm">Mark (Eng)</div>
                         </div>
                         <div className="flex-1 p-4 flex flex-col gap-3 justify-end overflow-hidden bg-[#0b141a] relative">
                            {/* Subtle WhatsApp Pattern */}
                            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                            
                            <AnimatePresence>
                              {animationStep >= 1 && activeSection === 6 && (
                                <motion.div initial={{ opacity: 0, x: 20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} className="bg-[#005c4b] text-[#e9edef] p-3 rounded-xl rounded-tr-sm self-end max-w-[90%] text-xs shadow-md relative z-10 leading-relaxed">
                                   <div className="font-bold text-emerald-400 mb-1 text-[10px] uppercase tracking-wider">Momentum Update</div>
                                   Sarah just approved the V2 mockups on the call. She requested the API integration be completed by Friday EOD.
                                   <div className="text-[9px] text-[#8696a0] text-right mt-2">11:42 AM</div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                         <div className="h-14 bg-[#202c33] flex items-center px-4 relative z-10">
                           <div className="w-full h-9 bg-[#2a3942] rounded-full px-4 flex items-center text-[#8696a0] text-xs">Type a message</div>
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
