// scripts/create-product.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function createProduct() {
  const product = await stripe.products.create({
    name: 'Monthly Subscription',
    description: 'Premium subscription service',
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2900, // $29.00 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
  });

  console.log('Product ID:', product.id);
  console.log('Price ID:', price.id);
}

createProduct();