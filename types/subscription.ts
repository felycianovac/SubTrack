export type TimeUnit = "days" | "weeks" | "months" | "years";
export interface BillingCycle {
    interval: number;   
    unit: TimeUnit;     
  }
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "disabled";
export type Currency = "USD" | "EUR" | "GBP" | "MDL" | "JPY" | "AUD" | "CAD";
export type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "bank_transfer" | "apple_pay" | "google_pay" | "other";

export interface Subscription {
    id: string
    name: string
    category: string
    cost: number
    billingCycle: "monthly" | "yearly"
    startDate: Date
    renewalDate: Date
    status: "active" | "paused" | "cancelled"
  }
  