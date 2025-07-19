'use client'

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon,
  CalendarDays,
  CreditCard,
  DollarSign,
  Users,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Grid3X3,
  List,
  X,
  Building2,
  MapPin,
  Clock,
  User
} from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
}

export interface Reservation {
  id: string;
  user: User;
  reservationDate: Date;
  service: string;
  destination: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  amount: number;
  currency: string;
  createdAt: Date;
}

export type SortField = keyof Reservation | 'user.name' | 'user.email';
export type SortDirection = 'asc' | 'desc';

export interface TableFilters {
  search: string;
  status: string;
  paymentMethod: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const mockReservations: Reservation[] = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'Emily Johnson',
      email: 'Software Developer',
      profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=120&fit=crop&crop=face'
    },
    reservationDate: new Date('2024-01-15T14:30:00'),
    service: 'Premium Spa Package',
    destination: 'Wellness Center',
    paymentMethod: 'credit_card',
    status: 'confirmed',
    amount: 299.99,
    currency: 'USD',
    createdAt: new Date('2024-01-10T10:15:00')
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Marcus Chen',
      email: 'Digital Marketing Specialist',
      profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&h=120&fit=crop&crop=face'
    },
    reservationDate: new Date('2024-01-20T09:00:00'),
    service: 'City Tour',
    destination: 'Downtown Heritage District',
    paymentMethod: 'paypal',
    status: 'pending',
    amount: 75.00,
    currency: 'USD',
    createdAt: new Date('2024-01-18T16:45:00')
  },
  {
    id: '3',
    user: {
      id: 'u3',
      name: 'Sarah Williams',
      email: 'Healthcare Nurse',
      profileImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&h=120&fit=crop&crop=face'
    },
    reservationDate: new Date('2024-01-25T19:30:00'),
    service: 'Fine Dining Experience',
    destination: 'Michelin Star Restaurant',
    paymentMethod: 'credit_card',
    status: 'completed',
    amount: 450.00,
    currency: 'USD',
    createdAt: new Date('2024-01-12T14:20:00')
  },
  {
    id: '4',
    user: {
      id: 'u4',
      name: 'David Rodriguez',
      email: 'Financial Analyst',
      profileImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=120&h=120&fit=crop&crop=face'
    },
    reservationDate: new Date('2024-02-05T11:00:00'),
    service: 'Adventure Sports',
    destination: 'Mountain Resort',
    paymentMethod: 'bank_transfer',
    status: 'cancelled',
    amount: 180.00,
    currency: 'USD',
    createdAt: new Date('2024-01-28T09:30:00')
  },
  {
    id: '5',
    user: {
      id: 'u5',
      name: 'Lisa Thompson',
      email: 'Graphic Designer',
      profileImage: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=120&h=120&fit=crop&crop=face'
    },
    reservationDate: new Date('2024-02-10T16:00:00'),
    service: 'Cultural Workshop',
    destination: 'Art Museum',
    paymentMethod: 'cash',
    status: 'confirmed',
    amount: 95.00,
    currency: 'USD',
    createdAt: new Date('2024-02-01T11:15:00')
  },
  {
    id: '6',
    user: {
      id: 'u6',
      name: 'James Wilson',
      email: 'Renewable Energy Engineer',
      profileImage: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=120&h=120&fit=crop&crop=face'
    },
    reservationDate: new Date('2024-02-15T13:45:00'),
    service: 'Photography Tour',
    destination: 'Historic District',
    paymentMethod: 'credit_card',
    status: 'pending',
    amount: 120.00,
    currency: 'USD',
    createdAt: new Date('2024-02-08T15:30:00')
  }
];

