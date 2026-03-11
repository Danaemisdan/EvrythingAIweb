import React from "react";

export default function Footer() {
    return (
        <footer className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
            {/* Background Video Layer */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source
                    src="https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4"
                    type="video/mp4"
                />
            </video>

            {/* Multiply Mask Layer: Everything white becomes transparent (shows video), everything black stays black */}
            <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center mix-blend-multiply pointer-events-none">

                {/* SVG Stencil */}
                <img
                    src="/2.svg"
                    alt="Evrything AI Symbol Stencil"
                    className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-contain mb-8 md:mb-12"
                />

                {/* Big Bold EVRYTHING AI Stencil */}
                <h1
                    className="text-white text-[14vw] md:text-[10rem] lg:text-[12rem] font-black leading-[0.9] tracking-tighter text-center uppercase"
                    style={{ fontFamily: "BlinkMacSystemFont, -apple-system, 'SF Pro Display', sans-serif" }}
                >
                    EVRYTHING<br />AI
                </h1>
            </div>

            {/* Foreground text tagging layer (sits above the stencil mask) */}
            <div className="absolute bottom-16 md:bottom-24 w-full z-20 flex justify-center pointer-events-none px-6">
                <p
                    className="text-white/90 text-xl md:text-2xl lg:text-3xl font-medium tracking-wide text-center"
                    style={{
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                        textShadow: "0px 4px 12px rgba(0,0,0,0.8), 0px 2px 4px rgba(0,0,0,0.6)"
                    }}
                >
                    the only AI startup that actually gives a f***
                </p>
            </div>
        </footer>
    );
}
