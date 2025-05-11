import { Receipt, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showTagline?: boolean
}

export function Logo({ className, showTagline = true }: LogoProps) {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      <div className="flex items-center gap-2 group">
        <div className="relative">
          <div className="bg-primary/10 rounded-lg p-2 transition-all duration-300 group-hover:bg-primary/20">
            <Receipt className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary/70 transition-all duration-300 group-hover:text-primary" />
        </div>
        <div >
          <h1 className="text-3xl font-bold  text-foreground transition-colors duration-300">
            <span className="text-primary">Sub</span>Tracker
          </h1>
          {showTagline && (
            <p className="text-sm text-muted-foreground transition-opacity duration-300">
              Manage your subscriptions effortlessly
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
