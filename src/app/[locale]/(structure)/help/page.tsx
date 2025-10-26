'use client'
import React from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'Can I cancel at anytime?',
      answer: 'Yes, you can cancel anytime no questions are asked while you cancel but we would highly appreciate if you will give us some feedback.',
    },
    {
      id: 2,
      question: 'My team has credits. How do we use them?',
      answer: 'Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details.',
    },
    {
      id: 3,
      question: 'How does Preline\'s pricing work?',
      answer: 'Our subscriptions are tiered. Understanding the task at hand and ironing out the wrinkles is key.',
    },
    {
      id: 4,
      question: 'How secure is Preline?',
      answer: 'Protecting the data you trust to Preline is our first priority. This part is really crucial in keeping the project in line to completion.',
    },
    {
      id: 5,
      question: 'Do you offer discounts?',
      answer: 'We\'ve built in discounts at each tier for teams. The time has come to bring those ideas and plans to life.',
    },
    {
      id: 6,
      question: 'What is your refund policy?',
      answer: 'We offer refunds. We aim high at being focused on building relationships with our clients and community.',
    },
  ];

  return (
    <div >
      {/* Title */}
      <div className="flex text-center items-center justify-center mb-10 lg:mb-14 bg-accent h-60 pt-16 rounded-b-3xl">
        <h2 className="text-2xl font-bold md:text-3xl md:leading-tight text-white dark:text-neutral-200 font-playfair ">
          Frequently Asked Questions
        </h2>
      </div>
      {/* End Title */}

      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-sm mb-10">
        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-12">
          {faqs.map((faq) => (
            <div key={faq.id} className="group p-4 hover:bg-gray-50 dark:hover:bg-neutral-800/30 rounded-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 font-playfair">
                {faq.question}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-neutral-400">
                {faq.answer}
              </p>
              <hr className='mt-4'/>
            </div>
          ))}
        </div>
        {/* End Grid */}
      </div>
    </div>
  );
};

export default FAQSection;