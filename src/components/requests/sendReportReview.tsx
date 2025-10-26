import React, { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { useSession } from 'next-auth/react';


// Define types for the Button component props
interface ButtonProps {
  variant: 'ghost' | 'solid' | 'outline'; // Add other variants as needed
  size: 'sm' | 'md' | 'lg'; // Add other sizes as needed
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

// Button component with proper TypeScript typing
const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size, 
  className, 
  onClick, 
  children, 
  type = 'button',
  disabled = false
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent';
  const variantStyles = {
    ghost: 'hover:bg-gray-100',
    solid: 'bg-accent text-white hover:bg-secondary',
    outline: 'border border-gray-300 hover:bg-gray-50'
  };
  const sizeStyles = {
    sm: 'text-sm p-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Main ReportPopup component
const ReportPopup = ({reviewid}:any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  
    const { data: session, status } = useSession();
console.log(session?.user?.id)


  // Report reasons/categories
  const reportReasons = [
    { id: 'violence', label: 'Violence' },
    { id: 'sexual', label: 'Sexual Content' },
    { id: 'harassment', label: 'Harassment' },
    { id: 'spam', label: 'Spam or Misleading' },
    { id: 'hate_speech', label: 'Hate Speech' },
    { id: 'false_info', label: 'False Information' },
    { id: 'other', label: 'Other' }
  ];

  const openPopup = () => setIsOpen(true);
  const closePopup = () => {
    setIsOpen(false);
    setSelectedReason('');
    setAdditionalDetails('');
    setSubmitStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) {
      setSubmitStatus('Please select a reason for reporting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reportData = {
        reason: selectedReason,
        informations: additionalDetails,
        //timestamp: new Date().toISOString(),
        user:session?.user?.id,
        review:reviewid
        // You would typically include the review ID here as well
        // reviewId: props.reviewId
      };
      
      // In a real application, you would make an actual API call
      console.log('Submitting report:', reportData);
      
   try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}reviewreport/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to add amenity');
      }
    } catch (err) {
      console.error('Error adding amenity:', err);
      // Revert the change if API call fails
    }



      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful submission
      setSubmitStatus('success');
      setTimeout(() => {
        closePopup();
      }, 1500);
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-500 hover:text-gray-900"
        onClick={openPopup}
      >
        <Flag className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold font-playfair">Report Review</h3>
              <button 
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close report dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Please select the reason for reporting this review:
                </p>
                
                <div className="space-y-2">
                  {reportReasons.map((reason) => (
                    <label key={reason.id} className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={() => setSelectedReason(reason.id)}
                        className="mt-1 mr-2"
                      />
                      <span className="text-sm">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  id="details"
                  rows={3}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide any additional information..."
                />
              </div>
              
              {submitStatus === 'success' ? (
                <div className="bg-accent text-white p-3 rounded-md text-sm mb-4">
                  Thank you for your report. We'll review it shortly.
                </div>
              ) : submitStatus === 'error' ? (
                <div className="bg-highlights text-white p-3 rounded-md text-sm mb-4">
                  There was an error submitting your report. Please try again.
                </div>
              ) : submitStatus ? (
                <div className="bg-background text-white p-3 rounded-md text-sm mb-4">
                  {submitStatus}
                </div>
              ) : null}
              
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                 <button
                  type="submit"
                  
                  className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-xl hover:bg-accent transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportPopup;