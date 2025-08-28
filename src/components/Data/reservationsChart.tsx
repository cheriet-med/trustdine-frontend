'use client'
import { LuBadgeDollarSign } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
import { GiConfirmed } from "react-icons/gi";
import { TbCalendarCancel } from "react-icons/tb";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import useFetchAllBookings from "@/components/requests/fetchAllBookings";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
type SeriesData = [number, number][];

interface Booking {
  id: number;
  status: string;
  created_at: string;
  total_price: string | null;
  category: string | null;
  restaurat_check_in_date: string | null;
  check_in_date: string | null;
}

export default function ReservationChart() {
  const [revenueSeries, setRevenueSeries] = useState<{data: SeriesData}[]>([]);
  const [bookingSeries, setBookingSeries] = useState<{data: SeriesData}[]>([]);

  const { AllBookings } = useFetchAllBookings();


  // Calculate metrics from booking data
  const calculateMetrics = (bookings: Booking[]) => {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Total revenue today
    const todayRevenue = bookings
      .filter(booking => {
        const bookingDate = new Date(booking.created_at).toDateString();
        return bookingDate === today && booking.total_price;
      })
      .reduce((sum, booking) => sum + parseFloat(booking.total_price || '0'), 0);

    // Total revenue this month
    const monthRevenue = bookings
      .filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getMonth() === currentMonth && 
               bookingDate.getFullYear() === currentYear && 
               booking.total_price;
      })
      .reduce((sum, booking) => sum + parseFloat(booking.total_price || '0'), 0);

    // Total revenue this year
    const yearRevenue = bookings
      .filter(booking => {
        const bookingDate = new Date(booking.created_at);
        return bookingDate.getFullYear() === currentYear && booking.total_price;
      })
      .reduce((sum, booking) => sum + parseFloat(booking.total_price || '0'), 0);

    // Completed bookings count
    const completedBookings = bookings.filter(booking => booking.status === 'Completed').length;

    return {
      todayRevenue: todayRevenue.toFixed(2),
      monthRevenue: monthRevenue.toFixed(2),
      yearRevenue: yearRevenue.toFixed(2),
      completedBookings
    };
  };

  useEffect(() => {
    if (AllBookings && AllBookings.length > 0) {
      // Process booking data for charts
      const processBookingData = (bookings: Booking[]) => {
        // Group bookings by date
        const dailyData: { [key: string]: { revenue: number; count: number } } = {};
        
        bookings.forEach(booking => {
          // Use check_in_date for hotels, restaurat_check_in_date for restaurants, or created_at as fallback
          let dateToUse = booking.check_in_date || booking.restaurat_check_in_date || booking.created_at;
          
          // Parse the date string
          let bookingDate: Date;
          if (dateToUse.includes('T')) {
            bookingDate = new Date(dateToUse);
          } else {
            // Handle "August 24th 2025" format
            bookingDate = new Date(dateToUse);
          }
          
          const dateKey = bookingDate.toDateString();
          
          if (!dailyData[dateKey]) {
            dailyData[dateKey] = { revenue: 0, count: 0 };
          }
          
          dailyData[dateKey].count += 1;
          if (booking.total_price) {
            dailyData[dateKey].revenue += parseFloat(booking.total_price);
          }
        });

        // Convert to chart data format
        const revenueData: SeriesData = [];
        const bookingData: SeriesData = [];

        Object.entries(dailyData)
          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
          .forEach(([date, data]) => {
            const timestamp = new Date(date).getTime();
            revenueData.push([timestamp, data.revenue]);
            bookingData.push([timestamp, data.count]);
          });

        return { revenueData, bookingData };
      };

      const { revenueData, bookingData } = processBookingData(AllBookings);
      setRevenueSeries([{ data: revenueData }]);
      setBookingSeries([{ data: bookingData }]);
    }
  }, [AllBookings]);

  const metrics = AllBookings ? calculateMetrics(AllBookings) : {
    todayRevenue: '0.00',
    monthRevenue: '0.00',
    yearRevenue: '0.00',
    completedBookings: 0
  };

  const options1: ApexOptions = {
    chart: {
      id: "chart2",
      type: "area",
      height: 230,
      foreColor: "#ccc",
      toolbar: {
        autoSelected: "pan",
        show: false
      }
    },
    colors: ["#00BAEC"],
    stroke: {
      width: 3
    },
    grid: {
      borderColor: "#555",
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0
      }
    },
    markers: {
      size: 5,
      colors: ["#000524"],
      strokeWidth: 3
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function(val) {
          return "$" + val.toFixed(2);
        }
      }
    },
    xaxis: {
      type: "datetime"
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      labels: {
        formatter: function(val) {
          return "$" + val.toFixed(0);
        }
      }
    }
  };

  const options2: ApexOptions = {
    chart: {
      id: "chart1",
      height: 130,
      type: "bar",
      foreColor: "#ccc",
      brush: {
        target: "chart2",
        enabled: true
      },
      selection: {
        enabled: true,
        fill: {
          color: "#fff",
          opacity: 0.4
        }
      }
    },
    colors: ["#FF0080"],
    stroke: {
      width: 2
    },
    grid: {
      borderColor: "#444"
    },
    markers: {
      size: 0
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function(val) {
          return val + " bookings";
        }
      }
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      tickAmount: 2
    }
  };

  return (
    <div className="mx-2 lg:mx-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue Today</p>
              <p className="text-2xl font-medium text-gray-900">${metrics.todayRevenue}</p>
            </div>
            <LuBadgeDollarSign size={32} className="text-accent"/>
          </div>
          <div className="mt-1 flex gap-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <p className="flex gap-2 text-xs">
              <span className="font-medium"> New </span>
              <span className="text-gray-500"> Daily revenue </span>
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl font-medium text-gray-900">{AllBookings?.length || 0}</p>
            </div>
           <LuCalendarDays size={32} className="text-accent"/>
          </div>
          <div className="mt-1 flex gap-1 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <p className="flex gap-2 text-xs">
              <span className="font-medium"> {metrics.completedBookings} </span>
              <span className="text-gray-500"> Completed </span>
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue This Month</p>
              <p className="text-2xl font-medium text-gray-900">${metrics.monthRevenue}</p>
            </div>
           <GiConfirmed size={32} className="text-accent"/>
          </div>
          <div className="mt-1 flex gap-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <p className="flex gap-2 text-xs">
              <span className="font-medium"> Monthly </span>
              <span className="text-gray-500"> Revenue total </span>
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue This Year</p>
              <p className="text-2xl font-medium text-gray-900">${metrics.yearRevenue}</p>
            </div>
           <TbCalendarCancel size={32} className="text-accent"/>
          </div>
          <div className="mt-1 flex gap-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <p className="flex gap-2 text-xs">
              <span className="font-medium"> Yearly </span>
              <span className="text-gray-500"> Revenue total </span>
            </p>
          </div>
        </article>
      </div>

      {/* Charts section */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <p className="font-playfair text-center p-6">Daily Revenue and Booking Trends</p>
        
        {/* Revenue Chart */}
        <div className="px-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Revenue</h3>
          <div id="chart-area">
            {revenueSeries.length > 0 && (
              <Chart 
                options={options1} 
                series={revenueSeries} 
                type="area" 
                height={300} 
              />
            )}
          </div>
        </div>

        {/* Booking Count Chart */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Bookings</h3>
          <div id="chart-bar" className="mt-4">
            {bookingSeries.length > 0 && (
              <Chart 
                options={options2} 
                series={bookingSeries} 
                type="bar" 
                height={300} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}