const ReservationsTable = () => {
  const [reservations] = useState<Reservation[]>(mockReservations);
  const [filters, setFilters] = useState<TableFilters>({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    dateRange: { from: undefined, to: undefined }
  });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortField, setSortField] = useState<SortField>('reservationDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);

  // Event handlers
  const handleEdit = (reservation: Reservation) => {
    console.log('Edit:', reservation);
  };

  const handleDelete = (reservation: Reservation) => {
    console.log('Delete:', reservation);
  };

  const handleView = (reservation: Reservation) => {
    console.log('View:', reservation);
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      paymentMethod: 'all',
      dateRange: { from: undefined, to: undefined }
    });
  };

  const hasActiveFilters = 
    filters.search || 
    (filters.status && filters.status !== 'all') || 
    (filters.paymentMethod && filters.paymentMethod !== 'all') || 
    filters.dateRange.from || 
    filters.dateRange.to;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  // Filter and sort reservations
  const filteredAndSortedReservations = useMemo(() => {
    let filtered = [...reservations];

    if (filters.search) {
      filtered = filtered.filter(reservation =>
        reservation.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        reservation.user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        reservation.service.toLowerCase().includes(filters.search.toLowerCase()) ||
        reservation.destination.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === filters.status);
    }

    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      filtered = filtered.filter(reservation => reservation.paymentMethod === filters.paymentMethod);
    }

    if (filters.dateRange.from) {
      filtered = filtered.filter(reservation => 
        new Date(reservation.reservationDate) >= filters.dateRange.from!
      );
    }

    if (filters.dateRange.to) {
      filtered = filtered.filter(reservation => 
        new Date(reservation.reservationDate) <= filters.dateRange.to!
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'user':
          aValue = a.user.name;
          bValue = b.user.name;
          break;
        case 'reservationDate':
          aValue = new Date(a.reservationDate);
          bValue = new Date(b.reservationDate);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'service':
          aValue = a.service;
          bValue = b.service;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [reservations, filters, sortField, sortDirection]);

  // Statistics
  const stats = {
    total: reservations.length,
    totalRevenue: reservations.reduce((sum, r) => sum + r.amount, 0),
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
  };

  // Export functionality
  const exportToCSV = () => {
    const csvContent = [
      ['User', 'Email', 'Date', 'Service', 'Destination', 'Amount', 'Currency', 'Status', 'Payment Method'].join(','),
      ...filteredAndSortedReservations.map(reservation => [
        reservation.user.name,
        reservation.user.email,
        format(new Date(reservation.reservationDate), 'yyyy-MM-dd'),
        reservation.service,
        reservation.destination,
        reservation.amount,
        reservation.currency,
        reservation.status,
        reservation.paymentMethod
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusClasses = (status: string) => {
      switch (status) {
        case 'confirmed':
          return 'bg-emerald-100 text-emerald-700  ';
        case 'pending':
          return 'bg-amber-100 text-amber-700  ';
        case 'cancelled':
          return 'bg-red-100 text-red-700 ';
        case 'completed':
          return 'bg-blue-100 text-blue-700 ';
        default:
          return 'bg-gray-100 text-gray-700 ';
      }
    };

    return (
      <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  // Payment Method Icon Component
  const PaymentMethodIcon = ({ method, className = "h-4 w-4" }: { method: string; className?: string }) => {
    const getIcon = () => {
      switch (method) {
        case 'credit_card':
          return <CreditCard className={className} />;
        case 'paypal':
          return <DollarSign className={className} />;
        case 'bank_transfer':
          return <Building2 className={className} />;
        case 'cash':
          return <DollarSign className={className} />;
        default:
          return <CreditCard className={className} />;
      }
    };

    return getIcon();
  };

  // User Avatar Component
  const UserAvatar = ({ user, size = "sm" }: { user: { name: string; email: string; profileImage: string }; size?: "sm" | "md" | "lg" }) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10", 
      lg: "h-12 w-12"
    };

    const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
      <div className={`relative flex ${sizeClasses[size]} shrink-0 overflow-hidden rounded-full`}>
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className="aspect-square h-full w-full"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100  `}>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {getInitials(user.name)}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Custom Select Component
  const CustomSelect = ({ 
    value, 
    onChange, 
    options, 
    placeholder 
  }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-full items-center justify-between text-gray-500 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  "
        >
          <span className="truncate ">{selectedLabel}</span>
          <ArrowDown className="h-4 w-4 opacity-50" />
        </button>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-80 ">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="relative flex w-full cursor-default select-none items-center text-gray-500 hover:bg-highlights hover:text-white rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-500 data-[disabled]:pointer-events-none data-[disabled]:opacity-50  "
              >
                {option.value === value && (
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <ArrowDown className="h-4 w-4" />
                  </span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Custom Dropdown Menu Component
  const DropdownMenu = ({ 
    trigger, 
    items,
    reservationId
  }: {
    trigger: React.ReactNode;
    items: { 
      label: string; 
      icon: React.ReactNode; 
      onClick: () => void;
      className?: string;
    }[];
    reservationId: string;
  }) => {
    return (
     <div className="relative">
  <button 
    onClick={() => setIsDropdownOpen(isDropdownOpen === reservationId ? null : reservationId)}
    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 hover:text-gray-900"
  >
    {trigger}
  </button>
  {isDropdownOpen === reservationId && (
    <div className="absolute z-[50] right-4 top-0 mr-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-80">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.onClick();
            setIsDropdownOpen(null);
          }}
          className={`relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${item.className || ''}`}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  )}
</div>
    );
  };

  // Custom Calendar Component
  const DateRangePicker = () => {
    const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>(filters.dateRange);

    const handleApply = () => {
      setFilters(prev => ({
        ...prev,
        dateRange: { from: selectedRange.from, to: selectedRange.to }
      }));
      setIsDatePickerOpen(false);
    };

    const handleCancel = () => {
      setSelectedRange(filters.dateRange);
      setIsDatePickerOpen(false);
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className="inline-flex h-10 w-full items-center justify-between rounded-md border border-gray-200 text-gray-500 bg-white px-3 py-2 text-sm font-normal ring-offset-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  "
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, "LLL dd, y")} -{" "}
                  {format(selectedRange.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </div>
        </button>
        
        {isDatePickerOpen && (
          <div className="absolute z-[100] mt-1 w-full rounded-md border border-gray-200 bg-white p-2 shadow-lg animate-in fade-in-80 text-gray-500">
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <div className="grid gap-1 w-full ">
                  {[0, 1].map((monthOffset) => (
                    <div key={monthOffset} className="space-y-1">
                      <div className="flex items-center justify-between px-2 pt-1">
                        <div className="text-sm font-medium">
                          {format(
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth() + monthOffset,
                              1
                            ),
                            "MMMM yyyy"
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 px-1 pb-1 text-xs">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div key={day} className="flex h-8 w-8 items-center justify-center">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 px-1">
                        {Array.from({
                          length: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + monthOffset + 1,
                            0
                          ).getDate(),
                        }).map((_, i) => {
                          const day = i + 1;
                          const date = new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + monthOffset,
                            day
                          );
                          const isSelected =
                            (selectedRange.from && format(date, "yyyy-MM-dd") === format(selectedRange.from, "yyyy-MM-dd")) ||
                            (selectedRange.to && format(date, "yyyy-MM-dd") === format(selectedRange.to, "yyyy-MM-dd"));
                          const isInRange =
                            selectedRange.from &&
                            selectedRange.to &&
                            date >= selectedRange.from &&
                            date <= selectedRange.to;

                          return (
                            <button
                              key={day}
                              onClick={() => {
                                if (!selectedRange.from) {
                                  setSelectedRange({ from: date, to: undefined });
                                } else if (!selectedRange.to && date >= selectedRange.from) {
                                  setSelectedRange({ ...selectedRange, to: date });
                                } else {
                                  setSelectedRange({ from: date, to: undefined });
                                }
                              }}
                              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                                isSelected
                                  ? "bg-gray-900 text-gray-50  "
                                  : isInRange
                                  ? "bg-gray-100 text-gray-900  "
                                  : "hover:bg-gray-100 hover:text-gray-900 "
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={handleCancel}
                  className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  "
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-3 text-sm font-medium text-gray-50 transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8  mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-playfair">
            Reservations
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className=" rounded-lg border border-slate-200  p-1 bg-white  ">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md ${viewMode === 'table' ? 'bg-gray-50  ' : ''}`}
            >
              <List className="h-5 w-5 text-secondary"/>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md ${viewMode === 'cards' ? 'bg-gray-50  ' : ''}`}
            >
              <Grid3X3 className="h-5 w-5 text-secondary"/>
            </button>
          </div>
          
          <button 
            onClick={exportToCSV}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-gray-50 hover:bg-gray-900/90   px-4 py-1.5 gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>



      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-highlights   p-4 ">
      
        <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 text-white">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  placeholder="Search reservations..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 pl-10 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 text-white">Status</label>
              <CustomSelect
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                placeholder="All statuses"
                options={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 text-white">Payment Method</label>
              <CustomSelect
                value={filters.paymentMethod}
                onChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}
                placeholder="All methods"
                options={[
                  { value: 'all', label: 'All methods' },
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'paypal', label: 'PayPal' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'cash', label: 'Cash' },
                ]}
              />
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 text-white">Date Range</label>
              <DateRangePicker />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 ">
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center rounded-md text-sm text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary hover:text-white  px-3 py-1.5 gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table/Cards View */}
      {viewMode === 'table' ? (<div className="rounded-xl border border-slate-200 bg-white isolate">
  <div className="p-0">
    <div className="overflow-x-auto pt-4">
      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 md:px-4 text-left font-bold text-slate-500 min-w-[180px] md:min-w-0">
              <div className="flex items-center cursor-pointer select-none text-sm" onClick={() => handleSort('user')}>
                User
                <SortIcon field="user"/>
              </div>
            </th>
            
            <th className="h-12 px-4 md:px-4 text-left font-bold text-slate-500 min-w-[120px] md:min-w-0">
              <div className="flex items-center cursor-pointer select-none text-sm" onClick={() => handleSort('reservationDate')}>
                Date
                <SortIcon field="reservationDate" />
              </div>
            </th>
            
            <th className="h-12 px-4 md:px-4 text-left font-bold text-slate-500 min-w-[140px] md:min-w-0">
              <div className="flex items-center cursor-pointer select-none text-sm" onClick={() => handleSort('service')}>
                Service
                <SortIcon field="service" />
              </div>
            </th>
            
            <th className="h-12 px-4 md:px-4 text-left font-bold text-slate-500 text-sm min-w-[150px] md:min-w-0">
              Destination
            </th>
            
            <th className="h-12 px-4 md:px-4 text-left font-bold text-slate-500 text-sm min-w-[100px] md:min-w-0">
              <div className="flex items-center cursor-pointer select-none" onClick={() => handleSort('amount')}>
                Amount
                <SortIcon field="amount" />
              </div>
            </th>
            
            <th className="h-12 px-4 md:px-4 text-left font-bold text-slate-500 text-sm min-w-[120px] md:min-w-0">
              Payment
            </th>
            
            <th className="h-12 px-4 md:px-4 text-left font-bold text-slate-500 text-sm min-w-[100px] md:min-w-0">
              <div className="flex items-center cursor-pointer select-none" onClick={() => handleSort('status')}>
                Status
                <SortIcon field="status" />
              </div>
            </th>
            
            <th className="h-12 px-4 md:px-4 text-right font-bold text-slate-500 text-sm min-w-[80px] md:min-w-0">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {filteredAndSortedReservations.length === 0 ? (
            <tr className="border-b hover:bg-slate-50/50">
              <td colSpan={8} className="text-center py-8 text-slate-500">
                No reservations found matching the current filters.
              </td>
            </tr>
          ) : (
            filteredAndSortedReservations.map((reservation, index) => (
              <tr 
                key={reservation.id} 
                className={`border-b transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-slate-50/50`}
              >
                {/* User Column */}
                <td className="py-4 px-4 lg:px-4 align-middle sm:py-3 min-w-[280px] lg:min-w-0">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={reservation.user} size="md" />
                    <div>
                      <div className="font-medium text-slate-900 font-playfair">{reservation.user.name}</div>
                      <div className="text-sm text-slate-500">{reservation.user.email}</div>
                    </div>
                  </div>
                </td>
                
                {/* Date Column */}
                <td className="py-4 px-4 lg:px-4 align-middle text-slate-700 text-sm sm:py-3 min-w-[120px] lg:min-w-0">
                  {format(new Date(reservation.reservationDate), 'MMM dd, yyyy')}
                </td>
                
                {/* Service Column */}
                <td className="py-4 px-4 lg:px-4 align-middle text-slate-700 text-sm sm:py-3 min-w-[180px] lg:min-w-0">
                  {reservation.service}
                </td>
                
                {/* Destination Column */}
                <td className="py-4 px-4 lg:px-4 align-middle sm:py-3 min-w-[250px] lg:min-w-0">
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {reservation.destination}
                  </div>
                </td>
                
                {/* Amount Column */}
                <td className="py-4 px-4 lg:px-4 align-middle font-medium text-slate-900 text-sm sm:py-3 min-w-[100px] lg:min-w-0">
                  {formatCurrency(reservation.amount, reservation.currency)}
                </td>
                
                {/* Payment Column */}
                <td className="py-4 px-4 lg:px-4 align-middle sm:py-3 min-w-[180px] lg:min-w-0">
                  <div className="flex items-center gap-2">
                    <PaymentMethodIcon method={reservation.paymentMethod} />
                    <span className="text-sm text-slate-600 capitalize">
                      {reservation.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                
                {/* Status Column */}
                <td className="py-4 px-4 lg:px-4 align-middle sm:py-3 min-w-[100px] lg:min-w-0">
                  <StatusBadge status={reservation.status} />
                </td>
                
                {/* Actions Column */}
                <td className="py-4 px-4 lg:px-4 align-middle text-right sm:py-3 min-w-[80px] lg:min-w-0">
                  <DropdownMenu
                    reservationId={reservation.id}
                    trigger={<MoreHorizontal className="h-4 w-4" />}
                    items={[
                      {
                        label: 'View',
                        icon: <Eye className="mr-2 h-4 w-4" />,
                        onClick: () => handleView(reservation)
                      },
                      {
                        label: 'Edit',
                        icon: <Edit className="mr-2 h-4 w-4" />,
                        onClick: () => handleEdit(reservation)
                      },
                      {
                        label: 'Delete',
                        icon: <Trash2 className="mr-2 h-4 w-4" />,
                        onClick: () => handleDelete(reservation),
                        className: 'text-red-600'
                      }
                    ]}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
      ) : (
        <div className="space-y-4">
         
          {filteredAndSortedReservations.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white   ">
              <div className="text-center py-8">
                <p className="text-slate-500 ">
                  No reservations found matching the current filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedReservations.map((reservation) => (
                <div key={reservation.id} className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
                  <div className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={reservation.user} size="lg" />
                        <div>
                          <div className="text-base font-medium text-slate-900 ">
                            {reservation.user.name}
                          </div>
                          <div className="text-sm text-slate-500 ">{reservation.user.email}</div>
                        </div>
                      </div>
                      <StatusBadge status={reservation.status} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 ">
                          {format(new Date(reservation.reservationDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 ">{reservation.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 ">{reservation.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PaymentMethodIcon method={reservation.paymentMethod} />
                        <span className="text-slate-600  capitalize">
                          {reservation.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 ">
                      <div className="text-lg font-semibold text-secondary ">
                        {formatCurrency(reservation.amount, reservation.currency)}
                      </div>
                      <DropdownMenu
                        reservationId={reservation.id}
                        trigger={<MoreHorizontal className="h-4 w-4" />}
                        items={[
                          {
                            label: 'View',
                            icon: <Eye className="mr-2 h-4 w-4" />,
                            onClick: () => handleView(reservation)
                          },
                          {
                            label: 'Edit',
                            icon: <Edit className="mr-2 h-4 w-4" />,
                            onClick: () => handleEdit(reservation)
                          },
                          {
                            label: 'Delete',
                            icon: <Trash2 className="mr-2 h-4 w-4" />,
                            onClick: () => handleDelete(reservation),
                            className: 'text-red-600 '
                          }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationsTable;