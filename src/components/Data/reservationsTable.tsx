'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import useFetchAllBookings from '@/components/requests/fetchAllBookings';
import useFetchAllUser from '@/components/requests/fetchAllUsers';
import PrivacyDialog from '@/components/Data/privacyDialog';
import { RiCloseLargeLine } from "react-icons/ri";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
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
  title: string;
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
  image:string;
  category:string,
  total_guests:string,
  room_quantity:string,
  cancellation_policy:string,
}

export type SortField = keyof Reservation | 'user.name' | 'user.title';
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


const ReservationsTable = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
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
  const { data: session, status } = useSession({ required: true });
  const { AllBookings, mutate} = useFetchAllBookings();


  const Owner = useMemo(() => {
    return AllBookings.filter((user) => user.user_owner === session?.user?.id);
  }, [AllBookings, session?.user?.id]);

  const { AllUsers } = useFetchAllUser();


 useEffect(() => {
    if (Owner && AllUsers) {
      const transformed = Owner.map((b: any) => {
        const user = AllUsers.find((u: any) => u.id === b.user);

        return {
          id: String(b.id),
          user: {
            id: String(user?.id || "unknown"),
            name: user?.full_name || "Unknown User",
            title: user?.title || "",
            profileImage: user?.profile_image || "",
          },
          reservationDate: new Date(
            b.restaurat_check_in_date || b.check_in_date 
          ),
           reservationDateEnd: new Date(b.check_out_date
          ),
           reservationDateTime: new Date(b.restaurat_check_in_time
          ),
          service: b.name || "N/A",
          destination: b.location || "N/A",
          paymentMethod: b.payment_method?.toLowerCase().includes("credit, cash")
            ? "credit_card"
            : b.payment_method?.toLowerCase().includes("paypal")
            ? "paypal"
            : b.payment_method?.toLowerCase().includes("bank")
            ? "bank_transfer"
            : "cash",
          status: b.status ? b.status.toLowerCase() : "pending",
          amount: b.total_price ? parseFloat(b.total_price) : 0,
          currency: "USD", // you can replace this if your API provides currency
          createdAt: new Date(b.created_at),
          total_guests:b.total_guests,
          adults:b.adults,
          children:b.children,
          room_quantity:b.room_quantity,
          image:b.image || "",
          cancellation_policy:b.cancellation_policy,
          category:b.category

        } as Reservation;
      });

      setReservations(transformed);
    }
  }, [Owner, AllUsers]);




