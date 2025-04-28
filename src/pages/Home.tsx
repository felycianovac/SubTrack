"use client"

import { useState, useEffect } from "react"
import SubscriptionList from "@/components/subscription-list"
import { generateSampleData } from "@/lib/sample-data"
import type { Subscription } from "@/types/subscription"

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  useEffect(() => {
    const savedSubscriptions = localStorage.getItem("subscriptions")
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions))
    } else {
      const sampleData = generateSampleData()
      setSubscriptions(sampleData)
    }
  }, [])

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Subscription Tracker</h1>
      <SubscriptionList subscriptions={subscriptions} />
    </div>
  )
}

export default App
