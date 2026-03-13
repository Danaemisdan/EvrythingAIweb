import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Magnetic } from "./magnetic";
import { 
    SiGoogle, SiWhatsapp, SiCanva, SiSlack, SiNotion, SiFigma,
    SiGithub, SiDiscord, SiZoom, SiLinear, SiX, SiStripe, SiSpotify,
    SiYoutube, SiSalesforce, SiHubspot, SiJira, SiMiro, SiTrello,
    SiDropbox, SiOpenai, SiVercel, SiShopify, SiMailchimp, SiZendesk
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

export function SocialShowcase() {
    // Large array of exact brand icons requested + additions to fill 30-40 count
    const BRANDS = [
        { icon: SiGoogle, color: "#4285F4" }, { icon: FaLinkedin, color: "#0A66C2" }, 
        { icon: SiWhatsapp, color: "#25D366" }, { icon: SiCanva, color: "#00C4CC" }, 
        { icon: SiSlack, color: "#4A154B" }, { icon: SiNotion, color: "#000000" }, 
        { icon: SiFigma, color: "#F24E1E" }, { icon: SiGithub, color: "#181717" },
        { icon: SiDiscord, color: "#5865F2" }, { icon: SiZoom, color: "#2D8CFF" },
        { icon: SiLinear, color: "#5E6AD2" }, { icon: SiX, color: "#000000" },
        { icon: SiStripe, color: "#008CDD" }, { icon: SiSpotify, color: "#1DB954" },
        { icon: SiYoutube, color: "#FF0000" }, { icon: SiSalesforce, color: "#00A1E0" },
        { icon: SiHubspot, color: "#FF7A59" }, { icon: SiJira, color: "#0052CC" },
        { icon: SiMiro, color: "#050038" }, { icon: SiTrello, color: "#0052CC" },
        { icon: SiDropbox, color: "#0061FF" }, { icon: SiOpenai, color: "#412991" },
        { icon: SiVercel, color: "#000000" }, { icon: SiShopify, color: "#95BF47" },
        { icon: SiMailchimp, color: "#FFE01B" }, { icon: SiZendesk, color: "#03363D" }
    ];

    // Duplicate some purely to fill visual density to hit closer to 40 nodes visually
    const icons = [...BRANDS, ...BRANDS.slice(0, 14)];

    // Pre-calculate scattered random positions so they stay stable across hydration
    const scatteredNodes = useMemo(() => {
        return icons.map((item, i) => {
            // Distribute them radially outward with some randomness
            const angle = (i / icons.length) * Math.PI * 2 * 3; // Spiral outwards
            const radius = 180 + Math.random() * 250; // Random distance between 180px and 430px from center
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            // Random scales to give depth perception
            const scale = 0.6 + Math.random() * 0.8; 

            return { ...item, x, y, scale };
        });
    }, [icons]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-black px-4 overflow-hidden">
            <h2 className="text-[3rem] sm:text-[4.5rem] font-bold tracking-tight text-center leading-[1.1] mb-16 z-30">
                Connects to everything.<br />
                <span className="text-[#fd5934]">Locally.</span>
            </h2>
            
            <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center pointer-events-auto">
                
                {/* Central Momentum Node */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="absolute z-40 w-28 h-28 bg-black rounded-[2rem] shadow-2xl flex items-center justify-center overflow-hidden"
                >
                    <svg viewBox="0 0 375 375" className="w-20 h-20 drop-shadow-lg">
                        <path fill="#ffffff" d="M 187.53125 64.34375 L 329.738281 310.652344 L 187.53125 239.414062 L 45.320312 310.652344 Z" />
                    </svg>
                </motion.div>

                {/* Scattered Magnetic Ecosystem Icons */}
                {scatteredNodes.map((node, i) => {
                    const Icon = node.icon;

                    return (
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                            animate={{ x: node.x, y: node.y, opacity: 1, scale: node.scale }}
                            transition={{ 
                                delay: i * 0.02, 
                                duration: 1.2, 
                                type: "spring", 
                                stiffness: 60,
                                damping: 12
                            }}
                            className="absolute z-20"
                        >
                            <Magnetic intensity={0.4} springOptions={{ stiffness: 150, damping: 15, mass: 0.1 }}>
                                <div 
                                    className="w-16 h-16 bg-white border border-gray-100/50 rounded-2xl shadow-xl flex items-center justify-center backdrop-blur-md cursor-pointer hover:border-gray-300 transition-colors"
                                    style={{ color: node.color }}
                                >
                                    <Icon className="w-8 h-8" />
                                </div>
                            </Magnetic>
                        </motion.div>
                    );
                })}

                {/* Subtle connecting lines matrix behind all icons */}
                <svg className="absolute inset-0 w-full h-full -z-10 opacity-10 pointer-events-none">
                    <defs>
                        <radialGradient id="fade" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="black" stopOpacity="1" />
                            <stop offset="100%" stopColor="black" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="50%" cy="50%" r="200" stroke="url(#fade)" strokeWidth="1" fill="none" />
                    <circle cx="50%" cy="50%" r="300" stroke="url(#fade)" strokeWidth="1" strokeDasharray="4 8" fill="none" />
                    <circle cx="50%" cy="50%" r="400" stroke="url(#fade)" strokeWidth="1" strokeDasharray="2 6" fill="none" />
                </svg>
            </div>
        </div>
    );
}
