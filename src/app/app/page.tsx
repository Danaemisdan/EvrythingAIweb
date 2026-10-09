"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue } from "framer-motion";
import Link from "next/link";
import { AgentFace, AgentState } from "@/components/AgentFace";
import { Terminal, Cpu, Network, Video, Layers, Wand2, Mail, Calendar, MessageSquare, ShieldCheck, MonitorSmartphone } from "lucide-react";

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [faceState, setFaceState] = useState<AgentState>("idle");

  // --- Intro Scroll ---
  const introRef = useRef<HTMLDivElement>(null);
  const introProgress = useMotionValue(0);

  // --- Section Trackers ---
  const devRef = useRef<HTMLDivElement>(null);
  const creativeRef = useRef<HTMLDivElement>(null);
  const opsRef = useRef<HTMLDivElement>(null);
  const universalRef = useRef<HTMLDivElement>(null);
  
  const [currentDevStep, setCurrentDevStep] = useState(0);
  const [currentCreativeStep, setCurrentCreativeStep] = useState(0);
  const [currentOpsStep, setCurrentOpsStep] = useState(0);
  const [currentUniversalStep, setCurrentUniversalStep] = useState(0);

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

      const isActive = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        return rect.top < vh * 0.8 && rect.bottom > vh * 0.2;
      };

      const getStep = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return 0;
        const rect = ref.current.getBoundingClientRect();
        const totalDistance = vh + rect.height;
        const scrolled = vh - rect.top;
        const p = Math.max(0, Math.min(1, scrolled / totalDistance));
        if (p > 0.7) return 2;
        if (p > 0.5) return 1;
        return 0;
      };

      setCurrentDevStep(getStep(devRef));
      setCurrentCreativeStep(getStep(creativeRef));
      setCurrentOpsStep(getStep(opsRef));
      setCurrentUniversalStep(getStep(universalRef));

      if (isActive(universalRef)) setActiveSection(4);
      else if (isActive(opsRef)) setActiveSection(3);
      else if (isActive(creativeRef)) setActiveSection(2);
      else if (isActive(devRef)) setActiveSection(1);
      else setActiveSection(0);
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
    else if (activeSection === 1) setFaceState(currentDevStep === 0 ? "thinking" : currentDevStep === 1 ? "error" : "happy");
    else if (activeSection === 2) setFaceState(currentCreativeStep === 2 ? "idle" : "thinking");
    else if (activeSection === 3) setFaceState(currentOpsStep === 0 ? "listening" : "speaking");
    else if (activeSection === 4) setFaceState(currentUniversalStep === 1 ? "thinking" : "happy");
  }, [activeSection, currentDevStep, currentCreativeStep, currentOpsStep, currentUniversalStep]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Face positions using clamp to prevent them from flying off ultrawide monitors!
  const faceVariants = {
    0: { x: "0px", y: "-15vh", scale: 1 },
    1: { x: "clamp(100px, 25vw, 360px)", y: "-22vh", scale: 0.55 }, // Top Right of Dev widget
    2: { x: "clamp(-360px, -25vw, -100px)", y: "-22vh", scale: 0.55 }, // Top Left of Creative widget
    3: { x: "clamp(100px, 25vw, 360px)", y: "-22vh", scale: 0.55 },  // Top Right of Ops widget
    4: { x: "clamp(-360px, -25vw, -100px)", y: "0px", scale: 0.7 }, // Dead center of Universal widget
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
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="relative pointer-events-auto"
        >
          {/* Intro Portal - only visible in section 0 */}
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
            className={activeSection === 0 ? "" : "transition-opacity duration-1000 ease-in"}
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
        <div className="min-h-screen flex items-center justify-center px-6 md:px-24">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] max-w-5xl text-center">
            Momentum is not an assistant. <br/>
            <span className="text-zinc-600">It is a fully autonomous digital workforce capable of reasoning, planning, and executing across any domain.</span>
          </h2>
        </div>

        {/* --- SECTION 1: ENGINEERING --- */}
        <div ref={devRef} className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-32 flex flex-col md:flex-row gap-20 items-start">
          <div className="w-full md:w-1/2 flex flex-col gap-[40vh] py-[20vh]">
            <div className="max-w-xl">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6"><Terminal className="text-emerald-400" /></div>
              <h3 className="text-4xl md:text-5xl font-medium mb-6">Absolute Autonomy in Engineering</h3>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">Momentum doesn't just write snippets. It reads your entire repository, understands your architecture, and builds full-stack features from end to end.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-lg text-zinc-300"><Cpu className="w-5 h-5 text-emerald-500" /> Multi-file architecture design</li>
                <li className="flex items-center gap-4 text-lg text-zinc-300"><Network className="w-5 h-5 text-emerald-500" /> CI/CD pipeline management</li>
              </ul>
            </div>
            <div className="max-w-xl">
              <h3 className="text-4xl md:text-5xl font-medium mb-6">Proactive Debugging</h3>
              <p className="text-xl text-zinc-400 leading-relaxed">When a pipeline breaks or a runtime error occurs, Momentum automatically investigates the stack trace, writes the patch, runs tests, and pushes the fix before you even wake up.</p>
            </div>
            <div className="max-w-xl">
              <h3 className="text-4xl md:text-5xl font-medium mb-6">Zero-Setup Deployments</h3>
              <p className="text-xl text-zinc-400 leading-relaxed">Simply describe the application you want. Momentum will scaffold the database, configure the cloud infrastructure, and give you a live production URL.</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 sticky top-32 h-[calc(100vh-16rem)]">
            <div className="w-full h-full bg-zinc-900/50 backdrop-blur-3xl rounded-[2rem] border border-emerald-500/20 p-8 pt-32 shadow-2xl flex flex-col relative overflow-hidden">
              <h4 className="text-xl font-medium text-white mb-6">Terminal / IDE</h4>
              <div className="flex-1 bg-black/80 rounded-xl border border-white/5 p-6 font-mono text-sm overflow-hidden flex flex-col justify-end gap-2">
                <AnimatePresence mode="popLayout">
                  {currentDevStep >= 0 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-zinc-400">
                      $ momentum build --target=production<br/><span className="text-zinc-500">Analyzing 1,402 files...</span>
                    </motion.div>
                  )}
                  {currentDevStep >= 1 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4">
                      <span className="text-red-400">✖ Build Failed: TypeError in auth.ts</span><br/><span className="text-zinc-500">Momentum Agent intercepted error...</span><br/><span className="text-emerald-400">Applying patch to auth.ts (lines 14-22)...</span>
                    </motion.div>
                  )}
                  {currentDevStep >= 2 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4">
                      <span className="text-emerald-400">✔ Patch successful. Tests passed.</span><br/><span className="text-blue-400">Deploying to Vercel (Production)...</span><br/><span className="text-white mt-2 inline-block font-bold">✨ Live at: https://app.production.com</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: CREATIVE --- */}
        <div ref={creativeRef} className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-32 flex flex-col-reverse md:flex-row gap-20 items-start">
          <div className="w-full md:w-1/2 sticky top-32 h-[calc(100vh-16rem)]">
            <div className="w-full h-full bg-zinc-900/50 backdrop-blur-3xl rounded-[2rem] border border-pink-500/20 p-8 pt-32 shadow-2xl flex flex-col relative overflow-hidden">
              <h4 className="text-xl font-medium text-white mb-6 text-right">Media Timeline</h4>
              <div className="flex-1 bg-black/80 rounded-xl border border-white/5 p-6 flex flex-col justify-center gap-4 relative overflow-hidden">
                <div className="h-48 bg-zinc-900 rounded-lg overflow-hidden relative">
                   {currentCreativeStep === 0 && <div className="absolute inset-0 flex items-center justify-center text-zinc-600">Raw Assets (142 files)</div>}
                   {currentCreativeStep === 1 && <div className="absolute inset-0 flex items-center justify-center text-pink-400">Syncing Audio & B-Roll...</div>}
                   {currentCreativeStep === 2 && (
                     <div className="absolute inset-0">
                       <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-80" />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"><span className="text-white font-bold bg-pink-600 px-4 py-2 rounded-full">Final Cut Ready</span></div>
                     </div>
                   )}
                </div>
                <div className="flex flex-col gap-2">
                  <motion.div className="h-6 bg-pink-500/20 rounded w-full" animate={{ width: currentCreativeStep > 0 ? "100%" : "30%" }} transition={{ duration: 0.5 }} />
                  <motion.div className="h-6 bg-rose-500/20 rounded w-3/4" animate={{ width: currentCreativeStep > 0 ? "80%" : "10%" }} transition={{ duration: 0.5 }} />
                  <motion.div className="h-6 bg-purple-500/20 rounded w-1/2" animate={{ width: currentCreativeStep > 0 ? "60%" : "5%" }} transition={{ duration: 0.5 }} />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-[40vh] py-[20vh]">
            <div className="max-w-xl">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6"><Video className="text-pink-400" /></div>
              <h3 className="text-4xl md:text-5xl font-medium mb-6">A New Era of Creative Control</h3>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">Drop thousands of raw clips into a folder. Momentum will categorize them, find the best takes, and assemble a narrative timeline synced perfectly to your music.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-lg text-zinc-300"><Layers className="w-5 h-5 text-pink-500" /> Automated asset organization</li>
                <li className="flex items-center gap-4 text-lg text-zinc-300"><Wand2 className="w-5 h-5 text-pink-500" /> Prompt-based color grading</li>
              </ul>
            </div>
            <div className="max-w-xl">
              <h3 className="text-4xl md:text-5xl font-medium mb-6">Iterate at the Speed of Thought</h3>
              <p className="text-xl text-zinc-400 leading-relaxed">Tell Momentum to "make the intro punchier" or "swap the b-roll to match a cyberpunk aesthetic." It executes complex NLE operations in seconds, letting you focus on the vision.</p>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: OPS --- */}
        <div ref={opsRef} className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-32 flex flex-col md:flex-row gap-20 items-start">
          <div className="w-full md:w-1/2 flex flex-col gap-[40vh] py-[20vh]">
            <div className="max-w-xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6"><Mail className="text-blue-400" /></div>
              <h3 className="text-4xl md:text-5xl font-medium mb-6">Business Operations on Autopilot</h3>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">Momentum doesn't just read your email; it manages your professional relationships. It drafts nuanced replies, negotiates deals within your parameters, and coordinates complex schedules.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-lg text-zinc-300"><Calendar className="w-5 h-5 text-blue-500" /> Autonomous calendar Tetris</li>
                <li className="flex items-center gap-4 text-lg text-zinc-300"><MessageSquare className="w-5 h-5 text-blue-500" /> Multi-stakeholder negotiation</li>
              </ul>
            </div>
            <div className="max-w-xl">
              <h3 className="text-4xl md:text-5xl font-medium mb-6">Inbox Zero, Permanently.</h3>
              <p className="text-xl text-zinc-400 leading-relaxed">It categorizes everything, surfaces only what requires your executive decision, and automatically archives or resolves the rest. You will never waste time on administrative overhead again.</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 sticky top-32 h-[calc(100vh-16rem)]">
            <div className="w-full h-full bg-zinc-900/50 backdrop-blur-3xl rounded-[2rem] border border-blue-500/20 p-8 pt-32 shadow-2xl flex flex-col relative overflow-hidden">
              <h4 className="text-xl font-medium text-white mb-6">Active Negotiation</h4>
              <div className="flex-1 bg-black/80 rounded-xl border border-white/5 p-6 flex flex-col gap-4 overflow-hidden justify-end">
                <AnimatePresence mode="popLayout">
                  {currentOpsStep >= 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-start bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] text-zinc-200">
                      <span className="text-xs text-zinc-500 block mb-1">Acme Corp</span>
                      We need a 20% discount on the enterprise plan to proceed with the Q4 deployment.
                    </motion.div>
                  )}
                  {currentOpsStep >= 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-end bg-blue-600 px-4 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%] text-white">
                      <span className="text-xs text-blue-300 block mb-1">Momentum (on your behalf)</span>
                      I can authorize 10% today, and I'll include our priority support package free for 6 months to offset the difference.
                    </motion.div>
                  )}
                  {currentOpsStep >= 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-start bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] text-zinc-200">
                      <span className="text-xs text-zinc-500 block mb-1">Acme Corp</span>
                      That works. Send the contract over.
                    </motion.div>
                  )}
                </AnimatePresence>
                {currentOpsStep >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
                    <span className="text-xs text-blue-400 border border-blue-500/30 bg-blue-500/10 px-4 py-2 rounded-full">Contract Auto-Generated & Sent</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 4: UNIVERSAL & PRIVACY --- */}
        <div ref={universalRef} className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-32 flex flex-col-reverse md:flex-row gap-20 items-start">
          <div className="w-full md:w-1/2 sticky top-32 h-[calc(100vh-16rem)]">
            <div className="w-full h-full bg-zinc-900/50 backdrop-blur-3xl rounded-[2rem] border border-purple-500/20 p-8 pt-32 shadow-2xl flex flex-col relative overflow-hidden">
              <h4 className="text-xl font-medium text-white mb-6 text-right z-10 relative">Universal OS Control</h4>
              <div className="flex-1 bg-black rounded-xl border border-white/10 p-1 flex flex-col relative overflow-hidden shadow-2xl">
                {/* Fake macOS Window Header */}
                <div className="h-6 w-full flex items-center px-3 gap-2 bg-zinc-900/50 rounded-t-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                
                <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-zinc-950 rounded-b-lg">
                  <AnimatePresence mode="popLayout">
                    {currentUniversalStep === 0 && (
                      <motion.div key="blender" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col p-4">
                        <div className="text-xs text-zinc-500 mb-4 font-mono">Blender 4.0 - scene_01.blend</div>
                        <div className="flex-1 border border-zinc-800 rounded-lg flex items-center justify-center bg-zinc-900/50">
                           <div className="w-48 h-48 border-2 border-dashed border-purple-500/30 rounded-lg animate-pulse flex items-center justify-center relative">
                             <div className="absolute inset-0 bg-purple-500/5" />
                           </div>
                        </div>
                      </motion.div>
                    )}
                    {currentUniversalStep === 1 && (
                      <motion.div key="vscode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col p-4">
                        <div className="text-xs text-zinc-500 mb-4 font-mono">VS Code - main.tsx</div>
                        <div className="flex-1 border border-zinc-800 rounded-lg p-6 font-mono text-sm text-emerald-400/80 text-left bg-black">
                          <div>function initAgent() {'{'}</div>
                          <div className="ml-4">const ctx = getOSContext();</div>
                          <div className="ml-4 text-purple-400">// Momentum auto-refactoring OS hooks...</div>
                          <div className="ml-4">ctx.takeControl();</div>
                          <div>{'}'}</div>
                        </div>
                      </motion.div>
                    )}
                    {currentUniversalStep === 2 && (
                      <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col p-4">
                        <div className="text-xs text-zinc-500 mb-4 font-mono">Terminal</div>
                        <div className="flex-1 rounded-lg p-6 font-mono text-sm text-white/80 text-left flex flex-col gap-3 bg-black">
                          <div className="text-green-400">$ momentum system --override</div>
                          <div className="text-zinc-500">Injecting OS accessibility hooks...</div>
                          <div className="text-purple-400">Total System Control: GRANTED</div>
                          <div className="text-blue-400 animate-pulse mt-4">Awaiting intent...</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Fake Cursor controlled by Momentum */}
                <motion.div 
                   animate={{ 
                     x: currentUniversalStep === 0 ? "10vw" : currentUniversalStep === 1 ? "-5vw" : "5vw",
                     y: currentUniversalStep === 0 ? "5vh" : currentUniversalStep === 1 ? "-10vh" : "15vh"
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
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-[40vh] py-[20vh]">
            <div className="max-w-xl">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6"><MonitorSmartphone className="text-purple-400" /></div>
              <h3 className="text-4xl md:text-5xl font-medium mb-6">Controls Any Application</h3>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">Momentum isn't just a web wrapper. It directly interfaces with your operating system, driving any desktop application with human-like precision.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-lg text-zinc-300"><Layers className="w-5 h-5 text-purple-500" /> From 3D Modeling to Chip Design</li>
                <li className="flex items-center gap-4 text-lg text-zinc-300"><Wand2 className="w-5 h-5 text-purple-500" /> No exact prompting required—just state intent</li>
              </ul>
            </div>
            <div className="max-w-xl">
              <h3 className="text-4xl md:text-5xl font-medium mb-6">Total Privacy. Zero Subscriptions.</h3>
              <p className="text-xl text-zinc-400 leading-relaxed">It runs completely on your PC hardware. It's blisteringly fast, inherently private, and your data is uncompromisingly safe. Best of all? It's a one-time fee of $30. We despise subscriptions. You only pay after you've used it.</p>
            </div>
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
