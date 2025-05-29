import { Currency, PaymentMethod, SubscriptionStatus, Subscription } from './subscription';

export interface SubscriptionDTO {
  id?: number;
  name: string;
  price: number;
  currency: Currency;
  billingInterval: number;
  billingUnit: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS';
  automaticallyRenews: boolean;
  startDate: string;
  nextPaymentDate: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'OTHER';
  paidBy: string;
  category: string;
  url?: string;
  notes?: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELED' | 'DISABLED';
  ownerId: number;
}

const paymentMethodMap = {
  'credit_card': 'CREDIT_CARD',
  'debit_card': 'DEBIT_CARD',
  'paypal': 'PAYPAL',
  'bank_transfer': 'BANK_TRANSFER',
  'apple_pay': 'APPLE_PAY',
  'google_pay': 'GOOGLE_PAY',
  'other': 'OTHER'
} as const;

const reversePaymentMethodMap = {
  'CREDIT_CARD': 'credit_card',
  'DEBIT_CARD': 'debit_card',
  'PAYPAL': 'paypal',
  'BANK_TRANSFER': 'bank_transfer',
  'APPLE_PAY': 'apple_pay',
  'GOOGLE_PAY': 'google_pay',
  'OTHER': 'other'
} as const;

const statusMap = {
  'active': 'ACTIVE',
  'paused': 'PAUSED',
  'canceled': 'CANCELED',
  'disabled': 'DISABLED'
} as const;

const reverseStatusMap = {
  'ACTIVE': 'active',
  'PAUSED': 'paused',
  'CANCELED': 'canceled',
  'DISABLED': 'disabled'
} as const;

export function mapSubscriptionDTOToSubscription(dto: SubscriptionDTO): Subscription {
  return {
    id: dto.id?.toString() ?? '',
    name: dto.name,
    price: dto.price,
    currency: dto.currency,
    billingCycle: {
      interval: dto.billingInterval,
      unit: dto.billingUnit.toLowerCase() as 'days' | 'weeks' | 'months' | 'years'
    },
    automaticallyRenews: dto.automaticallyRenews,
    startDate: new Date(dto.startDate),
    nextPaymentDate: new Date(dto.nextPaymentDate),
    paymentMethod: reversePaymentMethodMap[dto.paymentMethod] as PaymentMethod,
    paidBy: dto.paidBy,
    category: dto.category,
    url: dto.url,
    notes: dto.notes,
    status: reverseStatusMap[dto.status] as SubscriptionStatus
  };
}

export function mapSubscriptionToDTO(subscription: Subscription, contextUserId: number): SubscriptionDTO {
  return {
    id: subscription.id ? parseInt(subscription.id) : undefined,
    name: subscription.name,
    price: subscription.price,
    currency: subscription.currency,
    billingInterval: subscription.billingCycle.interval,
    billingUnit: subscription.billingCycle.unit.toUpperCase() as 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS',
    automaticallyRenews: subscription.automaticallyRenews,
    startDate: subscription.startDate.toISOString(),
    nextPaymentDate: subscription.nextPaymentDate.toISOString(),
    paymentMethod: paymentMethodMap[subscription.paymentMethod] as SubscriptionDTO['paymentMethod'],
    paidBy: subscription.paidBy,
    category: subscription.category,
    url: subscription.url,
    notes: subscription.notes,
    status: statusMap[subscription.status] as SubscriptionDTO['status'],
    ownerId: contextUserId
  };
} 