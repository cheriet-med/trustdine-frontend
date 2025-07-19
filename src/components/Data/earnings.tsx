'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const EarningChart: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'rangeArea',
      animations: {
        speed: 500,
      },
      toolbar: {
        show: true,
      },
    },
    colors: ['#d4526e', '#33b2df', '#d4526e', '#33b2df'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: [0.24, 0.24, 1, 1],
    },
    forecastDataPoints: {
      count: 2,
    },
    stroke: {
      curve: 'straight',
      width: [0, 0, 2, 2],
    },
    legend: {
      show: true,
      customLegendItems: ['Reservations', 'Revenues'],
      inverseOrder: true,
      position: 'top',
    },
    title: {
      text: 'Revenues & Reservations',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
      },
    },
    markers: {
      hover: {
        sizeOffset: 5,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      type: 'category',
    },
  };

  const series = [
    {
      type: 'rangeArea',
      name: 'Team B Range',
      data: [
        { x: 'Jan', y: [1100, 1900] },
        { x: 'Feb', y: [1200, 1800] },
        { x: 'Mar', y: [900, 2900] },
        { x: 'Apr', y: [1400, 2700] },
        { x: 'May', y: [2600, 3900] },
        { x: 'Jun', y: [500, 1700] },
        { x: 'Jul', y: [1900, 2300] },
        { x: 'Aug', y: [1000, 1500] },
      ],
    },
    {
      type: 'rangeArea',
      name: 'Team A Range',
      data: [
        { x: 'Jan', y: [3100, 3400] },
        { x: 'Feb', y: [4200, 5200] },
        { x: 'Mar', y: [3900, 4900] },
        { x: 'Apr', y: [3400, 3900] },
        { x: 'May', y: [5100, 5900] },
        { x: 'Jun', y: [5400, 6700] },
        { x: 'Jul', y: [4300, 4600] },
        { x: 'Aug', y: [2100, 2900] },
      ],
    },
    {
      type: 'line',
      name: 'Team B Median',
      data: [
        { x: 'Jan', y: 1500 },
        { x: 'Feb', y: 1700 },
        { x: 'Mar', y: 1900 },
        { x: 'Apr', y: 2200 },
        { x: 'May', y: 3000 },
        { x: 'Jun', y: 1000 },
        { x: 'Jul', y: 2100 },
        { x: 'Aug', y: 1200 },
        { x: 'Sep', y: 1800 },
        { x: 'Oct', y: 2000 },
      ],
    },
    {
      type: 'line',
      name: 'Team A Median',
      data: [
        { x: 'Jan', y: 3300 },
        { x: 'Feb', y: 4900 },
        { x: 'Mar', y: 4300 },
        { x: 'Apr', y: 3700 },
        { x: 'May', y: 5500 },
        { x: 'Jun', y: 5900 },
        { x: 'Jul', y: 4500 },
        { x: 'Aug', y: 2400 },
        { x: 'Sep', y: 2100 },
        { x: 'Oct', y: 1500 },
      ],
    },
  ];

  return (
    <>
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 m-6'>
    <div className="bg-white rounded-xl lg:col-span-2 p-2 lg:p-6 shadow-sm ">
      <p className=" p-1 lg:p-2 text-2xl font-playfair font-semibold">You've made $1852.65 this month</p>
      <Chart options={options} series={series} type="rangeArea" height={350} />
    </div>



     {/* Year-to-date summary section */}
      <div className="p-12 bg-white rounded-xl lg:col-span-1 shadow-sm ">
        <h3 className="text-xl font-semibold mb-2 font-playfair ">Year-to-date summary</h3>
        <p className="text-sm text-gray-500 mb-4">Jan 1 – Jul 17, 2025</p>
        
        <div className="space-y-3  font-montserrat text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Gross earnings</span>
            <span>$5596.00</span>
          </div>
          <div className="flex justify-between">
            <span>Adjustments</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Alcohol service fee</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between">
            <span>Tax withheld</span>
            <span>$754.72</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200 font-semibold font-playfair text-lg ">
            <span>Total (USD)</span>
            <span>$6350.72</span>
          </div>
        </div>
      </div>

</div>
  <div className="p-6 bg-white rounded-xl mx-6  shadow-sm " >
<h1 className='text-xl font-playfair mb-4 font-semibold'>Paid</h1>
<p className='text-gray-600 text-sm'>
Payouts are typically sent around 24 hours after a guest checks in or once a service is completed, though the exact timing can vary depending on different factors. Your payout is calculated by taking your nightly rate plus any optional charges, like a cleaning fee, and subtracting the host service fee. For monthly stays, payouts are released in monthly installments.
<br />
If a guest cancels, they’re refunded based on your cancellation policy, unless exceptions apply. If you cancel the reservation yourself, you won’t be paid and may face cancellation fees or other consequences. In some cases, payouts may be delayed if you haven’t submitted required taxpayer information.
<br />
If you work with a co-host, you can share payouts with them through co-host payout proposals. These can be reviewed or canceled if changes are needed before confirmation. You can also choose to stop co-host payouts at any time, but your co-host won’t be paid for future bookings. When payouts are limited, co-hosts are paid first and the host receives what’s left. Note that co-host payouts may not be available in all regions, and specific programs like Resident Hosting may have further restrictions.
<br />
Additional details are available on how to set up or update your payout method, manage payout preferences, resolve payout issues, and handle taxes or donations.

</p>

  </div>
</>
  );
};

export default EarningChart;