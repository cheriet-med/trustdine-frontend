"use client";

import { useSession} from "next-auth/react";
import DashboardAdmin from "@/components/admin-dashboard/dashboard";
import MessagesUser from "@/components/user-dashboard/messagesPage";
import EditHotelListingDashboard from "@/components/partner-dashboard/edit-hotel-listing";

export default function ProtectedPage() {
  const { data: session, status } = useSession({ required: true });

  if (status === "loading") {
    return ( <div className="h-screen">
      <div className="grid lg:grid-cols-4 gap-10 mt-6">
      <div className=" lg:col-span-1 h-screen bg-gray-200 animate-pulse">  
      </div>
      <div className="lg:col-span-3 h-screen bg-gray-200 animate-pulse">
      </div>
    </div>  
    </div>);
  }
  return session?.user?.is_superuser? <DashboardAdmin/> :  ( session?.user?.is_staff? <EditHotelListingDashboard/>:<MessagesUser/>)
}