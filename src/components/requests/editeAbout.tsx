import { useState, useEffect } from 'react';
import { GoPencil } from 'react-icons/go';
import TiptapEditor from '../admin-dashboard/Tiptapeditor';

interface EditAboutPopupProps {
  initialAbout?: string;
  infoId:any;
  onUpdateSuccess?: (newAbout: string) => void;
  mutate?: () => Promise<any>;
}

const EditAboutPopup = ({ initialAbout = '', infoId, onUpdateSuccess, mutate }: EditAboutPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [about, setAbout] = useState<string>(initialAbout || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAbout(initialAbout || '');
  }, [initialAbout]);

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
        body: JSON.stringify({ about }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setIsOpen(false);
      
      if (mutate) await mutate();
      if (onUpdateSuccess) onUpdateSuccess(about);
      
    } catch (err) {
      console.error("Failed to update about:", err);
      setError(err instanceof Error ? err.message : "Failed to update about information");
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
          <div className="bg-white p-6  shadow-lg max-w-2xl w-full rounded-2xl"> {/* Increased max-width */}
            <h2 className="text-xl font-semibold mb-4 font-playfair">Edit About Information</h2>
            
            {/* Replaced textarea with Tiptap */}
            <div className="mb-4">
              <TiptapEditor 
                content={about}
                onChange={(content) => setAbout(content)}
              />
            </div>
           
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
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
                disabled={isSaving || !about.trim()}
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

export default EditAboutPopup;