"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Video, Mail, Code, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AgentFace } from "@/components/AgentFace";

const features = [
  {
    title: "Creative & Media",
    description: "Your personal creative team. Momentum edits video timelines, designs mockups, and organizes visual assets instantly.",
    icon: <Video className="w-6 h-6 text-black" />,
    color: "from-pink-500/20 to-rose-500/5",
    border: "border-pink-200",
    items: ["Video Timeline Assembly", "Asset Organization", "Graphic Mockups"]
  },
  {
    title: "Productivity & Admin",
    description: "Your executive assistant. Momentum hits Inbox Zero, coordinates complex scheduling, and drafts documents autonomously.",
    icon: <Mail className="w-6 h-6 text-black" />,
    color: "from-blue-500/20 to-sky-500/5",
    border: "border-blue-200",
    items: ["Inbox Zero Automation", "Meeting Scheduling", "Document Drafting"]
  },
  {
    title: "Development",
    description: "Your pair programmer. Momentum understands your entire codebase, generates boilerplate, debugs errors, and manages deployments.",
    icon: <Code className="w-6 h-6 text-black" />,
    color: "from-emerald-500/20 to-green-500/5",
    border: "border-emerald-200",
    items: ["Automated Debugging", "Architecture Design", "CI/CD Management"]
  },
  {
    title: "Communication",
    description: "Your frontline representative. Momentum negotiates deals, messages clients, and attends meetings on your behalf.",
    icon: <Users className="w-6 h-6 text-black" />,
    color: "from-orange-500/20 to-amber-500/5",
    border: "border-orange-200",
    items: ["Client Messaging", "Meeting Representation", "Contract Generation"]
  }
];

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Zoom portal: starts scaling up slowly, then extremely fast to fill the screen
  const portalScale = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [1, 1, 30, 200]);
  const portalOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 1, 1]);
  
  // Hero text fades out as we start scrolling
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-black selection:bg-black/10 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-sm border-b border-white/5 mix-blend-difference">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity">
          Momentum
        </Link>
        <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
          Back to Home
        </Link>
      </nav>

      {/* 200vh container for scroll portal effect */}
      <div ref={containerRef} className="h-[250vh] relative w-full bg-black">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          
          <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none mt-40"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05] text-white text-center">
              Intelligence that <br />
              <span className="text-zinc-500">does the work.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed text-center px-6">
              Not just another chat interface. Momentum is a digital workforce engineered for absolute autonomy.
            </p>
          </motion.div>

          <div className="z-20 relative -mt-64 md:-mt-80 pointer-events-auto">
            {/* Make the Agent face "idle" so it tracks mouse and has eyes open */}
            <AgentFace state="idle" size={160} />
            
            {/* The white portal that zooms out of the eyes */}
            <motion.div
              style={{ scale: portalScale, opacity: portalOpacity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 bg-white rounded-full pointer-events-none origin-center"
            />
          </div>
        </div>
      </div>

      {/* 2nd Section - White Background */}
      <main className="relative z-30 bg-white text-black py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <div className="text-center mb-24 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
              Executes complex tasks across any domain.
            </h2>
            <p className="text-xl text-zinc-600 leading-relaxed">
              Seamlessly integrates into your professional workflows to act exactly as you would.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative overflow-hidden rounded-[2rem] bg-zinc-50 border ${feature.border} p-8 md:p-12 group hover:bg-zinc-100 transition-colors shadow-sm`}
              >
                {/* Subtle background gradient */}
                <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${feature.color} blur-[80px] opacity-40 pointer-events-none transition-opacity group-hover:opacity-70`} />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm border border-zinc-200">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-3xl font-semibold tracking-tight mb-4">{feature.title}</h3>
                  <p className="text-zinc-600 text-lg leading-relaxed mb-8 max-w-md">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-center text-sm font-medium text-zinc-700">
                        <CheckCircle className="w-4 h-4 mr-3 text-zinc-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Closing CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">Ready to delegate?</h2>
            <Link 
              href="/newagent" 
              className="inline-flex h-16 items-center justify-center rounded-full bg-black px-10 text-white font-medium text-lg hover:bg-zinc-800 transition-colors shadow-xl hover:shadow-2xl"
            >
              Experience Momentum
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
