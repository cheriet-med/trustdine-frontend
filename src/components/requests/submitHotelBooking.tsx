'use client'

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Minus } from 'lucide-react';
import { IoChevronDown } from "react-icons/io5";
import { LuUsersRound } from 'react-icons/lu';
import useFetchBooking from '@/components/requests/fetchBooking';
import { useSession } from 'next-auth/react';
import LoginButtonBookinHotel from '../header/loginButtonBookingHotel';
import { useRouter } from "next/navigation";
import moment from 'moment';
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa";

interface DateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

const HotelBookingComponent = ({bookdata}:any) => {
  const now = moment();
  const router = useRouter();
  const { Booking, isLoading, } = useFetchBooking(bookdata.id);
  const [partner, setPartner] = useState(false);
  const [isLoadingg, setIsLoadingg] = useState(false);
  const { data: session, status } = useSession( );

  // New calendar state
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  // Guest selector state
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const guestSelectorRef = useRef<HTMLDivElement>(null);
  const guestButtonRef = useRef<HTMLButtonElement>(null);

  // Smooth scroll function to center popup
  const scrollToCenter = (popupRef: React.RefObject<HTMLDivElement | null>) => {
    if (popupRef.current) {
      const popup = popupRef.current;
      const popupRect = popup.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate the center position
      const popupCenter = popupRect.top + popupRect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const scrollOffset = popupCenter - viewportCenter;
      
      // Smooth scroll to center the popup
      window.scrollBy({
        top: scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  // Function to get available rooms for selected dates
  const getAvailableRooms = (): number => {
    if (!dateRange.checkIn || !dateRange.checkOut || !Booking || !Array.isArray(Booking)) return bookdata.rooms_number || 0;
    
    let maxRoomsBooked = 0;
    
    // Check each day in the selected range
    const currentDate = new Date(dateRange.checkIn);
    while (currentDate < dateRange.checkOut) {
      const totalRooms = Booking.reduce((sum, booking) => {
        if (!booking.check_in_date || !booking.check_out_date || !booking.room_quantity) return sum;
        
        const checkIn = new Date(booking.check_in_date);
        const checkOut = new Date(booking.check_out_date);
        
        // Check if the current date falls within the booking period
        if (currentDate >= checkIn && currentDate < checkOut) {
          return sum + parseInt(booking.room_quantity);
        }
        
        return sum;
      }, 0);
      
      maxRoomsBooked = Math.max(maxRoomsBooked, totalRooms);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return 8 - maxRoomsBooked;
  };

  // Function to check if a date is unavailable due to booking conflicts
  const isDateUnavailable = (date: Date): boolean => {
    if (!Booking || !Array.isArray(Booking)) return false;
    
    // Get bookings that overlap with this date and sum their room quantities
    const totalRooms = Booking.reduce((sum, booking) => {
      if (!booking.check_in_date || !booking.check_out_date || !booking.room_quantity) return sum;
      
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      
      // Check if the date falls within the booking period
      if (date >= checkIn && date < checkOut) {
        return sum + parseInt(booking.room_quantity);
      }
      
      return sum;
    }, 0);

    // If total room quantity is greater than 8, the date is unavailable
    return totalRooms > 8;
  };

  // New calendar functions
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
      const isUnavailable = isDateUnavailable(date);
      const isDisabled = isPast || isUnavailable;
      
      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateClick(date)}
          disabled={isDisabled}
          className={`w-10 h-10 text-sm rounded-full transition-colors relative ${
            isDisabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : isSelected
              ? 'bg-secondary text-white font-semibold'
              : isInRange
              ? 'bg-highlights text-white'
              : isToday
              ? 'bg-background text-white font-semibold'
              : 'hover:bg-gray-100'
          } ${isUnavailable && !isPast ? 'bg-black text-white' : ''}`}
          title={isUnavailable ? 'No rooms available on this date' : ''}
        >
          {day}
          {isUnavailable && !isPast && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-6 bg-gray-400 rotate-45"></div>
            </div>
          )}
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

  // Handle calendar popup opening with smooth scroll
  const handleCalendarOpen = () => {
    setShowCalendar(!showCalendar);
    setShowGuestSelector(false);
    
    // Scroll to center after popup opens
    if (!showCalendar) {
      setTimeout(() => {
        scrollToCenter(calendarRef);
      }, 100); // Small delay to ensure popup is rendered
    }
  };

  // Handle guest selector opening with smooth scroll
  const handleGuestSelectorOpen = () => {
    setShowGuestSelector(!showGuestSelector);
    setShowCalendar(false); // Close calendar when opening guest selector
    
    // Scroll to center after popup opens
    if (!showGuestSelector) {
      setTimeout(() => {
        scrollToCenter(guestSelectorRef);
      }, 100); // Small delay to ensure popup is rendered
    }
  };

  // Close popups when clicking outside - UPDATED TO HANDLE BOTH POPUPS
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside calendar popup
      if (
        showCalendar &&
        calendarRef.current && 
        !calendarRef.current.contains(event.target as Node) &&
        calendarButtonRef.current &&
        !calendarButtonRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }

      // Check if click is outside guest selector popup
      if (
        showGuestSelector &&
        guestSelectorRef.current && 
        !guestSelectorRef.current.contains(event.target as Node) &&
        guestButtonRef.current &&
        !guestButtonRef.current.contains(event.target as Node)
      ) {
        setShowGuestSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar, showGuestSelector]); // Added showGuestSelector to dependency array

  const updateGuests = (type: keyof typeof guests, increment: boolean): void => {
    const availableRooms = getAvailableRooms();
    
    setGuests(prev => {
      if (type === 'rooms') {
        const newValue = prev[type] + (increment ? 1 : -1);
        return {
          ...prev,
          [type]: Math.max(1, Math.min(availableRooms, newValue))
        };
      }
      return {
        ...prev,
        [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
      };
    });
  };

  const handleSubmit = async () => {
    setIsLoadingg(true);
    const productData = {
      product: bookdata.id,
      user: session?.user?.id,
      check_in_date: dateRange.checkIn,
      check_out_date: dateRange.checkOut,
      adults: guests.adults,
      children: guests.children,
      room_quantity: guests.rooms,
      created_at: now.format('MMMM Do YYYY'),
      status:"pending",
      image:bookdata.image,
      receipt:bookdata.receipt,
      total_guests:guests.adults+guests.children,
      total_price:bookdata.price_per_night,
      payment_method:"Cash, Credit Card",
      name:bookdata.name,
      category:'Hotel',
      cancellation_policy:bookdata.cancellation_policy,
      location:bookdata.location,
      user_owner:bookdata.user
    };

    try {
      const productResponse = await fetch(
        `${process.env.NEXT_PUBLIC_URL}order/`,
        {
          method: 'POST',
          headers: {
            "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(productData),
        }
      );

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
       const data = await productResponse.json();
      router.push(`/en/checkout-booking?nb=${data.id}`); 
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-secondary mb-1">${bookdata.price_per_night}
          <span className="text-base font-medium text-secondary"> For Night</span>
        </h2>
        <p className="text-sm text-gray-500 mb-6">Lowest prices for your stay</p>

        <div className="space-y-4">
          {/* New Date Picker Button */}
          <div className="relative">
            <button
              ref={calendarButtonRef}
              type="button"
              onClick={handleCalendarOpen}
              className="w-full flex gap-2 justify-center items-center rounded-3xl border border-2 py-3 hover:border-secondary"
            >
              <Calendar size={18} className="text-secondary" />
              <span >{getDateRangeText()}</span>
            </button>

            {/* New Calendar Popup */}
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
                      setShowGuestSelector(false);
                    }}
                    className="w-full bg-secondary hover:bg-accent text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guest Selector */}
          <div className="relative">
            <button 
              ref={guestButtonRef}
              className="w-full flex justify-center items-center rounded-3xl border border-2 py-3 hover:border-secondary"
              onClick={handleGuestSelectorOpen}
            >
              <LuUsersRound className="w-4 h-4 mr-2 text-secondary" />
              {guests.rooms} room, {guests.adults} adults, {guests.children} children
            </button>
            
            {showGuestSelector && (
              <div 
                ref={guestSelectorRef}
                className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">Rooms</span>
                      {dateRange.checkIn && dateRange.checkOut && (
                        <div className="text-xs text-gray-500">
                          {getAvailableRooms()} available
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                        onClick={() => updateGuests('rooms', false)}
                        disabled={guests.rooms <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center select-none">{guests.rooms}</span>
                      <button 
                        className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                        onClick={() => updateGuests('rooms', true)}
                        disabled={guests.rooms >= getAvailableRooms()}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Adults</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                        onClick={() => updateGuests('adults', false)}
                        disabled={guests.adults <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center select-none">{guests.adults}</span>
                      <button 
                        className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                        onClick={() => updateGuests('adults', true)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Children</span>
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                        onClick={() => updateGuests('children', false)}
                        disabled={guests.children <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center select-none">{guests.children}</span>
                      <button 
                        className="p-2 rounded-full border border-2 hover:bg-secondary hover:text-white"
                        onClick={() => updateGuests('children', true)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-secondary hover:bg-accent py-2 text-white rounded-3xl"
                    onClick={() => setShowGuestSelector(false)}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            {status === "authenticated" ?         
              (session?.user?.is_staff ? 
                <button className="w-full bg-secondary hover:bg-accent text-white font-medium py-2 rounded-3xl" onClick={() => setPartner(true)}>
                  Reserve Now
                </button> :
                <button
                  disabled={isLoadingg}
                  onClick={handleSubmit}
                  className={`w-full flex items-center justify-center gap-2 
                    bg-secondary hover:bg-accent text-white font-medium py-2 rounded-3xl ${
                      isLoadingg
                        ? "bg-secondary hover:bg-accent text-white"
                        : "bg-accent text-white hover:bg-accent"
                    }`}
                >
                  {isLoadingg ? (
                    <>
                      <FaCircleNotch className="animate-spin" />
                      <span>Reserve Now</span>
                    </>
                  ) : (
                    "Reserve Now"
                  )}
                </button>
              ) :
              <LoginButtonBookinHotel/>
            }
          </div>
          
          {partner && (
            <div className="flex justify-center items-center">
              <p className="text-accent font-semibold">Please switch to user Account</p>
            </div>
          )}
          
          <p className="text-xs text-gray-500 text-center">
            Prices are provided by our partners, and reflect nightly room rates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingComponent;