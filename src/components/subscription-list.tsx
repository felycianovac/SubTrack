import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate, getDaysUntil } from "@/lib/utils"
import { ThemeAwareDropdownMenuContent, ThemeAwareDropdownMenuItem, ThemeAwareSelectContent, ThemeAwareSelectItem, ThemeAwareBadge } from "@/components/ui/custom-theme-components"
import type { Subscription } from "@/types/subscription"
import { Edit, ExternalLink, MoreVertical, Pause, Play, Trash2, X } from "lucide-react"
import { useState, useMemo } from "react"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"



interface SubscriptionListProps {
  subscriptions: Subscription[]
  onEdit: (subscription: Subscription) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Subscription["status"]) => void
}

export default function SubscriptionList({ subscriptions, onEdit, onDelete, onStatusChange }: SubscriptionListProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")


  const categories = useMemo(() => {
    const uniqueCategories = new Set(subscriptions.map((sub) => sub.category))
    return ["all", ...Array.from(uniqueCategories)]
  }, [subscriptions])

  const formatBillingCycle = (billingCycle: Subscription["billingCycle"]): string => {
    if (billingCycle.interval === 1) {
      return billingCycle.unit.slice(0, -1) + "ly" 
    }
    return `every ${billingCycle.interval} ${billingCycle.unit}`
  }

  const getMonthlyPrice = (subscription: Subscription): number => {
    const { price, billingCycle } = subscription

    if (billingCycle.unit === "months" && billingCycle.interval === 1) {
      return price
    }

    let monthlyPrice = price

    switch (billingCycle.unit) {
      case "days":
        monthlyPrice = (price / billingCycle.interval) * 30
        break
      case "weeks":
        monthlyPrice = (price / billingCycle.interval) * 4.33
        break
      case "months":
        monthlyPrice = price / billingCycle.interval
        break
      case "years":
        monthlyPrice = price / (billingCycle.interval * 12)
        break
    }

    return monthlyPrice
  }

  const filteredAndSortedSubscriptions = useMemo(() => {
    let filtered = subscriptions

    if (categoryFilter !== "all") {
      filtered = filtered.filter((sub) => sub.category === categoryFilter)
    }
    return [...filtered].sort((a, b) => {
      const aPrice = getMonthlyPrice(a)
      const bPrice = getMonthlyPrice(b)
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
          case "priceHigh":
            return bPrice - aPrice // High to Low
          case "priceLow":
            return aPrice - bPrice // Low to High
  
        case "expiringSoon":
          return getDaysUntil(a.nextPaymentDate) - getDaysUntil(b.nextPaymentDate)
        case "longestRemaining":
          return getDaysUntil(b.nextPaymentDate) - getDaysUntil(a.nextPaymentDate)
        default:
          return 0
      }
    })
  }, [subscriptions, categoryFilter, sortBy])

  const getStatusColor = (status: Subscription["status"], daysUntil: number) => {
    if (status === "cancelled") return "bg-gray-200 text-gray-700"
    if (status === "paused") return "bg-yellow-100 text-yellow-800"
    if (status === "disabled") return "bg-red-100 text-red-800"
    if (daysUntil <= 7) return "bg-red-100 text-red-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <div className="space-y-4">
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Category:</span>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <ThemeAwareSelectContent>
            {categories.map((category) => (
              <ThemeAwareSelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </ThemeAwareSelectItem>
            ))}
          </ThemeAwareSelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <ThemeAwareSelectContent>
              <ThemeAwareSelectItem value="name">Name</ThemeAwareSelectItem>
              <ThemeAwareSelectItem value="priceHigh">Price (High to Low)</ThemeAwareSelectItem>
              <ThemeAwareSelectItem value="priceLow">Price (Low to High)</ThemeAwareSelectItem>
              <ThemeAwareSelectItem value="expiringSoon">Expiring Soon</ThemeAwareSelectItem>
              <ThemeAwareSelectItem value="longestRemaining">Longest Remaining</ThemeAwareSelectItem>
            </ThemeAwareSelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedSubscriptions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No subscriptions found</div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedSubscriptions.map((subscription) => {
            const daysUntil = getDaysUntil(subscription.nextPaymentDate)
            const isPaid = subscription.status === "active" && daysUntil < 0
            const statusColor = getStatusColor(subscription.status, daysUntil)
            const badgeClass = isPaid ? "bg-blue-100 text-blue-800" : statusColor


            return (
              <Card
                key={subscription.id}
                className={`${subscription.status === "cancelled" || subscription.status === "disabled" ? "opacity-60" : ""} ${
                  subscription.status === "paused" ? "border-yellow-300" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{subscription.name}</h3>
                        <Badge variant="outline">{subscription.category}</Badge>
                        {subscription.url && (
                          <a
                            href={subscription.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(subscription.price, subscription.currency)}/
                        {formatBillingCycle(subscription.billingCycle)}
                        {subscription.paidBy && subscription.paidBy !== "" && (
                          <span className="ml-2 text-xs">Paid by: {subscription.paidBy}</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                      <ThemeAwareBadge>Started: {formatDate(subscription.startDate)}</ThemeAwareBadge>                        <Badge className={badgeClass}>
                          {isPaid
                            ? "Paid"
                            : subscription.status === "active"
                            ? daysUntil === 0
                              ? "Renews today!"
                              : `Renews in ${daysUntil} days`
                            : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>

                      </div>
                      {subscription.notes && <p className="text-xs text-muted-foreground mt-2">{subscription.notes}</p>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>
                      <ThemeAwareDropdownMenuContent>
                        <ThemeAwareDropdownMenuItem onClick={() => onEdit(subscription)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </ThemeAwareDropdownMenuItem>
                        {subscription.status === "active" && (
                          <ThemeAwareDropdownMenuItem onClick={() => onStatusChange(subscription.id, "paused")}>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </ThemeAwareDropdownMenuItem>
                        )}
                         {(subscription.status === "paused" || subscription.status === "cancelled") && (
                          <ThemeAwareDropdownMenuItem onClick={() => onStatusChange(subscription.id, "active")}>
                          <Play className="mr-2 h-4 w-4" />
                          Activate
                        </ThemeAwareDropdownMenuItem>
                        )}
                        {subscription.status !== "cancelled" && (
                          <ThemeAwareDropdownMenuItem onClick={() => onStatusChange(subscription.id, "cancelled")}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </ThemeAwareDropdownMenuItem>
                        )}
                         <ThemeAwareDropdownMenuItem
                          onClick={() => onDelete(subscription.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </ThemeAwareDropdownMenuItem>
                        </ThemeAwareDropdownMenuContent>
                      </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
