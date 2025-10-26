'use client';

import React, { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { TiLocation } from "react-icons/ti";

export default function IpInfo() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}get-ip-info/`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching IP info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIpInfo();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-wrap gap-4 text-white font-medium justify-center pt-4 items-center">

      <div className="flex gap-1 items-center">
        <TiLocation size={22} />
        <p>{data.country_name}</p>
      </div>
      
      <p>IP: {data.ip}</p>
    </div>
  );
}
