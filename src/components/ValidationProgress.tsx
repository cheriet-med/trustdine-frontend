
// components/ValidationProgress.tsx
'use client';

import React from 'react';

interface ValidationProgressProps {
  isValidating: boolean;
}

const ValidationProgress: React.FC<ValidationProgressProps> = ({ isValidating }) => {
  if (!isValidating) return null;

  const steps = [
    'Extracting text and data from image',
    'Verifying restaurants & hotels database match',
    'Running fraud detection algorithms',
    'Calculating confidence score'
  ];





  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg flex flex-col justify-center items-center">
      <div className="flex items-center mb-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mr-3"></div>
        <span className="text-lg font-medium">AI Processing Receipt...</span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></div>
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationProgress;
