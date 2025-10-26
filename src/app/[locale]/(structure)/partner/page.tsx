'use client'

import { FaCheck } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

interface Plan {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  description: string;
  features: string[];
  featured: boolean;
  mostPopular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '/en/checkout-partner-free-plan',
    priceMonthly: '$0',
    description: "Perfect for individuals getting started with basic booking needs.",
    features: [
      'Up to 50 bookings/month',
      '1 calendar connection',
      'Basic scheduling',
      'Email notifications',
      '24-hour support response',
      'Standard booking page',
      'Basic reporting',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    id: 'tier-premium',
    href: '/en/checkout-partner',
    priceMonthly: '$29',
    description: 'Advanced features for professionals and businesses.',
    features: [
      'Unlimited bookings',
      'Multiple calendar connections',
      'Group appointments',
      'Custom booking forms',
      'SMS notifications',
      'Customizable booking page',
      'Advanced analytics',
      'Payment processing',
      'Calendar sync',
      'Team scheduling',
      'Priority support (4-hour response)',
      'API access',
      'White-label options',
    ],
    featured: true,
    mostPopular: true,
  },
]

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  return (
    <div className="relative isolate overflow-auto px-6 py-24 sm:py-32 lg:px-8 font-montserrat">
      {/* Background Image using Next.js Image */}
      <Image
        src="/bg/4.jpg"
        alt="Pricing background"
        fill
        className="object-cover object-center -z-10"
        priority
        quality={85}
      />
      
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 text-accent pt-16">Pricing</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl font-playfair text-a">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8  text-accent">
        Choose an affordable plan that's packed with the best features for engaging your audience, creating customer
        loyalty, and driving sales.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-6xl lg:grid-cols-2">
        {plans.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/90 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                  : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-accent' : 'text-accent',
                'text-base font-semibold leading-7'
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-bold tracking-tight'
                )}
              >
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-gray-200' : 'text-gray-500', 'text-base')}>/month</span>
            </p>
            <p className={classNames(tier.featured ? 'text-gray-200' : 'text-gray-600', 'mt-6 text-base leading-7')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-200' : 'text-gray-600',
                'mt-8 space-y-3 text-sm leading-6 sm:mt-10',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <FaCheck
                    className={classNames(
                      tier.featured ? 'text-accent' : 'text-accent',
                      'h-6 w-5 flex-none'
                    )}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-accent text-white shadow-sm hover:bg-secondary focus-visible:outline-indigo-500'
                  : 'text-accent ring-1 ring-inset ring-accent shadow-sm cursor-pointer hover:bg-secondary hover:text-white focus-visible:outline-accent',
                'mt-8 block rounded-md px-3.5 py-3 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 ',
              )}
            >
              Get started today
            </Link>
            {tier.featured && (
              <div className="absolute top-0 right-0 -z-10 h-full w-full rounded-3xl bg-gray-900/5" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}