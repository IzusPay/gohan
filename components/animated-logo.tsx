"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function AnimatedLogo({ className, size = "default" }: { className?: string; size?: "default" | "large" }) {
  const [pulseIndex, setPulseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = size === "large" ? "h-12 w-12" : "h-9 w-9"
  const iconScale = size === "large" ? 1.2 : 1

  return (
    <div className={cn("relative", sizeClasses, className)}>
      {/* Main server icon container */}
      <div className={cn(
        "flex items-center justify-center rounded-lg bg-primary relative overflow-hidden",
        sizeClasses
      )}>
        {/* Animated background pulse */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-foreground/20 to-transparent animate-pulse" />
        
        {/* Server rack SVG */}
        <svg 
          viewBox="0 0 24 24" 
          className="relative z-10 text-primary-foreground"
          style={{ width: 20 * iconScale, height: 20 * iconScale }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Server chassis */}
          <rect x="2" y="2" width="20" height="6" rx="1" />
          <rect x="2" y="10" width="20" height="6" rx="1" />
          <rect x="2" y="18" width="20" height="4" rx="1" />
          
          {/* LED indicators - animated */}
          <circle 
            cx="6" 
            cy="5" 
            r="1" 
            fill={pulseIndex === 0 ? "#22c55e" : "#4ade80"}
            className="transition-all duration-300"
          />
          <circle 
            cx="6" 
            cy="13" 
            r="1" 
            fill={pulseIndex === 1 ? "#22c55e" : "#4ade80"}
            className="transition-all duration-300"
          />
          <circle 
            cx="6" 
            cy="20" 
            r="1" 
            fill={pulseIndex === 2 ? "#22c55e" : "#4ade80"}
            className="transition-all duration-300"
          />
          
          {/* Activity indicators */}
          <line x1="10" y1="5" x2="18" y2="5" className="opacity-50" />
          <line x1="10" y1="13" x2="18" y2="13" className="opacity-50" />
          <line x1="10" y1="20" x2="14" y2="20" className="opacity-50" />
        </svg>
      </div>
      
      {/* Online status indicator */}
      <div className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-card"></span>
        </span>
      </div>
    </div>
  )
}
