"use client"

import { useState, useEffect } from "react"
import SubscriptionList from "@/components/subscription-list"
import AddSubscriptionForm from "@/components/add-subscription-form"
import { generateSampleData } from "@/lib/sample-data"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import type { Subscription } from "@/types/subscription"
import { ThemeAwareAddButton, ThemeAwareModal } from "@/components/ui/custom-theme-components"
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs"
import SubscriptionStats from "./subscription-stats"
import SubscriptionCalendar from "./subscription-calendar"
import { ThemeToggle } from "@/components/theme-toggle"


export default function SubscriptionDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [sampleDataActive, setSampleDataActive] = useState(false)



  useEffect(() => {
    const saved = localStorage.getItem("subscriptions")
    const sampleFlag = localStorage.getItem("sampleDataActive") === "true"
  
    if (saved) {
      setSubscriptions(JSON.parse(saved))
      setSampleDataActive(sampleFlag)
    } else if (sampleFlag) {
      const sample = generateSampleData()
      setSubscriptions(sample)
      setSampleDataActive(true)
      localStorage.setItem("subscriptions", JSON.stringify(sample))
    } else {
      setSubscriptions([]) // empty state, no sample
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
            <TabsList className="inline-flex items-center bg-muted p-1 rounded-lg border">
            <TabsTrigger value="list"
              className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground data-[state=active]:bg-gray-50 data-[state=active]:text-black hover:text-foreground transition-colors"
            >List</TabsTrigger>
            <TabsTrigger value="stats"
              className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground data-[state=active]:bg-gray-50 data-[state=active]:text-black hover:text-foreground transition-colors"
              >Statistics</TabsTrigger>
            <TabsTrigger value="calendar"
              className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground data-[state=active]:bg-gray-50 data-[state=active]:text-black hover:text-foreground transition-colors"
              >Calendar</TabsTrigger>
            </TabsList>
            <div className="absolute top-4 right-4 z-50">
             <ThemeToggle />
            </div>
            <div className="flex gap-2">
              {!sampleDataActive && (
              <Button
              variant="outline"
              onClick={() => {
                const sample = generateSampleData().map(s => ({ ...s, sample: true }))
                const updated = [...subscriptions, ...sample]
                setSubscriptions(updated)
                localStorage.setItem("subscriptions", JSON.stringify(sample))
                localStorage.setItem("sampleDataActive", "true")
                setSampleDataActive(true)
              }}> Try Sample Data </Button>)}

              <ThemeAwareAddButton
                onClick={() => {
                  setIsAddingNew(true)
                  setEditingSubscription(null)
            }}>Add Subscription
              </ThemeAwareAddButton>
            </div>
          </div>
          
            <TabsContent value="list">
              <SubscriptionList 
                subscriptions={subscriptions} 
                onEdit={setEditingSubscription}
                onDelete={deleteSubscription}
                onStatusChange={handleStatusChange}
              />
              {sampleDataActive && (
          <div className="flex justify-end mt-2">
            {sampleDataActive && (
          <Button
          variant="outline"
          className="text-red-500 hover:text-red-700 text-xs"
          onClick={() => {
            const filtered = subscriptions.filter(sub => !sub.sample)
            setSubscriptions(filtered)
            // localStorage.removeItem("subscriptions")
            localStorage.setItem("subscriptions", JSON.stringify(filtered))
            localStorage.removeItem("sampleDataActive")
            setSampleDataActive(false)}}> Remove Sample Data
          </Button>)}
  </div>
)}

            </TabsContent>
      
            <TabsContent value="stats">
              <SubscriptionStats subscriptions={subscriptions} />
            </TabsContent>
      
            <TabsContent value="calendar">
              <SubscriptionCalendar subscriptions={subscriptions} />
            </TabsContent>
          </Tabs>
      
          {(isAddingNew || editingSubscription) && (
            <ThemeAwareModal>
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
            </ThemeAwareModal>
          )}
        </div>
      )
    }