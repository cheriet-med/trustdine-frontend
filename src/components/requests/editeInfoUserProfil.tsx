import { useState, useEffect } from 'react';
import { GoPencil } from 'react-icons/go';

interface EditNameTitleProps {
  initialFullName?: string;
  initialTitle?: string;
  initialWantToGo?: string;
  initialTimeSpend?: string;
  initialBorn?: string;
  initialPets?: string;
  initialObsessed?: string;
  initialLanguage?: string;
  initialLocation?: string;
  infoId: any;
  onUpdateSuccess?: (
    newFullName: string, 
    newTitle: string,
    newWantToGo: string,
    newTimeSpend: string,
    newBorn: string,
    newPets: string,
    newObsessed: string,
    newLanguage: string,
    newLocation: string
  ) => void;
  mutate?: () => Promise<any>;
}

const EditInfo = ({ 
  initialFullName = '', 
  initialTitle = '', 
  initialWantToGo = '',
  initialTimeSpend = '',
  initialBorn = '',
  initialPets = '',
  initialObsessed = '',
  initialLanguage = '',
  initialLocation = '',
  infoId, 
  onUpdateSuccess, 
  mutate 
}: EditNameTitleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState<string>(initialFullName || '');
  const [title, setTitle] = useState<string>(initialTitle || '');
  const [wantToGo, setWantToGo] = useState<string>(initialWantToGo || '');
  const [timeSpend, setTimeSpend] = useState<string>(initialTimeSpend || '');
  const [born, setBorn] = useState<string>(initialBorn || '');
  const [pets, setPets] = useState<string>(initialPets || '');
  const [obsessed, setObsessed] = useState<string>(initialObsessed || '');
  const [language, setLanguage] = useState<string>(initialLanguage || '');
  const [location, setLocation] = useState<string>(initialLocation || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when initial values change
  useEffect(() => {
    setFullName(initialFullName || '');
    setTitle(initialTitle || '');
    setWantToGo(initialWantToGo || '');
    setTimeSpend(initialTimeSpend || '');
    setBorn(initialBorn || '');
    setPets(initialPets || '');
    setObsessed(initialObsessed || '');
    setLanguage(initialLanguage || '');
    setLocation(initialLocation || '');
  }, [
    initialFullName, 
    initialTitle,
    initialWantToGo,
    initialTimeSpend,
    initialBorn,
    initialPets,
    initialObsessed,
    initialLanguage,
    initialLocation
  ]);

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
          title: title,
          want_to_go: wantToGo,
          time_spend: timeSpend,
          born: born,
          pets: pets,
          obsessed: obsessed,
          language: language,
          location: location
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setIsOpen(false);
      
      // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
      
      // Call the optional callback
      if (onUpdateSuccess) onUpdateSuccess(
        fullName, 
        title,
        wantToGo,
        timeSpend,
        born,
        pets,
        obsessed,
        language,
        location
      );
      
    } catch (err) {
      console.error("Failed to update information:", err);
      setError(err instanceof Error ? err.message : "Failed to update information");
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
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 font-playfair">Edit Profile Information</h2>
            
            <div className="space-y-4">

              <div className='flex flex-col sm:flex-row gap-4'>
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
              <div>
                <label htmlFor="wantToGo" className="block text-sm font-medium text-secondary mb-1">
                  Want to go
                </label>
                <input
                  id="wantToGo"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={wantToGo}
                  onChange={(e) => setWantToGo(e.target.value)}
                  placeholder="Places you want to visit..."
                />
              </div>

              <div>
                <label htmlFor="timeSpend" className="block text-sm font-medium text-secondary mb-1">
                  Time spend
                </label>
                <input
                  id="timeSpend"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={timeSpend}
                  onChange={(e) => setTimeSpend(e.target.value)}
                  placeholder="How you spend your time..."
                />
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
              <div>
                <label htmlFor="born" className="block text-sm font-medium text-secondary mb-1">
                  Born
                </label>
                <input
                  id="born"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={born}
                  onChange={(e) => setBorn(e.target.value)}
                  placeholder="Where you were born..."
                />
              </div>

              <div>
                <label htmlFor="pets" className="block text-sm font-medium text-secondary mb-1">
                  Pets
                </label>
                <input
                  id="pets"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={pets}
                  onChange={(e) => setPets(e.target.value)}
                  placeholder="Your pets..."
                />
              </div>
</div>
              <div>
                <label htmlFor="obsessed" className="block text-sm font-medium text-secondary mb-1">
                  Obsessed with
                </label>
                <input
                  id="obsessed"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={obsessed}
                  onChange={(e) => setObsessed(e.target.value)}
                  placeholder="Things you're obsessed with..."
                />
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-secondary mb-1">
                  Language
                </label>
                <input
                  id="language"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Languages you speak..."
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-secondary mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-seondary focus:border-transparent rounded-xl"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your current location..."
                />
              </div>
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
                disabled={isSaving}
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

export default EditInfo;