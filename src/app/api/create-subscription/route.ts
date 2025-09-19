import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function POST(req: NextRequest) {
  try {
    const { email, priceId } = await req.json();

    if (!email || !priceId) {
      return NextResponse.json(
        { error: 'Email and price ID are required' },
        { status: 400 }
      );
    }

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card', 'paypal'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/en/account/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/en/account/cancel`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}