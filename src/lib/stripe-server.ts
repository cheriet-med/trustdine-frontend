import Stripe from 'stripe';

// Validate server environment variable
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

// Your price ID - replace with your actual price ID
export const SUBSCRIPTION_PRICE_ID = 'price_1S7YgOGIHlrjHR0Dodbyuh2f';