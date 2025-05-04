"use client"

import { useState, useMemo } from "react"
import type { Subscription } from "@/types/subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface SubscriptionCalendarProps {
  subscriptions: Subscription[]
}

export default function SubscriptionCalendar({ subscriptions }: SubscriptionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => sub.status === "active")
  }, [subscriptions])

  // Get the first day of the current month
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  }, [currentDate])

  // Get the last day of the current month
  const lastDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  }, [currentDate])

  // Get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = useMemo(() => {
    return firstDayOfMonth.getDay()
  }, [firstDayOfMonth])

  // Get the number of days in the current month
  const daysInMonth = useMemo(() => {
    return lastDayOfMonth.getDate()
  }, [lastDayOfMonth])

  // Generate calendar days array
  const calendarDays = useMemo(() => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }, [firstDayOfWeek, daysInMonth])

  // Get subscriptions for each day
  const subscriptionsByDay = useMemo(() => {
    const result: Record<number, Subscription[]> = {}

    activeSubscriptions.forEach((subscription) => {
      const nextPaymentDate = new Date(subscription.nextPaymentDate)

      // Check if renewal date is in the current month and year
      if (
        nextPaymentDate.getMonth() === currentDate.getMonth() &&
        nextPaymentDate.getFullYear() === currentDate.getFullYear()
      ) {
        const day = nextPaymentDate.getDate()
        if (!result[day]) {
          result[day] = []
        }
        result[day].push(subscription)
      }
    })

    return result
  }, [activeSubscriptions, currentDate])

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Format month and year
  const formattedMonthYear = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }, [currentDate])

  // Format billing cycle for display
  const formatBillingCycle = (billingCycle: Subscription["billingCycle"]): string => {
    if (billingCycle.interval === 1) {
      return billingCycle.unit.slice(0, -1) + "ly" // e.g., "monthly", "yearly"
    }
    return `every ${billingCycle.interval} ${billingCycle.unit}`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Subscription Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <button onClick={goToPreviousMonth} className="p-1 rounded-md hover:bg-muted" aria-label="Previous month">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium">{formattedMonthYear}</span>
              <button onClick={goToNextMonth} className="p-1 rounded-md hover:bg-muted" aria-label="Next month">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-sm py-1">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[80px] p-1 border rounded-md ${day === null ? "bg-muted/20" : "hover:bg-muted/50"} ${
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear()
                    ? "border-primary"
                    : "border-border"
                }`}
              >
                {day !== null && (
                  <>
                    <div className="text-right text-sm font-medium">{day}</div>
                    <div className="mt-1 space-y-1">
                      {subscriptionsByDay[day]?.map((subscription) => (
                        <div
                          key={subscription.id}
                          className="text-xs p-1 rounded bg-primary/10 truncate"
                          title={`${subscription.name} - ${formatCurrency(subscription.price, subscription.currency)}/${formatBillingCycle(subscription.billingCycle)}`}
                        >
                          {subscription.name}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(subscriptionsByDay)
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([day, subs]) => (
                <div key={day} className="border-b pb-2 last:border-0">
                  <div className="font-medium">
                    {new Date(currentDate.getFullYear(), currentDate.getMonth(), Number(day)).toLocaleDateString(
                      "en-US",
                      { weekday: "long", month: "short", day: "numeric" },
                    )}
                  </div>
                  <div className="space-y-1 mt-1">
                    {subs.map((subscription) => (
                      <div key={subscription.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>{subscription.name}</span>
                          <Badge variant="outline">{subscription.category}</Badge>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(subscription.price, subscription.currency)}/
                          {formatBillingCycle(subscription.billingCycle)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            {Object.keys(subscriptionsByDay).length === 0 && (
              <p className="text-muted-foreground">No payments this month</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
