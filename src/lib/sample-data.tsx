import type { Subscription } from "@/types/subscription"

export function generateSampleData(): Subscription[] {
  const today = new Date()

  return [
    {
      id: "1",
      name: "Netflix",
      price: 15.99,
      currency: "USD",
      billingCycle: {
        interval: 1,
        unit: "months",
      },
      automaticallyRenews: true,
      startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
      nextPaymentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      paymentMethod: "credit_card",
      paidBy: "",
      category: "Entertainment",
      url: "https://netflix.com",
      status: "active",
    },
    {
      id: "2",
      name: "Spotify",
      price: 9.99,
      currency: "USD",
      billingCycle: {
        interval: 1,
        unit: "months",
      },
      automaticallyRenews: true,
      startDate: new Date(today.getFullYear(), today.getMonth() - 5, 10),
      nextPaymentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12),
      paymentMethod: "paypal",
      paidBy: "",
      category: "Music",
      url: "https://spotify.com",
      status: "active",
    }
]
}
