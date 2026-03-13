import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Video, MonitorUp, PhoneOff, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function MeetingCloser() {
    // 0: Waiting -> 1: Agent Joins -> 2: Speaking -> 3: Deal Closed
    const [callPhase, setCallPhase] = useState(0);

    useEffect(() => {
        // Sequencer: Loop the meeting phases automatically
        let timer1: NodeJS.Timeout, timer2: NodeJS.Timeout, timer3: NodeJS.Timeout;
        
        const runSequence = () => {
             setCallPhase(0);
             timer1 = setTimeout(() => setCallPhase(1), 1500); // Agent joins
             timer2 = setTimeout(() => setCallPhase(2), 2500); // Agent starts talking
             timer3 = setTimeout(() => setCallPhase(3), 6000); // Closes deal
        };

        runSequence();
        const cycle = setInterval(runSequence, 10000); // Re-run every 10s for demo loop

        return () => {
             clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3);
             clearInterval(cycle);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-white px-4 relative">
            <h2 
                className="text-[3rem] sm:text-[4.5rem] md:text-[5.5rem] font-bold tracking-tight text-center leading-[1.1] mb-12 font-[-apple-system,BlinkMacSystemFont,'SF_Pro',sans-serif] drop-shadow-2xl"
                style={{ textShadow: "0 4px 60px rgba(0,0,0,0.8)" }}
            >
                Takes meetings.<br />
                <span className="text-[#fd5934]">Closes deals.</span>
            </h2>

            {/* Premium Video Call UI Container */}
            <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-video bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(255,255,255,0.03)] overflow-hidden flex flex-col backdrop-blur-3xl">
                
                {/* Header Navbar of Call */}
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        <span className="text-xs font-medium text-white/50 tracking-wider">00:14:32</span>
                    </div>
                    <span className="text-sm font-medium text-white/80 tracking-tight">Q3 Enterprise Expansion Pitch</span>
                    <div className="w-16"></div> {/* Spacer for flex centering */}
                </div>

                {/* Main Video Grid */}
                <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                    
                    {/* User / Prospect Video Feed (Placeholder blur) */}
                    <div className="relative rounded-2xl bg-gradient-to-br from-[#111] to-[#0A0A0A] border border-white/5 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[2px]"></div>
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                            <span className="text-xs font-medium text-white">Sarah (VP of Sales)</span>
                        </div>
                    </div>

                    {/* Agent Video Feed */}
                    <div className="relative rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            {callPhase === 0 ? (
                                <motion.div 
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-white/30 text-sm font-medium flex items-center gap-2"
                                >
                                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/80 animate-spin"></div>
                                    Waiting for Momentum Agent...
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="agent-active"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    {/* Momentum Logo "Speaking" Avatar */}
                                    <div className="relative">
                                        {/* Glowing halo when speaking */}
                                        <motion.div 
                                            animate={{ opacity: callPhase >= 2 ? [0.4, 0.8, 0.4] : 0, scale: callPhase >= 2 ? [1, 1.2, 1] : 1 }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                            className="absolute inset-x-0 -inset-y-4 bg-[#fd5934]/30 rounded-[3rem] blur-2xl z-0"
                                        />
                                        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10 border-4 border-[#111]">
                                            <Image src="/logo-black.svg" alt="Agent" width={60} height={60} className="w-14 h-14" />
                                        </div>
                                    </div>

                                    {/* Audio Visualizer */}
                                    <div className="flex gap-1.5 items-end h-8">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div 
                                                key={i}
                                                animate={
                                                    callPhase >= 2 
                                                    ? { height: ["20%", `${Math.random() * 60 + 40}%`, "20%"] } 
                                                    : { height: "10%" }
                                                }
                                                transition={
                                                    callPhase >= 2 
                                                    ? { repeat: Infinity, duration: 0.5 + Math.random() * 0.5, ease: "easeInOut" }
                                                    : { duration: 0.3 }
                                                }
                                                className={`w-2 rounded-full ${callPhase >= 2 ? "bg-[#fd5934]" : "bg-white/20"}`}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#fd5934]/30 flex items-center gap-2 z-20">
                            <span className="text-xs font-semibold text-white">Momentum Agent (AI)</span>
                            {callPhase >= 2 && (
                                <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_#4ade80]" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Call Control Bar */}
                <div className="h-20 bg-black/40 border-t border-white/5 backdrop-blur-xl flex items-center justify-center gap-4 sm:gap-6 px-6">
                    <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Mic className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Video className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <MonitorUp className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors">
                        <PhoneOff className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Deal Closed Overlay */}
                <AnimatePresence>
                    {callPhase === 3 && (
                        <motion.div 
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            className="absolute inset-0 z-50 bg-[#0a0a0a]/80 flex flex-col items-center justify-center gap-6"
                        >
                            <motion.div 
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                            >
                                <CheckCircle2 className="w-12 h-12 text-green-400" />
                            </motion.div>
                            <div className="text-center">
                                <h3 className="text-3xl font-bold tracking-tight mb-2">Contract Signed</h3>
                                <p className="text-green-400/80 font-medium tracking-tight">Enterprise Tier • $12,500 ACV</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

