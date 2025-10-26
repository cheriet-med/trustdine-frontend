'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EventContentArg, EventClickArg } from '@fullcalendar/core';
import { useState, useEffect } from 'react';
import useFetchAllBookings from "@/components/requests/fetchAllBookings";
import { useSession } from 'next-auth/react';
interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  color?: string;
  location?: string;
  category?: string;
  status?: string;
  totalPrice?: string | null;
  guests?: string;
  paymentMethod?: string;
  roomNumber?: string;
}

interface EventPopup {
  show: boolean;
  event: CalendarEvent | null;
  x: number;
  y: number;
}

interface Booking {
  id: number;
  user: number;
  product: number;
  status: string;
  created_at: string;
  updated_at: string | null;
  image: string;
  check_in_date: string | null;
  check_out_date: string | null;
  total_guests: string;
  adults: string;
  children: string;
  room_quantity: string | null;
  base_price: string | null;
  tax_amount: string | null;
  service_fee: string | null;
  discount_amount: string | null;
  total_price: string | null;
  payment_method: string;
  cancellation_date: string | null;
  refund_amount: string | null;
  restaurat_check_in_date: string | null;
  restaurat_check_in_time: string | null;
  name: string | null;
  category: string | null;
  cancellation_policy: string | null;
  location: string | null;
}

