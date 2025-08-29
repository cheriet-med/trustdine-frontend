// components/ValidationResults.tsx
'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { ValidationResult } from '@/types/receipt';
import AddReviewHotelForm from './requests/addhotelReview';
import AddReviewRestaurantForm from './requests/addRestaurantReview';

import Link from 'next/link';

interface ValidationResultsProps {
  result: ValidationResult;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ result }) => {
 

  return (
    <div className={`border-2 rounded-lg p-6 `}>
         
   {result.status == "valid" ?
           (result.category == "Hotel"?  <AddReviewHotelForm proid={result.productID}/> : <AddReviewRestaurantForm proid={result.productID}/>):
  (result.is_bill? (result.status == "suspect" ? 
     <div className='flex flex-col justify-center items-center'>
       <div className="flex items-center text-sm text-gray-500 mb-6">
        <Clock className="h-4 w-4 mr-1" />
        Processed in {result.processingTime}s
      </div>
      <p className='text-2xl font-playfair text-orange-700 uppercase font-bold'>{result.status}</p>
      <p className='text-gray-500 font-medium mb-6'>{result.validationReasons}</p>

      <p className='text-sm text-gray-500'>Please upload a valid bill issued within the last 21 days to continue submitting your review. <br></br>
This step helps ensure secure and trusted reviews, while also improving your trust score as a client.
 <br></br>
 If you believe this is an error, please reach out to us via our <Link href="/en/contact-us"><span className='font-bold underline'>Contact Page</span></Link>.
</p>

     </div> 
:
     <div className='flex flex-col justify-center items-center'>
       <div className="flex items-center text-sm text-gray-500 mb-6">
        <Clock className="h-4 w-4 mr-1" />
        Processed in {result.processingTime}s
      </div>
      <p className='text-2xl font-playfair text-red-700 uppercase font-bold'>{result.status}</p>
      <p className='text-gray-500 font-medium mb-6'>{result.validationReasons}</p>

      <p className='text-sm text-gray-500'>Please upload a valid bill issued within the last 21 days to continue submitting your review. <br></br>
This step helps ensure secure and trusted reviews, while also improving your trust score as a client.
 <br></br>
 If you believe this is an error, please reach out to us via our <Link href="/en/contact-us"><span className='font-bold underline'>Contact Page</span></Link>.
</p>

     </div>
     
    ): 
     <div className='flex flex-col justify-center items-center'>
       <div className="flex items-center text-sm text-gray-500 mb-6">
        <Clock className="h-4 w-4 mr-1" />
        Processed in {result.processingTime}s
      </div>
      <p className='text-2xl font-playfair text-red-700 uppercase font-bold'>{result.status}</p>
      <p className='text-gray-500 font-medium mb-6'>{result.validationReasons}</p>

      <p className='text-sm text-gray-500'>Please upload a valid bill issued within the last 21 days to continue submitting your review. <br></br>
This step helps ensure secure and trusted reviews, while also improving your trust score as a client.
 <br></br>
 If you believe this is an error, please reach out to us via our <Link href="/en/contact-us"><span className='font-bold underline'>Contact Page</span></Link>.
</p>

     </div>
     )
}
      </div>

     
 
  );
};

export default ValidationResults;