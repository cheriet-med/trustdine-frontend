// components/ValidationResults.tsx
'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { ValidationResult } from '@/types/receipt';
import AddReviewHotelForm from './requests/addhotelReview';
import AddReviewRestaurantForm from './requests/addRestaurantReview';
import DonutChart from "@/components/Data/DonutChart";
import Link from 'next/link';

interface ValidationResultsProps {
  result: ValidationResult;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ result }) => {
 
console.log(result)
  const series_detailed_scores = [0.49609375, 0.003445698158678709, 0.41787721874862266, 0.0525, 0.372643131762743, 0.05751653889099195, 0.05069777498017804]; // values
  const labels_detailed_scores = ["hash similarity", "histogram similarity", "ssim score", "feature matches", "template score", "ocr similarity", "color similarity"]; // labels

  const series_hash = [0.49609375, 1.29, 0.41787721874862266]; // values
  const labels_hash = ["similarity", "hamming_distance", "perceptual_similarity"]; // labels


  const series_histogram = [0.003445698158678709, 0, 8.453558265754877e-08, 0.007259492762386799, 0.0065232153367453805]; // values
  const labels_histogram = ["similarity", "correlation", "chi square", "intersection", "bhattacharyya"]; // labels

  const series_ssim = [0.41787721874862266, 0.4222035481753818]; // values
  const labels_ssim = ["similarity", "mean_ssim"]; // labels



  const series_features = [0.003445698158678709, 0, 8.453558265754877e-08, 0.007259492762386799]; // values
  const labels_features = ["similarity", "total matches", "good matches", "avg distance"]; // labels

  const series_ocr = [0.05751653889099195, 0.01652892561983471, 0.010467054812278356, 0.2335907335907336]; // values
  const labels_ocr = ["similarity", "jaccard score", "Tfidf score", "character similarity"]; // labels




  return (
    <div className={`border-2 rounded-lg p-6 `}>
         
   {result.status == "valid" ?
           (result.category == "Hotel"?  <AddReviewHotelForm proid={result.productID}/> : <AddReviewRestaurantForm proid={result.productID}/>):
 
     <div className='flex flex-col justify-center items-center'>
       <div className="flex items-center text-sm text-gray-500 mb-6">
        <Clock className="h-4 w-4 mr-1" />
        Processed in {result.processingTime}s
      </div>
      <p className='text-2xl font-playfair text-red-700 uppercase font-bold'>{result.status}</p>
      <p className='text-gray-500 font-medium mb-6'>{result.validationReasons}</p>

     

 <div className="grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3  p-6">
      
      <DonutChart series={series_detailed_scores} labels={labels_detailed_scores} title={"Detailed scores"}/>
      <DonutChart series={series_hash} labels={labels_hash} title={"Hash"}/>
       <DonutChart series={series_histogram} labels={labels_histogram} title={"Histogram"}/>

        <DonutChart series={series_ssim} labels={labels_ssim} title={"Ssim"}/>

        <DonutChart series={series_features} labels={labels_features} title={"Features"}/>

        <DonutChart series={series_ocr} labels={labels_ocr} title={"ocr"}/>
    </div>

     <p className='text-sm text-gray-500'>Please upload a valid bill issued within the last 21 days to continue submitting your review. <br></br>
This step helps ensure secure and trusted reviews, while also improving your trust score as a client.
 <br></br>
 If you believe this is an error, please reach out to us via our <Link href="/en/contact-us"><span className='font-bold underline'>Contact Page</span></Link>.
</p>
</div>
}
      </div>

     
 
  );
};

export default ValidationResults;