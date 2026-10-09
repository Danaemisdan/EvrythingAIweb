"use client";

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

  const portalScale = useTransform(introProgress, [0, 0.1, 0.6, 1], [1, 1, 80, 200]);
  const portalOpacity = useTransform(introProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);
  const faceOpacityIntro = useTransform(introProgress, [0, 0.02, 1], [1, 0, 0]);
  const heroOpacity = useTransform(introProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(introProgress, [0, 0.15], [0, -50]);

  useEffect(() => {
    if (activeSection === 0) setFaceState("idle");
    else if (activeSection === 1) setFaceState("speaking"); 
    else if (activeSection >= 2 && activeSection <= 8) setFaceState("thinking");
    else if (activeSection === 9) setFaceState("idle");
  }, [activeSection, animationStep]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const faceVariants = {
    0: { x: "0px", y: "-15vh", scale: 1 },
    1: { x: "0px", y: "0vh", scale: 0.6 },
    2: { x: "0px", y: "-30vh", scale: 0.5 },
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
        
        {/* 2. MAC OS SCREEN */}
        <div ref={howRef} className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
           
           {/* REVERTED TO ORIGINAL SUBHEADING TEXT */}
           <div className="max-w-4xl text-center mb-16 relative z-10">
             <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-sm font-medium mb-8 inline-block">Native OS Integration</div>
             <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">Summon it anywhere.</h2>
             <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
               Give it a directive. Momentum floats above your workspace and takes full control of your mouse and keyboard, right before your eyes.
             </p>
           </div>
           
           {/* REVERTED TO EXACT MAIN WEBSITE MAC LAYOUT */}
           <div className="w-full max-w-6xl aspect-[16/10] bg-black rounded-[2rem] border-[16px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col z-10">
              <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/mac-wallpaper.jpg')" }} />
              
              <div className="absolute top-0 left-0 right-0 z-20">
                <MacOSMenuBar appName="Finder" />
              </div>
              
              {/* Fake Desktop Icons for realism */}
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
              
              <div className="absolute bottom-4 z-20 w-full flex justify-center">
                <MacOSDock apps={dockIcons} onAppClick={() => {}} />
              </div>
           </div>
        </div>

        {/* 4. APPLICATIONS SCROLL */}
        <div ref={horizontalScrollRef} className="relative h-[700vh] w-full border-t border-zinc-900">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center">
            <motion.div style={{ x: `-${hProgress * 85.7}%` }} className="flex w-[700vw] h-full pt-16">
              
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

              {/* PANEL 5: HARDWARE DESIGN */}
              <div className="w-[100vw] h-full flex items-center justify-center p-6 md:p-12">
                <div className="max-w-[1400px] w-full flex flex-col md:flex-row items-center gap-16">
                  <div className="flex-1">
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">Hardware & <br/>Circuit Design.</h3>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-lg mb-8">Momentum directly drives Altium and AutoCAD. It optimally routes multi-layer PCBs, places components to minimize interference, and automatically runs signal integrity simulations.</p>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800 bg-[#061c0f]">
                       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                       <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.2) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
                       
                       <div className="h-8 bg-[#020b06] border-b border-emerald-900/50 flex items-center px-4 font-mono text-[10px] text-emerald-600/70">ALTIUM DESIGNER - Motherboard_V2.PcbDoc</div>
                       
                       <div className="relative w-full h-[calc(100%-32px)]">
                          {/* Fake IC Components */}
                          <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-[#111] border-2 border-emerald-500/50 rounded flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                             <div className="text-[10px] text-emerald-400 font-mono">CPU_MAIN</div>
                             <div className="text-[8px] text-zinc-500">U1</div>
                          </div>
                          
                          <div className="absolute top-1/2 right-1/4 w-12 h-20 bg-[#111] border border-emerald-500/50 rounded flex flex-col items-center justify-center">
                             <div className="text-[8px] text-emerald-400 font-mono">RAM_A</div>
                          </div>

                          {/* Animated Routing Traces */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
                             <motion.path 
                                d="M 280 200 L 400 200 L 450 250 L 550 250" 
                                fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4"
                                initial={{ pathLength: 0 }} animate={{ pathLength: animationStep >= 1 ? 1 : 0 }} transition={{ duration: 1.5, ease: "linear" }}
                             />
                             <motion.path 
                                d="M 280 220 L 380 220 L 420 280 L 550 280" 
                                fill="none" stroke="#34d399" strokeWidth="1"
                                initial={{ pathLength: 0 }} animate={{ pathLength: animationStep >= 1 ? 1 : 0 }} transition={{ duration: 1.2, ease: "linear", delay: 0.5 }}
                             />
                             <motion.path 
                                d="M 280 240 L 350 240 L 400 320 L 480 320 L 550 310" 
                                fill="none" stroke="#059669" strokeWidth="3"
                                initial={{ pathLength: 0 }} animate={{ pathLength: animationStep >= 2 ? 1 : 0 }} transition={{ duration: 1, ease: "linear" }}
                             />
                          </svg>

                          <AnimatePresence>
                             {animationStep >= 2 && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute bottom-6 right-6 bg-black/90 border border-emerald-500/30 p-3 rounded shadow-lg text-[10px] font-mono">
                                  <div className="text-emerald-400 mb-1">AUTO-ROUTER: SUCCESS</div>
                                  <div className="text-zinc-400">NETS ROUTED: 100% (4,092)</div>
                                  <div className="text-zinc-400">IMPEDANCE MATCHED: YES</div>
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
