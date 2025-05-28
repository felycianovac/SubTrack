"use client"

import { useAuth } from "@/contexts/auth-context"
import SubscriptionDashboard from "@/components/subscription-dashboard"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Logo showTagline={true} />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => logout()}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <SubscriptionDashboard />
      </div>
    </div>
  )
}


// function App() {
//   const [isAddingNew, setIsAddingNew] = useState(true)

//   const addSubscription = (subscription: Omit<Subscription, "id">) => {
//     const newSub: Subscription = {
//       ...subscription,
//       id: crypto.randomUUID(),
//     }
//     const existing = localStorage.getItem("subscriptions")
//     const parsed: Subscription[] = existing ? JSON.parse(existing) : []
//     const updated = [...parsed, newSub]
//     localStorage.setItem("subscriptions", JSON.stringify(updated))
//     setIsAddingNew(false)
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       <h1 className="text-3xl font-bold mb-6">Add Subscription</h1>
//       {isAddingNew && (
//         <div className="relative bg-background p-8 rounded-xl w-full max-w-xl mx-auto shadow-md">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold">Add New Subscription</h2>
//             <button
//               className="text-gray-500 hover:text-gray-800"
//               onClick={() => setIsAddingNew(false)}
//               aria-label="Close"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <AddSubscriptionForm
//             onSubmit={addSubscription}
//             onCancel={() => setIsAddingNew(false)}
//           />
//         </div>
//       )}
//     </div>
//   )
// }
