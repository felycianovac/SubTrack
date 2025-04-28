import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate, getDaysUntil } from "@/lib/utils"
import type { Subscription } from "@/types/subscription"
import { ExternalLink } from "lucide-react"

interface SubscriptionListProps {
  subscriptions: Subscription[]
}

export default function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  const formatBillingCycle = (billingCycle: Subscription["billingCycle"]): string => {
    if (billingCycle.interval === 1) {
      return billingCycle.unit.slice(0, -1) + "ly" 
    }
    return `every ${billingCycle.interval} ${billingCycle.unit}`
  }

  const getStatusColor = (status: Subscription["status"], daysUntil: number) => {
    if (status === "cancelled") return "bg-gray-200 text-gray-700"
    if (status === "paused") return "bg-yellow-100 text-yellow-800"
    if (status === "disabled") return "bg-red-100 text-red-800"
    if (daysUntil <= 7) return "bg-red-100 text-red-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Subscriptions</h2>

      {subscriptions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No subscriptions found.</div>
      ) : (
        <div className="grid gap-4">
          {subscriptions.map((subscription) => {
            const daysUntil = getDaysUntil(subscription.nextPaymentDate)
            const statusColor = getStatusColor(subscription.status, daysUntil)

            return (
              <Card
                key={subscription.id}
                className={`${
                  subscription.status === "cancelled" || subscription.status === "disabled" ? "opacity-60" : ""
                } ${subscription.status === "paused" ? "border-yellow-300" : ""}`}
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
                        <Badge variant="secondary">Started: {formatDate(subscription.startDate)}</Badge>
                        <Badge className={statusColor}>
                          {subscription.status === "active"
                            ? daysUntil <= 0
                              ? "Renews today!"
                              : `Renews in ${daysUntil} days`
                            : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>
                      {subscription.notes && <p className="text-xs text-muted-foreground mt-2">{subscription.notes}</p>}
                    </div>
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
