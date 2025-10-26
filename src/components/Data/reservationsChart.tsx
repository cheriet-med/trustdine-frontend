'use client'
import { LuBadgeDollarSign } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
import { GiConfirmed } from "react-icons/gi";
import { TbCalendarCancel } from "react-icons/tb";
import dynamic from 'next/dynamic';
import { useEffect, useState, useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import useFetchAllBookings from "@/components/requests/fetchAllBookings";
import { useSession } from "next-auth/react";
import moment from "moment";

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

// Skeleton Components
const MetricCardSkeleton = () => (
  <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
    <div className="mt-4 flex gap-1">
      <div className="w-4 h-4 bg-gray-200 rounded"></div>
      <div className="flex gap-2 flex-1">
        <div className="h-3 bg-gray-200 rounded w-12"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </article>
);

const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div 
      className="bg-gray-200 rounded-lg" 
      style={{ height: `${height}px` }}
    ></div>
  </div>
);

export default function ReservationChart() {
  const [revenueSeries, setRevenueSeries] = useState<{ name: string; data: SeriesData }[]>([
    { name: "Revenue", data: [] }
  ]);
  const [bookingSeries, setBookingSeries] = useState<{ name: string; data: SeriesData }[]>([
    { name: "Bookings", data: [] }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession({ required: true });
  const { AllBookings } = useFetchAllBookings();


  const Owner = useMemo(() => {
    return AllBookings.filter((user) => user.user_owner === session?.user?.id);
  }, [AllBookings, session?.user?.id]);

  // Revenue totals
const todayBookings = Owner.filter(item =>
  item.created_at && moment(item.created_at).isSame(moment(), "day")
);

const totalPerDay =
  todayBookings.length > 0
    ? todayBookings.reduce((sum, r) => sum + Number(r.total_price || 0), 0)
    : 0;
    

const month = Owner.filter(item =>
  item.created_at &&
  moment(item.created_at, ["MMMM Do YYYY", moment.ISO_8601], true).isSame(moment(), "month")
);

const totalPerMonth =
  month.length > 0 ? month.reduce((sum, r) => sum + Number(r.total_price), 0) : 0;


  const year = Owner.filter(item =>
    item.created_at && moment(item.created_at, ["MMMM Do YYYY", moment.ISO_8601]).isSame(moment(), "year")
  );
  const totalPerYear = year.length > 0 ? year.reduce((sum, r) => sum + +r.total_price, 0) : 0;

  // Calculate metrics
  const calculateMetrics = (bookings: Booking[]) => {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const todayRevenue = bookings
      .filter(b => new Date(b.created_at).toDateString() === today && b.total_price)
      .reduce((sum, b) => sum + parseFloat(b.total_price || '0'), 0);

    const monthRevenue = bookings
      .filter(b => {
        const d = new Date(b.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && b.total_price;
      })
      .reduce((sum, b) => sum + parseFloat(b.total_price || '0'), 0);

    const yearRevenue = bookings
      .filter(b => new Date(b.created_at).getFullYear() === currentYear && b.total_price)
      .reduce((sum, b) => sum + parseFloat(b.total_price || '0'), 0);

    const completedBookings = bookings.filter(b => b.status === 'Completed').length;

    return {
      todayRevenue: todayRevenue.toFixed(2),
      monthRevenue: monthRevenue.toFixed(2),
      yearRevenue: yearRevenue.toFixed(2),
      completedBookings
    };
  };

  useEffect(() => {
    if (status !== 'loading' && AllBookings !== undefined) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [status, AllBookings]);

  useEffect(() => {
    if (Owner && Owner.length > 0) {
      const processBookingData = (bookings: Booking[]) => {
        const dailyData: { [key: string]: { revenue: number; count: number } } = {};

        bookings.forEach(b => {
          let dateToUse = b.check_in_date || b.restaurat_check_in_date || b.created_at;
          let bookingDate = moment(dateToUse, ["MMMM Do YYYY", moment.ISO_8601]).toDate();
          const dateKey = bookingDate.toDateString();

          if (!dailyData[dateKey]) {
            dailyData[dateKey] = { revenue: 0, count: 0 };
          }
          dailyData[dateKey].count += 1;
          if (b.total_price) dailyData[dateKey].revenue += parseFloat(b.total_price);
        });

        const revenueData: SeriesData = [];
        const bookingData: SeriesData = [];

        Object.entries(dailyData)
          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
          .forEach(([date, data]) => {
            const ts = new Date(date).getTime();
            revenueData.push([ts, data.revenue]);
            bookingData.push([ts, data.count]);
          });

        return { revenueData, bookingData };
      };

      const { revenueData, bookingData } = processBookingData(Owner);
      setRevenueSeries([{ name: "Revenue", data: revenueData }]);
      setBookingSeries([{ name: "Bookings", data: bookingData }]);
    }
  }, [Owner]);

  const metrics = Owner ? calculateMetrics(Owner) : {
    todayRevenue: '0.00',
    monthRevenue: '0.00',
    yearRevenue: '0.00',
    completedBookings: 0
  };

  const options1: ApexOptions = {
    chart: {
      id: "chart1",
      type: "area",
      foreColor: "#ccc",
      toolbar: { autoSelected: "pan", show: false }
    },
    noData: {
      text: "No Revenue Data",
      align: "center",
      verticalAlign: "middle",
      style: { color: "#888", fontSize: "16px" }
    },
    colors: ["#00BAEC"],
    stroke: { curve: "smooth", width: 2 },
    grid: { borderColor: "#555", yaxis: { lines: { show: false } } },
    dataLabels: { enabled: false },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] }
    },
    markers: { size: 5, colors: ["#000524"], strokeWidth: 3 },
    tooltip: { theme: "dark", y: { formatter: val => "$" + val.toFixed(2) } },
    xaxis: { type: "datetime" },
    yaxis: { min: 0, tickAmount: 4, labels: { formatter: val => "$" + val.toFixed(0) } }
  };

  const options2: ApexOptions = {
    chart: {
      id: "chart2",
      type: "bar",
      foreColor: "#ccc",
      brush: { target: "chart1", enabled: true },
      selection: { enabled: true, fill: { color: "#fff", opacity: 0.4 } }
    },
    noData: {
      text: "No Booking Data",
      align: "center",
      verticalAlign: "middle",
      style: { color: "#888", fontSize: "16px" }
    },
    colors: ["#FF0080"],
    stroke: { width: 2 },
    grid: { borderColor: "#444" },
    markers: { size: 0 },
    tooltip: { theme: "dark", y: { formatter: val => val + " bookings" } },
    xaxis: { type: "datetime", tooltip: { enabled: false } },
    yaxis: { tickAmount: 2 }
  };

  return (
    <div className="mx-2 lg:mx-6 mt-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          <>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </>
        ) : (
          <>
            <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue Today</p>
                  <p className="text-2xl font-medium text-gray-900">${totalPerDay.toFixed(2)}</p>
                </div>
                <LuBadgeDollarSign size={32} className="text-accent"/>
              </div>
            </article>
            <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Reservations</p>
                  <p className="text-2xl font-medium text-gray-900">{Owner?.length || 0}</p>
                </div>
                <LuCalendarDays size={32} className="text-accent"/>
              </div>
            </article>
            <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue This Month</p>
                  <p className="text-2xl font-medium text-gray-900">${totalPerMonth.toFixed(2)}</p>
                </div>
                <GiConfirmed size={32} className="text-accent"/>
              </div>
            </article>
            <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue This Year</p>
                  <p className="text-2xl font-medium text-gray-900">${totalPerYear.toFixed(2)}</p>
                </div>
                <TbCalendarCancel size={32} className="text-accent"/>
              </div>
            </article>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <ChartSkeleton height={300} />
            <div className="mt-8"><ChartSkeleton height={300} /></div>
          </div>
        ) : (
          <>
            <p className="font-playfair text-center p-6">Daily Revenue and Booking Trends</p>
            <div className="px-6">
              <Chart options={options1} series={revenueSeries} type="area" height={300} />
            </div>
            <div className="px-6 pb-6">
              <Chart options={options2} series={bookingSeries} type="bar" height={300} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
