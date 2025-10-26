import { useState, useEffect } from 'react';
import { GoPencil } from 'react-icons/go';

interface EditAddressProps {
  initialAddress?: {
    address_line_1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    countryCode?: string;
  };
  infoId: any;
  onUpdateSuccess?: (newAddress: {
    address_line_1: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
  }) => void;
  mutate?: () => Promise<any>;
}

const EditAddress = ({ 
  initialAddress = {}, 
  infoId, 
  onUpdateSuccess, 
  mutate 
}: EditAddressProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState({
    address_line_1: initialAddress.address_line_1 || '',
    city: initialAddress.city || '',
    state: initialAddress.state || '',
    postalCode: initialAddress.postalCode || '',
    countryCode: initialAddress.countryCode || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when initial values change
  useEffect(() => {
    setAddress({
      address_line_1: initialAddress.address_line_1 || '',
      city: initialAddress.city || '',
      state: initialAddress.state || '',
      postalCode: initialAddress.postalCode || '',
      countryCode: initialAddress.countryCode || '',
    });
  }, [initialAddress]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${infoId}`, {
        method: "PUT",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          address_line_1: address.address_line_1,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          countryCode: address.countryCode,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setIsOpen(false);
      
      // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
      
      // Call the optional callback
      if (onUpdateSuccess) onUpdateSuccess(address);
      
    } catch (err) {
      console.error("Failed to update address:", err);
      setError(err instanceof Error ? err.message : "Failed to update address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="relative">
      {/* Edit Button */}
      <button 
        className="text-sm font-medium text-accent hover:text-secondary flex items-center"  
        onClick={() => setIsOpen(true)}
      >
        <GoPencil className="h-4 w-4 mr-1" />
        {address.address_line_1 == null? "Add": " Edit"}
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 font-playfair">Edit Address</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="address_line_1" className="block text-sm font-medium text-secondary mb-1">
                  Street Address
                </label>
                <input
                  id="address_line_1"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-transparent rounded-xl"
                  value={address.address_line_1}
                  onChange={(e) => handleChange('address_line_1', e.target.value)}
                  placeholder="Enter street address..."
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-secondary mb-1">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-transparent rounded-xl"
                  value={address.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city..."
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-secondary mb-1">
                  State/Province
                </label>
                <input
                  id="state"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-transparent rounded-xl"
                  value={address.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Enter state or province..."
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-secondary mb-1">
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-transparent rounded-xl"
                  value={address.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="Enter postal code..."
                />
              </div>

              <div>
                <label htmlFor="countryCode" className="block text-sm font-medium text-secondary mb-1">
                  Country Code
                </label>
                <input
                  id="countryCode"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-secondary focus:border-transparent rounded-xl"
                  value={address.countryCode}
                  onChange={(e) => handleChange('countryCode', e.target.value)}
                  placeholder="Enter country code (e.g., US, CA)..."
                />
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
                disabled={isSaving || !address.address_line_1.trim()}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAddress;