'use client'

import { GoPencil } from "react-icons/go";
import { MdOutlineSecurity } from "react-icons/md";
import useFetchUser from "@/components/requests/fetchUser";
import EditUsername from "@/components/requests/editeUsername";
import EditPhone from "@/components/requests/editePhoneNumber";
import EditWebsite from "@/components/requests/editeWebsite";
import EditAddress from "@/components/requests/editeAddress";
import IdentityVerification from "@/components/requests/identityFerivication";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import Link from "next/link";
import { AiOutlineUserDelete } from "react-icons/ai";
import { RiCloseLargeLine } from "react-icons/ri";
import { signOut } from "next-auth/react";
import { FcPlanner } from "react-icons/fc";
import { MdOutlineVerified } from "react-icons/md";
import Image from "next/image";
import { getStripe, SUBSCRIPTION_PRICE_ID } from '@/lib/stripe-client';
import type { SubscriptionData } from '@/types/subscription';
import VerifyPhoneOTP from "../requests/verifyPhoneNumber";


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
  is_staff?:Boolean;
  is_email_verified?:Boolean;
  status?:string;
  is_phone_number_verified?:Boolean;
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

// Custom popup types
interface PopupState {
  isOpen: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface Subscription {
  cancelAtPeriodEnd: boolean;
  customerId: string;
  id: string;
  priceId: string;
  status: string;
}


export default function PersonalInformation() {
  const [emailsend, setEmailsend] = useState(false);
  const [emailsenderror, setEmailsenderror] = useState(false);
  const [emailsendvalidation, setEmailsendvalidation] = useState(false);
  const [emailsenderrorvalidation, setEmailsenderrorvalidation] = useState(false);
  const [passwordsend, setPasswordsend] = useState(false);
  const [passwordsenderror, setPasswordsenderror] = useState(false);
  const { data: session, status } = useSession({ required: true });
  const userId = session?.user?.id;
  const { Users,  isLoading, mutate } = useFetchUser(userId);

  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [fetchingSubscriptions, setFetchingSubscriptions] = useState(true);

  const [isOpendelete, setIsOpenDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Custom popup state
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });





const sendVerificationEmail = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_URL}send-verification-email/`, {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${session?.accessToken}`,
      },
      body: JSON.stringify({
        email: session?.user.email,
      }),
    });

    console.log("Verification email request sent successfully");
     setEmailsendvalidation(true);
  } catch (err) {
    console.error("Failed to send verification email:", err);
    setEmailsenderrorvalidation(true);
  }
};




  // Custom popup functions
  const showPopup = (type: 'success' | 'error' | 'confirm', title: string, message: string, onConfirm?: () => void, confirmText?: string, cancelText?: string) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      confirmText: confirmText || 'OK',
      cancelText: cancelText || 'Cancel'
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const handleDelete = () => {
    setIsOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.statusText}`);
      }

      // No need to revalidate if account is gone
      // Just sign out immediately
      await signOut({ callbackUrl: "/en/login" });

    } catch (err) {
      setError("An error occurred while deleting account");
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    if (!isSaving) {
      setIsOpenDelete(false);
      setError(null);
      setSuccessMessage(null);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);


  
const fetchSubscriptions = async () => {
  try {
    const response = await fetch(`/api/get-subscriptions?email=${session?.user.email}`);
    const data = await response.json();
    
    if (response.ok) {
      setSubscriptions(data.subscriptions);
      
      // Check if any subscription has active status
      const hasActiveSubscription = data.subscriptions.some((subscription: Subscription) => 
        subscription.status === 'active'
      );
      
      // Make PUT request based on subscription status
      try {
        const putResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}infoid/${session?.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            premium_plan: hasActiveSubscription
          })
        });
        
        if (putResponse.ok) {
          console.log(`Premium plan ${hasActiveSubscription ? 'activated' : 'deactivated'} successfully`);
        } else {
          console.error('Failed to update premium plan:', await putResponse.text());
        }
      } catch (putError) {
        console.error('Error making PUT request:', putError);
      }
      
    } else {
      console.error('Error fetching subscriptions:', data.error);
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
  } finally {
    setFetchingSubscriptions(false);
  }
};


  const handleSubscribe = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session?.user.email,
          priceId: SUBSCRIPTION_PRICE_ID,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error('Stripe error:', error);
          showPopup('error', 'Checkout Error', 'Error redirecting to checkout. Please try again.');
        }
      } else {
        showPopup('error', 'Subscription Error', `Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      showPopup('error', 'Subscription Error', 'Error creating subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    // Show confirmation popup instead of browser confirm
    showPopup(
      'confirm',
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will keep access until the end of your current billing period.',
      () => confirmCancelSubscription(subscriptionId),
      'Yes, Cancel',
      'Keep Subscription'
    );
  };

  const confirmCancelSubscription = async (subscriptionId: string) => {
    setLoading(true);

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();

      if (response.ok) {
        showPopup('success', 'Subscription Canceled', 'Subscription canceled successfully. You will keep access until the end of your billing period.');
        fetchSubscriptions(); // Refresh subscriptions
      } else {
        showPopup('error', 'Cancellation Error', `Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      showPopup('error', 'Cancellation Error', 'Error canceling subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeSubscription = subscriptions.find(
    sub => sub.status === 'active' || sub.status === 'trialing'
  );

  // Use Users data directly instead of profileData state
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
                <div className="flex gap-4 items-center">
                  <span>{profileData.email}</span>
                   {profileData.is_email_verified == false ? "" :
                    <div className="relative h-7 w-7 ">
                                                 <Image
                                                   src="/verified.png" // or "/logo.webp" if using an webp
                                                   alt="logo"
                                                   fill
                                                   sizes='100%'
                                                   style={{ objectFit: 'contain' }} // Maintain aspect ratio
                                                   priority // Ensures it loads faster
                                                 />
                    </div>
                   
                   
                 }
                </div>
                
                {emailsendvalidation && <p className="text-accent text-sm text-center">Verification email sent, please check your inbox or spam folder.</p>}
                {emailsenderrorvalidation && <p className="text-accent text-sm text-center">We couldn’t send the verification email. Please try again.</p>}
                {emailsend && <p className="text-accent text-sm text-center">Email update confirmation has been sent successfully.</p>}
                {emailsenderror && <p className="text-accent text-sm text-center">Email could not be sent. Kindly retry.</p>}
              </div>
              <div className="flex gap-4">
               {profileData.is_email_verified == false ? 
              <button className="text-sm font-medium text-accent hover:text-secondary flex items-center"  onClick={sendVerificationEmail}>
                <MdOutlineVerified className="h-5 w-5 mr-1" />
                Verify
              </button>: ""}
                  <button className="text-sm font-medium text-accent hover:text-secondary flex items-center"  onClick={resetEmail}>
                <GoPencil className="h-4 w-4 mr-1" />
                Edit
              </button>
              </div>
            
            </dd>
          </div>

          {/* Password */}
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
                  
                  {profileData.phoneNumber == null ?  <p className="text-gray-500 mt-1">
                    Add a number so confirmed guests and Goamico can get in touch. You can add other numbers and choose how they're used.
                  </p>: 
                  (profileData.is_phone_number_verified == false ?
                  <p className="text-gray-700">{profileData.phoneNumber}</p> :  
                  <div className="flex gap-4 items-center">
                  <span>{profileData.phoneNumber}</span>
                  
                    <div className="relative h-7 w-7 ">
                      <Image
                        src="/verified.png" // or "/logo.webp" if using an webp
                        alt="logo"
                        fill
                        sizes='100%'
                        style={{ objectFit: 'contain' }} // Maintain aspect ratio
                        priority // Ensures it loads faster
                      />
                    </div>
                   
                   
                
                </div>
                  )
                  }
                 
                </div>
<div className="flex gap-4">
  {profileData.is_phone_number_verified == false ?
<VerifyPhoneOTP 
  initialPhoneNumber={profileData.phoneNumber}
  infoId={userId}
  onVerificationSuccess={(phoneNumber:any) => {
    console.log('Phone verified:', phoneNumber);
  }}
  mutate={mutate}
/>:""}
                <EditPhone
                  initialFullName={profileData.phoneNumber}
                  infoId={userId}
                  onUpdateSuccess={(newFullName, ) => {
                    console.log('Updated:', newFullName, );
                  }}
                  mutate={mutate}
                />
</div>

              </div>
            </dd>
          </div>

          {/* Identity Verification */}
          {session?.user?.is_staff?
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium text-gray-900 font-playfair">Identity verification</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
              {profileData.identity_verified == true ? 
              
            
               <div className="flex gap-4 items-center">
                  <span className="text-green-500">Verified</span>
                   {profileData.is_email_verified == false ? "" :
                    <div className="relative h-7 w-7 ">
                      <Image
                        src="/verified.png" // or "/logo.webp" if using an webp
                        alt="logo"
                        fill
                        sizes='100%'
                        style={{ objectFit: 'contain' }} // Maintain aspect ratio
                        priority // Ensures it loads faster
                      />
                    </div>       
                 }
                </div>
              
              : (profileData.status == "pending" ? <p className="text-orange-700">Pending Verification</p>:<p>Unverified</p>)}
               {profileData.status == "pending" || profileData.identity_verified == true ? "" : 
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
              />}
            </dd>
          </div>:""}

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
             {profileData.website == null ? <span>Not Provided</span> :   <Link 
    href={profileData.website.startsWith("http") ? profileData.website : `https://${profileData.website}`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="underline text-secondary"
  >
    {profileData.website}
  </Link>}
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

        {profileData.is_staff == true? 
        <div className="flex gap-2  mt-2 items-center">
          <FcPlanner size={32}/>
          {activeSubscription ? (
            <div  className="flex gap-2 flex-wrap items-center">
              <h3 className="font-medium text-gray-900 font-playfair ">Premium Plan | <span className="text-sm text-accent">Subscription: {activeSubscription.status}</span></h3>
              {activeSubscription.cancelAtPeriodEnd && (
                <p className="text-sm text-secondary font-medium">
                | Subscription will cancel at the end of the billing period
                </p>
              )}
              {!activeSubscription.cancelAtPeriodEnd && (
                <p className='text-secondary font-bold underline hover:text-black cursor-pointer font-playfair' onClick={() => handleCancelSubscription(activeSubscription.id)}>
                Cancel Subsription </p>    
              )}
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
             <h3 className="font-medium text-gray-900 font-playfair ">Free Plan</h3>
             <p className='text-secondary font-extrabold underline hover:text-white cursor-pointer font-playfair' onClick={handleSubscribe}>
               Upgrade to Premium       
             </p>
            </div>
          )}
        </div> : ""}
        
        <div className="flex gap-2  mt-8">
          <AiOutlineUserDelete size={24} className="text-accent"/>
          <h3 className="font-medium text-gray-900 font-playfair hover:underline cursor-pointer" onClick={handleDelete}>Delete Account</h3>
        </div>
        
        <div className="flex gap-2 items-center mt-8 ">
          <MdOutlineSecurity size={24} className="text-accent"/> 
          <h3 className="font-medium text-gray-900 font-playfair">Why isn't my info shown here?</h3>
        </div>
      
        <p className="mt-2 text-sm text-gray-500">
          We're hiding some account details to protect your identity. If you need to update this information, <Link href="/en/contact-us"><span className="underline">please contact support</span></Link> .
        </p>
      </div>

      {/* Delete Dialog */}
      {isOpendelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-highlights rounded-lg shadow-lg p-6 max-w-lg w-full relative space-y-4">
            {/* Close Button */}
            <RiCloseLargeLine
              size={24}
              className="absolute top-2 right-2 text-white hover:text-gray-300 cursor-pointer"
              onClick={handleCloseDialog}
            />

            {/* Content */}
            <h1 className="text-xl font-semibold font-playfair text-white">
              Delete Account
            </h1>
            <p className='text-sm text-white'>Are you sure you want to Delete this Account? This action cannot be undone.</p>

            {successMessage && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-sm">
                {successMessage}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-3 py-1 border border-gray-300 rounded hover:bg-accent transition-colors disabled:opacity-50 rounded-lg text-white"
                onClick={handleCloseDialog}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-secondary text-white rounded hover:bg-accent transition-colors disabled:bg-accent disabled:cursor-not-allowed rounded-lg"
                onClick={handleDeleteConfirm}
                disabled={isSaving }
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : 'Delete Account'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Popup Modal */}
      {popup.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative space-y-4">
            {/* Close Button */}
            <RiCloseLargeLine
              size={20}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={closePopup}
            />

            {/* Icon based on type */}
            <div className="flex items-center justify-center mb-4">
              {popup.type === 'success' && (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
              {popup.type === 'error' && (
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}
              {popup.type === 'confirm' && (
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-lg font-semibold font-playfair text-gray-900 mb-2">
                {popup.title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {popup.message}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3">
              {popup.type === 'confirm' ? (
                <>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    onClick={closePopup}
                  >
                    {popup.cancelText}
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    onClick={() => {
                      popup.onConfirm?.();
                      closePopup();
                    }}
                  >
                    {popup.confirmText}
                  </button>
                </>
              ) : (
                <button
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    popup.type === 'success' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  onClick={closePopup}
                >
                  {popup.confirmText}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}