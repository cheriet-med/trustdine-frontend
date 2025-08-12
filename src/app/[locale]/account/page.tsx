"use client";

import { useSession} from "next-auth/react";
import DashboardAdmin from "@/components/admin-dashboard/dashboard";
import DashboardUser from "@/components/user-dashboard/dashboarduser";
import DashboardPartner from "@/components/partner-dashboard/partner-dashboard";


export default function ProtectedPage() {
  const { data: session, status } = useSession({ required: true });
console.log(session?.user)
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
  return session?.user?.is_superuser? <DashboardAdmin/> :  ( session?.user?.is_staff? <DashboardPartner/>:(session?.user?.full_name == "" ? <DashboardUser/>: "Comming soon ..."))
}