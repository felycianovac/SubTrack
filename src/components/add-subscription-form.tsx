"use client"

import { useState, useEffect } from "react"
import type {
  Subscription,
  Currency,
  PaymentMethod,
  TimeUnit,
  BillingCycle,
  SubscriptionStatus,
} from "@/types/subscription"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ThemeAwareSelectContent, ThemeAwareSelectItem } from "./ui/custom-theme-components"

interface AddSubscriptionFormProps {
  onSubmit: (subscription: Subscription | Omit<Subscription, "id">) => void
  onCancel: () => void
  initialData?: Subscription | null
}

const CATEGORIES = [
  "Entertainment",
  "Education",
  "Utilities",
  "Software",
  "Gaming",
  "Music",
  "News",
  "Streaming",
  "Food",
  "Fitness",
  "Other",
]

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "MDL", "JPY", "AUD", "CAD"]

const PAYMENT_METHODS: PaymentMethod[] = [
  "credit_card",
  "debit_card",
  "paypal",
  "bank_transfer",
  "apple_pay",
  "google_pay",
  "other",
]

const TIME_UNITS: TimeUnit[] = ["days", "weeks", "months", "years"]

const STATUSES: SubscriptionStatus[] = ["active", "paused", "canceled", "disabled"]

export default function AddSubscriptionForm({ onSubmit, initialData }: AddSubscriptionFormProps) {
  const [formData, setFormData] = useState<Omit<Subscription, "id">>({
    name: "",
    price: 0,
    currency: "USD",
    billingCycle: {
      interval: 1,
      unit: "months",
    },
    automaticallyRenews: true,
    startDate: new Date(),
    nextPaymentDate: new Date(),
    paymentMethod: "credit_card",
    paidBy: "",
    category: "Entertainment",
    url: "",
    notes: "",
    status: "active",
    selected: false,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        currency: initialData.currency,
        billingCycle: initialData.billingCycle,
        automaticallyRenews: initialData.automaticallyRenews,
        startDate: new Date(initialData.startDate),
        nextPaymentDate: new Date(initialData.nextPaymentDate),
        paymentMethod: initialData.paymentMethod,
        paidBy: initialData.paidBy,
        category: initialData.category,
        url: initialData.url || "",
        notes: initialData.notes || "",
        status: initialData.status,
        selected: initialData.selected || false,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
  
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number.parseFloat(value)
          : type === "date"
          ? new Date(value)
          : value,
    }))
  }
  

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleBillingCycleChange = (field: keyof BillingCycle, value: any) => {
    setFormData({
      ...formData,
      billingCycle: {
        ...formData.billingCycle,
        [field]: field === "interval" ? Number(value) : value,
      },
    })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()


    const processedData = {
      ...formData,
      startDate: new Date(formData.startDate),
      nextPaymentDate: new Date(formData.nextPaymentDate),
      price: Number(formData.price),
    }

    if (initialData) {
      onSubmit({
        ...processedData,
        id: initialData.id,
      })
    } else {
      onSubmit(processedData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label htmlFor="name">Subscription Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Netflix, Spotify, etc."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.1"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <ThemeAwareSelectContent>
              {CURRENCIES.map((currency) => (
                <ThemeAwareSelectItem key={currency} value={currency}>
                  {currency}
                </ThemeAwareSelectItem>
              ))}
            </ThemeAwareSelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Billing Cycle</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              id="billingInterval"
              type="number"
              min="1"
              value={formData.billingCycle.interval}
              onChange={(e) => handleBillingCycleChange("interval", e.target.value)}
              required
            />
          </div>
          <div>
            <Select
              value={formData.billingCycle.unit}
              onValueChange={(value) => handleBillingCycleChange("unit", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <ThemeAwareSelectContent>
                {TIME_UNITS.map((unit) => (
                  <ThemeAwareSelectItem key={unit} value={unit}>
                    {unit}
                  </ThemeAwareSelectItem>
                ))}
              </ThemeAwareSelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="automaticallyRenews"
          checked={formData.automaticallyRenews}
          onCheckedChange={(checked) => handleCheckboxChange("automaticallyRenews", checked as boolean)}
        />
        <Label htmlFor="automaticallyRenews">Automatically renews</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate.toISOString().split("T")[0]}
            onChange={handleChange}
            
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
          <Input
            id="nextPaymentDate"
            name="nextPaymentDate"
            type="date"
            value={formData.nextPaymentDate.toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select
          value={formData.paymentMethod}
          onValueChange={(value) => handleSelectChange("paymentMethod", value as PaymentMethod)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <ThemeAwareSelectContent>
            {PAYMENT_METHODS.map((method) => (
              <ThemeAwareSelectItem key={method} value={method}>
                {method
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </ThemeAwareSelectItem>
            ))}
          </ThemeAwareSelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="paidBy">Paid By</Label>
        <Input
          id="paidBy"
          name="paidBy"
          value={formData.paidBy}
          onChange={handleChange}
          placeholder="Person or organization paying"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <ThemeAwareSelectContent>
            {CATEGORIES.map((category) => (
              <ThemeAwareSelectItem key={category} value={category}>
                {category}
              </ThemeAwareSelectItem>
            ))}
          </ThemeAwareSelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional information"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value as SubscriptionStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <ThemeAwareSelectContent>
            {STATUSES.map((status) => (
              <ThemeAwareSelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </ThemeAwareSelectItem>
            ))}
          </ThemeAwareSelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" variant="outline"> {initialData ? "Update" : "Add"} Subscription</Button>
      </div>
    </form>
  )
}
