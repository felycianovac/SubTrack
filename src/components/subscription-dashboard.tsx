"use client"

import { useState, useEffect } from "react"
import SubscriptionList from "@/components/subscription-list"
import AddSubscriptionForm from "@/components/add-subscription-form"
import { generateSampleData } from "@/lib/sample-data"
import { X } from "lucide-react"

import type { Subscription } from "@/types/subscription"

export default function SubscriptionDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("subscriptions")
    if (saved) {
      setSubscriptions(JSON.parse(saved))
    } else {
      const sample = generateSampleData()
      setSubscriptions(sample)
    }
  }, [])

  const addSubscription = (subscription: Omit<Subscription, "id">) => {
    const newSub: Subscription = {
      ...subscription,
      id: crypto.randomUUID(),
    }
    const updated = [...subscriptions, newSub]
    setSubscriptions(updated)
    localStorage.setItem("subscriptions", JSON.stringify(updated))
    setIsAddingNew(false)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Subscription Tracker</h1>

      <button
        onClick={() => setIsAddingNew(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Subscription
      </button>

      <SubscriptionList subscriptions={subscriptions} />

      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="relative bg-white p-8 rounded-xl w-full max-w-xl mx-auto shadow-md">
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
        </div>
      )}
    </div>
  )
}
