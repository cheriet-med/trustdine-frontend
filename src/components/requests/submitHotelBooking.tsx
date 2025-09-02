'use client'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Minus } from 'lucide-react';
import { LuUsersRound } from 'react-icons/lu';
import useFetchBooking from '@/components/requests/fetchBooking';
import { useSession } from 'next-auth/react';
import LoginButtonBookinHotel from '../header/loginButtonBookingHotel';
import { useRouter } from "next/navigation";
import moment from 'moment';
import { FaEye, FaEyeSlash, FaCircleNotch, FaCopy } from "react-icons/fa";

const HotelBookingComponent = ({bookdata}:any) => {
  const now = moment();
  const router = useRouter();
  const { Booking, isLoading, } = useFetchBooking(bookdata.id);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkInDate, setCheckInDate] = useState('Select date');
  const [checkOutDate, setCheckOutDate] = useState('Select date');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [partner, setPartner] = useState(false);
  const [isLoadingg, setIsLoadingg] = useState(false);
  const { data: session, status } = useSession( );

  // Guest selector state
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  // Function to get available rooms for selected dates
  const getAvailableRooms = (): number => {
    if (!selectedStartDate || !selectedEndDate || !Booking || !Array.isArray(Booking)) return bookdata.rooms_number || 0;
    
    let maxRoomsBooked = 0;
    
    // Check each day in the selected range
    const currentDate = new Date(selectedStartDate);
    while (currentDate < selectedEndDate) {
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDateInRange = (date: Date | null): boolean => {
    if (!selectedStartDate || !date) return false;
    
    // Use hovered date for preview, otherwise use selected end date
    const compareDate = hoveredDate || selectedEndDate;
    if (!compareDate) return false;
    
    // Don't show range if it's the same date
    if (selectedStartDate.getTime() === compareDate.getTime()) return false;
    
    const start = selectedStartDate < compareDate ? selectedStartDate : compareDate;
    const end = selectedStartDate < compareDate ? compareDate : selectedStartDate;
    
    return date > start && date < end;
  };

  const isDateSelected = (date: Date | null): boolean => {
    if (!date) return false;
    return (selectedStartDate ? date.getTime() === selectedStartDate.getTime() : false) ||
           (selectedEndDate ? date.getTime() === selectedEndDate.getTime() : false);
  };

  const handleDateClick = (date: Date): void => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setCheckInDate(formatDate(date));
      setCheckOutDate('Select date');
      setHoveredDate(null);
    } else {
      // Complete the range
      if (date.getTime() === selectedStartDate.getTime()) {
        // Clicking the same date, do nothing or reset
        return;
      }
      
      if (date > selectedStartDate) {
        setSelectedEndDate(date);
        setCheckOutDate(formatDate(date));
      } else {
        // If selected date is before start date, swap them
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
        setCheckInDate(formatDate(date));
        setCheckOutDate(formatDate(selectedStartDate));
      }
      setHoveredDate(null);
    }
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const applyDates = () => {
    if (selectedStartDate && selectedEndDate) {
      // Log the selected dates
      console.log('Check-in date:', selectedStartDate);
      console.log('Check-out date:', selectedEndDate);
      console.log('Formatted Check-in:', formatDate(selectedStartDate));
      console.log('Formatted Check-out:', formatDate(selectedEndDate));
      setShowDatePicker(false);
    }
  };

  const resetDates = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setCheckInDate('Select date');
    setCheckOutDate('Select date');
  };

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

  const handleReserve = () => {
    console.log('Reservation Details:');
    console.log('Check-in:', selectedStartDate);
    console.log('Check-out:', selectedEndDate);
    console.log('Guests:', guests.adults);
  };

  const handleSubmit = async () => {
    setIsLoadingg(true);
    const productData = {
      product: bookdata.id,
      user: session?.user?.id,
      check_in_date: selectedStartDate,
      check_out_date: selectedEndDate,
      adults: guests.adults,
      children: guests.children,
      room_quantity: guests.rooms,
      created_at: now.format('MMMM Do YYYY'),
      status:"Completed",
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
      router.push('/en/account/trips');  
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const renderCalendar = (monthOffset = 0) => {
    const displayMonth = new Date(currentMonth);
    displayMonth.setMonth(currentMonth.getMonth() + monthOffset);
    const days = getDaysInMonth(displayMonth);
    
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            >
              <ChevronLeft size={20} className="md:w-4 md:h-4" />
            </button>
          )}
          <h3 className="font-semibold text-base md:text-lg">
            {months[displayMonth.getMonth()]} {displayMonth.getFullYear()}
          </h3>
          {monthOffset === 1 && (
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            >
              <ChevronRight size={20} className="md:w-4 md:h-4" />
            </button>
          )}
          {monthOffset === 0 && (
            <div className="w-10" />
          )}
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs md:text-sm text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-10 md:h-10" />;
            }
            
            const isSelected = isDateSelected(date);
            const isInRange = isDateInRange(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date.getTime() < new Date().setHours(0, 0, 0, 0);
            const isUnavailable = isDateUnavailable(date);
            const isDisabled = isPast || isUnavailable;
            
            return (
              <button
                key={index}
                onClick={() => !isDisabled && handleDateClick(date)}
                onMouseEnter={() => !isDisabled && selectedStartDate && !selectedEndDate && setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={isDisabled}
                className={`
                  h-10 md:h-10 text-sm rounded-lg transition-all duration-200 touch-manipulation relative
                  ${isDisabled
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'hover:bg-gray-50 cursor-pointer active:bg-gray-100'
                  }
                  ${isSelected 
                    ? 'bg-secondary text-white hover:bg-background' 
                    : ''
                  }
                  ${isInRange && !isSelected 
                    ? 'bg-highlights text-white ' 
                    : ''
                  }
                  ${isToday && !isSelected 
                    ? 'border-2 border-secondary' 
                    : ''
                  }
                  ${isUnavailable && !isPast
                    ? 'bg-black text-white cursor-not-allowed' 
                    : ''
                  }
                `}
                title={isUnavailable ? 'No rooms available on this date' : ''}
              >
                {date.getDate()}
                {isUnavailable && !isPast && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0.5 h-6 bg-gray-400 rotate-45"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (

      
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-secondary mb-1">${bookdata.price_per_night}
              <span className="text-base font-medium text-secondary"> For Night</span>
            </h2>
            <p className="text-sm text-gray-500 mb-6">Lowest prices for your stay</p>

            <div className="space-y-4">
              {/* Date Picker */}
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    className="h-auto p-3 justify-center text-center flex-col border border-2 rounded-3xl hover:border-secondary transition-colors touch-manipulation"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <Calendar size={12} />
                      Check In
                    </div>
                    <div className="font-medium text-sm md:text-base">{checkInDate}</div>
                  </button>
                  <button
                    className="h-auto p-3 justify-center text-center flex-col border border-2 rounded-3xl hover:border-secondary transition-colors touch-manipulation"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <Calendar size={12} />
                      Check Out
                    </div>
                    <div className="font-medium text-sm md:text-base">{checkOutDate}</div>
                  </button>
                </div>
                
                {showDatePicker && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-full max-w-[800px] mx-auto">
                    <div className="p-3 md:p-6">
                      <div className="flex flex-col md:gap-8 mb-4 md:mb-6">
                        {renderCalendar(0)}
                        <div className="block md:hidden mt-4 pt-4 border-t border-gray-200" />
                        <div className="hidden md:block">
                          {renderCalendar(1)}
                        </div>
                        <div className="block md:hidden">
                          {renderCalendar(1)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center flex-wrap justify-between pt-4 border-t border-gray-200 gap-3">
                        <button
                          onClick={resetDates}
                          className="text-gray-500 hover:text-gray-700 text-sm transition-colors order-2 sm:order-1 touch-manipulation underline"
                        >
                          Clear dates
                        </button>
                        
                        <div className="flex gap-2 order-1 sm:order-2">
                          <button
                            onClick={() => setShowDatePicker(false)}
                            className="flex-1 sm:flex-none px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors touch-manipulation border border-1 rounded-3xl"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={applyDates}
                            disabled={!selectedStartDate || !selectedEndDate}
                            className="sm:flex-none px-6 py-2 bg-secondary hover:bg-accent disabled:bg-gray-300 text-white transition-colors touch-manipulation rounded-3xl"
                          >
                            Apply Dates
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Selector */}
              <div className="relative">
                <button 
                  className="w-full flex justify-center items-center rounded-3xl border border-2 py-3 hover:border-secondary"
                  onClick={() => setShowGuestSelector(!showGuestSelector)}
                >
                  <LuUsersRound className="w-4 h-4 mr-2" />
                  {guests.rooms} room, {guests.adults} adults, {guests.children} children
                </button>
                
                {showGuestSelector && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">Rooms</span>
                          {selectedStartDate && selectedEndDate && (
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
                  (session?.user?.is_staff?    <button className="w-full bg-secondary hover:bg-accent text-white font-medium py-2 rounded-3xl" onClick={()=> setPartner(true)}>
            Reserve Now
          </button>:




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


              ):
              <LoginButtonBookinHotel/>}
              </div>
 {partner &&
          <div className="flex justify-center items-center">
             <p className="text-accent font-semibold ">Please swich to user Account</p>
          </div>
         
          }
              <p className="text-xs text-gray-500 text-center">
                Prices are provided by our partners, and reflect nightly room rates.
              </p>
            </div>
          </div>
        </div>

  );
};

export default HotelBookingComponent;