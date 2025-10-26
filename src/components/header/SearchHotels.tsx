'use client';

import { useState, FormEvent, useEffect, useRef } from "react";
import { IoSearch, IoLocationOutline, IoTimeOutline, IoBusinessOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'location' | 'recent' | 'business' | 'nearby';
  imageUrl?: string;
}

export default function HotelSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const t = useTranslations('TopNav');
  const router = useRouter();
  const locale = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with your actual data source
  const mockSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      title: 'New York City',
      subtitle: 'New York, United States',
      type: 'location',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
    },
    {
      id: '2',
      title: 'Benjamin Steakhouse Prime',
      subtitle: 'New York City, New York',
      type: 'business',
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427'
    },
    {
      id: '3',
      title: 'Musée Public National Bardo',
      subtitle: 'Algiers, Algeria',
      type: 'location',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'
    },
    {
      id: '4',
      title: 'The Unvanquished Tour in Porto City Center',
      subtitle: 'Porto, Portugal',
      type: 'business',
      imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7'
    },
    {
      id: '5',
      title: 'Amsterdam All-Inclusive 90-Minutes Canal Cruise',
      subtitle: 'Amsterdam, The Netherlands',
      type: 'business',
      imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
    }
  ];

  // Handle mounting
  useEffect(() => {
    setMounted(true);
    
    // Load recent searches
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing recent searches:', error);
        }
      }
    }
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = mockSuggestions.filter(suggestion =>
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
  }, [searchQuery]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const performSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newSearch: SearchSuggestion = {
        id: Date.now().toString(),
        title: query,
        subtitle: 'Recent search',
        type: 'recent'
      };

      const updatedRecent = [newSearch, ...recentSearches.filter(r => r.title !== query)].slice(0, 5);
      setRecentSearches(updatedRecent);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
      }

      // Navigate to search results
      router.push(`/${locale}/search-hotel?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.title);
    performSearch(suggestion.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const totalSuggestions = (searchQuery ? suggestions : recentSearches).length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < totalSuggestions - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const currentSuggestions = searchQuery ? suggestions : recentSearches;
          handleSuggestionClick(currentSuggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 100);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'location':
        return <IoLocationOutline className="w-5 h-5" />;
      case 'recent':
        return <IoTimeOutline className="w-5 h-5" />;
      case 'business':
        return <IoBusinessOutline className="w-5 h-5" />;
      default:
        return <IoLocationOutline className="w-5 h-5" />;
    }
  };

  const currentSuggestions = searchQuery ? suggestions : recentSearches;

  if (!mounted) {
    return (
      <div className="relative mx-2 lg:w-[700px]">
        <form className="relative">
          <input
            type="text"
            placeholder="Search Hotels, good palces.."
            value=""
            readOnly
            className="m-2 pl-12 pr-24 lg:w-[700px] text-gray-300 focus:text-gray-700 rounded-3xl h-12 focus:outline-none focus:ring-2 focus:bg-white hover:bg-white transition-colors"
          />
          <IoSearch className="absolute left-4 top-4 text-gray-600" size={28} />
          <button 
            type="button" 
            className="absolute right-4 lg:right-0 top-3 bg-secondary text-white px-4 py-2 rounded-2xl font-medium"
            disabled
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative mx-2 lg:w-[700px]">
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Hotels, good palces.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="m-2 pl-12 pr-24 lg:w-[700px] text-gray-300 focus:text-gray-700 rounded-3xl h-12 focus:outline-none focus:ring-2 focus:bg-white hover:bg-white transition-colors"
        />
        <IoSearch className="absolute left-4 top-4 text-gray-600" size={28} />
        <button 
          type="submit" 
          className="absolute right-4 lg:right-0 top-3 bg-secondary hover:bg-accent text-white px-4 py-2 rounded-3xl font-medium transition-colors"
          aria-label={t('search')}
        >
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-2 right-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto font-montserrat "
        >
          {searchQuery === '' && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <IoTimeOutline className="w-4 h-4 mr-2" />
                Recently Viewed
              </div>
            </div>
          )}

          {searchQuery !== '' && suggestions.length === 0 && (
            <div className="p-4 text-gray-500 text-center">
              No suggestions found for "{searchQuery}"
            </div>
          )}

          {currentSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex-shrink-0 mr-3">
                {suggestion.imageUrl ? (
                  <img
                    src={suggestion.imageUrl}
                    alt={suggestion.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    {getIconForType(suggestion.type)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 ">
                <div className="text-sm font-medium text-secondary truncate">
                  {suggestion.title}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {suggestion.subtitle}
                </div>
              </div>
              {suggestion.type === 'recent' && (
                <div className="flex-shrink-0 ml-2">
                  <IoTimeOutline className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {searchQuery === '' && recentSearches.length === 0 && (
            <div className="p-4 text-gray-500 text-center">
              Start typing to see suggestions
            </div>
          )}
        </div>
      )}
    </div>
  );
}