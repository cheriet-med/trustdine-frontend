'use client'
import { LuBadgeDollarSign } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
import { GiConfirmed } from "react-icons/gi";
import { TbCalendarCancel } from "react-icons/tb";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import ReservationsTable from "./reservationsTableAdmin";
import NewsletterTable from "@/components/Data/newsletterTable";
import ReservationChartAdmin from "./reservationChartAdmin";
import UsersTable from "./tableUsersAdmin";
import ReportReviews from "./reposrtReviewsTableAdmin";
import Verification from "./tableVerificationAdmin";
export default function AnalyticsAdmin() {


  return (
    <>
    <ReservationChartAdmin/>
    <ReservationsTable/><Verification/>
    <div className="flex gap-2 flex-wrap md:flex-nowrap">
      <UsersTable/>
  <ReportReviews/>
    </div>
    
    </>
  );
}