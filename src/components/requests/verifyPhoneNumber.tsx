import { useState, useEffect, useRef } from 'react';
import { GoPencil } from 'react-icons/go';
import { MdOutlineVerified } from "react-icons/md";

interface VerifyPhoneOTPProps {
  initialPhoneNumber?: string;
  infoId: any;
  onVerificationSuccess?: (phoneNumber: string) => void;
  mutate?: () => Promise<any>;
}

const VerifyPhoneOTP = ({ 
  initialPhoneNumber = '', 
  infoId, 
  onVerificationSuccess, 
  mutate 
}: VerifyPhoneOTPProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('otp');
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhoneNumber || '');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update local state when initial values change
  useEffect(() => {
    setPhoneNumber(initialPhoneNumber || '');
  }, [initialPhoneNumber]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTPAndOpen = async () => {

    setIsOpen(true)

    try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}send-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        phone_number: phoneNumber,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text(); // show backend error
      throw new Error(`Failed to send OTP. Please try again with a valid phone number.`);
    }

  } catch (err) {
    console.error("Failed to send OTP:", err);
    setError(err instanceof Error ? err.message : "Failed to send OTP");
  }
};

  const handleVerifyOTP = async () => {

    setIsOpen(true)

    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}verify-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          phone_number: phoneNumber,
          otp_code: otpCode
        }),
      });

      if (!response.ok) throw new Error(`OTP verification failed. Status: ${response.status}`);
      

    const responses = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${infoId}`, {
        method: "PUT",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
         is_phone_number_verified:true,
        }),
      });

      if (!responses.ok) throw new Error(`HTTP error! status: ${response.status}`);

      
      // Close modal and reset state
      setIsOpen(false);
      setStep('otp');
      setOtp(['', '', '', '', '', '']);
      
      // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
      
      // Call the optional callback
      if (onVerificationSuccess) onVerificationSuccess(phoneNumber);
      
    } catch (err) {
      console.error("Failed to verify OTP:", err);
      setError(err instanceof Error ? err.message : "Failed to verify OTP. Please check your code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    setIsSending(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}send-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          phone_number: phoneNumber
        }),
      });

      if (!response.ok) throw new Error(`Failed to send OTP. Please try again with a valid phone number.`);
      
      setCountdown(60); // 60 second countdown for resend
      
    } catch (err) {
      console.error("Failed to send OTP:", err);
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsSending(false);
    }
  };


  return (
    <div className="relative">
      {/* Verify Button */}
      <button 
        className="text-sm font-medium text-accent hover:text-secondary flex items-center"  
        onClick={handleSendOTPAndOpen}
      >
        <MdOutlineVerified className="h-5 w-5 mr-1" />
        Verify Phone
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full">
            

            
              <>
                <h2 className="text-xl font-semibold mb-2 font-playfair">Enter OTP</h2>
                <p className="text-sm text-gray-600 mb-6">
                  We sent a 6-digit code to {phoneNumber}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      Enter OTP Code
                    </label>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el:any) => otpInputRefs.current[index] = el}
                          type="text"
                          maxLength={1}
                          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-1 focus:ring-accent focus:border-transparent"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {countdown}s
                    </p>
                  ) : (
                    <button
                      className="text-sm text-accent hover:text-secondary underline"
                      onClick={handleResendOTP}
                      disabled={isSending}
                    >
                      {isSending ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>
                
                {error && (
                  <div className="mt-4 p-2 text-secondary rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    onClick={() => setIsOpen(false)}
                    disabled={isVerifying}
                  >
                    Back
                  </button>
                  <button
                    className="px-3 py-1 bg-secondary text-white rounded-lg hover:bg-accent transition-colors disabled:bg-accent disabled:cursor-not-allowed"
                    onClick={handleVerifyOTP}
                    disabled={isVerifying || otp.join('').length !== 6}
                  >
                    {isVerifying ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : 'Verify OTP'}
                  </button>
                </div>
              </>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyPhoneOTP;