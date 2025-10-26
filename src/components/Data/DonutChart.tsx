"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import React from "react";

// Dynamically import so it doesn’t break SSR
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DonutChartProps {
  series: number[];
  labels: string[];
  title:string
}

const DonutChart: React.FC<DonutChartProps> = ({ series, labels, title }) => {
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#785964", "#82A7A6", "#9ED0E6", "#B796AC", "#000000"," #2D628C"],
    labels,
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10,
        },
        donut: {
          size: "65%",
          background: "transparent",
          labels: {
            show: false,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              offsetY: -10,
              formatter: (val: string) => val,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              offsetY: 16,
              formatter: (val: string) => val,
            },
            total: {
              show: false,
              showAlways: false,
              label: "Total",
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#373d3f",
              formatter: (w) => {
                return w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
              },
            },
          },
        },
      },
    },
  };

  return (
    <div>
  <div className=" flex flex-col gap-4 justify-center items-center hidden md:flex">
        <p className="font-playfair text-gray-700">{title}</p>
      <Chart options={options} series={series} type="donut" width="380" />
    </div>
         <div className=" flex flex-col gap-4 justify-center items-center md:hidden">
        <p className="font-playfair text-gray-700">{title}</p>
      <Chart options={options} series={series} type="donut" width="300" />
    </div>
    </div>
   
  );
};

export default DonutChart;
