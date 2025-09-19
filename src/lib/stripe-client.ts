import { loadStripe } from '@stripe/stripe-js';

// Validate client environment variable
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
}

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Your price ID - same as server-side
export const SUBSCRIPTION_PRICE_ID = 'price_1S7YgOGIHlrjHR0Dodbyuh2f';