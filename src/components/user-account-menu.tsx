import { useAuth } from "@/contexts/auth-context"
import { User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ThemeAwareDropdownMenuContent, ThemeAwareDropdownMenuItem } from "./ui/custom-theme-components"

export function UserAccountMenu() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"

          className="h-9 w-9 rounded-full bg-primary text-primary-foreground p-0 shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {user?.email?.charAt(0).toUpperCase() ?? <User className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <ThemeAwareDropdownMenuContent>
        <div className="px-2 py-1.5 text-sm font-medium">
          {user?.email}
        </div>
        <ThemeAwareDropdownMenuItem onClick={handleLogout}>
          Log out
        </ThemeAwareDropdownMenuItem>
      </ThemeAwareDropdownMenuContent>
    </DropdownMenu>
  )
} 