import React from "react";

export default function Footer() {
    return (
        <footer className="relative w-full min-h-[140vh] bg-black flex flex-col items-center justify-center overflow-hidden py-32">

            {/* 1. The SVG Logo Stencil */}
            {/* We render a video and perfectly mask it using the user's SVG so ONLY the SVG shape shows the video. */}
            <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 mb-8">
                <video
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        WebkitMaskImage: "url('/2.svg')",
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: "url('/2.svg')",
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                    }}
                >
                    <source src="/waves.mp4" type="video/mp4" />
                </video>
            </div>

            {/* 2. The Text Stencil */}
            {/* We use an oversized background video and overlay it with a pure black div that has white text punched out via multiply. */}
            <div className="relative w-full max-w-[1400px] flex items-center justify-center">

                {/* The Video Layer */}
                <video
                    autoPlay loop muted playsInline
                    className="absolute z-0 w-[120%] h-[120%] object-cover object-center"
                >
                    <source src="/waves.mp4" type="video/mp4" />
                </video>

                {/* The Solid Black Punch-Out Mask */}
                {/* White text inside a Black container + mix-blend-multiply = Black stays black, White becomes 100% transparent opening a hole to the video below. */}
                <div className="relative z-10 w-full h-full bg-black flex items-center justify-center mix-blend-multiply py-4 md:py-8 lg:py-16">
                    <h1
                        className="text-white text-[18vw] md:text-[14rem] lg:text-[18rem] font-black leading-[0.8] tracking-tighter text-center uppercase"
                        style={{ fontFamily: "BlinkMacSystemFont, -apple-system, 'SF Pro Display', sans-serif" }}
                    >
                        EVRYTHING<br />AI
                    </h1>
                </div>

            </div>

            {/* 3. The Tagline */}
            <div className="relative z-20 mt-16 md:mt-32">
                <p
                    className="text-white/80 text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-center"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
                >
                    the only AI startup that actually gives a f***
                </p>
            </div>

        </footer>
    );
}
