"use client"

import { useState, useEffect } from "react"
import SubscriptionList from "@/components/subscription-list"
import { X } from "lucide-react"
import AddSubscriptionForm from "@/components/add-subscription-form"

import { generateSampleData } from "@/lib/sample-data"
import type { Subscription } from "@/types/subscription"

// function App() {
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
//   const [isAddingNew, setIsAddingNew] = useState(false)


//   useEffect(() => {
//     const savedSubscriptions = localStorage.getItem("subscriptions")
//     if (savedSubscriptions) {
//       setSubscriptions(JSON.parse(savedSubscriptions))
//     } else {
//       const sampleData = generateSampleData()
//       setSubscriptions(sampleData)
//     }
//   }, [])

//   return (
//     <div className="container mx-auto p-4 md:p-6">
//       <h1 className="text-3xl font-bold mb-6">Subscription Tracker</h1>
//       <SubscriptionList subscriptions={subscriptions} />
//     </div>
//   )
// }


function App() {
  const [isAddingNew, setIsAddingNew] = useState(true)

  const addSubscription = (subscription: Omit<Subscription, "id">) => {
    const newSub: Subscription = {
      ...subscription,
      id: crypto.randomUUID(),
    }
    const existing = localStorage.getItem("subscriptions")
    const parsed: Subscription[] = existing ? JSON.parse(existing) : []
    const updated = [...parsed, newSub]
    localStorage.setItem("subscriptions", JSON.stringify(updated))
    setIsAddingNew(false)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Add Subscription</h1>
      {isAddingNew && (
        <div className="relative bg-background p-8 rounded-xl w-full max-w-xl mx-auto shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Subscription</h2>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setIsAddingNew(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <AddSubscriptionForm
            onSubmit={addSubscription}
            onCancel={() => setIsAddingNew(false)}
          />
        </div>
      )}
    </div>
  )
}



export default App
