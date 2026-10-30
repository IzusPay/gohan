import { cn } from "@/lib/utils"

// HostPrime mark: three ascending server blades inside a rounded tile, with a live status dot
export function AnimatedLogo({ className, size = "default" }: { className?: string; size?: "default" | "large" }) {
  const sizeClasses = size === "large" ? "h-12 w-12" : "h-9 w-9"

  return (
    <div className={cn("relative shrink-0", sizeClasses, className)}>
      <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="hp-tile" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#c6f432" />
            <stop offset="1" stopColor="#3fd18a" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#hp-tile)" />
        <rect x="9" y="23" width="6" height="9" rx="2" fill="#13200b" />
        <rect x="17" y="16" width="6" height="16" rx="2" fill="#13200b" />
        <rect x="25" y="9" width="6" height="23" rx="2" fill="#13200b" />
      </svg>
      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />
      </span>
    </div>
  )
}
