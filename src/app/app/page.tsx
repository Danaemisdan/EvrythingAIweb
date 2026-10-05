"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, Mail, Code, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AgentFace } from "@/components/AgentFace";

const features = [
  {
    title: "Creative & Media",
    description: "Your personal creative team. Momentum edits video timelines, designs mockups, and organizes visual assets instantly.",
    icon: <Video className="w-6 h-6 text-white" />,
    color: "from-pink-500/20 to-rose-500/5",
    border: "border-pink-500/20",
    items: ["Video Timeline Assembly", "Asset Organization", "Graphic Mockups"]
  },
  {
    title: "Productivity & Admin",
    description: "Your executive assistant. Momentum hits Inbox Zero, coordinates complex scheduling, and drafts documents autonomously.",
    icon: <Mail className="w-6 h-6 text-white" />,
    color: "from-blue-500/20 to-sky-500/5",
    border: "border-blue-500/20",
    items: ["Inbox Zero Automation", "Meeting Scheduling", "Document Drafting"]
  },
  {
    title: "Development",
    description: "Your pair programmer. Momentum understands your entire codebase, generates boilerplate, debugs errors, and manages deployments.",
    icon: <Code className="w-6 h-6 text-white" />,
    color: "from-emerald-500/20 to-green-500/5",
    border: "border-emerald-500/20",
    items: ["Automated Debugging", "Architecture Design", "CI/CD Management"]
  },
  {
    title: "Communication",
    description: "Your frontline representative. Momentum negotiates deals, messages clients, and attends meetings on your behalf.",
    icon: <Users className="w-6 h-6 text-white" />,
    color: "from-orange-500/20 to-amber-500/5",
    border: "border-orange-500/20",
    items: ["Client Messaging", "Meeting Representation", "Contract Generation"]
  }
];

export default function AppPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          Momentum
        </Link>
        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Back to Home
        </Link>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <div className="mb-24 max-w-4xl flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 pointer-events-none"
          >
            <AgentFace state="sleeping" size={160} />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.05]"
          >
            Intelligence that <br />
            <span className="text-zinc-500">does the work.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed mx-auto"
          >
            Not just another chat interface. Momentum is a digital workforce engineered for absolute autonomy. It executes complex tasks seamlessly across any professional domain.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-[2rem] bg-zinc-900/40 border ${feature.border} p-8 md:p-12 group hover:bg-zinc-900/60 transition-colors`}
            >
              {/* Subtle background gradient */}
              <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${feature.color} blur-[100px] opacity-50 pointer-events-none transition-opacity group-hover:opacity-80`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                  {feature.icon}
                </div>
                
                <h3 className="text-3xl font-medium tracking-tight mb-4">{feature.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-md">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-center text-sm font-medium text-zinc-300">
                      <CheckCircle className="w-4 h-4 mr-3 text-zinc-500" />
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
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-8">Ready to delegate?</h2>
          <Link 
            href="/newagent" 
            className="inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-black font-semibold text-lg hover:bg-zinc-200 transition-colors shadow-lg hover:shadow-xl"
          >
            Experience Momentum
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
