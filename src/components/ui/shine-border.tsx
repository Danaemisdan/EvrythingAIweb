import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ShineBorderProps = {
    children: ReactNode;
    className?: string;
    borderWidth?: number;
    duration?: number;
    conicGradient?: string;
};

export const ShineBorder = ({
    children,
    className,
    borderWidth = 1.5,
    duration = 3,
    conicGradient = "conic-gradient(from 90deg at 50% 50%, transparent 40%, #A98BFE, #F86A92, #FB923C, transparent 60%)",
}: ShineBorderProps) => {
    return (
        <div
            className={cn("relative rounded-[calc(1rem+1.5px)] p-[1.5px] overflow-hidden", className)}
            style={{ padding: borderWidth }}
        >
            <div className="absolute inset-0 z-0 overflow-hidden rounded-[calc(1rem+1.5px)]">
                <div
                    className="absolute -inset-[100%] animate-spin"
                    style={{
                        backgroundImage: conicGradient,
                        animationDuration: `${duration}s`,
                        animationTimingFunction: "linear",
                        animationIterationCount: "infinite"
                    }}
                />
            </div>
            <div className="relative z-10 w-full h-full rounded-2xl bg-[#0a0a0a] overflow-hidden">
                {children}
            </div>
        </div>
    );
};