export default function Calendar() {
  const [popup, setPopup] = useState<EventPopup>({ show: false, event: null, x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { data: session, status } = useSession({ required: true });
  const { AllBookings } = useFetchAllBookings();
  const Owner = AllBookings.filter((user) => user.user_owner === session?.user?.id)

  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert booking data to calendar events
  useEffect(() => {
    if (Owner && Owner.length > 0) {
      const bookingEvents: CalendarEvent[] = Owner.map((booking) => {
        // Determine the date to use
        let startDate: Date;
        let endDate: Date | undefined;
        let isAllDay = false;

        if (booking.category === 'Restaurant' && booking.restaurat_check_in_date) {
          // For restaurant bookings, use restaurant check-in date and time
          startDate = new Date(booking.restaurat_check_in_date);
          if (booking.restaurat_check_in_time) {
            // Parse time and set it
            const [time, period] = booking.restaurat_check_in_time.split(' ');
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            
            startDate.setHours(hour, parseInt(minutes || '0'), 0, 0);
            // Restaurant bookings typically last 2 hours
            endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
          } else {
            isAllDay = true;
          }
        } else if (booking.category === 'Hotel' && booking.check_in_date) {
          // For hotel bookings, use check-in and check-out dates
          startDate = new Date(booking.check_in_date);
          if (booking.check_out_date) {
            endDate = new Date(booking.check_out_date);
          }
          isAllDay = true;
        } else {
          // Fallback to created_at date
          if (booking.created_at.includes('T')) {
            startDate = new Date(booking.created_at);
          } else {
            // Handle "August 24th 2025" format
            startDate = new Date(booking.created_at);
          }
          isAllDay = true;
        }

        // Determine color based on status and category
        let color = '#6B7280'; // Default gray
        if (booking.status === 'Completed') {
          color = booking.category === 'Restaurant' ? '#82A7A6' : '#9ED0E6'; // Green for restaurant, blue for hotel
        } else if (booking.status === 'Pending') {
          color = '#F59E0B'; // Yellow
        } else if (booking.status === 'Cancelled') {
          color = '#EF4444'; // Red
        }

        // Create event title
        const title = booking.name || `${booking.category} Booking #${booking.id}`;

        return {
          id: booking.id.toString(),
          title,
          start: startDate,
          end: endDate,
          allDay: isAllDay,
          color,
          location: booking.location || 'Not specified',
          category: booking.category || 'Booking',
          status: booking.status,
          totalPrice: booking.total_price,
          guests: `${booking.total_guests} (${booking.adults} adults, ${booking.children} children)`,
          paymentMethod: booking.payment_method,
          room_quantity: booking.category === 'Hotel' ? booking.room_quantity : undefined
        };
      });

      setEvents(bookingEvents);
    }
  }, [AllBookings]);

  const handleDateClick = (arg: DateClickArg) => {
    const newEvent = prompt(`Create event for ${arg.dateStr}:`);
    if (newEvent) {
      alert(`Event "${newEvent}" would be created for ${arg.dateStr}`);
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    const rect = info.el.getBoundingClientRect();
    const event = events.find(e => e.id === info.event.id);
    
    setPopup({
      show: true,
      event: event || null,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  const closePopup = () => {
    setPopup({ show: false, event: null, x: 0, y: 0 });
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <div className="p-1 cursor-pointer hover:opacity-80 transition-opacity">
        <div className={`font-bold ${isMobile ? 'text-xs' : 'text-sm'} truncate`}>
          {eventInfo.event.title}
        </div>
        {!eventInfo.event.allDay && !isMobile && (
          <div className="text-xs opacity-90">
            {eventInfo.timeText}
          </div>
        )}
      </div>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Hotel: 'bg-background text-white',
      Restaurant: 'bg-accent text-white',
      Booking: 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      Completed: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const [aspectRatio, setAspectRatio] = useState(1.8);
  const [displayEventTime, setDisplayEventTime] = useState(true);

  const [eventTimeFormat, setEventTimeFormat] = useState<{
    hour: 'numeric' | '2-digit';
    minute: '2-digit';
    omitZeroMinute: boolean;
    meridiem?: 'short' | 'narrow' | 'long';
  }>({
    hour: 'numeric',
    minute: '2-digit',
    omitZeroMinute: false,
    meridiem: 'short'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAspectRatio(window.innerWidth < 768 ? 1.0 : 1.8);
      setDisplayEventTime(window.innerWidth >= 768);
      setEventTimeFormat({
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: window.innerWidth >= 768 ? 'short' : undefined
      });
    }
  }, [isMobile]);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="p-2 sm:p-4 max-w-full">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-2 sm:p-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 font-playfair">Booking Calendar</h2>
              <div className="flex flex-wrap gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-background"></div>
                  <span>Hotel Bookings</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-accent"></div>
                  <span>Restaurant Bookings</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-yellow-500"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span>Cancelled</span>
                </div>
              </div>
            </div>

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'today'
              }}
              footerToolbar={{
                center: 'dayGridMonth,timeGridWeek,listWeek'
              }}
              height="auto"
              events={events}
              //dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              nowIndicator={true}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={3}
              weekends={true}
              aspectRatio={aspectRatio}
              contentHeight="auto"
              stickyHeaderDates={false}
              dayHeaderFormat={{ weekday: isMobile ? 'narrow' : 'short' }}
              eventDisplay="block"
              eventMinHeight={isMobile ? 25 : 30}
              expandRows={true}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={true}
              displayEventTime={displayEventTime}
              displayEventEnd={false}
              dayPopoverFormat={{ month: 'long', day: 'numeric', year: 'numeric' }}
              moreLinkClick="popover"
              moreLinkText={isMobile ? "+" : "more"}
              navLinks={true}
              eventResizableFromStart={!isMobile}
              eventDurationEditable={!isMobile}
              handleWindowResize={true}
              windowResizeDelay={100}
            />
          </div>
        </div>
      </div>

      {/* Event Popup */}
      {popup.show && popup.event && isClient && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={closePopup}
          />
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div 
              className="bg-white rounded-lg shadow-xl border w-11/12 max-w-md mx-auto p-4 pointer-events-auto max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 pr-2">
                    {popup.event.title}
                  </h3>
                  <button 
                    onClick={closePopup}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {popup.event.category && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(popup.event.category)}`}>
                        {popup.event.category}
                      </span>
                    )}
                    {popup.event.status && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(popup.event.status)}`}>
                        {popup.event.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">Date:</span>
                    <span className="text-sm text-gray-900">
                      {popup.event.allDay ? 
                        new Date(popup.event.start).toLocaleDateString() :
                        new Date(popup.event.start).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }
                      {popup.event.end && popup.event.allDay && (
                        ` - ${new Date(popup.event.end).toLocaleDateString()}`
                      )}
                    </span>
                  </div>
                  
                  {popup.event.guests && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">Guests:</span>
                      <span className="text-sm text-gray-900">{popup.event.guests}</span>
                    </div>
                  )}
                  
                  {popup.event.totalPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">Total Price:</span>
                      <span className="text-sm text-gray-900 font-semibold">${popup.event.totalPrice}</span>
                    </div>
                  )}
                  
                  {popup.event.roomNumber && popup.event.category === 'Hotel' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">Rooms:</span>
                      <span className="text-sm text-gray-900">{popup.event.roomNumber}</span>
                    </div>
                  )}
                  
                  {popup.event.location && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">Location:</span>
                      <span className="text-sm text-gray-900">{popup.event.location}</span>
                    </div>
                  )}
                  
                  {popup.event.paymentMethod && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">Payment:</span>
                      <span className="text-sm text-gray-900">{popup.event.paymentMethod}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
                  <button 
                    onClick={closePopup}
                    className="flex-1 min-w-0 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>

                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}