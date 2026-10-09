const fs = require('fs');

const code = `"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import Link from "next/link";
import { AgentFace, AgentState } from "@/components/AgentFace";

const APPS = [
  "VS Code", "Terminal", "GitHub", "Blender", "Unreal Engine", "Unity", "AutoCAD", "SolidWorks",
  "Meta Ads", "Google Analytics", "HubSpot", "Salesforce", "Zoom", "Slack", "WhatsApp", "Discord",
  "Figma", "Photoshop", "Premiere Pro", "After Effects", "Excel", "Notion", "Linear", "Jira"
];

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [faceState, setFaceState] = useState<AgentState>("idle");

  // --- Scroll Refs ---
  const introRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
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
      
      if (howRef.current && horizontalScrollRef.current && marqueeRef.current) {
         const howRect = howRef.current.getBoundingClientRect();
         const marqRect = marqueeRef.current.getBoundingClientRect();
         const hRect = horizontalScrollRef.current.getBoundingClientRect();
         
         if (howRect.top > vh * 0.5) {
            newSection = 0; // Intro
         } else if (howRect.top <= vh * 0.5 && marqRect.top > vh * 0.5) {
            newSection = 1; // Mac Screen
         } else if (marqRect.top <= vh * 0.5 && hRect.top > vh * 0.5) {
            newSection = 2; // Marquee
         } else {
            const totalScrollable = hRect.height - vh;
            let progress = -hRect.top / totalScrollable;
            progress = Math.max(0, Math.min(1, progress));
            setHProgress(progress);
            
            if (hRect.bottom < vh * 0.5) {
               newSection = 8; // Conclusion
            } else {
               if (progress < 0.2) newSection = 3; // Eng
               else if (progress < 0.4) newSection = 4; // Auto
               else if (progress < 0.6) newSection = 5; // Game
               else if (progress < 0.8) newSection = 6; // Marketing
               else newSection = 7; // Meetings
               
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

  useEffect(() => {
    if (activeSection === 0) setFaceState("idle");
    else if (activeSection === 1) setFaceState("speaking"); 
    else if (activeSection === 2) setFaceState("idle"); 
    else if (activeSection === 3) setFaceState(animationStep === 1 ? "error" : "thinking");
    else if (activeSection >= 4 && activeSection <= 7) setFaceState("thinking");
    else if (activeSection === 8) setFaceState("idle");
  }, [activeSection, animationStep]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const faceVariants = {
    0: { x: "0px", y: "-15vh", scale: 1 },
    1: { x: "0px", y: "-5vh", scale: 0.7 },    // Huge face right on the Mac desktop
    2: { x: "0px", y: "-38vh", scale: 0.5 },   // Top center
    3: { x: "0px", y: "-38vh", scale: 0.5 },
    4: { x: "0px", y: "-38vh", scale: 0.5 },
    5: { x: "0px", y: "-38vh", scale: 0.5 },
    6: { x: "0px", y: "-38vh", scale: 0.5 },
    7: { x: "0px", y: "-38vh", scale: 0.5 },
    8: { x: "0px", y: "-25vh", scale: 0.8 },   // Conclusion, well above the text!
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
        <div className="min-h-[50vh] flex items-center justify-center px-6 md:px-24 mb-32">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] max-w-5xl text-center">
            Momentum is not an assistant. It's a relentless personal friend. <br/>
            <span className="text-zinc-500 block mt-8 text-2xl md:text-3xl max-w-4xl mx-auto font-normal">It doesn't just do a task once and leave. It stays by your side, learns your unique workflows, and autonomously drives your software day and night.</span>
          </h2>
        </div>

        {/* 2. MAC OS SCREEN */}
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
              <div className="flex-1 bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative flex flex-col items-center justify-center">
                 {/* NO SHITTY SQUARE. Just a glowing backdrop for the 3D Face to sit on. */}
                 <div className="w-64 h-64 bg-white/5 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                 <div className="absolute top-[60%] text-center text-white/50 font-medium tracking-wide">Momentum is active and watching your screen.</div>
              </div>
           </div>
        </div>

        {/* 3. MARQUEE (The 50+ Apps) */}
        <div ref={marqueeRef} className="py-32 border-y border-zinc-900 bg-zinc-950 overflow-hidden flex flex-col gap-8">
           <div className="text-center text-zinc-500 font-medium mb-4 uppercase tracking-widest text-sm">Momentum natively controls any application</div>
           
           <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
             <motion.div animate={{ x: [0, -1035] }} transition={{ repeat: Infinity, ease: "linear", duration: 20 }} className="flex items-center justify-center md:justify-start gap-12 px-6">
                {[...APPS, ...APPS].map((app, i) => (
                  <div key={i} className="text-2xl font-bold text-zinc-700 whitespace-nowrap">{app}</div>
                ))}
             </motion.div>
           </div>
        </div>

        {/* 4. APPLICATIONS SCROLL */}
        <div ref={horizontalScrollRef} className="relative h-[500vh] w-full">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center">
            <motion.div style={{ x: \`-\${hProgress * 80}%\` }} className="flex w-[500vw] h-full pt-16">
              
              {/* PANEL 1: ENGINEERING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Software <br/>Engineering.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum drives your IDE. It reads your entire repository, runs local tests, debugging errors in the terminal, and pushes bug fixes while you sleep.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#0d0d0d]">
                       {/* Sleek Code UI */}
                       <div className="absolute inset-0 p-8 font-mono text-sm">
                          <div className="text-zinc-600 mb-4">// auth.ts</div>
                          <div><span className="text-pink-500">export const</span> <span className="text-blue-400">verifyToken</span> = <span className="text-purple-400">async</span> (token) =&gt; {'{'}</div>
                          <div className="pl-4 mt-2">
                             <AnimatePresence mode="wait">
                                {animationStep === 0 && <motion.div key="1" className="text-zinc-400">await jwt_decode(token);</motion.div>}
                                {animationStep === 1 && <motion.div key="2" className="text-red-500 bg-red-500/10 p-1 rounded inline-block">TypeError: jwt_decode is not a function</motion.div>}
                                {animationStep === 2 && <motion.div key="3" className="text-emerald-400 bg-emerald-500/10 p-1 rounded inline-block">await jwt.verify(token, process.env.SECRET);</motion.div>}
                             </AnimatePresence>
                          </div>
                          <div className="mt-2">{'}'}</div>
                       </div>
                       {/* Floating Terminal Widget */}
                       <div className="absolute bottom-6 right-6 bg-black/90 backdrop-blur border border-zinc-700 p-4 rounded-xl shadow-2xl min-w-[280px]">
                         <div className="flex items-center gap-3 mb-3">
                           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                           <span className="text-white font-bold text-xs uppercase tracking-wider">Momentum CLI</span>
                         </div>
                         <div className="text-emerald-400 text-xs font-mono">
                           {animationStep >= 2 ? "✔ Fix applied. Pushing to origin/main..." : "> Running tests..."}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 2: AUTO 3D */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Automobile & <br/>3D Design.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum clicks through CAD menus, sets physical constraints, and processes aerodynamic simulations completely autonomously. It's like having a senior industrial designer on staff.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                     {/* Sleek Abstract 3D UI */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#0a0a0a] flex items-center justify-center">
                       {/* Abstract Mesh Graphic */}
                       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute">
                          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                             <circle cx="200" cy="200" r="150" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                             <circle cx="200" cy="200" r="100" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
                             <path d="M50 200 L350 200 M200 50 L200 350 M94 94 L306 306 M94 306 L306 94" stroke="#3b82f6" strokeWidth="1" opacity="0.2" />
                          </svg>
                       </motion.div>
                       
                       <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur border border-zinc-800 p-4 rounded-xl">
                          <div className="text-xs text-zinc-400 mb-1">Aerodynamic Drag Coeff.</div>
                          <div className="text-3xl font-light text-blue-400">{animationStep >= 1 ? "0.24cd" : "0.31cd"}</div>
                          {animationStep >= 1 && <div className="text-emerald-400 text-xs mt-1">Optimization complete</div>}
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 3: GAME DEV */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Game Dev & <br/>Environments.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Building worlds takes hours. Momentum places assets, bakes lighting, adjusts collision meshes, and writes C# game logic scripts natively inside your engine's editor.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#111] flex items-center justify-center p-8">
                       {/* Sleek Node Graph UI */}
                       <div className="w-full h-full relative">
                          <div className="absolute top-10 left-10 bg-zinc-900 border border-zinc-700 rounded-lg p-3 w-40 z-10 shadow-lg">
                             <div className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2 border-b border-zinc-800 pb-1">Event Tick</div>
                             <div className="flex justify-between items-center"><div className="w-2 h-2 rounded-full bg-white" /> <div className="w-2 h-2 rounded-full bg-orange-500" /></div>
                          </div>
                          
                          <motion.div animate={{ width: animationStep >= 1 ? "120px" : "0px" }} className="absolute top-16 left-[210px] h-0.5 bg-orange-500 origin-left" />

                          <AnimatePresence>
                            {animationStep >= 1 && (
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-10 right-10 bg-zinc-900 border border-orange-500 rounded-lg p-3 w-48 z-10 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                                 <div className="text-[10px] text-orange-400 uppercase tracking-widest mb-2 border-b border-zinc-800 pb-1">Set Actor Location</div>
                                 <div className="flex items-center gap-2 text-xs text-zinc-300"><div className="w-2 h-2 rounded-full bg-orange-500" /> Target</div>
                                 <div className="flex items-center gap-2 text-xs text-zinc-300 mt-2"><div className="w-2 h-2 rounded-full bg-yellow-400" /> New Location</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 4: MARKETING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Marketing & <br/>Analytics.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum physically logs into your Ads Manager, duplicates underperforming campaigns, adjusts A/B testing budgets, and generates daily ROI reports for you.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#0f172a] p-8 flex flex-col justify-end">
                       {/* Sleek Line Chart UI */}
                       <svg className="w-full h-48 absolute bottom-0 left-0" viewBox="0 0 600 200" preserveAspectRatio="none">
                         <defs>
                           <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5"/>
                             <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                           </linearGradient>
                         </defs>
                         <path d="M0 200 L0 150 Q 100 120 200 140 T 400 80 T 600 40 L600 200 Z" fill="url(#chartGrad)" />
                         <motion.path d="M0 150 Q 100 120 200 140 T 400 80 T 600 40" fill="none" stroke="#60a5fa" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: animationStep >= 1 ? 1 : 0.3 }} transition={{ duration: 1 }} />
                       </svg>
                       <div className="relative z-10 bg-slate-900/80 backdrop-blur p-6 rounded-xl border border-slate-700 self-end w-64 shadow-2xl">
                          <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Campaign ROAS</div>
                          <div className="text-4xl font-light text-white mb-2">{animationStep >= 1 ? "4.2x" : "1.8x"}</div>
                          <div className="text-emerald-400 text-xs flex items-center gap-1">↑ Budget increased 15%</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 5: MEETINGS */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Meetings & <br/>Comms.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">It literally attends meetings for you. Momentum joins Zoom calls, extracts action items, and immediately messages your team on WhatsApp with the updates.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-zinc-950 flex">
                      {/* Zoom Side (Ultra Clean Apple Style) */}
                      <div className="flex-1 border-r border-zinc-800 p-6 flex flex-col gap-4">
                         <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-widest"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Live Call</div>
                         <div className="flex-1 bg-zinc-900 rounded-xl flex items-center justify-center relative overflow-hidden border border-zinc-800">
                           <div className="text-4xl font-light text-zinc-700">Client Sync</div>
                           <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur rounded-lg p-3 text-xs text-zinc-300">
                             <span className="text-blue-400 font-medium">Sarah:</span> "We need the API integrated by Friday."
                           </div>
                         </div>
                      </div>
                      {/* Message Side */}
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
             
             {/* The face is globally locked to y:-25vh during this section, safely ABOVE this text! */}

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
