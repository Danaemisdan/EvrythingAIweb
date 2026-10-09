"use client";

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
               newSection = 5; // Conclusion
            } else {
               if (progress < 0.33) newSection = 2; // Panel 1
               else if (progress < 0.66) newSection = 3; // Panel 2
               else newSection = 4; // Panel 3
               
               const segmentProgress = (progress % 0.33) * 3;
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
    else if (activeSection === 3) setFaceState("thinking");
    else if (activeSection === 4) setFaceState(animationStep === 1 ? "speaking" : "listening");
    else if (activeSection === 5) setFaceState("happy");
  }, [activeSection, animationStep]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Global Face Coordinates
  const faceVariants = {
    0: { x: "0px", y: "-15vh", scale: 1 },
    1: { x: "0px", y: "0px", scale: 0.35 },     // Shrinks perfectly into the Mac Mockup widget circle!
    2: { x: "20vw", y: "-5vh", scale: 0.65 },  // Over IDE mockup
    3: { x: "20vw", y: "-5vh", scale: 0.65 },  // Over CAD mockup
    4: { x: "20vw", y: "-5vh", scale: 0.65 },  // Over CRM mockup
    5: { x: "0px", y: "-20vh", scale: 1.2 },   // Massive in conclusion
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
            Momentum is not a chatbot.
          </h2>
          <p className="text-2xl md:text-3xl text-zinc-500 max-w-3xl leading-relaxed">
            It is a fully autonomous digital workforce capable of reasoning, planning, and executing inside your actual software.
          </p>
        </div>

        {/* 2. HOW IT LOOKS & HOW TO USE IT */}
        <div ref={howRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-zinc-950 relative border-t border-zinc-900">
           <div className="max-w-4xl text-center mb-16 relative z-10">
             <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-sm font-medium mb-8 inline-block">Native OS Integration</div>
             <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">Summon it anywhere.</h2>
             <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
               Hit <kbd className="bg-zinc-800 px-3 py-1 rounded-md font-mono text-sm border border-zinc-700 text-white mx-1">Cmd + M</kbd>. Give it a directive. Momentum floats above your workspace and takes full control of your mouse and keyboard, right before your eyes.
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
              <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center relative flex items-center justify-center mt-7">
                 {/* The Momentum Widget Floating Platform */}
                 {/* The global face will shrink and perfectly position itself exactly over this circle! */}
                 <div className="w-80 bg-black/50 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full mb-6 relative flex items-center justify-center">
                       <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                       {/* The face flies right here globally */}
                    </div>
                    <div className="text-white font-medium mb-2 text-lg">Momentum Active</div>
                    <div className="text-sm text-zinc-300 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                      Designing UI in Figma...
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. APPLICATIONS (HORIZONTAL SCROLL) */}
        <div ref={horizontalScrollRef} className="relative h-[300vh] w-full border-t border-zinc-900">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center">
            <motion.div 
              style={{ x: `-${hProgress * 66.666}%` }}
              className="flex w-[300vw] h-full"
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
                             {animationStep >= 1 && (
                               <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4 text-[#f14c4c] bg-[#f14c4c]/10 px-1 inline-block">
                                 // TypeError: jwt_decode is not a function
                               </motion.div>
                             )}
                             {animationStep === 2 && (
                               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-4 text-[#4fc1ff] bg-[#4fc1ff]/10 px-1 inline-block mt-2">
                                 <span className="text-[#569cd6]">const</span> decoded = <span className="text-[#569cd6]">await</span> <span className="text-[#4ec9b0]">jwt</span>.<span className="text-[#dcdcaa]">verify</span>(token, <span className="text-[#4fc1ff]">process.env.SECRET</span>);
                               </motion.div>
                             )}
                           </AnimatePresence>
                           <div>{'}'}</div>
                           <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#1e1e1e] border-t border-[#3c3c3c] p-3 overflow-hidden flex flex-col justify-end">
                              <div className="text-[#cccccc]">~/projects/momentum-core <span className="text-[#27c93f]">main</span></div>
                              {animationStep >= 1 && <div className="text-[#f14c4c]">$ npm run test <br/>✖ 1 failing (TypeError)</div>}
                              {animationStep === 2 && <div className="text-[#27c93f]">$ momentum fix <br/>Applying patch to auth.ts... <br/>✔ 1 passing. Pushing to origin/main.</div>}
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
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Automobile & <br/>3D Designing.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">From simple meshes to complete automobile designing. Momentum physically clicks through complex CAD menus, adjusting dimensions, constraints, and rendering physics simulations completely autonomously.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-[#2a2a2a] rounded-xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col h-[500px] text-xs text-zinc-300">
                       <div className="h-8 bg-[#333] border-b border-zinc-700 flex items-center px-4 gap-4">
                          <div className="font-medium text-white">SolidDesign Pro 2026</div>
                          <div className="flex gap-3 text-zinc-400"><span>File</span><span>Edit</span><span>Sketch</span><span>Features</span><span>Evaluate</span></div>
                       </div>
                       <div className="flex-1 flex overflow-hidden">
                          <div className="w-48 bg-[#333] border-r border-zinc-700 p-2 flex flex-col gap-2 overflow-y-auto">
                             <div className="font-medium text-zinc-200 mb-2">FeatureManager</div>
                             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-500 rounded-sm" /> Chassis_Assembly</div>
                             <div className="flex items-center gap-2 ml-4 text-blue-400"><div className="w-3 h-3 bg-blue-500 rounded-full" /> V8_Engine_Block</div>
                             <div className="flex items-center gap-2 ml-4"><div className="w-3 h-3 bg-zinc-500 rounded-sm" /> Suspension_Front</div>
                             <div className="flex items-center gap-2 ml-4"><div className="w-3 h-3 bg-zinc-500 rounded-sm" /> Axle_Rear</div>
                          </div>
                          <div className="flex-1 bg-[#1c1c1c] relative flex items-center justify-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                             <motion.div animate={{ rotateY: animationStep === 2 ? 180 : 0, scale: animationStep === 1 ? 1.1 : 1 }} transition={{ duration: 4, ease: "easeInOut" }} className="w-64 h-32 border border-blue-500/50 rounded-3xl flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                                <div className="absolute inset-x-8 -bottom-4 h-8 flex justify-between">
                                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-[#1c1c1c]" />
                                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-[#1c1c1c]" />
                                </div>
                                <div className="absolute top-0 left-1/4 right-1/4 h-1/2 border-t border-x border-blue-500/50 rounded-t-xl" />
                             </motion.div>
                             
                             <AnimatePresence>
                               {animationStep >= 1 && (
                                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-1/4 right-10 bg-[#333] border border-blue-500 rounded shadow-xl p-3 w-40 z-10">
                                     <div className="font-medium text-white mb-2 border-b border-zinc-600 pb-1">Fillet / Chamfer</div>
                                     <div className="flex justify-between items-center mb-1"><span>Radius:</span> <span className="bg-black px-1 text-emerald-400 border border-emerald-500/30">15.0mm</span></div>
                                     <div className="flex justify-between items-center text-zinc-500"><span>Edges:</span> <span>4 selected</span></div>
                                  </motion.div>
                               )}
                             </AnimatePresence>
                             
                             <motion.div 
                                animate={{ x: animationStep === 0 ? -100 : animationStep === 1 ? 80 : -50, y: animationStep === 0 ? 50 : -60 }}
                                transition={{ type: "spring" }}
                                className="absolute w-4 h-4 z-20 pointer-events-none drop-shadow-2xl"
                             >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 3.75L18.75 11.25L11.25 12.75L9 20.25L4.5 3.75Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                             </motion.div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 3: COMMUNICATIONS */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Slack</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">iMessage</span>
                      <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">Superhuman</span>
                    </div>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Everyday <br/>Communications.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Messaging people everyday, completely handled. Momentum reads context across platforms and physically drafts nuanced replies to your team in Slack, or negotiates deals in your email.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex h-[500px] text-sm text-zinc-200">
                      <div className="flex-1 border-r border-zinc-800 flex flex-col bg-[#1a1d21]">
                         <div className="h-12 border-b border-zinc-800 flex items-center px-4 font-bold text-white"># product-updates</div>
                         <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative">
                            <div className="flex gap-3">
                               <div className="w-8 h-8 rounded bg-pink-600 flex-shrink-0" />
                               <div>
                                 <div className="font-bold text-white text-sm">Sarah <span className="text-zinc-500 font-normal text-xs ml-1">11:05 AM</span></div>
                                 <div className="text-zinc-300 mt-1">Can someone update me on the Q3 roadmap for the mobile app? I have a client meeting in 10.</div>
                               </div>
                            </div>
                            <AnimatePresence>
                              {animationStep >= 1 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-2">
                                   <div className="w-8 h-8 rounded bg-purple-600 flex-shrink-0" />
                                   <div>
                                     <div className="font-bold text-white text-sm">You <span className="text-zinc-500 font-normal text-xs ml-1">11:06 AM</span> <span className="text-[10px] text-purple-400 border border-purple-500/30 px-1 rounded ml-1">Momentum Draft</span></div>
                                     <div className="text-zinc-300 mt-1">Hey Sarah, mobile V2 is launching Sept 15th. We're prioritizing the new dashboard and biometric login. I've attached the one-pager you can show the client!</div>
                                   </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                      </div>
                      <div className="w-[40%] flex flex-col bg-black">
                         <div className="h-12 border-b border-zinc-800 flex items-center justify-center font-bold text-white text-xs">Mike (Co-founder)</div>
                         <div className="flex-1 p-4 flex flex-col gap-3 justify-end overflow-hidden">
                            <div className="bg-zinc-800 p-2.5 rounded-2xl rounded-bl-sm self-start max-w-[85%] text-xs">
                               Dude, did we send the wire transfer to the agency yet?
                            </div>
                            <AnimatePresence>
                              {animationStep === 2 && (
                                <motion.div initial={{ opacity: 0, scale: 0.9, originY: 1 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-600 text-white p-2.5 rounded-2xl rounded-br-sm self-end max-w-[85%] text-xs border border-blue-500">
                                   Yeah, just sent it 5 mins ago. Should clear by tomorrow.
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <div className="h-8 border border-zinc-700 rounded-full mt-2 flex items-center px-3 text-zinc-500 text-xs">iMessage</div>
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
             <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-sm font-medium mb-8">The Final Argument</div>
             <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8">Own your workforce. <br/>Don't rent it.</h2>
             <p className="text-2xl text-zinc-300 max-w-3xl leading-relaxed mb-12">
               We completely despise the subscription model. SaaS companies are milking you dry for simple API wrappers. Momentum uses ZERO APIs. It hooks natively into your OS accessibility layer and runs 100% locally.
               <br/><br/>
               You buy it once for <span className="text-white font-bold">$30</span>, and it works for you forever.
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
