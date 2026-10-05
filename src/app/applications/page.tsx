"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, Mail, Code, Calendar, Users, Briefcase, FileText, Bot, Layers, CheckCircle } from "lucide-react";
import Link from "next/link";

const applications = [
  {
    title: "Creative & Media",
    description: "Automate video editing, graphic design, and content generation. Momentum works with your tools to execute creative briefs.",
    icon: <Video className="w-6 h-6 text-white" />,
    color: "from-pink-500/20 to-rose-500/5",
    border: "border-pink-500/20",
    items: ["Video Timeline Assembly", "Asset Organization", "Graphic Mockups"]
  },
  {
    title: "Productivity & Admin",
    description: "Your executive assistant. Drafts documents, manages complex schedules, and organizes your digital workspace autonomously.",
    icon: <Mail className="w-6 h-6 text-white" />,
    color: "from-blue-500/20 to-sky-500/5",
    border: "border-blue-500/20",
    items: ["Inbox Zero Automation", "Meeting Scheduling", "Document Drafting"]
  },
  {
    title: "Development & Engineering",
    description: "A pair programmer that understands your entire codebase. Generates boilerplate, debugging architectures, and deploying code.",
    icon: <Code className="w-6 h-6 text-white" />,
    color: "from-emerald-500/20 to-green-500/5",
    border: "border-emerald-500/20",
    items: ["Automated Debugging", "Architecture Design", "CI/CD Management"]
  },
  {
    title: "Communication & Sales",
    description: "Negotiate deals, message clients, and attend meetings on your behalf. Momentum is your frontline representative.",
    icon: <Users className="w-6 h-6 text-white" />,
    color: "from-orange-500/20 to-amber-500/5",
    border: "border-orange-500/20",
    items: ["Client Messaging", "Meeting Representation", "Contract Generation"]
  }
];

export default function ApplicationsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          Momentum
        </Link>
        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Back to Home
        </Link>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-24 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-8 leading-[1.1]"
          >
            Applications built for <br />
            <span className="text-zinc-500">absolute autonomy.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed"
          >
            Momentum OS isn't just an interface; it's a digital workforce. Designed to seamlessly integrate into any professional domain, it executes complex workflows exactly as you would.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app, index) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-[2rem] bg-zinc-900/40 border ${app.border} p-8 md:p-12 group hover:bg-zinc-900/60 transition-colors`}
            >
              {/* Subtle background gradient */}
              <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${app.color} blur-[100px] opacity-50 pointer-events-none transition-opacity group-hover:opacity-80`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10">
                  {app.icon}
                </div>
                
                <h3 className="text-3xl font-medium tracking-tight mb-4">{app.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-md">
                  {app.description}
                </p>

                <ul className="space-y-3">
                  {app.items.map((item, i) => (
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
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">Ready to delegate?</h2>
          <Link 
            href="/newagent" 
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-black font-medium hover:bg-zinc-200 transition-colors"
          >
            Experience Momentum
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