const [isOpen, setIsOpen] = useState(false);
const [isOpenupdate, setIsOpenUpdate] = useState(false);
const [isOpendelete, setIsOpenDelete] = useState(false);
const dialogRef = useRef<HTMLDivElement>(null); // Ref for the dialog container
 const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updateReservation, setUpdateReservation] = useState<Reservation | null>(null);
  const [deleteReservation, setDeleteReservation] = useState<Reservation | null>(null);

 const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close the dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close the dialog
      }
    };

    // Add event listener when the dialog is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when `isOpen` changes





  // Event handlers
  const handleEdit = (reservation: Reservation) => {
  setUpdateReservation(reservation);
  setIsOpenUpdate(true);
};

  const handleDelete = (reservation: Reservation) => {
  setDeleteReservation(reservation);
  setIsOpenDelete(true);
  };


  const handleDeleteConfirm = async (id:any) => {
   

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}orderid/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
      
      });

         // Trigger SWR revalidation to refresh the data
      if (mutate) {
        await mutate();
      }
      

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something wrong please try again");
    }
  setIsOpenDelete(false);
  };


  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsOpen(true);
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
        reservation.user.title.toLowerCase().includes(filters.search.toLowerCase()) ||
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
      ['User', 'title', 'Date', 'Service', 'Destination', 'Amount', 'Currency', 'Status', 'Payment Method'].join(','),
      ...filteredAndSortedReservations.map(reservation => [
        reservation.user.name,
        reservation.user.title,
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
  const UserAvatar = ({ user, size = "sm" }: { user: { name: string; title: string; profileImage: string }; size?: "sm" | "md" | "lg" }) => {
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
            src={`${process.env.NEXT_PUBLIC_IMAGE}/${user.profileImage}`}
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
          className="relative flex w-full cursor-default select-none hover:bg-highlights hover:text-white items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
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
                      <div className="text-sm text-slate-500">{reservation.user.title}</div>
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
                <p className='text-secondary capitalize text-sm font-semibold'>{reservation.status}</p>
                 {/**<StatusBadge status={reservation.status} /> */} 
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
                          <div className="text-base font-medium text-slate-900 font-playfair">
                            {reservation.user.name}
                          </div>
                          <div className="text-sm text-slate-500 ">{reservation.user.title}</div>
                        </div>
                      </div>
                    <p className='text-secondary capitalize text-sm font-semibold'>{reservation.status}</p>
                    {/** <StatusBadge status={reservation.status} /> */} 
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



      {/* Edit Dialog */}
{isOpen && selectedReservation && (
  <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
     
    <div
      ref={dialogRef}
      className="bg-highlights rounded-lg shadow-lg p-6 max-w-lg w-full relative space-y-4"
    >
      {/* Close Button */}
      <RiCloseLargeLine
        size={24}
        className="absolute top-2 right-2 text-white hover:text-gray-300 cursor-pointer"
        onClick={() => setIsOpen(false)}
      />

      {/* Content */}
      <h1 className="text-xl font-semibold font-playfair text-white">
        Reservation Details
      </h1>


<div className='space-y-2'>
 
<Image
  alt="Property"
  src={`${process.env.NEXT_PUBLIC_IMAGE}/${selectedReservation.image}`}
  width={800} // set an appropriate width
  height={320} // set an appropriate height
  className="h-80 w-full rounded-md object-cover"
/>
<div className='flex justify-between flex-wrap gap-2'>
   <p className="text-sm text-white">
        Reservation ID: {selectedReservation.id}
      </p>  
      <p className="text-sm text-white">
        Location: {selectedReservation.destination}
      </p>
</div>
 <hr />

      <p className="text-sm text-white">
        Service Name: {selectedReservation.service}
      </p>

<div className='flex  flex-wrap gap-6'>

  <div className='space-y-2'>
     <p className="text-sm text-white">Amount: {selectedReservation.amount}$</p>
      <p className="text-sm text-white">Category:{selectedReservation.category}</p>
  </div>   
    

 <div className='space-y-2'>
   <p className="text-sm text-white">Total guests:{selectedReservation.total_guests}</p>
 <p className="text-sm text-white">Room quantity:{selectedReservation.room_quantity}</p>
</div> 
</div>
 
<hr />

 <div>
  <p className="text-sm text-white font-bold">Cancellation policy:</p>
  <div 
   className="text-white text-sm leading-relaxed prose-inherit"
   dangerouslySetInnerHTML={{ __html: selectedReservation.cancellation_policy || '' }}
/>
 </div>


</div>
      
    </div>
  </div>
)}


 {/* Edit Dialog */}
{isOpenupdate && updateReservation && (
  <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
    <div
      ref={dialogRef}
      className="bg-highlights rounded-lg shadow-lg p-6 max-w-lg w-full relative space-y-4"
    >
      {/* Close Button */}
      <RiCloseLargeLine
        size={24}
        className="absolute top-2 right-2 text-white hover:text-gray-300 cursor-pointer"
        onClick={() => setIsOpenUpdate(false)}
      />

      {/* Content */}
      <h1 className="text-xl font-semibold font-playfair text-white">
        Reservation view
      </h1>

    </div>
  </div>
)}


 {/* Edit Dialog */}
{isOpendelete && deleteReservation && (
  <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
    <div
      ref={dialogRef}
      className="bg-highlights rounded-lg shadow-lg p-6 max-w-lg w-full relative space-y-4"
    >
      {/* Close Button */}
      <RiCloseLargeLine
        size={24}
        className="absolute top-2 right-2 text-white hover:text-gray-300 cursor-pointer"
        onClick={() => setIsOpenDelete(false)}
      />

      {/* Content */}
      <h1 className="text-xl font-semibold font-playfair text-white">
        Reservation Delete
      </h1>
    <p className='text-sm text-white'>Are you sure you want to delete this reservation? This action cannot be undone.</p>
   

    <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-3 py-1 border border-gray-300 rounded hover:bg-accent transition-colors disabled:opacity-50 rounded-lg text-white"
                onClick={() => setIsOpenDelete(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-secondary text-white rounded hover:bg-accent transition-colors disabled:bg-accent disabled:cursor-not-allowed rounded-lg"
                onClick={()=>handleDeleteConfirm(deleteReservation.id)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : 'Delete'}
              </button>
            </div> 

            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            </div>
  </div>
)}

    </div>
  );
};

export default ReservationsTable;







/**
 *  {
                            label: 'Edit',
                            icon: <Edit className="mr-2 h-4 w-4" />,
                            onClick: () => handleEdit(reservation)
                          },
 */