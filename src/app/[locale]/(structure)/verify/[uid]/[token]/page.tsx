// app/[lang]/verify/[uid]/[token]/page.tsx

import React from "react";
import Link from "next/link";
export default async function VerifyPage({
  params,
}: {
  params: Promise<{ lang: string; uid: string; token: string }>;
}) {
  const { lang, uid, token } = await params; // ✅ unwrap params

  let message = "Verification failed";

  try {
    const res = await fetch(
      `https://api.goamico.com/verify-email/${uid}/${token}`,
      { method: "GET", cache: "no-store" }
    );

    if (res.ok) {
      message = "Verification succeeded";
    }
  } catch (err) {
    message = "An error occurred during verification";
  }

  return (
    <>
                <div className="flex flex-col text-center items-center justify-center px-2 mb-10 lg:mb-14 bg-a h-40  pt-32 rounded-b-3xl">
 
      </div>
     <div className="flex flex-col h-96 items-center justify-center bg-white rounded-xl m-6 gap-2">
      <p className="text-xl font-semibold font-playfair text-green-500">{message}</p>
      <p>Your email has been verified successfully. You can return to the <Link href="/en" className="text-secondary underline ">home page</Link>  or go to your <Link href="/en/account" className="text-secondary underline">dashboard</Link>.</p>
    </div>
    </>
   
  );
}
