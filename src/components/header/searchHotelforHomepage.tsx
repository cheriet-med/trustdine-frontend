'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import { IoSearch, IoLocationOutline, IoTimeOutline, IoBusinessOutline, IoCalendarOutline, IoPeopleOutline, IoChevronDown, IoRemoveOutline, IoAddOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { useRouter } from "next/navigation";
import useFetchListing from "../requests/fetchListings";
interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'location' | 'recent' | 'business' | 'nearby';
  imageUrl?: string;
}

interface GuestCounts {
  adults: number;
  children: number;
  rooms: number;
}

interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}


function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}


export default function HotelSearchHomepage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const {listings} =useFetchListing()
  const hotelsListings = listings?.filter((user) => user.category === "Hotel");


  // Guest selection state
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    rooms: 1
  });
  
  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const guestRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  

  // Smooth scroll to center popup function
  const scrollToCenter = (element: HTMLElement) => {
    if (!element) return;
    
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calculate the center position
    const elementCenter = elementRect.top + scrollTop + (elementRect.height / 2);
    const viewportCenter = viewportHeight / 2;
    const targetScrollTop = elementCenter - viewportCenter;
    
    // Smooth scroll to the calculated position
    window.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

const debouncedQuery = useDebounce(searchQuery, 300);

const suggestions = useMemo<SearchSuggestion[]>(() => {
  if (!debouncedQuery) return [];
  return (
    hotelsListings
      ?.filter((hotel) =>
        (hotel.name ?? "").toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (hotel.location ?? "").toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      .slice(0, 6)
      .map((hotel) => ({
        id: String(hotel.id),
        title: hotel.name ?? "Unnamed Hotel",
        subtitle: hotel.location ?? "Unknown location",
        type: "location" as const,
        imageUrl: hotel.image ?? undefined,
      })) ?? []
  );
}, [debouncedQuery, hotelsListings]);

  // Scroll to center when popups open
  useEffect(() => {
    if (showCalendar && calendarRef.current) {
      // Small delay to ensure popup is rendered
      const timer = setTimeout(() => {
        scrollToCenter(calendarRef.current!);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showCalendar]);

  useEffect(() => {
    if (showGuestPopup && guestRef.current) {
      // Small delay to ensure popup is rendered
      const timer = setTimeout(() => {
        scrollToCenter(guestRef.current!);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showGuestPopup]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setShowGuestPopup(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Guest functions
  const updateGuestCount = (type: keyof GuestCounts, increment: boolean) => {
    setGuestCounts(prev => {
      const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Ensure adults is at least 1
      if (type === 'adults' && newCount < 1) return prev;
      
      return { ...prev, [type]: newCount };
    });
  };

  const getGuestText = () => {
    const { adults, children, rooms } = guestCounts;
    const totalGuests = adults + children;
    
    if (totalGuests === 1 && rooms === 1) {
      return "1 Guest, 1 Room";
    }
    
    return `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}, ${rooms} Room${rooms > 1 ? 's' : ''}`;
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateSelected = (date: Date) => {
    const dateTime = date.getTime();
    return (
      (dateRange.checkIn && dateRange.checkIn.getTime() === dateTime) ||
      (dateRange.checkOut && dateRange.checkOut.getTime() === dateTime)
    );
  };

  const isDateInRange = (date: Date) => {
    if (!dateRange.checkIn || !dateRange.checkOut) return false;
    const dateTime = date.getTime();
    return dateTime > dateRange.checkIn.getTime() && dateTime < dateRange.checkOut.getTime();
  };

  const handleDateClick = (date: Date) => {
    if (!selectingCheckOut && !dateRange.checkIn) {
      setDateRange({ checkIn: date, checkOut: null });
      setSelectingCheckOut(true);
    } else if (selectingCheckOut) {
      if (dateRange.checkIn && date > dateRange.checkIn) {
        setDateRange(prev => ({ ...prev, checkOut: date }));
        setSelectingCheckOut(false);
      } else {
        setDateRange({ checkIn: date, checkOut: null });
      }
    } else {
      setDateRange({ checkIn: date, checkOut: null });
      setSelectingCheckOut(true);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getDateRangeText = () => {
    if (!dateRange.checkIn) return "Check dates";
    if (!dateRange.checkOut) return `${formatDate(dateRange.checkIn)} - Out`;
    return `${formatDate(dateRange.checkIn)} - ${formatDate(dateRange.checkOut)}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = isDateSelected(date);
      const isInRange = isDateInRange(date);
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      
      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateClick(date)}
          disabled={isPast}
          className={`w-10 h-10 text-sm rounded-full transition-colors ${
            isPast 
              ? 'text-gray-300 cursor-not-allowed' 
              : isSelected
              ? 'bg-highlights text-white font-semibold'
              : isInRange
              ? 'bg-secondary text-white'
              : isToday
              ? 'bg-background text-white font-semibold'
              : 'hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };


const handleSearch = () => {
  if (searchQuery.trim()) {
    // include guests and dates if you want
    const params = new URLSearchParams({
      q: searchQuery,
      adults: String(guestCounts.adults),
      children: String(guestCounts.children),
      rooms: String(guestCounts.rooms),
      checkIn: dateRange.checkIn ? dateRange.checkIn.toISOString() : "",
      checkOut: dateRange.checkOut ? dateRange.checkOut.toISOString() : "",
      
    });
    router.push(`/en/search-hotel?${params.toString()}`);
  }
};


  return (
    <div ref={containerRef} className="relative mx-2  font-montserrat">
      <div className="relative flex justify-center items-center gap-2 flex-wrap">
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Hotels, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="pl-12 pr-4 w-[330px] md:w-[345px] text-gray-700 rounded-3xl h-12 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-highlights focus:border-transparent transition-all shadow-sm"
          />
          <CiLocationOn className="absolute left-6 top-4 text-secondary" size={18} />
        </div>

        {/* Date Picker Button */}
        <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setShowCalendar(!showCalendar);
            setShowGuestPopup(false);
            setShowSuggestions(false);
          }}
          className="flex items-center justify-center gap-2 w-40 h-12 bg-white border border-gray-200 hover:border-secondary hover:shadow-md text-gray-700 px-1 py-1 rounded-3xl font-medium transition-all"
        >
          <IoCalendarOutline size={18} className="text-secondary" />
          <span className="text-sm truncate">{getDateRangeText()}</span>
         {/* <IoChevronDown size={16} className={`transition-transform ${showCalendar ? 'rotate-180' : ''}`} />*/}
        </button>

        {/* Guest Selection Button */}
        <button
          type="button"
          onClick={() => {
            setShowGuestPopup(!showGuestPopup);
            setShowCalendar(false);
            setShowSuggestions(false);
          }}
          className="flex items-center justify-center gap-2 w-40 h-12 bg-white border border-gray-200 hover:border-secondary hover:shadow-md text-gray-700 px-1 py-1 rounded-3xl font-medium transition-all"
        >
          <IoPeopleOutline size={18} className="text-secondary" />
          <span className="text-sm truncate">{getGuestText()}</span>
         {/* <IoChevronDown size={16} className={`transition-transform ${showGuestPopup ? 'rotate-180' : ''}`} />*/}
        </button>
</div>
        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className=" w-[330px] md:w-32 h-11 bg-secondary hover:bg-accent text-white px-4 py-2 rounded-3xl font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Search
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && searchQuery && (
        <div
          ref={suggestionsRef}
          className="absolute top-16 left-0  lg:left-4 right-0 mx-2 lg:w-[345px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {suggestions.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">
              No suggestions found for "{searchQuery}"
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                onClick={() => {
                  setSearchQuery(suggestion.title);
                  setShowSuggestions(false);
                  setShowCalendar(false);
                  setShowGuestPopup(false);
                  router.push(`/en/booking/${suggestion.id}`);
                }}
               
              >
                <div className="flex-shrink-0 mr-3">
                  {suggestion.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE}/${suggestion.imageUrl}`}
                      alt={suggestion.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <IoLocationOutline className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.subtitle}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Guest Selection Popup */}
      {showGuestPopup && (
        <div
          ref={guestRef}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[300px] max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guests and Rooms</h3>
          <div className="space-y-6">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Adults</div>
                <div className="text-sm text-gray-500">Age 18+</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateGuestCount('adults', false)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={guestCounts.adults <= 1}
                >
                  <IoRemoveOutline size={16} />
                </button>
                <span className="w-8 text-center font-semibold text-lg">{guestCounts.adults}</span>
                <button
                  type="button"
                  onClick={() => updateGuestCount('adults', true)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-secondary transition-colors"
                >
                  <IoAddOutline size={16} />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Children</div>
                <div className="text-sm text-gray-500">Age 0-17</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateGuestCount('children', false)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={guestCounts.children <= 0}
                >
                  <IoRemoveOutline size={16} />
                </button>
                <span className="w-8 text-center font-semibold text-lg">{guestCounts.children}</span>
                <button
                  type="button"
                  onClick={() => updateGuestCount('children', true)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-secondary transition-colors"
                >
                  <IoAddOutline size={16} />
                </button>
              </div>
            </div>

            {/* Rooms */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 flex justify-start">Rooms</div>
                <div className="text-sm text-gray-500">Number of rooms</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateGuestCount('rooms', false)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={guestCounts.rooms <= 1}
                >
                  <IoRemoveOutline size={16} />
                </button>
                <span className="w-8 text-center font-semibold text-lg">{guestCounts.rooms}</span>
                <button
                  type="button"
                  onClick={() => updateGuestCount('rooms', true)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-secondary transition-colors"
                >
                  <IoAddOutline size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowGuestPopup(false);
                setShowCalendar(false);
              }}
              className="w-full bg-secondary hover:bg-accent text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Calendar Popup */}
      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoChevronDown className="rotate-90" size={18} />
            </button>
            <h3 className="font-semibold text-gray-900 text-lg">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoChevronDown className="-rotate-90" size={18} />
            </button>
          </div>

          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {renderCalendar()}
          </div>

          {/* Date Info */}
          {(dateRange.checkIn || dateRange.checkOut) && (
            <div className="mb-2 flex justify-center">
              <div className="text-sm text-secondary">
                {dateRange.checkIn && !dateRange.checkOut && "Select check-out date"}
                {dateRange.checkIn && dateRange.checkOut && 
                  `${formatDate(dateRange.checkIn)} - ${formatDate(dateRange.checkOut)}`
                }
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowCalendar(false);
                setShowGuestPopup(false);
              }}
              className="w-full bg-secondary hover:bg-accent text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}