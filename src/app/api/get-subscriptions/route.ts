import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ subscriptions: [] });
    }

    const customer = customers.data[0];

    // Get customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
    });

    const formattedSubscriptions = subscriptions.data.map(sub => ({
      id: sub.id,
      status: sub.status,
      priceId: sub.items.data[0].price.id,
      customerId: sub.customer as string,
      currentPeriodStart: (sub as any).current_period_start,
      currentPeriodEnd: (sub as any).current_period_end,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    }));

    return NextResponse.json({ subscriptions: formattedSubscriptions });
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}