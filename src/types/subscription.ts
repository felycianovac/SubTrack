export type TimeUnit = "days" | "weeks" | "months" | "years";
export interface BillingCycle {
    interval: number;   
    unit: TimeUnit;     
  }
export type SubscriptionStatus = "active" | "paused" | "canceled" | "disabled";
export type Currency = "USD" | "EUR" | "GBP" | "MDL" | "JPY" | "AUD" | "CAD";
export type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "bank_transfer" | "apple_pay" | "google_pay" | "other";

export interface Subscription {
    id: string;
    name: string;
    price: number;
    currency: Currency;
    billingCycle: BillingCycle;   
    automaticallyRenews: boolean;
    startDate: Date;
    nextPaymentDate: Date;
    paymentMethod: PaymentMethod;
    paidBy: string;
    category: string;
    url?: string;
    notes?: string;
    status: SubscriptionStatus;
    selected?: boolean;
    sample?: boolean 

  }