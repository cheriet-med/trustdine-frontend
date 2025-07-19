export interface BTCPayInvoice {
    id: string;
    storeId: string;
    orderId: string;
    status: InvoiceStatus;
    amount: string;
    currency: string;
    createdTime: string;
    expirationTime: string;
    monitoringTime: string;
    speedPolicy: string;
    itemCode?: string;
    itemDesc?: string;
    checkoutLink: string;
    receipt?: {
      enabled: boolean;
      showQR?: boolean;
      showPayments?: boolean;
    };
    archived: boolean;
    metadata: Record<string, any>;
  }
  
  export type InvoiceStatus = 
    | 'New' 
    | 'Processing' 
    | 'Settled' 
    | 'Invalid' 
    | 'Expired';
  
  export interface CreateInvoiceRequest {
    amount: number;
    currency?: string;
    orderId?: string;
    itemDesc?: string;
    itemCode?: string;
    notificationURL?: string;
    redirectURL?: string;
    metadata?: Record<string, any>;
    checkout?: {
      speedPolicy?: 'HighSpeed' | 'MediumSpeed' | 'LowMediumSpeed' | 'LowSpeed';
      paymentMethods?: string[];
      expirationMinutes?: number;
      monitoringMinutes?: number;
      paymentTolerance?: number;
      redirectAutomatically?: boolean;
    };
  }
  
  export interface InvoiceWebhookEvent {
    deliveryId: string;
    webhookId: string;
    originalDeliveryId: string;
    isRedelivery: boolean;
    type: WebhookEventType;
    timestamp: string;
    storeId: string;
    invoiceId: string;
  }
  
  export type WebhookEventType = 
    | 'InvoiceCreated'
    | 'InvoiceReceivedPayment'
    | 'InvoicePaymentSettled'
    | 'InvoiceProcessing'
    | 'InvoiceExpired'
    | 'InvoiceSettled'
    | 'InvoiceInvalid';
  
  export interface BTCPayStore {
    id: string;
    name: string;
    website?: string;
    speedPolicy: string;
    networkFeeMode: string;
    invoiceExpiration: number;
    monitoringExpiration: number;
    paymentTolerance: number;
    archived: boolean;
  }
  
  export interface PaymentMethod {
    paymentMethod: string;
    cryptoCode: string;
    paymentMethodName: string;
    enabled: boolean;
    additionalData: Record<string, any>;
  }
  
  export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    details?: string;
  }
  
  export interface GetInvoicesOptions {
    status?: InvoiceStatus[];
    orderId?: string;
    itemCode?: string;
    take?: number;
    skip?: number;
  }