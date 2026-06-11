import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MessagesWindow({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    // Phase 1: Typing indicator
    const timer1 = setTimeout(() => {
      setProgress(1); // Start uploading
    }, 1000);

    // Phase 2: Uploading
    let uploadInterval: NodeJS.Timeout;
    if (progress > 0 && progress < 100) {
      uploadInterval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(uploadInterval);
            setTimeout(() => {
                setShowVideo(true);
                setTimeout(() => {
                    setSent(true);
                    setTimeout(onComplete, 2000);
                }, 800);
            }, 500);
            return 100;
          }
          return p + 10;
        });
      }, 100);
    }

    return () => {
      clearTimeout(timer1);
      if (uploadInterval) clearInterval(uploadInterval);
    };
  }, [progress, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="absolute right-10 bottom-32 w-[380px] h-[520px] bg-[#1c1c1e]/90 backdrop-blur-xl rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden z-[90]"
    >
      {/* Top Bar */}
      <div className="h-14 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between select-none">
        <div className="flex flex-col">
            <span className="text-white font-medium text-sm">Design Team</span>
            <span className="text-white/40 text-[10px]">3 people</span>
        </div>
        <div className="flex gap-3 text-blue-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative">
          <div className="text-center text-[10px] text-white/40 mb-2">Today 9:41 AM</div>
          
          <div className="flex items-end gap-2 max-w-[85%] self-start">
             <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400"></div>
             <div className="bg-[#2c2c2e] text-white text-sm py-2 px-3 rounded-2xl rounded-bl-sm">
                 Hey! Can we get that video for the campaign out today?
             </div>
          </div>
          
          <AnimatePresence>
              {progress > 0 && !showVideo && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-end gap-1 max-w-[85%] self-end mt-4"
                  >
                      <div className="w-48 h-32 bg-[#2c2c2e] rounded-2xl flex items-center justify-center relative overflow-hidden">
                          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <div className="absolute inset-0 bg-blue-500/20" style={{ width: `${progress}%` }}></div>
                      </div>
                  </motion.div>
              )}
              
              {showVideo && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex flex-col items-end gap-1 max-w-[85%] self-end mt-4 ${sent ? '' : 'opacity-70'}`}
                  >
                      <div className="w-48 h-32 bg-black rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                          <img src="https://media.giphy.com/media/sIIhZliB2McAo/giphy.gif" alt="Nyan Cat" className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80" />
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-md">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                          </div>
                      </div>
                      {sent && <span className="text-[10px] text-white/40 mr-1">Delivered</span>}
                  </motion.div>
              )}
          </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="h-16 bg-white/5 border-t border-white/10 flex items-center px-4 gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
          </div>
          <div className="flex-1 h-8 rounded-full border border-white/10 bg-black/50 px-3 flex items-center text-white/30 text-sm">
              iMessage
          </div>
      </div>
    </motion.div>
  );
}
