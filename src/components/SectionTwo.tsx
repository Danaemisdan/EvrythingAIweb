"use client";

import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

export default function SectionTwo() {
  return (
    <section className="bg-white text-black min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="max-w-[1000px] w-full flex flex-col items-center justify-center text-center gap-6">
        <h2 className="text-[32px] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight font-[-apple-system,BlinkMacSystemFont,'SF_Pro',sans-serif]">
          Momentum OS replaces{" "}
          <br className="hidden md:block" />
          your{" "}
          <AnimatedTextCycle
            words={[
              "ChatGPT",
              "Claude",
              "Gemini",
              "n8n",
              "Zapier",
              "Make.com",
              "Perplexity",
              "Copilot",
            ]}
            className="text-[#fd5934]"
            interval={2500}
          />
          <br /> subscription.
        </h2>
        
        <p className="text-neutral-500 text-[17px] sm:text-[21px] font-medium leading-relaxed max-w-[600px] mt-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif" }}>
          Built deeply into your OS layer, it democratizes AI so you don&apos;t need to pay multiple subscriptions to gain momentum and grow your business.
        </p>
      </div>
    </section>
  );
}
