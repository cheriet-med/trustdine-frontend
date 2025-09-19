'use client';

import { useState, useEffect } from 'react';
import { getStripe, SUBSCRIPTION_PRICE_ID } from '@/lib/stripe-client';
import type { SubscriptionData } from '@/types/subscription';

interface SubscriptionManagerProps {
  userEmail: string;
}

export default function SubscriptionManager({ userEmail }: SubscriptionManagerProps) {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [fetchingSubscriptions, setFetchingSubscriptions] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(`/api/get-subscriptions?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSubscriptions(data.subscriptions);
      } else {
        console.error('Error fetching subscriptions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setFetchingSubscriptions(false);
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          priceId: SUBSCRIPTION_PRICE_ID,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error('Stripe error:', error);
          alert('Error redirecting to checkout');
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Error creating subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel your subscription? You will keep access until the end of your current billing period.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Subscription canceled successfully. You will keep access until the end of your billing period.');
        fetchSubscriptions(); // Refresh subscriptions
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Error canceling subscription');
    } finally {
      setLoading(false);
    }
  };

  const activeSubscription = subscriptions.find(
    sub => sub.status === 'active' || sub.status === 'trialing'
  );

  if (fetchingSubscriptions) {
    return <div className="p-4">Loading subscription information...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Subscription Management</h2>
      
      {activeSubscription ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Active Subscription</h3>
            <p className="text-sm text-green-600">
              Status: {activeSubscription.status}
            </p>
            <p className="text-sm text-green-600">
              Next billing: {new Date(activeSubscription.currentPeriodEnd * 1000).toLocaleDateString()}
            </p>
            {activeSubscription.cancelAtPeriodEnd && (
              <p className="text-sm text-orange-600 font-medium">
                Subscription will cancel at the end of the billing period
              </p>
            )}
          </div>
          
          {!activeSubscription.cancelAtPeriodEnd && (
            <button
              onClick={() => handleCancelSubscription(activeSubscription.id)}
              disabled={loading}
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Premium Subscription</h3>
            <p className="text-3xl font-bold text-blue-600">$29/month</p>
            <p className="text-gray-600">Get access to premium features</p>
          </div>
          
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Processing...' : 'Subscribe Now'}
          </button>
        </div>
      )}
    </div>
  );
}