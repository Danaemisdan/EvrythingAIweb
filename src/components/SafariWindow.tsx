import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface SafariWindowProps {
  url: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function SafariWindow({ url, children, onClose, className = "" }: SafariWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      drag
      dragMomentum={false}
      className={`absolute z-[60] flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-3xl ${className}`}
      style={{
        width: "min(98vw, 900px)",
        height: "600px",
        left: "calc(50% - min(49vw, 450px))",
        top: "calc(50% - 300px)",
      }}
    >
      {/* Title Bar */}
      <div className="h-12 w-full bg-black/40 border-b border-white/10 flex items-center px-4 select-none shrink-0 cursor-move">
        <div className="flex gap-2">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:bg-[#FF5F56]/80 flex items-center justify-center group" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
        </div>
        
        {/* URL Bar */}
        <div className="mx-auto flex-1 max-w-md h-7 ml-4 rounded-md bg-white/10 border border-white/10 flex items-center justify-center px-3 shadow-inner">
          <span className="text-white/80 text-xs font-medium tracking-wide font-sans truncate">{url}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 relative bg-white overflow-hidden pointer-events-auto">
        {children}
      </div>
    </motion.div>
  );
}
