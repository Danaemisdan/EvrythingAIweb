"use client";

import { useState } from "react";
import Image from "next/image";

interface IOSDockProps {
  apps: { id: string; name: string; icon: string }[];
  onAppClick?: (id: string) => void;
}

export default function IOSDock({ apps, onAppClick }: IOSDockProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartIndex((prev) => Math.min(apps.length - visibleCount, prev + 1));
  };

  const visibleApps = apps.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[98%] max-w-[420px] h-[72px] rounded-[24px] bg-white/20 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 flex items-center justify-between px-1">
      <button 
        onClick={handlePrev} 
        disabled={startIndex === 0}
        className={`w-6 h-6 flex items-center justify-center rounded-full bg-black/20 text-white ${startIndex === 0 ? 'opacity-30' : 'active:bg-black/40'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div className="flex-1 flex items-center justify-around px-0.5">
          {visibleApps.map((app) => (
            <div 
              key={app.id} 
              onClick={(e) => {
                e.stopPropagation();
                onAppClick && onAppClick(app.id);
              }} 
              className="flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-90"
            >
              <div className="relative w-[44px] h-[44px] shadow-sm rounded-[10px]">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
            </div>
          ))}
      </div>

      <button 
        onClick={handleNext} 
        disabled={startIndex >= apps.length - visibleCount}
        className={`w-6 h-6 flex items-center justify-center rounded-full bg-black/20 text-white ${startIndex >= apps.length - visibleCount ? 'opacity-30' : 'active:bg-black/40'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}
