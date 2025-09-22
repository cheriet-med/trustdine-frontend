import { useState, useEffect } from 'react';
import { GoPencil } from 'react-icons/go';
import {FaStar } from "react-icons/fa"; 

interface EditNameTitleProps {
  initialFullName?: string;
  initialTitle?: string;
  infoId: any;
  onUpdateSuccess?: (newFullName: string, newTitle: string) => void;
  mutate?: () => Promise<any>; // Add mutate function from SWR
}

const EditNameTitle = ({ 
  initialFullName = '', 
  initialTitle = '', 
  infoId, 
  onUpdateSuccess, 
  mutate 
}: EditNameTitleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState<string>(initialFullName || '');
  const [title, setTitle] = useState<string>(initialTitle || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  // Update local state when initial values change
  useEffect(() => {
    setFullName(initialFullName || '');
    setTitle(initialTitle || '');
  }, [initialFullName, initialTitle]);

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
          full_name: fullName,
          title: title ,
          hotel_stars:rating
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setIsOpen(false);
      
      // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
      
      // Call the optional callback
      if (onUpdateSuccess) onUpdateSuccess(fullName, title);
      
    } catch (err) {
      console.error("Failed to update name and title:", err);
      setError(err instanceof Error ? err.message : "Failed to update name and title information");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      {/* Edit Button */}
      <div 
        className="absolute right-4 top-4 border border-1 px-3 py-0.5 rounded-3xl border-secondary shadow-sm text-sm flex gap-1 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <GoPencil size={18} />
        <p>Edit</p> 
      </div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 font-playfair">Edit Name and Title</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-secondary mb-1">
                 Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name..."
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-secondary mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your title..."
                />
              </div>
            </div>
            
                  <div className=" my-4 ">
                  <label htmlFor="title" className="block text-sm font-medium text-secondary mb-1">
                  Classification 
                </label>
                    
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl ${
                            star <= (hoverRating || rating)
                              ? 'text-accent'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
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
                disabled={isSaving || (!fullName.trim() && !title.trim())}
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

export default EditNameTitle;