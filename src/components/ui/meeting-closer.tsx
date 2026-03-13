import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck, PhoneCall, Sparkles } from "lucide-react";

export function MeetingCloser() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-black px-4">
            <h2 className="text-[3rem] sm:text-[4.5rem] font-bold tracking-tight text-center leading-[1.1] mb-16">
                Takes meetings.<br />
                <span className="text-[#fd5934]">Closes deals.</span>
            </h2>

            <div className="relative w-full max-w-xl mx-auto flex flex-col items-center gap-6">
                
                {/* Step 1: Calendar Invite */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-full bg-white border border-gray-200 shadow-lg rounded-2xl p-5 flex items-center gap-4"
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <CalendarCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg">Discovery Call booked</h4>
                        <p className="text-gray-500 text-sm">Momentum synced with John's calendar</p>
                    </div>
                    <span className="text-sm font-medium text-gray-400">10:00 AM</span>
                </motion.div>

                {/* Step 2: AI Call execution */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="w-full bg-white border border-gray-200 shadow-lg rounded-2xl p-5 flex items-center gap-4 ml-8"
                >
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden">
                        <Sparkles className="w-6 h-6 text-[#fd5934] z-10" />
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} 
                            transition={{ repeat: Infinity, duration: 2 }} 
                            className="absolute inset-0 bg-orange-200 rounded-full"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg">Momentum Voice active</h4>
                        <p className="text-gray-500 text-sm">Handling objections & pitching ROI...</p>
                    </div>
                    <div className="flex gap-1 items-end h-6">
                        <motion.div animate={{ height: ["40%", "100%", "60%"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-[#fd5934] rounded-full"></motion.div>
                        <motion.div animate={{ height: ["80%", "30%", "100%"] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1.5 bg-[#fd5934] rounded-full"></motion.div>
                        <motion.div animate={{ height: ["60%", "90%", "40%"] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1.5 bg-[#fd5934] rounded-full"></motion.div>
                    </div>
                </motion.div>

                {/* Step 3: Deal Closed */}
                <motion.div 
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                    className="w-full bg-green-50 border border-green-200 shadow-xl rounded-2xl p-6 flex flex-col items-center gap-3 text-center mt-4"
                >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-md mb-2">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-900">Contract Signed</h3>
                    <p className="text-green-700 font-medium">$12,500 ACV closed successfully without human intervention.</p>
                </motion.div>

            </div>
        </div>
    );
}
