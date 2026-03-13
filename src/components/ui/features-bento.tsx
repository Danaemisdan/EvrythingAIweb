import React from "react";
import { motion } from "framer-motion";
import { CircleDollarSign, Infinity, LockKeyhole } from "lucide-react";

export function FeaturesBento() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-black px-4 max-w-5xl mx-auto">
            <h2 className="text-[3rem] sm:text-[4.5rem] font-bold tracking-tight text-center leading-[1.1] mb-16">
                No hidden catches.<br />
                <span className="text-[#fd5934]">Pure leverage.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                
                {/* 0 Subscription Fees */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                    className="col-span-1 md:col-span-2 bg-neutral-100 hover:bg-neutral-200 transition-colors border border-neutral-200 rounded-[2rem] p-8 flex flex-col justify-between min-h-[250px] relative overflow-hidden group"
                >
                    <div className="z-10 relative">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                            <CircleDollarSign className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2">$0 Subscriptions.</h3>
                        <p className="text-neutral-600 text-lg font-medium max-w-md">
                            Stop paying monthly retainers for bloated software. You own your Momentum OS completely.
                        </p>
                    </div>
                    {/* Decorative giant background icon */}
                    <div className="absolute -bottom-10 -right-10 text-neutral-200 opacity-50 group-hover:scale-110 transition-transform duration-700">
                        <CircleDollarSign className="w-64 h-64" />
                    </div>
                </motion.div>

                {/* 0 API Limits */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                    className="col-span-1 bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 flex flex-col justify-between min-h-[250px] relative overflow-hidden group text-white"
                >
                    <div className="z-10 relative">
                        <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6">
                            <Infinity className="w-7 h-7 text-[#fd5934]" />
                        </div>
                        <h3 className="text-3xl font-bold mb-2">No Limits.</h3>
                        <p className="text-neutral-400 font-medium">
                            Unlimited API calls to your local models. Run at scale for free.
                        </p>
                    </div>
                </motion.div>

                {/* Runs Locally / Privacy Secure */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                    className="col-span-1 md:col-span-3 bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                >
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shrink-0 shadow-xl z-10">
                        <LockKeyhole className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left z-10">
                        <h3 className="text-3xl font-bold mb-3">100% Local & Private.</h3>
                        <p className="text-neutral-600 text-lg font-medium max-w-2xl">
                            Your data never leaves your machine. Momentum taps directly into your local storage running highly-optimized local LLMs that protect your privacy implicitly.
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
