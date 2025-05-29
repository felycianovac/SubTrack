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
import { UserAccountMenu } from "./user-account-menu"
import { subscriptionsApi } from "@/lib/api"
import { mapSubscriptionDTOToSubscription, mapSubscriptionToDTO } from "@/types/subscriptions"
import { useAuth } from "@/contexts/auth-context"

export default function SubscriptionDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [sampleDataActive, setSampleDataActive] = useState(false)
  const { user, contextUserId } = useAuth()
  const isReadOnlyGuest = user?.role === 'GUEST_RO';
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [size] = useState(10)
  
const fetchSubscriptions = async () => {
    if (!contextUserId) return
    const result = await subscriptionsApi.getAll(contextUserId, page, size)
    setSubscriptions(result.content.map(mapSubscriptionDTOToSubscription))
    setTotalPages(result.totalPages)
  }

  useEffect(() => {
    const sampleFlag = localStorage.getItem("sampleDataActive") === "true";

    if (sampleFlag) {
      const sample = generateSampleData();
      setSubscriptions(sample);
      setSampleDataActive(true);
    } else if (contextUserId) {
      fetchSubscriptions();
    }
  }, [contextUserId, page]);

  const addSubscription = async (sub: Omit<Subscription, "id">) => {
    if (sampleDataActive) {
      const newSub: Subscription = { ...sub, id: crypto.randomUUID(), sample: true };
      const updated = [...subscriptions, newSub];
      setSubscriptions(updated);
      localStorage.setItem("subscriptions", JSON.stringify(updated));
      return;
    }

    if (!contextUserId) return;
    const dto = await subscriptionsApi.create(mapSubscriptionToDTO(sub as Subscription, contextUserId), contextUserId);
    await fetchSubscriptions();
  };

  const updateSubscription = async (sub: Subscription) => {
    if (sampleDataActive) {
      const updated = subscriptions.map((s) => (s.id === sub.id ? sub : s));
      setSubscriptions(updated);
      localStorage.setItem("subscriptions", JSON.stringify(updated));
      return;
    }

    if (!contextUserId) return;
    const dto = await subscriptionsApi.update(parseInt(sub.id), mapSubscriptionToDTO(sub, contextUserId), contextUserId);
    await fetchSubscriptions();
  };

  const deleteSubscription = async (id: string) => {
    if (sampleDataActive) {
      const updated = subscriptions.filter((s) => s.id !== id);
      setSubscriptions(updated);
      localStorage.setItem("subscriptions", JSON.stringify(updated));
      return;
    }

    if (!contextUserId) return;
    await subscriptionsApi.delete(parseInt(id), contextUserId);
    await fetchSubscriptions();
  };

  const handleStatusChange = (id: string, status: Subscription["status"]) => {
    const updatedSubscriptions = subscriptions.map((sub) =>
      sub.id === id ? { ...sub, status } : sub
    );
    setSubscriptions(updatedSubscriptions);

    if (!sampleDataActive && contextUserId) {
      const subToUpdate = updatedSubscriptions.find((sub) => sub.id === id);
      if (subToUpdate) {
        updateSubscription(subToUpdate);
      }
    }
  }

  const handleFormSubmit = async (data: Subscription | Omit<Subscription, "id">) => {
    if ("id" in data) {
      await updateSubscription(data as Subscription);
    } else {
      await addSubscription(data as Omit<Subscription, "id">);
    }
  
    setIsAddingNew(false);
    setEditingSubscription(null);
  };
  

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <Tabs defaultValue="list">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="inline-flex items-center bg-muted p-1 rounded-lg border">
            <TabsTrigger value="list" className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground data-[state=active]:bg-gray-50 data-[state=active]:text-black hover:text-foreground transition-colors">List</TabsTrigger>
            <TabsTrigger value="stats" className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground data-[state=active]:bg-gray-50 data-[state=active]:text-black hover:text-foreground transition-colors">Statistics</TabsTrigger>
            <TabsTrigger value="calendar" className="px-4 py-2 text-sm font-medium rounded-md text-muted-foreground data-[state=active]:bg-gray-50 data-[state=active]:text-black hover:text-foreground transition-colors">Calendar</TabsTrigger>
          </TabsList>
          <div className="absolute top-4 right-4 z-50">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <UserAccountMenu />
            </div>
          </div>
          <div className="flex gap-2">
            {/* {(!sampleDataActive && !isReadOnlyGuest) && (
              <Button
                variant="outline"
                onClick={() => {
                  const sample = generateSampleData().map(s => ({ ...s, sample: true }))
                  const updated = [...subscriptions, ...sample]
                  setSubscriptions(updated)
                  localStorage.setItem("subscriptions", JSON.stringify(sample))
                  localStorage.setItem("sampleDataActive", "true")
                  setSampleDataActive(true)
                }}>
                Try Sample Data
              </Button>
            )} */}
          {!isReadOnlyGuest && (
            <ThemeAwareAddButton
              onClick={() => {
                setIsAddingNew(true)
                setEditingSubscription(null)
              }}>
              Add Subscription
            </ThemeAwareAddButton>
            )}
          </div>
        </div>

        <TabsContent value="list">
          <SubscriptionList
            subscriptions={subscriptions}
            onEdit={setEditingSubscription}
            onDelete={deleteSubscription}
            onStatusChange={handleStatusChange}
          />
          {/* {sampleDataActive && (
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-700 text-xs"
                onClick={() => {
                  const filtered = subscriptions.filter(sub => !sub.sample)
                  setSubscriptions(filtered)
                  localStorage.setItem("subscriptions", JSON.stringify(filtered))
                  localStorage.removeItem("sampleDataActive")
                  setSampleDataActive(false)
                }}>
                Remove Sample Data
              </Button>
            </div>
          )} */}
          <div className="flex justify-center items-center gap-4 mt-6">
  <Button
    variant="outline"
    size="sm"
    className="rounded-full px-4 w-28 justify-center"
    onClick={() => setPage((p) => Math.max(p - 1, 0))}
    disabled={page === 0}
  >
    ← Previous
  </Button>

  <div className="text-sm text-muted-foreground font-medium px-3 py-1 border rounded-full bg-muted/50">
    Page <span className="font-semibold text-foreground">{page + 1}</span> of{" "}
    <span className="font-semibold text-foreground">{totalPages}</span>
  </div>

  <Button
    variant="outline"
    size="sm"
    className="rounded-full px-4 w-28 justify-center"
    onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
    disabled={page + 1 >= totalPages}
  >
    Next →
  </Button>
</div>

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
  onSubmit={handleFormSubmit}
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
