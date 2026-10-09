const fs = require('fs');

const code = `"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import Link from "next/link";
import { AgentFace, AgentState } from "@/components/AgentFace";
import MacOSMenuBar from "@/components/mac-os-menu-bar";
import MacOSDock from "@/components/mac-os-dock";

const dockIcons = [
  { id: "finder", name: "Finder", icon: "/app-icons/finder.png" },
  { id: "launchpad", name: "Launchpad", icon: "/app-icons/launchpad.png" },
  { id: "safari", name: "Safari", icon: "/app-icons/safari.png" },
  { id: "messages", name: "Messages", icon: "/app-icons/messages.png" },
  { id: "mail", name: "Mail", icon: "/app-icons/mail.png" },
  { id: "maps", name: "Maps", icon: "/app-icons/maps.png" },
  { id: "photos", name: "Photos", icon: "/app-icons/photos.png" },
  { id: "appstore", name: "App Store", icon: "/app-icons/appstore.png" },
  { id: "notes", name: "Notes", icon: "/app-icons/notes.png" },
  { id: "vscode", name: "VS Code", icon: "/app-icons/vscode.png" },
  { id: "settings", name: "Settings", icon: "/app-icons/settings.png" }
];

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [faceState, setFaceState] = useState<AgentState>("idle");

  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  
  const [hProgress, setHProgress] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      let newSection = 0;
      
      if (horizontalScrollRef.current) {
         const hRect = horizontalScrollRef.current.getBoundingClientRect();
         
         if (hRect.top > vh * 0.5) {
            newSection = 1; 
         } else {
            const totalScrollable = hRect.height - vh;
            let progress = -hRect.top / totalScrollable;
            progress = Math.max(0, Math.min(1, progress));
            setHProgress(progress);
            
            if (hRect.bottom < vh * 0.5) {
               newSection = 9;
            } else {
               if (progress < 0.14) newSection = 2;
               else if (progress < 0.28) newSection = 3;
               else if (progress < 0.42) newSection = 4;
               else if (progress < 0.56) newSection = 5;
               else if (progress < 0.7) newSection = 6;
               else if (progress < 0.84) newSection = 7;
               else newSection = 8;
               
               const segmentProgress = (progress % 0.14) * 7.14;
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

  useEffect(() => {
    if (activeSection === 0 || activeSection === 1) setFaceState("idle");
    else if (activeSection >= 2 && activeSection <= 8) setFaceState("thinking");
    else if (activeSection === 9) setFaceState("idle");
  }, [activeSection, animationStep]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="bg-black text-white selection:bg-white/20 font-sans min-h-screen relative overflow-x-clip">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-md border-b border-white/5">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">Momentum</Link>
        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Back to Home</Link>
      </nav>

      {/* 1. INTRO SECTION */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] max-w-5xl mb-8">
            Momentum is not a chatbot.
          </h2>
          <p className="text-2xl md:text-3xl text-zinc-500 max-w-3xl leading-relaxed">
            It is a fully autonomous digital workforce capable of reasoning, planning, and executing inside your actual software.
          </p>
        </div>
      </div>

      <div className="relative z-40 bg-black border-t border-zinc-900 pt-32 pb-12">
        
        {/* 2. MAC OS SCREEN */}
        <div className="flex flex-col items-center justify-center px-6 relative overflow-hidden">
           
           <div className="max-w-4xl text-center mb-16 relative z-10">
             <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-sm font-medium mb-8 inline-block">Native OS Integration</div>
             <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">Summon it anywhere.</h2>
             <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
               Give it a directive. Momentum floats above your workspace and takes full control of your mouse and keyboard, right before your eyes.
             </p>
           </div>
           
           {/* Exact Main Website Layout, but with AgentFace safely trapped inside */}
           <div className="w-full max-w-6xl aspect-[16/10] bg-black rounded-[2rem] border-[16px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col z-10">
              <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/mac-wallpaper.jpg')" }} />
              
              <div className="absolute top-0 left-0 right-0 z-20">
                <MacOSMenuBar appName="Finder" />
              </div>
              
              <div className="absolute top-12 right-6 z-10 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-white/10 p-2 rounded-lg">
                  <img src="/app-icons/folder.png" className="w-12 h-12 drop-shadow-md" alt="Folder" onError={(e) => e.currentTarget.style.display='none'} />
                  <span className="text-white text-xs font-medium drop-shadow-md">Projects</span>
                </div>
                <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-white/10 p-2 rounded-lg">
                  <img src="/app-icons/folder.png" className="w-12 h-12 drop-shadow-md" alt="Folder" onError={(e) => e.currentTarget.style.display='none'} />
                  <span className="text-white text-xs font-medium drop-shadow-md">Design Assets</span>
                </div>
              </div>

              {/* AgentFace is explicitly inside the screen, so it cannot overlap the surrounding page text or header */}
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                  <AgentFace state="idle" size={120} />
                </div>
              </div>
              
              <div className="absolute bottom-4 z-20 w-full flex justify-center">
                <MacOSDock apps={dockIcons} onAppClick={() => {}} />
              </div>
           </div>
        </div>

        {/* 3. MARQUEE SCROLLER */}
        <div className="mt-24 mb-12 border-y border-zinc-900 bg-zinc-950/50 py-6 overflow-hidden flex whitespace-nowrap text-zinc-500 font-mono text-sm uppercase items-center">
          <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="flex gap-12 items-center">
            {Array(10).fill(0).map((_, i) => (
              <React.Fragment key={i}>
                <span>Momentum physically drives these apps</span>
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span>Zero API limitations</span>
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* 4. APPLICATIONS SCROLL */}
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

              {/* PANEL 2: GAME DEV */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Game Dev & <br/>Environments.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum physically drives Unreal Engine. It visually connects blueprint nodes, bakes complex lighting, and adjusts collision meshes.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#161616]">
                       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
                       
                       <div className="h-8 bg-[#252525] border-b border-black flex items-center px-4 text-[10px] text-zinc-400 z-10 relative">UnrealEditor - ThirdPersonMap - Blueprints</div>
                       
                       <div className="p-8 relative w-full h-full">
                          <div className="absolute top-12 left-10 w-48 bg-[#1e1e1e] border border-black rounded shadow-lg overflow-hidden z-20">
                             <div className="bg-gradient-to-r from-red-800 to-red-900 px-3 py-1 font-bold text-[10px] text-white">Event BeginPlay</div>
                             <div className="p-3 text-[10px]">
                                <div className="flex justify-between items-center"><span className="text-zinc-400">Exec</span> <div className="w-3 h-3 border border-white rounded-full bg-white/20" /></div>
                             </div>
                          </div>
                          
                          <motion.path 
                             d="M 230 75 C 300 75, 250 150, 350 150" 
                             fill="none" stroke="white" strokeWidth="3" 
                             className="absolute top-0 left-0 z-10"
                             initial={{ pathLength: 0 }}
                             animate={{ pathLength: animationStep >= 1 ? 1 : 0 }}
                             transition={{ duration: 0.5 }}
                          />

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

              {/* PANEL 3: VIDEO EDITING */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Video & <br/>Post-Production.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum edits inside Premiere Pro and DaVinci Resolve. It trims silence, automatically grades color, synchronizes multi-cam footage, and renders final exports.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                     <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#1e1e1e] flex flex-col">
                        <div className="h-8 bg-[#2a2a2a] flex items-center px-4 text-[10px] text-zinc-400 font-medium">DaVinci Resolve - Project 1</div>
                        
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
                       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', transform: 'perspective(500px) rotateX(60deg) scale(2)' }} />
                       
                       <motion.div animate={{ rotateY: 360, rotateX: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="relative z-10">
                          <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
                             <circle cx="150" cy="150" r="100" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                             <circle cx="150" cy="150" r="70" stroke="#06b6d4" strokeWidth="2" opacity="0.5" />
                             <path d="M50 150 L250 150 M150 50 L150 250 M79 79 L221 221 M79 221 L221 79" stroke="#06b6d4" strokeWidth="1" opacity="0.2" />
                             <rect x="110" y="100" width="80" height="100" stroke="#06b6d4" strokeWidth="2" fill="rgba(6,182,212,0.1)" />
                          </svg>
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

              {/* PANEL 5: BIOINFORMATICS */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Bioinformatics & <br/>DNA Analysis.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum natively drives PyMOL, SnapGene, and BLAST. It autonomously aligns massive genome sequences, folds proteins in 3D space, and identifies CRISPR target sites.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#0f172a]">
                       <div className="h-8 bg-[#1e293b] border-b border-indigo-900/50 flex items-center px-4 font-mono text-[10px] text-indigo-300">PyMOL - Protein_Folding_Sim_v4.pdb</div>
                       
                       <div className="relative w-full h-[calc(100%-32px)] flex items-center justify-center overflow-hidden">
                          {/* Fake DNA Helix / Protein Structure */}
                          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 400 300">
                             <motion.path 
                                d="M 50 150 Q 125 50 200 150 T 350 150" 
                                fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"
                                initial={{ pathLength: 0 }} animate={{ pathLength: animationStep >= 1 ? 1 : 0 }} transition={{ duration: 2, ease: "easeInOut" }}
                             />
                             <motion.path 
                                d="M 50 150 Q 125 250 200 150 T 350 150" 
                                fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round"
                                initial={{ pathLength: 0 }} animate={{ pathLength: animationStep >= 1 ? 1 : 0 }} transition={{ duration: 2, ease: "easeInOut", delay: 0.2 }}
                             />
                             
                             <AnimatePresence>
                               {animationStep >= 2 && (
                                 <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                   {Array(8).fill(0).map((_, i) => (
                                     <line key={i} x1={80 + i * 35} y1={120 + Math.sin(i)*20} x2={80 + i * 35} y2={180 - Math.sin(i)*20} stroke="#4ade80" strokeWidth="2" opacity="0.6" />
                                   ))}
                                 </motion.g>
                               )}
                             </AnimatePresence>
                          </svg>

                          <div className="absolute top-4 left-4 bg-black/60 border border-indigo-500/30 p-3 rounded shadow-lg text-[10px] font-mono">
                            <div className="text-indigo-400 mb-1">SEQUENCE ALIGNMENT</div>
                            <div className="text-zinc-300">Target: CRISPR-Cas9 Locus</div>
                            <div className="text-zinc-300">Match Accuracy: {animationStep >= 2 ? "99.8%" : "Analyzing..."}</div>
                          </div>
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
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-black relative overflow-hidden pt-32 border-t border-zinc-900">
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
