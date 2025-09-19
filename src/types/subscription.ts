export interface SubscriptionData {
  id: string;
  status: string;
  priceId: string;
  customerId: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export interface Customer {
  id: string;
  email: string;
  subscriptions?: SubscriptionData[];
}