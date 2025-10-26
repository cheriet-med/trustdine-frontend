'use client'

import React, { useState } from 'react';
import { Check, X, Clock, BarChart3 } from 'lucide-react';
import { IoMdInformationCircleOutline } from "react-icons/io";

interface TrustScoreData {
  verifiedReviewsPercent: number;
  avgResponseTime: string;
  totalReviews: number;
  aiAnalysisScore: number;
}

interface VerifiedBadgeProps {
  venueName: string;
  trustScore?: TrustScoreData;
  className?: string;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ 
  venueName, 
  trustScore = {
    verifiedReviewsPercent: 87,
    avgResponseTime: '2.3 hours',
    totalReviews: 1249,
    aiAnalysisScore: 92
  },
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTrustScore, setShowTrustScore] = useState(false);

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      {/* Venue Name */}
      <h2 className="text-2xl font-bold text-gray-900">{venueName}</h2>
      
      {/* Verified Badge */}
      <div className="relative">
        <button
          className="inline-flex items-center gap-1  text-accent text-sm font-medium  transition-colors cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTrustScore(!showTrustScore)}
        >
          <Check className="w-5 h-5" />
          <span >Verified Reviews</span>
          <IoMdInformationCircleOutline className="w-5 h-5"/>
        </button>

        {/* Hover Tooltip */}
        {showTooltip && !showTrustScore && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-secondary text-white text-sm rounded-lg shadow-lg z-10">
            <div className="relative">
              This venue's reviews have been verified through AI receipt analysis.
             
            </div>
          </div>
        )}
      </div>

      {/* Trust Score Panel */}
      {showTrustScore && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-accent border border-gray-200 rounded-lg shadow-lg p-6 z-20 text-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold ">Trust Score</h3>
            <button
              onClick={() => setShowTrustScore(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Score Metrics */}
          <div className="space-y-4">
            {/* Overall AI Analysis Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-white" />
                <span className="text-sm font-medium  ">AI Analysis Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${trustScore.aiAnalysisScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold ">{trustScore.aiAnalysisScore}%</span>
              </div>
            </div>

            {/* Verified Reviews Percentage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white" />
                <span className="text-sm font-medium  ">Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${trustScore.verifiedReviewsPercent}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold  ">{trustScore.verifiedReviewsPercent}%</span>
              </div>
            </div>

            {/* Average Response Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-sm font-medium  ">Avg Response Time</span>
              </div>
              <span className="text-sm font-semibold  ">{trustScore.avgResponseTime}</span>
            </div>

            {/* Total Reviews */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium  ">Total Reviews Analyzed</span>
              <span className="text-sm font-semibold  ">{trustScore.totalReviews.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs text-gray-50">
              Trust scores are calculated using AI analysis of receipt data, review patterns, and response times.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage
const ReviewsPopup: React.FC = () => {
  return (
   
        <VerifiedBadge 
          venueName="" 
          trustScore={{
            verifiedReviewsPercent: 94,
            avgResponseTime: '1.8 hours',
            totalReviews: 2847,
            aiAnalysisScore: 96
          }}
        />
    
  );
};

export default ReviewsPopup;