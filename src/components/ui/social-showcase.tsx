import React from "react";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Instagram, Mail, MessageSquare, Slack } from "lucide-react";

export function SocialShowcase() {
    const icons = [
        { icon: Twitter, color: "text-sky-500", delay: 0 },
        { icon: Linkedin, color: "text-blue-600", delay: 0.1 },
        { icon: Instagram, color: "text-pink-600", delay: 0.2 },
        { icon: Mail, color: "text-red-500", delay: 0.3 },
        { icon: MessageSquare, color: "text-green-500", delay: 0.4 },
        { icon: Slack, color: "text-purple-600", delay: 0.5 },
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-black px-4">
            <h2 className="text-[3rem] sm:text-[4.5rem] font-bold tracking-tight text-center leading-[1.1] mb-16">
                Connects to <br />
                <span className="text-[#fd5934]">everything.</span>
            </h2>
            
            <div className="relative w-full max-w-lg h-[300px] flex items-center justify-center">
                {/* Central Momentum Node */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="absolute z-10 w-24 h-24 bg-black rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden"
                >
                    <svg viewBox="0 0 375 375" className="w-16 h-16 drop-shadow-md">
                        <path fill="#ffffff" d="M 187.53125 64.34375 L 329.738281 310.652344 L 187.53125 239.414062 L 45.320312 310.652344 Z" />
                    </svg>
                </motion.div>

                {/* Orbiting Social Icons */}
                {icons.map((item, i) => {
                    const Icon = item.icon;
                    const angle = (i / icons.length) * Math.PI * 2;
                    const radius = 120;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                            animate={{ x, y, opacity: 1, scale: 1 }}
                            transition={{ 
                                delay: item.delay, 
                                duration: 0.8, 
                                type: "spring", 
                                stiffness: 100 
                            }}
                            className="absolute w-14 h-14 bg-white border border-gray-100 rounded-2xl shadow-xl flex items-center justify-center"
                        >
                            <Icon className={`w-7 h-7 ${item.color}`} />
                        </motion.div>
                    );
                })}

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full -z-10 opacity-20 pointer-events-none">
                    <circle cx="50%" cy="50%" r="120" stroke="black" strokeWidth="1" strokeDasharray="4 4" fill="none" />
                </svg>
            </div>
        </div>
    );
}
