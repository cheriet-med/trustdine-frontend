'use client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EventContentArg, EventClickArg } from '@fullcalendar/core';
import { useState, useEffect } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  color?: string;
  description?: string;
  location?: string;
  category?: string;
}

interface EventPopup {
  show: boolean;
  event: CalendarEvent | null;
  x: number;
  y: number;
}

export default function Calendar() {
  const [popup, setPopup] = useState<EventPopup>({ show: false, event: null, x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const events: CalendarEvent[] = [
    { 
      id: '1',
      title: 'Team Meeting', 
      start: new Date(), 
      color: '#3B82F6',
      description: 'Weekly team sync and project updates',
      location: 'Conference Room A',
      category: 'Work'
    },
    { 
      id: '2',
      title: 'Lunch Break', 
      start: new Date(new Date().setHours(12, 0, 0, 0)), 
      end: new Date(new Date().setHours(13, 0, 0, 0)), 
      color: '#10B981',
      description: 'Lunch with colleagues',
      location: 'Cafeteria',
      category: 'Personal'
    },
    {
      id: '3',
      title: 'Project Deadline',
      start: new Date(Date.now() + 24 * 60 * 60 * 1000),
      color: '#EF4444',
      description: 'Final submission for Q3 project',
      location: 'Remote',
      category: 'Work'
    },
    {
      id: '4',
      title: 'Doctor Appointment',
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      color: '#8B5CF6',
      description: 'Annual checkup',
      location: 'Medical Center',
      category: 'Health'
    },
    {
      id: '5',
      title: 'Birthday Party',
      start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      allDay: true,
      color: '#F59E0B',
      description: 'Sarah\'s birthday celebration',
      location: 'Park Plaza',
      category: 'Social'
    },
    {
      id: '6',
      title: 'Gym Session',
      start: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      color: '#06B6D4',
      description: 'Upper body workout',
      location: 'Fitness Center',
      category: 'Health'
    },
    {
      id: '7',
      title: 'Client Call',
      start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      color: '#EC4899',
      description: 'Quarterly review with major client',
      location: 'Video Call',
      category: 'Work'
    },
    {
      id: '8',
      title: 'Weekend Trip',
      start: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      allDay: true,
      color: '#84CC16',
      description: 'Mountain hiking adventure',
      location: 'Blue Ridge Mountains',
      category: 'Travel'
    }
  ];

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
      Work: 'bg-blue-100 text-blue-800',
      Personal: 'bg-green-100 text-green-800',
      Health: 'bg-purple-100 text-purple-800',
      Social: 'bg-yellow-100 text-yellow-800',
      Travel: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
  dateClick={handleDateClick}
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
      className="bg-white rounded-lg shadow-xl border w-11/12 max-w-sm mx-auto p-4 pointer-events-auto"
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
              
              <div className="space-y-2">
                {popup.event.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(popup.event.category)}`}>
                      {popup.event.category}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Time:</span>
                  <span className="text-sm text-gray-900">
                    {popup.event.allDay ? 'All Day' : 
                      new Date(popup.event.start).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }
                  </span>
                </div>
                
                {popup.event.location && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Location:</span>
                    <span className="text-sm text-gray-900">{popup.event.location}</span>
                  </div>
                )}
                
                {popup.event.description && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-700">{popup.event.description}</p>
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
                <button 
                  onClick={() => {
                    alert('Edit functionality would be implemented here');
                    closePopup();
                  }}
                  className="flex-1 min-w-0 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Edit
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