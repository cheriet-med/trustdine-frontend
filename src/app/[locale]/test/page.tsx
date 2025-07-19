'use client'
import { LuBadgeDollarSign } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
import { GiConfirmed } from "react-icons/gi";
import { TbCalendarCancel } from "react-icons/tb";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import ReservationsTable from "@/components/Data/reservationsTable";
import NewsletterTable from "@/components/Data/newsletterTable";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
type SeriesData = [number, number][];


export default function ReservationChart() {
const [series, setSeries] = useState<{data: SeriesData}[]>([]);

  useEffect(() => {
    // Generate data when component mounts
    const data = generateDayWiseTimeSeries(new Date("22 Apr 2017").getTime(), 115, {
      min: 30,
      max: 90
    });
    setSeries([{ data }]);
  }, []);

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
      //clipMarkers: false,
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
        //enabled: true,
        opacityFrom: 0.55,
        opacityTo: 0
      }
    },
    markers: {
      size: 5,
      colors: ["#000524"],
      //strokeColor: "#00BAEC",
      strokeWidth: 3
    },
    tooltip: {
      theme: "dark"
    },
    xaxis: {
      type: "datetime"
    },
    yaxis: {
      min: 0,
      tickAmount: 4
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
        },
        xaxis: {
          min: new Date("27 Jul 2017 10:00:00").getTime(),
          max: new Date("14 Aug 2017 10:00:00").getTime()
        }
      }
    },
    colors: ["#B796AC"],
    stroke: {
      width: 2
    },
    grid: {
      borderColor: "#444"
    },
    markers: {
      size: 0
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

  function generateDayWiseTimeSeries(baseval: number, count: number, yrange: { min: number, max: number }): SeriesData {
    let i = 0;
    const series: SeriesData = [];
    while (i < count) {
      const x = baseval;
      const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  return (
    <>
     <ReservationsTable/>
    
    <div className="mx-2 lg:mx-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-medium text-gray-900">$240.94</p>
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
              <span className="font-medium"> 67.81% </span>
              <span className="text-gray-500"> Since last week </span>
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-2xl font-medium text-gray-900">19</p>
            </div>
           <LuCalendarDays size={32} className="text-accent"/>
          </div>
          <div className="mt-1 flex gap-1 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
            <p className="flex gap-2 text-xs">
              <span className="font-medium"> 67.81% </span>
              <span className="text-gray-500"> Since last week </span>
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-medium text-gray-900">16</p>
            </div>
           <GiConfirmed size={32} className="text-accent"/>
          </div>
          <div className="mt-1 flex gap-1 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
            <p className="flex gap-2 text-xs">
              <span className="font-medium"> 67.81% </span>
              <span className="text-gray-500"> Since last week </span>
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-gray-100 bg-white p-6 w-full shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Canceled</p>
              <p className="text-2xl font-medium text-gray-900">3</p>
            </div>
           <TbCalendarCancel size={32} className="text-accent"/>
          </div>
          <div className="mt-1 flex gap-1 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
            <p className="flex gap-2 text-xs">
              <span className="font-medium"> 67.81% </span>
              <span className="text-gray-500"> Since last week </span>
            </p>
          </div>
        </article>
      </div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
 {/* Add the charts section */}
           <div className=" lg:col-span-2 rounded-xl border border-gray-100 bg-white  shadow-sm">
            <p className="font-playfair text-center p-6">The chart represents total revenue and total reservations</p>
        <div id="chart-area">
          {series.length > 0 && (
            <Chart 
              options={options1} 
              series={series} 
              type="area" 
              height={300} 
            />
          )}
        </div>
        <div id="chart-bar" className="mt-4">
          {series.length > 0 && (
            <Chart 
              options={options2} 
              series={series} 
              type="bar" 
              height={300} 
            />
          )}
        </div>
      </div>
         <NewsletterTable/>
</div>
     
    </div>

    </>
  );
}