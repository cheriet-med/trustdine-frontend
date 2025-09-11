'use client'

import React from 'react';

const TrustSystem: React.FC = () => {
  return (
    <div >
            <div className="flex flex-col text-center items-center justify-center px-2 mb-10 lg:mb-14 bg-a h-96  pt-32 rounded-b-3xl">
      <h1 className="text-3xl font-extrabold text-white md:text-5xl mb-2 font-playfair">
            <span className="block">Real Reviews.</span>
            <span className="block text-background">Verified Experiences.</span>
            <span className="block">Smarter Choices.</span>
          </h1>
        <p className='my-8 text-lg text-white  lg:text-xl font-playfair font-meduim w-max-5xl'>
  At TrustDine, we don't just collect reviews — we verify them.
  </p>
      </div>
      <div className="max-w-7xl mx-auto">
      

        {/* Verification Badge */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-4 border border-1 mx-2">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-background text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-playfair">Our Promise to You</h2>
              <p className="text-gray-600">
                Every review on our platform is connected to a real booking, real bill, or real visit. 
                No bots, no fake accounts, no manipulated scores.
              </p>
            </div>
          </div>
        </div>
<div className="bg-white rounded-xl shadow-sm p-8 mb-16 border border-1 mx-2">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-playfair" >
            Our Trust System was built to do one thing:
          </h2>
          <p className="text-2xl text-background font-medium font-playfair">
            Help you make better decisions — with confidence.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-playfair">
            Why it's different (and better)
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Verified by receipts or reservations",
                description: "So you know it really happened"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                title: "Personalized Trust Scores",
                description: "Get matched with places people like you love"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
                title: "Owner response transparency",
                description: "See how restaurants and hotels reply and improve"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "No paid reviews allowed",
                description: "Zero tolerance for fake or sponsored feedback"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-background p-2 rounded-lg text-white">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-800 font-playfair">{feature.title}</h4>
                    <p className="mt-1 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-8 font-playfair">
            Whether you're choosing where to eat on a trip, planning a romantic night out, or booking your next
            weekend escape — our system ensures that what you see is authentic, helpful, and human.
          </p>
          <p className="text-2xl font-bold text-gray-900 font-playfair">
            Because trust isn't earned by stars.<br />
            <span className="text-background font-playfair">It's earned by truth.</span>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSystem;