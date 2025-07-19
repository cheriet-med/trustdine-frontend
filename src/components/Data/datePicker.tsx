import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const ModernDateRangePicker = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkInDate, setCheckInDate] = useState('Select date');
  const [checkOutDate, setCheckOutDate] = useState('Select date');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
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

  const applyDates = (): void => {
    if (selectedStartDate && selectedEndDate) {
      setShowDatePicker(false);
    }
  };

  const resetDates = (): void => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setCheckInDate('Select date');
    setCheckOutDate('Select date');
  };

  const renderCalendar = (monthOffset: number = 0) => {
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
            
            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateClick(date)}
                onMouseEnter={() => !isPast && selectedStartDate && !selectedEndDate && setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={isPast}
                className={`
                  h-10 md:h-10 text-sm rounded-lg transition-all duration-200 touch-manipulation
                  ${isPast 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'hover:bg-background cursor-pointer active:bg-a'
                  }
                  ${isSelected 
                    ? 'bg-secondary text-white hover:bg-a' 
                    : ''
                  }
                  ${isInRange && !isSelected 
                    ? 'bg-accent text-a' 
                    : ''
                  }
                  ${isToday && !isSelected 
                    ? 'border-2 border-secondary' 
                    : ''
                  }
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full">
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
        <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-full max-w-[800px] mx-auto ">
          <div className="p-3 md:p-6">
            {/* Mobile: Single column calendar, Desktop: Two column */}
            <div className="flex flex-col  md:gap-8 mb-4 md:mb-6">
              {renderCalendar(0)}
              <div className="block md:hidden mt-4 pt-4 border-t border-gray-200" />
              <div className="hidden md:block">
                {renderCalendar(1)}
              </div>
              <div className="block md:hidden">
                {renderCalendar(1)}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap justify-between pt-4   border-t border-gray-200 gap-3">
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
                  className=" sm:flex-none px-6 py-2 bg-secondary hover:bg-accent disabled:bg-gray-300 text-white transition-colors touch-manipulation rounded-3xl"
                >
                  Apply Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernDateRangePicker;