"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import Link from "next/link";
import { AgentFace, AgentState } from "@/components/AgentFace";
import { Terminal, Cpu, Network, Video, Layers, Wand2, Mail, Calendar, MessageSquare, ShieldCheck, MonitorSmartphone, Code2, Scissors, CalendarDays, Shield } from "lucide-react";

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [faceState, setFaceState] = useState<AgentState>("idle");

  // --- Intro Scroll ---
  const introRef = useRef<HTMLDivElement>(null);
  const introProgress = useMotionValue(0);
  
  // --- Horizontal Scroll ---
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const [hProgress, setHProgress] = useState(0);
  const [animationStep, setAnimationStep] = useState(0); // 0, 1, 2 for dynamic widget animations

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

      // 2. Horizontal Progress
      if (horizontalScrollRef.current) {
        const rect = horizontalScrollRef.current.getBoundingClientRect();
        const totalScrollable = rect.height - vh;
        let progress = -rect.top / totalScrollable;
        progress = Math.max(0, Math.min(1, progress));
        setHProgress(progress);

        // Calculate Active Section (0 to 4)
        if (rect.top > vh * 0.5) setActiveSection(0);
        else if (progress < 0.25) setActiveSection(1);
        else if (progress < 0.50) setActiveSection(2);
        else if (progress < 0.75) setActiveSection(3);
        else setActiveSection(4);

        // Calculate a repeating 0,1,2 step for internal card animations based on sub-progress
        // Each card has 0.25 of the total progress.
        const segmentProgress = (progress % 0.25) * 4; // 0 to 1 within current card
        if (segmentProgress > 0.6) setAnimationStep(2);
        else if (segmentProgress > 0.3) setAnimationStep(1);
        else setAnimationStep(0);
      }
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
    else if (activeSection === 1) setFaceState(animationStep === 1 ? "error" : "thinking");
    else if (activeSection === 2) setFaceState("thinking");
    else if (activeSection === 3) setFaceState(animationStep === 1 ? "speaking" : "listening");
    else if (activeSection === 4) setFaceState("happy");
  }, [activeSection, animationStep]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Face positions meticulously aligned to the new HTML mockups inside the horizontal flex track
  const faceVariants = {
    0: { x: "0px", y: "-15vh", scale: 1 },
    1: { x: "20vw", y: "-5vh", scale: 0.65 },  // Over IDE mockup on the right
    2: { x: "20vw", y: "-5vh", scale: 0.65 },  // Over NLE mockup on the right
    3: { x: "20vw", y: "-5vh", scale: 0.65 },  // Over CRM mockup on the right
    4: { x: "0px", y: "0px", scale: 0.8 },     // Center screen for Universal Desktop
  };

  return (
    <div className="bg-black text-white selection:bg-white/20 font-sans min-h-screen relative overflow-x-hidden">
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

      {/* Intro Section */}
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

        {/* --- HORIZONTAL SCROLLING GALLERY --- */}
        <div ref={horizontalScrollRef} className="relative h-[400vh] w-full">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center">
            <motion.div 
              style={{ x: \`-\${hProgress * 75}%\` }}
              className="flex w-[400vw] h-full"
            >
              
              {/* PANEL 1: ENGINEERING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6"><Code2 className="text-emerald-400" /></div>
                    <h3 className="text-5xl md:text-7xl font-medium mb-6 leading-tight">Ship full-stack <br/>features.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum doesn't write snippets. It reads your entire repository and builds architecture. When CI/CD breaks, it reads the stack trace and pushes the patch while you sleep.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    {/* Realistic IDE HTML Mockup */}
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
                             {animationStep === 1 && (
                               <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-4 text-[#f14c4c] bg-[#f14c4c]/10 px-1 inline-block">
                                 // TypeError: jwt_decode is not a function
                               </motion.div>
                             )}
                             {animationStep === 2 && (
                               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-4 text-[#4fc1ff] bg-[#4fc1ff]/10 px-1 inline-block">
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

              {/* PANEL 2: CREATIVE */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6"><Scissors className="text-pink-400" /></div>
                    <h3 className="text-5xl md:text-7xl font-medium mb-6 leading-tight">Iterate at the <br/>speed of thought.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Drop thousands of raw clips into a folder. Momentum categorizes them, syncs audio, color grades, and cuts a narrative timeline. You dictate the vision, it does the clicking.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    {/* Realistic NLE HTML Mockup */}
                    <div className="w-full bg-[#181818] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col h-[500px] text-xs">
                       {/* Preview Monitor */}
                       <div className="h-[250px] bg-black border-b border-[#2a2a2a] relative flex items-center justify-center">
                          <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-80" />
                          <div className="absolute top-2 left-2 text-white/50 font-mono">01:24:12:08</div>
                          {animationStep > 0 && <div className="absolute inset-0 bg-pink-500/10 mix-blend-color-dodge transition-all duration-1000" />}
                       </div>
                       {/* Timeline */}
                       <div className="flex-1 p-2 bg-[#1c1c1c] flex flex-col gap-1">
                          <div className="h-4 border-b border-[#2a2a2a] flex items-center px-2">
                             <div className="w-full bg-[#2a2a2a] h-px relative">
                                <motion.div animate={{ x: animationStep === 2 ? "90%" : "20%" }} transition={{ duration: 2 }} className="absolute top-[-4px] w-2 h-2 bg-blue-500 rounded-sm" />
                             </div>
                          </div>
                          <div className="flex gap-1 h-8 mt-2">
                            <div className="w-16 bg-[#2a2a2a] flex items-center px-2 text-zinc-500 font-mono">V2</div>
                            <AnimatePresence>
                              {animationStep >= 1 && <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "30%" }} className="bg-purple-900/60 border border-purple-500/50 rounded flex items-center px-2 text-white/80 overflow-hidden text-nowrap truncate">B-Roll_City.mov</motion.div>}
                            </AnimatePresence>
                          </div>
                          <div className="flex gap-1 h-8">
                            <div className="w-16 bg-[#2a2a2a] flex items-center px-2 text-zinc-500 font-mono">V1</div>
                            <div className="w-[40%] bg-blue-900/60 border border-blue-500/50 rounded flex items-center px-2 text-white/80 truncate">Interview_01.mp4</div>
                            <div className="w-[50%] bg-blue-900/60 border border-blue-500/50 rounded flex items-center px-2 text-white/80 truncate">Interview_02.mp4</div>
                          </div>
                          <div className="flex gap-1 h-8 mt-2">
                            <div className="w-16 bg-[#2a2a2a] flex items-center px-2 text-zinc-500 font-mono">A1</div>
                            <div className="w-full bg-emerald-900/60 border border-emerald-500/50 rounded flex items-center px-2 text-white/80 truncate relative overflow-hidden">
                               <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none"><path d="M0,15 L10,5 L20,25 L30,10 L40,20 L50,5 L1000,15" stroke="currentColor" fill="none" /></svg>
                               Music_Bed_03.wav
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 3: OPERATIONS */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6"><CalendarDays className="text-blue-400" /></div>
                    <h3 className="text-5xl md:text-7xl font-medium mb-6 leading-tight">Inbox zero, <br/>permanently.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum drafts highly nuanced emails, negotiates B2B deals within your parameters, and plays calendar Tetris with stakeholders. You only step in for final executive approval.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    {/* Realistic Email/CRM HTML Mockup */}
                    <div className="w-full bg-white rounded-xl overflow-hidden border border-zinc-200 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex h-[500px] text-sm text-zinc-800">
                      <div className="w-1/3 bg-zinc-50 border-r border-zinc-200 flex flex-col">
                         <div className="p-4 border-b border-zinc-200 font-medium">Inbox</div>
                         <div className="p-4 border-b border-zinc-100 bg-blue-50">
                            <div className="font-medium text-black">Acme Corp</div>
                            <div className="text-xs font-medium text-blue-600 mt-1">Contract Negotiation</div>
                         </div>
                         <div className="p-4 border-b border-zinc-100 opacity-60">
                            <div className="font-medium">Global Tech</div>
                            <div className="text-xs mt-1 text-zinc-500">Q4 Sync</div>
                         </div>
                      </div>
                      <div className="w-2/3 flex flex-col">
                         <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
                            <div className="flex gap-3">
                               <div className="w-8 h-8 rounded-full bg-zinc-200 flex-shrink-0" />
                               <div>
                                 <div className="font-medium text-sm">Robert Chen <span className="text-zinc-400 font-normal ml-2">10:45 AM</span></div>
                                 <div className="text-zinc-600 text-sm mt-1">We need a 15% discount on the enterprise tier to proceed.</div>
                               </div>
                            </div>
                            <AnimatePresence>
                              {animationStep >= 1 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-4">
                                   <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs">AI</div>
                                   <div>
                                     <div className="font-medium text-sm">Momentum <span className="text-blue-500 font-normal ml-2 text-xs border border-blue-200 px-1 rounded bg-blue-50">Auto-Drafted</span></div>
                                     <div className="text-zinc-600 text-sm mt-1">I can authorize 10% today, and I'll include our priority support package free for 6 months to offset the difference.</div>
                                   </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                         <div className="h-16 border-t border-zinc-200 p-3 bg-zinc-50 flex items-center justify-end gap-2">
                            {animationStep === 2 && (
                              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="px-4 py-1.5 bg-blue-600 text-white rounded-md font-medium shadow-sm">Send & Confirm Meeting</motion.div>
                            )}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 4: UNIVERSAL */}
              <div className="w-[100vw] h-full flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
                <div className="relative z-10 max-w-4xl flex flex-col items-center text-center mt-[10vh]">
                  <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-sm font-medium mb-6 backdrop-blur-md">Universal OS Control</div>
                  <h3 className="text-5xl md:text-7xl font-medium mb-6 text-white drop-shadow-xl">Total privacy. Zero APIs.</h3>
                  <p className="text-2xl text-zinc-300 leading-relaxed drop-shadow-md mb-8">It controls your PC via native accessibility hooks. Blisteringly fast. 100% local execution. Best of all? It's a one-time fee of $30. We despise subscriptions.</p>
                </div>
                {/* Fake Desktop HTML Mockup directly below the text */}
                <div className="w-full max-w-4xl h-[400px] mt-12 bg-black rounded-t-2xl border-t border-x border-zinc-800 shadow-[0_0_100px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden relative">
                   <div className="h-6 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between text-zinc-500 text-xs">
                     <div>Apple</div>
                     <div className="flex gap-4"><span>File</span><span>Edit</span><span>View</span></div>
                     <div>Mon 9:41 AM</div>
                   </div>
                   <div className="flex-1 relative overflow-hidden bg-zinc-950">
                      {/* Fake Windows */}
                      <motion.div animate={{ scale: animationStep === 2 ? 1.05 : 1 }} className="absolute top-10 left-10 w-[60%] h-[200px] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                         <div className="h-6 bg-zinc-800 border-b border-zinc-700 px-2 flex items-center text-[10px] text-zinc-400">Blender - engine.blend</div>
                         <div className="flex-1 flex items-center justify-center border-2 border-dashed border-purple-500/30 m-4 rounded relative">
                            {animationStep > 0 && <div className="absolute inset-0 bg-purple-500/10" />}
                         </div>
                      </motion.div>
                      <motion.div animate={{ scale: animationStep === 1 ? 1.05 : 1 }} className="absolute bottom-10 right-10 w-[50%] h-[180px] bg-black border border-zinc-800 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs font-mono">
                         <div className="h-6 bg-zinc-900 border-b border-zinc-800 px-2 flex items-center text-[10px] text-zinc-400">Terminal</div>
                         <div className="p-3 text-emerald-400">
                           $ momentum system inject<br/>
                           <span className="text-zinc-500">Hooking OS accessibility APIs...</span><br/>
                           <span className="text-purple-400">Control granted.</span>
                         </div>
                      </motion.div>
                   </div>
                   {/* Fake Cursor controlled by Momentum */}
                   <motion.div 
                      animate={{ 
                        x: animationStep === 0 ? "35vw" : animationStep === 1 ? "10vw" : "20vw",
                        y: animationStep === 0 ? "5vh" : animationStep === 1 ? "-10vh" : "-15vh"
                      }}
                      transition={{ type: "spring", stiffness: 40, damping: 25 }}
                      className="absolute w-5 h-5 z-20 pointer-events-none drop-shadow-2xl"
                      style={{ left: "50%", top: "50%" }}
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M4.5 3.75L18.75 11.25L11.25 12.75L9 20.25L4.5 3.75Z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                     </svg>
                   </motion.div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">Ready to expand your workforce?</h2>
          <Link href="/newagent" className="inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Deploy Momentum
          </Link>
        </div>
      </div>
    </div>
  );
}
