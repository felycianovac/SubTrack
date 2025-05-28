import { useAuth } from "@/contexts/auth-context"
import { User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ThemeAwareDropdownMenuContent, ThemeAwareDropdownMenuItem } from "./ui/custom-theme-components"
import { useState } from "react"
import { ManageGuestsModal } from "./manage-guests-modal"
import { GuestProfilesModal } from "./guest-profiles-modal"

export function UserAccountMenu() {
  const { user, logout } = useAuth()
  const [isManageGuestsOpen, setIsManageGuestsOpen] = useState(false)
  const [isGuestProfilesOpen, setIsGuestProfilesOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline"
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground p-0 shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {user?.email?.charAt(0).toUpperCase() ?? <User className="h-5 w-5" />}
          </Button>
        </DropdownMenuTrigger>
        <ThemeAwareDropdownMenuContent align="end">
          <div className="px-2 py-1.5 text-sm font-medium">
            {user?.email}
          </div>
          <DropdownMenuSeparator />
          <ThemeAwareDropdownMenuItem onClick={() => setIsManageGuestsOpen(true)}>
            Manage Guests
          </ThemeAwareDropdownMenuItem>
          <ThemeAwareDropdownMenuItem onClick={() => setIsGuestProfilesOpen(true)}>
            Guest Profiles
          </ThemeAwareDropdownMenuItem>
          <DropdownMenuSeparator />
          <ThemeAwareDropdownMenuItem onClick={handleLogout}>
            Log out
          </ThemeAwareDropdownMenuItem>
        </ThemeAwareDropdownMenuContent>
      </DropdownMenu>

      <ManageGuestsModal
        isOpen={isManageGuestsOpen}
        onClose={() => setIsManageGuestsOpen(false)}
      />

      <GuestProfilesModal
        isOpen={isGuestProfilesOpen}
        onClose={() => setIsGuestProfilesOpen(false)}
      />
    </>
  )
} 