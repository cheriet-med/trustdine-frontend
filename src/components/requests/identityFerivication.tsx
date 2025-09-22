'use client'

import { useState, useEffect, useRef } from 'react';
import { GoPencil } from 'react-icons/go';
import moment from 'moment';
import { 
  Search, 
  User, 
  Building2, 
  Shield, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Star,
  MapPin,
  CreditCard,
  Mail,
  HelpCircle,
  Plus,
  TrendingUp,
  Loader2,
  X,
  CheckIcon
} from 'lucide-react';

interface IdentityVerificationProps {
  initialData?: {
    fullName?: string;
    idNumber?: string;
    documentType?: string;
  };
  infoId: any;
  onUpdateSuccess?: (newData: {
    fullName: string;
    idNumber: string;
    documentType: string;
  }) => void;
  mutate?: () => Promise<any>;
}

const IdentityVerification = ({ 
  initialData = {}, 
  infoId, 
  onUpdateSuccess, 
  mutate 
}: IdentityVerificationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    idNumber: initialData?.idNumber || '',
    documentType: initialData?.documentType || 'national_id' // default to national ID
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentImage, setDocumentImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);

  // Update local state when initial values change
  useEffect(() => {
    setFormData({
      fullName: initialData?.fullName || '',
      idNumber: initialData?.idNumber || '',
      documentType: initialData?.documentType || 'national_id'
    });
  }, [initialData]);

  const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    placeholder,
    className = ""
  }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    className?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className={`relative ${className}`} ref={selectRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent ${
            isOpen ? 'ring-2 ring-accent' : ''
          }`}
        >
          <span className="truncate text-left">{selectedLabel}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div 
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="max-h-60 overflow-y-auto"
              onWheel={(e) => {
                e.stopPropagation();
                const { currentTarget } = e;
                if (
                  e.deltaY < 0 && currentTarget.scrollTop <= 0 ||
                  e.deltaY > 0 && currentTarget.scrollHeight - currentTarget.clientHeight <= currentTarget.scrollTop
                ) {
                  e.preventDefault();
                }
              }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`relative flex w-full cursor-pointer select-none items-center px-4 py-2 text-sm text-left ${
                    value === option.value
                      ? 'bg-accent text-white'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-1 truncate text-left">{option.label}</span>
                  {value === option.value && (
                    <CheckIcon className="ml-2 h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Fixed: This should update documentType, not category
  const handleDocumentTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      documentType: value
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'selfie') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'document') {
        setDocumentImage(e.target.files[0]);
      } else {
        setSelfieImage(e.target.files[0]);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('user', infoId)
      formDataToSend.append('full_name', formData.fullName);
      formDataToSend.append('document_number', formData.idNumber);
      formDataToSend.append('document_type', formData.documentType);
      formDataToSend.append('date', moment().format('MMMM Do YYYY'));
      formDataToSend.append('time', moment().format('LTS'));
      if (documentImage) formDataToSend.append('document_photo', documentImage);
      if (selfieImage) formDataToSend.append('selfie_document', selfieImage);

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}verify/`, {
        method: "POST",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Second API call - update status to pending (only if verification was successful)
      const updateStatusResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${infoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({ status: "pending" }),
      });

      if (!updateStatusResponse.ok) {
        const errorData = await updateStatusResponse.json();
        throw new Error(errorData.message || `Failed to update status: ${updateStatusResponse.status}`);
      }
      
      setIsOpen(false);
      
      // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
      
      // Call the optional callback
      if (onUpdateSuccess) onUpdateSuccess(formData);
      
    } catch (err) {
      console.error("Failed to verify identity:", err);
      setError(err instanceof Error ? err.message : "Failed to verify identity");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      {/* Verification Button */}
      <button 
        className="text-sm font-medium text-accent hover:text-secondary flex items-center"  
        onClick={() => setIsOpen(true)}
      >
        <GoPencil className="h-4 w-4 mr-1" />
        Verify Identity
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 font-playfair">Identity Verification</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-secondary mb-1">
                  Full Legal Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name as on document..."
                />
              </div>

              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-secondary mb-1">
                  Document Type
                </label>
                <CustomSelect
                  value={formData.documentType}
                  onChange={handleDocumentTypeChange} // Fixed: Use the correct handler
                  placeholder="Select a document type"
                  options={[
                    { value: 'national_id', label: 'National ID' },
                    { value: 'passport', label: 'Passport' },
                    { value: 'drivers_license', label: "Driver's License" },
                  ]}
                />
              </div>

              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-secondary mb-1">
                  Document Number
                </label>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="Enter your document number..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Document Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'document')}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-secondary"
                />
                <p className="mt-1 text-xs text-gray-500">Upload a clear photo of your ID document</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1">
                  Selfie with Document
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'selfie')}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-secondary"
                />
                <p className="mt-1 text-xs text-gray-500">Upload a selfie holding your ID document</p>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 rounded-lg"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-secondary text-white rounded hover:bg-accent transition-colors disabled:bg-accent disabled:cursor-not-allowed rounded-lg"
                onClick={handleSave}
                disabled={isSaving || !formData.fullName.trim() || !formData.idNumber.trim() || !documentImage || !selfieImage}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify Identity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentityVerification;