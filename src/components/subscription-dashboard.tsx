"use client"

import { useState, useEffect } from "react"
import SubscriptionList from "@/components/subscription-list"
import AddSubscriptionForm from "@/components/add-subscription-form"
import { generateSampleData } from "@/lib/sample-data"
import { X } from "lucide-react"

import type { Subscription } from "@/types/subscription"
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs"

export default function SubscriptionDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)


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

  const updateSubscription = (updatedSubscription: Subscription | Omit<Subscription, "id">) => {
    if (!("id" in updatedSubscription)) return 
    const updated = subscriptions.map((sub) => 
      sub.id === updatedSubscription.id ? updatedSubscription : sub
    )
    setSubscriptions(updated)
    localStorage.setItem("subscriptions", JSON.stringify(updated))
    setEditingSubscription(null)
  }

  const deleteSubscription = (id: string) => {
    const updated = subscriptions.filter((sub) => sub.id !== id)
    setSubscriptions(updated)
    localStorage.setItem("subscriptions", JSON.stringify(updated)) // ← missing
  }

  const handleStatusChange = (id: string, status: Subscription["status"]) => {
    const updated = subscriptions.map((sub) =>
      sub.id === id ? { ...sub, status } : sub
    )
    setSubscriptions(updated)
    localStorage.setItem("subscriptions", JSON.stringify(updated)) // ← missing
      }

      return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <Tabs defaultValue="list">
            <div className="flex justify-between items-center mb-4">
            <TabsList className="inline-flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <TabsTrigger value="list"
              className="px-4 py-2 text-sm font-medium rounded-md text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black hover:text-black transition-colors"
            >List</TabsTrigger>
            <TabsTrigger value="stats"
              className="px-4 py-2 text-sm font-medium rounded-md text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black hover:text-black transition-colors"
            >Statistics</TabsTrigger>
            <TabsTrigger value="calendar"
              className="px-4 py-2 text-sm font-medium rounded-md text-gray-500 data-[state=active]:bg-white data-[state=active]:text-black hover:text-black transition-colors"
              >Calendar</TabsTrigger>
            </TabsList>
              <button
                onClick={() => {
                  setIsAddingNew(true)
                  setEditingSubscription(null)
                }}
                className="px-5 py-2.5 text-sm font-medium rounded-md bg-black text-white hover:bg-black/80 transition-colors"
                >
                Add Subscription
              </button>
            </div>
      
            <TabsContent value="list">
              {/* Your existing layout starts here */}
              <SubscriptionList 
                subscriptions={subscriptions} 
                onEdit={setEditingSubscription}
                onDelete={deleteSubscription}
                onStatusChange={handleStatusChange}
              />
            </TabsContent>
      
            <TabsContent value="stats">
              <p className="text-center text-muted-foreground">Statistics coming soon</p>
            </TabsContent>
      
            <TabsContent value="calendar">
              <p className="text-center text-muted-foreground">Calendar view coming soon</p>
            </TabsContent>
          </Tabs>
      
          {(isAddingNew || editingSubscription) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative bg-white p-8 rounded-xl w-full max-w-xl mx-auto shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold mb-4">
                    {editingSubscription ? "Edit Subscription" : "Add New Subscription"}
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-800"
                    onClick={() => {
                      setIsAddingNew(false)
                      setEditingSubscription(null)
                    }}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <AddSubscriptionForm
                  onSubmit={editingSubscription ? updateSubscription : addSubscription}
                  onCancel={() => {
                    setIsAddingNew(false)
                    setEditingSubscription(null)
                  }}
                  initialData={editingSubscription}
                />
              </div>
            </div>
          )}
        </div>
      )
    }