"use client"

import { useMemo } from "react"
import type { Subscription } from "@/types/subscription"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface SubscriptionStatsProps {
  subscriptions: Subscription[]
}

export default function SubscriptionStats({ subscriptions }: SubscriptionStatsProps) {
  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => sub.status === "active")
  }, [subscriptions])

  const stats = useMemo(() => {
    let monthlyTotal = 0
    let yearlyTotal = 0

    const categoryTotals: Record<string, { monthly: number; yearly: number }> = {}

    activeSubscriptions.forEach((sub) => {
      let monthlyCost = 0
      let yearlyCost = 0

      switch (sub.billingCycle.unit) {
        case "days":
          monthlyCost = (sub.price / sub.billingCycle.interval) * 30
          yearlyCost = monthlyCost * 12
          break
        case "weeks":
          monthlyCost = (sub.price / sub.billingCycle.interval) * 4.33
          yearlyCost = monthlyCost * 12
          break
        case "months":
          monthlyCost = sub.price / sub.billingCycle.interval
          yearlyCost = monthlyCost * 12
          break
        case "years":
          yearlyCost = sub.price / sub.billingCycle.interval
          monthlyCost = yearlyCost / 12
          break
      }

      monthlyTotal += monthlyCost
      yearlyTotal += yearlyCost

      if (!categoryTotals[sub.category]) {
        categoryTotals[sub.category] = { monthly: 0, yearly: 0 }
      }

      categoryTotals[sub.category].monthly += monthlyCost
      categoryTotals[sub.category].yearly += yearlyCost
    })

    return {
      monthlyTotal,
      yearlyTotal,
      categoryTotals,
    }
  }, [activeSubscriptions])

  const sortedCategories = useMemo(() => {
    return Object.entries(stats.categoryTotals).sort((a, b) => b[1].monthly - a[1].monthly)
  }, [stats.categoryTotals])

  const primaryCurrency = useMemo(() => {
    const currencyCounts: Record<string, number> = {}

    subscriptions.forEach((sub) => {
      if (!currencyCounts[sub.currency]) {
        currencyCounts[sub.currency] = 0
      }
      currencyCounts[sub.currency]++
    })

    let maxCount = 0
    let primaryCurrency = "USD"

    Object.entries(currencyCounts).forEach(([currency, count]) => {
      if (count > maxCount) {
        maxCount = count
        primaryCurrency = currency
      }
    })

    return primaryCurrency
  }, [subscriptions])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.monthlyTotal, primaryCurrency as any)}</div>
            <p className="text-xs text-muted-foreground">Active subscriptions only</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Yearly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.yearlyTotal, primaryCurrency as any)}</div>
            <p className="text-xs text-muted-foreground">Active subscriptions only</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCategories.length === 0 ? (
            <p className="text-muted-foreground">No active subscriptions</p>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map(([category, amounts]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{category}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(amounts.monthly, primaryCurrency as any)}/month
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black"
                      style={{
                        width: `${Math.min(100, (amounts.monthly / stats.monthlyTotal) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Subscriptions</span>
              <span className="font-medium">{subscriptions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Subscriptions</span>
              <span className="font-medium">{activeSubscriptions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Paused Subscriptions</span>
              <span className="font-medium">{subscriptions.filter((sub) => sub.status === "paused").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled Subscriptions</span>
              <span className="font-medium">{subscriptions.filter((sub) => sub.status === "cancelled").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Disabled Subscriptions</span>
              <span className="font-medium">{subscriptions.filter((sub) => sub.status === "disabled").length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
