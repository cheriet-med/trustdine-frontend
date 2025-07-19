// components/ValidationResults.tsx
'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { ValidationResult } from '@/types/receipt';

interface ValidationResultsProps {
  result: ValidationResult;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ result }) => {
  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'VALID':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'NEEDS_REVIEW':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'REJECTED':
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'VALID':
        return 'bg-green-50 border-green-200';
      case 'NEEDS_REVIEW':
        return 'bg-yellow-50 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-50 border-red-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNextStepsMessage = (status: ValidationResult['status']) => {
    switch (status) {
      case 'VALID':
        return '✅ Proceed to review submission. User trust score will increase.';
      case 'NEEDS_REVIEW':
        return '⚠️ Flagged for manual review. Admin will verify within 24 hours.';
      case 'REJECTED':
        return '❌ Receipt rejected. User trust score decreased. Cannot proceed with review.';
    }
  };

  const getNextStepsColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'VALID':
        return 'text-green-700';
      case 'NEEDS_REVIEW':
        return 'text-yellow-700';
      case 'REJECTED':
        return 'text-red-700';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getStatusColor(result.status)}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {getStatusIcon(result.status)}
          <h2 className="text-2xl font-bold ml-3">
            {result.status.replace('_', ' ')}
          </h2>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
            {result.confidence}%
          </div>
          <div className="text-sm text-gray-500">Confidence</div>
        </div>
      </div>

      {/* Processing Stats */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Clock className="h-4 w-4 mr-1" />
        Processed in {result.processingTime}s
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Extracted Data */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Extracted Data</h3>
          <div className="space-y-2 text-sm">
            {result.extractedData && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Restaurant:</span>
                  <span className="font-medium">{result.extractedData.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{result.extractedData.date}</span>
                </div>
                {result.extractedData.time && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{result.extractedData.time}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-lg">{result.extractedData.total}</span>
                </div>
                {result.extractedData.location && (
                  <div className="flex items-start justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-right max-w-48">{result.extractedData.location}</span>
                  </div>
                )}
              </>
            )}
          </div>
          
          {result.extractedData?.items && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Items:</h4>
              <div className="space-y-1 text-sm">
                {result.extractedData.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Validation Analysis */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Validation Analysis</h3>
          <div className="space-y-2">
            {result.validationReasons.map((reason, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm">{reason}</span>
              </div>
            ))}
          </div>

          {result.flags && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Flags:</h4>
              <div className="flex flex-wrap gap-2">
                {result.flags.map((flag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-200 rounded text-xs font-medium">
                    {flag.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-white bg-opacity-50 rounded-lg">
        <h3 className="font-semibold mb-2">Next Steps:</h3>
        <p className={`text-sm ${getNextStepsColor(result.status)}`}>
          {getNextStepsMessage(result.status)}
        </p>
      </div>
    </div>
  );
};

export default ValidationResults;