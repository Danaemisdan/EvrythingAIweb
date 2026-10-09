const fs = require('fs');

const code = `"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import Link from "next/link";
import { AgentFace, AgentState } from "@/components/AgentFace";

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [faceState, setFaceState] = useState<AgentState>("idle");

  const introRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  
  const introProgress = useMotionValue(0);
  const [hProgress, setHProgress] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      
      if (introRef.current) {
        const rect = introRef.current.getBoundingClientRect();
        let progress = -rect.top / rect.height;
        progress = Math.max(0, Math.min(1, progress));
        introProgress.set(progress);
      }

      let newSection = 0;
      
      if (howRef.current && horizontalScrollRef.current) {
         const howRect = howRef.current.getBoundingClientRect();
         const hRect = horizontalScrollRef.current.getBoundingClientRect();
         
         if (howRect.top > vh * 0.5) {
            newSection = 0; 
         } else if (howRect.top <= vh * 0.5 && hRect.top > vh * 0.5) {
            newSection = 1; 
         } else {
            const totalScrollable = hRect.height - vh;
            let progress = -hRect.top / totalScrollable;
            progress = Math.max(0, Math.min(1, progress));
            setHProgress(progress);
            
            if (hRect.bottom < vh * 0.5) {
               newSection = 9; // Conclusion (shifted by +2 panels)
            } else {
               if (progress < 0.14) newSection = 2; // Eng
               else if (progress < 0.28) newSection = 3; // Game Dev
               else if (progress < 0.42) newSection = 4; // Video Editing (NEW)
               else if (progress < 0.56) newSection = 5; // Auto
               else if (progress < 0.7) newSection = 6; // Data Science (NEW)
               else if (progress < 0.84) newSection = 7; // Marketing
               else newSection = 8; // Meetings
               
               const segmentProgress = (progress % 0.14) * 7.14; // Normalize to 0-1
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

  useEffect(() => {
    if (activeSection === 0) setFaceState("idle");
    else if (activeSection === 1) setFaceState("speaking"); 
    else if (activeSection >= 2 && activeSection <= 8) setFaceState(animationStep === 1 ? "error" : "thinking");
    else if (activeSection === 9) setFaceState("idle");
  }, [activeSection, animationStep]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const faceVariants = {
    0: { x: "0px", y: "-15vh", scale: 1 },
    1: { x: "0px", y: "0vh", scale: 0.8 },      // Center of Mac screen, large
    2: { x: "0px", y: "-30vh", scale: 0.5 },     // Lowered from -38vh to prevent "looking fully upwards"
    3: { x: "0px", y: "-30vh", scale: 0.5 },
    4: { x: "0px", y: "-30vh", scale: 0.5 },
    5: { x: "0px", y: "-30vh", scale: 0.5 },
    6: { x: "0px", y: "-30vh", scale: 0.5 },
    7: { x: "0px", y: "-30vh", scale: 0.5 },
    8: { x: "0px", y: "-30vh", scale: 0.5 },
    9: { x: "0px", y: "-25vh", scale: 0.8 },
  };

  return (
    <div className="bg-black text-white selection:bg-white/20 font-sans min-h-screen relative overflow-x-clip">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-md border-b border-white/5 mix-blend-difference">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">Momentum</Link>
        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Back to Home</Link>
      </nav>

      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <motion.div animate={faceVariants[activeSection as keyof typeof faceVariants]} transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.8 }} className="relative pointer-events-auto">
          {activeSection === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-center">
              <motion.div style={{ scale: portalScale, opacity: portalOpacity }} className="w-[54px] h-[56px] bg-white rounded-[12px] origin-center shadow-[0_0_80px_rgba(255,255,255,1)]" />
            </div>
          )}
          <motion.div style={{ opacity: activeSection === 0 ? faceOpacityIntro as any : 1 }} className={activeSection === 0 ? "" : "transition-opacity duration-1000 ease-in drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"}>
            <AgentFace state={faceState} size={180} />
          </motion.div>
        </motion.div>
      </div>

      {/* 1. HERO */}
      <div ref={introRef} className="h-[250vh] w-full absolute top-0 left-0 z-0" />
      <motion.div style={{ opacity: heroOpacity, y: heroY }} className="fixed inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-20 mt-[25vh]">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05]">Intelligence that <br /><span className="text-zinc-500">does the work.</span></h1>
        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed mx-auto">Scroll down to enter the portal and see Momentum execute complex tasks across applications.</p>
      </motion.div>
      <div className="h-[250vh]" />

      <div className="relative z-40 bg-black border-t border-zinc-900 pt-32">
        <div className="min-h-[50vh] flex items-center justify-center px-6 md:px-24 mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] max-w-5xl text-center">
            Momentum is not an assistant. It's a relentless personal friend. <br/>
            <span className="text-zinc-500 block mt-8 text-2xl md:text-3xl max-w-4xl mx-auto font-normal">It doesn't just do a task once and leave. It stays by your side, learns your unique workflows, and autonomously drives your software day and night.</span>
          </h2>
        </div>

        {/* 2. MAC OS SCREEN (NOW WITH FLOATING TASKS BEHIND FACE) */}
        <div ref={howRef} className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
           <div className="w-full max-w-6xl aspect-[16/10] bg-black rounded-[2rem] border-[16px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col z-10">
              <div className="h-7 bg-black/40 backdrop-blur-md border-b border-white/10 w-full flex items-center px-4 text-[11px] font-medium text-white/80 justify-between absolute top-0 z-20">
                 <div className="flex gap-4 items-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z"/></svg>
                    <span>File</span><span>Edit</span><span>View</span><span>Window</span>
                 </div>
                 <div className="flex gap-4 items-center"><span>100%</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg><span>Mon 9:41 AM</span></div>
              </div>
              
              <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center relative flex flex-col items-center justify-center">
                 {/* Floating UIs to make it look active! */}
                 <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-[20%] left-[10%] w-64 bg-black/80 backdrop-blur-md rounded-lg border border-zinc-700 p-4 shadow-xl">
                    <div className="flex gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-red-500"/><div className="w-2 h-2 rounded-full bg-yellow-500"/><div className="w-2 h-2 rounded-full bg-green-500"/></div>
                    <div className="font-mono text-[10px] text-zinc-400">
                      <div>$ npm run build</div>
                      <div className="text-blue-400">Compiling 244 modules...</div>
                      <div className="text-emerald-400">Success! Built in 4.2s</div>
                    </div>
                 </motion.div>
                 
                 <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-[20%] right-[10%] w-72 bg-white/90 backdrop-blur-md rounded-lg border border-zinc-200 p-4 shadow-xl text-black">
                    <div className="text-xs font-bold mb-2">Analyzing Data Trends</div>
                    <div className="flex items-end gap-1 h-12">
                      <div className="w-4 bg-blue-500 h-[30%]" /><div className="w-4 bg-blue-500 h-[50%]" /><div className="w-4 bg-blue-500 h-[80%]" /><div className="w-4 bg-emerald-500 h-[100%]" />
                    </div>
                 </motion.div>

                 <div className="absolute bottom-12 text-center text-white/90 font-medium tracking-wide bg-black/50 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 shadow-lg">
                    Summon it with <kbd className="bg-white/20 px-2 py-1 rounded mx-1 text-sm font-mono border border-white/30 text-white">Cmd + M</kbd>
                 </div>
              </div>
           </div>
        </div>

        {/* 4. APPLICATIONS SCROLL (NOW 7 PANELS WITH HIGH-FIDELITY HTML) */}
        <div ref={horizontalScrollRef} className="relative h-[700vh] w-full border-t border-zinc-900">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center">
            <motion.div style={{ x: \`-\${hProgress * 85.7}%\` }} className="flex w-[700vw] h-full pt-16">
              
              {/* PANEL 1: ENGINEERING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Software <br/>Engineering.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum drives your IDE. It reads your entire repository, runs local tests, debugging errors in the terminal, and pushes bug fixes while you sleep.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border border-zinc-800 bg-[#0d0d0d]">
                       {/* High-fidelity VS Code Replica */}
                       <div className="h-8 bg-[#1e1e1e] border-b border-[#333] flex items-center px-4 gap-4 text-[10px] text-zinc-400">
                          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"/><div className="w-2.5 h-2.5 rounded-full bg-green-500"/></div>
                          <span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span>
                       </div>
                       <div className="flex h-[calc(100%-32px)]">
                          <div className="w-12 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-center py-4 gap-4">
                             <div className="w-6 h-6 bg-zinc-700/50 rounded" />
                             <div className="w-6 h-6 bg-zinc-700/50 rounded" />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <div className="h-8 bg-[#1e1e1e] flex items-center px-3 text-[11px] text-zinc-300 font-mono border-b border-[#333]">
                               <div className="bg-[#1e1e1e] px-4 h-full flex items-center border-t-2 border-blue-500">auth.ts</div>
                            </div>
                            <div className="p-6 font-mono text-xs leading-relaxed overflow-hidden">
                                <div><span className="text-[#569cd6]">import</span> {'{'} <span className="text-[#9cdcfe]">jwt</span> {'}'} <span className="text-[#569cd6]">from</span> <span className="text-[#ce9178]">'jsonwebtoken'</span>;</div>
                                <div className="mt-4"><span className="text-[#569cd6]">export async function</span> <span className="text-[#dcdcaa]">verify</span>(token: <span className="text-[#4ec9b0]">string</span>) {'{'}</div>
                                <div className="pl-4">
                                  <AnimatePresence mode="wait">
                                     {animationStep === 0 && <motion.div key="1" className="text-zinc-400">await jwt_decode(token);</motion.div>}
                                     {animationStep === 1 && <motion.div key="2" className="bg-red-900/30 border-l-2 border-red-500 px-2 py-1 text-red-400">TypeError: jwt_decode is not a function</motion.div>}
                                     {animationStep === 2 && <motion.div key="3" className="text-emerald-400 bg-emerald-900/20 border-l-2 border-emerald-500 px-2 py-1">return await jwt.verify(token, process.env.SECRET);</motion.div>}
                                  </AnimatePresence>
                                </div>
                                <div>{'}'}</div>
                            </div>
                            <div className="h-32 bg-[#1e1e1e] border-t border-[#333] p-3 font-mono text-[10px]">
                                <div className="text-zinc-400 mb-1">TERMINAL</div>
                                {animationStep >= 2 ? <div className="text-emerald-400">✔ Fix applied. Tests passed.</div> : <div className="text-zinc-300">$ running tests...</div>}
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 2: GAME DEV (MASSIVELY IMPROVED NODE UI) */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Game Dev & <br/>Environments.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum physically drives Unreal Engine. It visually connects blueprint nodes, bakes complex lighting, and adjusts collision meshes.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#161616]">
                       {/* Grid Background */}
                       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
                       
                       <div className="h-8 bg-[#252525] border-b border-black flex items-center px-4 text-[10px] text-zinc-400 z-10 relative">UnrealEditor - ThirdPersonMap - Blueprints</div>
                       
                       <div className="p-8 relative w-full h-full">
                          {/* Node 1 */}
                          <div className="absolute top-12 left-10 w-48 bg-[#1e1e1e] border border-black rounded shadow-lg overflow-hidden z-20">
                             <div className="bg-gradient-to-r from-red-800 to-red-900 px-3 py-1 font-bold text-[10px] text-white">Event BeginPlay</div>
                             <div className="p-3 text-[10px]">
                                <div className="flex justify-between items-center"><span className="text-zinc-400">Exec</span> <div className="w-3 h-3 border border-white rounded-full bg-white/20" /></div>
                             </div>
                          </div>
                          
                          {/* Connection Line */}
                          <motion.path 
                             d="M 230 75 C 300 75, 250 150, 350 150" 
                             fill="none" stroke="white" strokeWidth="3" 
                             className="absolute top-0 left-0 z-10"
                             initial={{ pathLength: 0 }}
                             animate={{ pathLength: animationStep >= 1 ? 1 : 0 }}
                             transition={{ duration: 0.5 }}
                          />

                          {/* Node 2 */}
                          <AnimatePresence>
                             {animationStep >= 1 && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-[120px] left-[350px] w-56 bg-[#1e1e1e] border border-blue-500 rounded shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden z-20">
                                   <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-3 py-1 font-bold text-[10px] text-white flex justify-between">
                                      <span>SpawnActor from Class</span>
                                      <span className="italic text-zinc-300">f</span>
                                   </div>
                                   <div className="p-3 text-[10px] flex flex-col gap-2">
                                      <div className="flex items-center gap-2"><div className="w-3 h-3 border border-white rounded-full bg-white/20" /> <span className="text-zinc-300">Exec</span></div>
                                      <div className="flex items-center gap-2"><div className="w-3 h-3 border border-purple-500 rounded-full bg-purple-500/20" /> <span className="text-zinc-300">Class</span> <span className="text-purple-400 bg-black px-1 rounded ml-auto">BP_Enemy</span></div>
                                      <div className="flex items-center gap-2"><div className="w-3 h-3 border border-orange-500 rounded-full bg-orange-500/20" /> <span className="text-zinc-300">Spawn Transform</span></div>
                                   </div>
                                </motion.div>
                             )}
                          </AnimatePresence>
                          
                          {/* Momentum Overlay */}
                          <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl z-30">
                             <div className="flex items-center gap-3 mb-1">
                               <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
                               <span className="text-white font-medium text-xs">Momentum AI</span>
                             </div>
                             <div className="text-zinc-400 text-[10px]">Wiring Spawn logic to BeginPlay...</div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 3: VIDEO EDITING (NEW) */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Video & <br/>Post-Production.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum edits inside Premiere Pro and DaVinci Resolve. It trims silence, automatically grades color, synchronizes multi-cam footage, and renders final exports.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                     <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#1e1e1e] flex flex-col">
                        <div className="h-8 bg-[#2a2a2a] flex items-center px-4 text-[10px] text-zinc-400 font-medium">DaVinci Resolve - Project 1</div>
                        
                        {/* Timeline UI */}
                        <div className="flex-1 flex flex-col p-4 gap-4">
                           <div className="flex-1 bg-black rounded-lg border border-[#333] flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-blue-900/20" />
                              <div className="text-zinc-600 font-medium text-2xl tracking-widest">MEDIA OFFLINE</div>
                              {animationStep >= 1 && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center" />}
                           </div>
                           
                           <div className="h-32 bg-[#111] rounded-lg border border-[#333] p-2 flex flex-col gap-1 relative">
                              <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 left-1/3" />
                              <div className="flex gap-2 items-center text-[10px] text-zinc-500 mb-1"><span>V1</span> <div className="flex-1 h-6 bg-blue-600/30 border border-blue-500/50 rounded flex items-center px-2 text-white">Clip_001.mp4</div></div>
                              <div className="flex gap-2 items-center text-[10px] text-zinc-500"><span>V2</span> <div className="flex-1 h-6 bg-purple-600/30 border border-purple-500/50 rounded flex items-center px-2 text-white overflow-hidden relative">
                                 {animationStep >= 2 && <motion.div initial={{x:-100}} animate={{x:0}} className="w-1/2 h-full bg-purple-500/80 px-2 flex items-center border-r border-white/50">B-Roll_City.mp4</motion.div>}
                              </div></div>
                           </div>
                        </div>

                        <div className="absolute bottom-6 right-6 bg-black/90 backdrop-blur border border-zinc-700 p-4 rounded-xl shadow-2xl">
                           <div className="flex items-center gap-3 mb-2">
                             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                             <span className="text-white font-bold text-xs">Momentum AI</span>
                           </div>
                           <div className="text-zinc-400 text-xs">{animationStep >= 2 ? "B-roll overlaid successfully." : "Analyzing transcript for b-roll insertion..."}</div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* PANEL 4: AUTO 3D */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Automobile & <br/>3D Design.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum clicks through CAD menus, sets physical constraints, and processes aerodynamic simulations completely autonomously. It's like having a senior industrial designer on staff.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-black flex items-center justify-center">
                       {/* Extremely high-tech 3D Grid */}
                       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', transform: 'perspective(500px) rotateX(60deg) scale(2)' }} />
                       
                       <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} style={{ transformStyle: 'preserve-3d' }} className="relative w-48 h-48">
                          {/* Complex CSS Object */}
                          <div className="absolute inset-0 border border-cyan-500/50 bg-cyan-500/10 rounded-full" style={{ transform: 'rotateX(90deg)' }} />
                          <div className="absolute inset-0 border border-cyan-500/50 bg-cyan-500/10 rounded-full" style={{ transform: 'rotateY(90deg)' }} />
                          <div className="absolute inset-0 border border-cyan-500/50 bg-cyan-500/10 rounded-full" />
                          <div className="absolute inset-0 border-2 border-cyan-400 bg-cyan-400/20" style={{ transform: 'scale(0.5)' }} />
                       </motion.div>
                       
                       <div className="absolute top-6 left-6 bg-black/80 backdrop-blur border border-zinc-800 p-4 rounded-xl text-cyan-400 font-mono text-[10px]">
                          <div>TOLERANCE: 0.001mm</div>
                          <div>NODES: 42,010</div>
                          <div>STRESS: <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity }}>OPTIMIZING</motion.span></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 5: DATA SCIENCE (NEW) */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Data Science & <br/>Jupyter.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum writes complex Python pandas scripts, cleans enormous datasets, trains ML models, and generates interactive matplotlib visualizations.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-200 bg-white">
                       <div className="h-10 bg-zinc-100 border-b border-zinc-200 flex items-center px-4 font-mono text-[10px] text-zinc-500">Jupyter Notebook - data_analysis.ipynb</div>
                       <div className="p-6 font-mono text-xs flex flex-col gap-4">
                          <div className="flex gap-2">
                            <div className="text-blue-500">In [1]:</div>
                            <div className="bg-zinc-50 p-2 border border-zinc-200 rounded w-full">
                              <span className="text-green-600">import</span> pandas <span className="text-green-600">as</span> pd<br/>
                              df = pd.read_csv(<span className="text-red-500">'sales.csv'</span>)<br/>
                              df.head()
                            </div>
                          </div>
                          
                          <AnimatePresence>
                             {animationStep >= 1 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                                  <div className="text-red-500">Out[1]:</div>
                                  <div className="bg-white p-2 border border-zinc-200 rounded w-full overflow-hidden text-[10px]">
                                    <table className="w-full text-left text-zinc-600">
                                      <thead><tr className="border-b"><th className="pb-1">date</th><th className="pb-1">revenue</th><th className="pb-1">region</th></tr></thead>
                                      <tbody>
                                        <tr className="border-b"><td className="py-1">2026-01</td><td>$4,200</td><td>NA</td></tr>
                                        <tr className="border-b"><td className="py-1">2026-02</td><td>$NaN</td><td>EU</td></tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </motion.div>
                             )}
                          </AnimatePresence>

                          <AnimatePresence>
                             {animationStep >= 2 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                                  <div className="text-blue-500">In [2]:</div>
                                  <div className="bg-zinc-50 p-2 border border-zinc-200 rounded w-full relative">
                                    <span className="text-zinc-400"># Momentum AI auto-fixing NaN values...</span><br/>
                                    df[<span className="text-red-500">'revenue'</span>] = df[<span className="text-red-500">'revenue'</span>].fillna(df[<span className="text-red-500">'revenue'</span>].mean())
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                  </div>
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 6: MARKETING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Marketing & <br/>Analytics.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum physically logs into your Ads Manager, duplicates underperforming campaigns, adjusts A/B testing budgets, and generates daily ROI reports for you.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#0f172a] p-8 flex flex-col justify-end">
                       <svg className="w-full h-64 absolute bottom-0 left-0" viewBox="0 0 600 200" preserveAspectRatio="none">
                         <defs>
                           <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                             <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                           </linearGradient>
                         </defs>
                         <path d="M0 200 L0 150 Q 100 120 200 140 T 400 80 T 600 20 L600 200 Z" fill="url(#chartGrad)" />
                         <motion.path d="M0 150 Q 100 120 200 140 T 400 80 T 600 20" fill="none" stroke="#60a5fa" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: animationStep >= 1 ? 1 : 0.2 }} transition={{ duration: 1.5, ease: "easeOut" }} />
                       </svg>
                       <div className="relative z-10 bg-slate-900/80 backdrop-blur p-6 rounded-xl border border-slate-700 self-end w-64 shadow-2xl">
                          <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Campaign ROAS</div>
                          <div className="text-4xl font-light text-white mb-2">{animationStep >= 1 ? "4.2x" : "1.8x"}</div>
                          <div className="text-emerald-400 text-xs flex items-center gap-1">↑ Budget optimized by AI</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 7: MEETINGS */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Meetings & <br/>Comms.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">It literally attends meetings for you. Momentum joins Zoom calls, extracts action items, and immediately messages your team on WhatsApp with the updates.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-zinc-950 flex">
                      <div className="flex-1 border-r border-zinc-800 p-6 flex flex-col gap-4">
                         <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Live Call</div>
                         <div className="flex-1 bg-zinc-900 rounded-xl flex items-center justify-center relative overflow-hidden border border-zinc-800">
                           <div className="text-4xl font-light text-zinc-700">Client Sync</div>
                           <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur rounded-lg p-3 text-xs text-zinc-300">
                             <span className="text-blue-400 font-medium">Sarah:</span> "We need the API integrated by Friday."
                           </div>
                         </div>
                      </div>
                      <div className="flex-1 bg-[#1c1c1e] p-6 flex flex-col justify-end">
                         <AnimatePresence>
                           {animationStep >= 1 && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0b84ff] text-white p-4 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-lg">
                               Hey team, just got off the client call. Sarah approved the V2 mockups. Let's get the API integration done by Friday.
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>

        {/* 5. CONCLUSION */}
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-black relative overflow-hidden pt-32">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
           <div className="relative z-10 max-w-4xl flex flex-col items-center">
             <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8">The era of renting software is over.</h2>
             <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl leading-relaxed mb-12 font-light">
               SaaS companies charge massive monthly fees for simple API wrappers. Momentum uses zero APIs. It runs 100% locally on your machine, respects your absolute privacy, and works tirelessly inside your native applications.
               <br/><br/>
               <span className="text-white font-medium">A single, one-time flat fee. Yours forever.</span>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/app/app/page.tsx', code);
