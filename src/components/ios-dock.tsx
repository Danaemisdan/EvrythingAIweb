"use client";

import { useState } from "react";
import Image from "next/image";

interface IOSDockProps {
  apps: { id: string; name: string; icon: string }[];
  onAppClick?: (id: string) => void;
}

export default function IOSDock({ apps, onAppClick }: IOSDockProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;

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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[420px] h-[88px] rounded-[32px] bg-white/20 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 flex items-center justify-between px-2">
      <button 
        onClick={handlePrev} 
        disabled={startIndex === 0}
        className={`w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white ${startIndex === 0 ? 'opacity-30' : 'active:bg-black/40'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div className="flex-1 flex items-center justify-around px-1">
          {visibleApps.map((app) => (
            <div 
              key={app.id} 
              onClick={(e) => {
                e.stopPropagation();
                onAppClick && onAppClick(app.id);
              }} 
              className="flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-90"
            >
              <div className="relative w-[50px] h-[50px] shadow-sm rounded-[14px]">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
            </div>
          ))}
      </div>

      <button 
        onClick={handleNext} 
        disabled={startIndex >= apps.length - visibleCount}
        className={`w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white ${startIndex >= apps.length - visibleCount ? 'opacity-30' : 'active:bg-black/40'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  );
}
