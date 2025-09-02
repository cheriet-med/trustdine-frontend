'use client'

import { GoPencil } from "react-icons/go";
import { MdOutlineSecurity } from "react-icons/md";
import useFetchUser from "@/components/requests/fetchUser";
import EditUsername from "@/components/requests/editeUsername";
import EditPhone from "@/components/requests/editePhoneNumber";
import EditWebsite from "@/components/requests/editeWebsite";
import EditAddress from "@/components/requests/editeAddress";
import IdentityVerification from "@/components/requests/identityFerivication";
import { useState } from "react";
import { useSession } from 'next-auth/react';
import Link from "next/link";

interface ProfileData {
  id?: number;
  name?: string;
  full_name?: string;
  username?: string;
  title?: string;
  category?: string;
  amenities?: string;
  email?: string;
  location?: string;
  profile_image?: string;
  identity_verified?: boolean;
  about?: any;
  website?: string;
  joined?: string;
  address_line_1?: string;
  phoneNumber?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  latitude?: string;
  longtitude?: string;
  // New fields added below
  want_to_go?: string;
  time_spend?: string;
  born?: string;
  pets?: string;
  obsessed?: string;
  language?: string;

}
interface PersonalInfo {
  legalName: string;
  preferredName: string;
  email: string;
  phone: string;
  identityVerification: string;
  residentialAddress: string;
  mailingAddress: string;
  emergencyContact: string;
}

export default function PersonalInformation() {


  const [emailsend, setEmailsend] = useState(false);
  const [emailsenderror, setEmailsenderror] = useState(false);
   const [passwordsend, setPasswordsend] = useState(false);
  const [passwordsenderror, setPasswordsenderror] = useState(false);
 const { data: session, status } = useSession({ required: true });
   const userId = session?.user?.id;
  const { Users,  isLoading, mutate } = useFetchUser(userId);

 // Replace with actual userId

  // Use Users data directly instead of profileData state
  // Users is now a single object, not an array
  const profileData: ProfileData = Users || {};

  const resetEmail = async () => {
   
          try {
            const neo = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_email/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email:profileData.email,
              }),
            });
            
            if (!neo.ok) {
              throw new Error("Network response was not ok");
             
            }
           
            setEmailsend(true);
           }
           catch {
             setEmailsenderror(true);
          }
          }

  const resetPassword = async () => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}auth/users/reset_password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
                email:profileData.email,
              }),
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setPasswordsend(true);
    } catch {
      setPasswordsenderror(true);
    }
  };



  return (
    <div className=" mx-1 lg:mx-6 bg-white p-6 border border-gray-200 shadow-sm rounded-xl font-montserrat mt-6">
      <div className="px-4 sm:px-0">
        
        <h2 className="text-xl font-medium text-gray-900 mt-4 mb-6 font-playfair">Personal information</h2>
      </div>

      <div className="mt-6 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          {/* Legal Name */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Username</dt>
              

            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
             {profileData.username == null ? "Not Provided" : <span>{profileData.username}</span>} 
              <EditUsername
  initialFullName={profileData.username}
  infoId={userId}
  onUpdateSuccess={(newFullName, ) => {
    console.log('Updated:', newFullName, );
  }}
  mutate={mutate}
/>
            
            </dd>
          </div>

        
          {/* Email Address */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Email address</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              <div>
                <span>{profileData.email}</span>
                   {emailsend && <p className="text-accent text-sm text-center">email send for edite email with success</p>}
            {emailsenderror && <p className="text-accent text-sm text-center">email send for edite email failed</p>}
              </div>
              
           
              <button className="text-sm font-medium text-accent hover:text-secondary flex items-center"  onClick={resetEmail}>
                <GoPencil className="h-4 w-4 mr-1" />
                Edit
              </button>
            </dd>
          </div>

  {/* Preferred First Name */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Password</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
            <div>
              <span>***********</span>
                  {passwordsend && <p className="text-accent text-sm text-center">email send for edite password with success</p>}
            {passwordsenderror && <p className="text-accent text-sm text-center">email send for edite password failed</p>}
         
</div>
              <button className="text-sm font-medium text-accent hover:text-secondary flex items-center" onClick={resetPassword}> 
                <GoPencil className="h-4 w-4 mr-1" />
               Edit
              </button>
            </dd>
          </div>


          {/* Phone Numbers */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Phone numbers</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-700">{profileData.phoneNumber}</p>
                  <p className="text-gray-500 mt-1">
                    Add a number so confirmed guests and trustdine can get in touch. You can add other numbers and choose how they're used.
                  </p>
                </div>
                             <EditPhone
  initialFullName={profileData.phoneNumber}
  infoId={userId}
  onUpdateSuccess={(newFullName, ) => {
    console.log('Updated:', newFullName, );
  }}
  mutate={mutate}
/>
              </div>
            </dd>
          </div>

          {/* Identity Verification */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Identity verification</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              <span>{profileData.identity_verified == true ? "Verified": "Unverified"}</span>
          
                  <IdentityVerification 
        initialData={{
          fullName: "",
          idNumber: "",
          documentType: 'national_id'
        }}
         infoId={userId}
         onUpdateSuccess={(newAddress) => {
    console.log('Updated address:');
  }}
        mutate={mutate}
      />
  
            </dd>
          </div>

          {/* Residential Address */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Residential address</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
          {profileData.address_line_1 == null ? "Not Provided" :   <span>{profileData.address_line_1}, {profileData.city}, {profileData.state},{profileData.postalCode}, {profileData.countryCode}</span>}
            <EditAddress
  initialAddress={{
    address_line_1: profileData.address_line_1,
    city: profileData.city,
    state: profileData.state,
    postalCode: profileData.postalCode,
    countryCode: profileData.countryCode,
  }}
  infoId={userId}
  onUpdateSuccess={() => {
    console.log('Updated address:');
  }}
  mutate={mutate}
/>
            </dd>
          </div>

   {/* Website */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Website</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              <span>{profileData.website == null ? "Not Provided" : profileData.website}</span>
                                         <EditWebsite
  initialFullName={profileData.website}
  infoId={userId}
  onUpdateSuccess={(newFullName, ) => {
    console.log('Updated:', newFullName, );
  }}
  mutate={mutate}
/>
            </dd>
          </div>

        </dl>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex gap-2 items-center mt-8 ">
<MdOutlineSecurity size={24} className="text-accent"/> 
 <h3 className="font-medium text-gray-900 font-playfair">Why isn't my info shown here?</h3>
        </div>
      
        <p className="mt-2 text-sm text-gray-500">
          We're hiding some account details to protect your identity. If you need to update this information, <Link href="/en/contact-us"><span className="underline">please contact support</span></Link> .
        </p>
      </div>
    </div>
  );
}