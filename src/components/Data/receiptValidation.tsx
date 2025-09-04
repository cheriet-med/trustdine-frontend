'use client'
import { CiReceipt } from "react-icons/ci";
import { MdOutlineRateReview } from "react-icons/md";
import { useState } from "react";
import ReceiptUpload from "@/components/ReceiptUpload";
import ValidationProgress from "@/components/ValidationProgress";
import ValidationResults from "@/components/ValidationResults";
import { ValidationResult, ExtractedData } from "@/types/receipt";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Receipt() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const { data: session, status } = useSession({ required: true });
  const searchParams = useSearchParams();
  const id = searchParams.get('q');
  const category = searchParams.get('ctg');
  const reciept = searchParams.get('im');


  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
    setValidationResult(null); // Reset validation result when new file is uploaded
  };

const handleValidate = async () => {
  if (!uploadedFile) {
    console.error("No file uploaded");
    return;
  }

  setIsValidating(true);


  try {
    const imageFormData = new FormData();
    imageFormData.append('reference_image_url', `${process.env.NEXT_PUBLIC_IMAGE}/${reciept}`);
    imageFormData.append('image', uploadedFile); // safe now, since we checked it's not null

    const imageResponse = await fetch(
       `${process.env.NEXT_PUBLIC_URL}api/validate-bill/`,
      {
        method: 'POST',
        headers: {
          Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: imageFormData,
      }
    );

    if (!imageResponse.ok) {
      throw new Error(`Failed to upload image`);
    }

    const data = await imageResponse.json()





// Mock result (for now)
  const mockExtractedData: ExtractedData = {
    restaurantName: "Sample Restaurant",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    total: `$${(Math.random() * 50 + 10).toFixed(2)}`,
    location: "123 Main St, Sample City",
    taxAmount: `$${(Math.random() * 5 + 1).toFixed(2)}`,
    items: ["Item 1", "Item 2", "Item 3"]
  };

  const rand = Math.random();
  const status = data.status;
  const validationReasons = data.message


if (status == 'valid') {
  const add = await fetch(
       `${process.env.NEXT_PUBLIC_URL}score/`,
      {
        method: 'POST',
        headers: {
          Authorization: "Token " +process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          product: id,
          user:session?.user?.id,
          clean:5,
          blur:"",
          verified:5,
          fake:"",
          total:"",

        }),
      }
    );
    }


if (data.message == 'Image is too blurry - extracted very little text') {
  const add = await fetch(`${process.env.NEXT_PUBLIC_URL}score/`,
      {
        method: 'POST',
        headers: {
          Authorization: "Token " +process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          product: id,
          user:session?.user?.id,
          clean:"",
          blur:5,
          verified:"",
          fake:"",
          total:"",

        }),
      }
    );
    }
   

if (data.message == 'Bill date is not within the last 21 days or date not found') {
  const add = await fetch(
      `${process.env.NEXT_PUBLIC_URL}score/`,
      {
        method: 'POST',
        headers: {
          Authorization: "Token " +process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          product: id,
          user:session?.user?.id,
          clean:5,
          blur:"",
          verified:"",
          fake:"",
          total:"",

        }),
      }
    );
    }


if (data.message == "Uploaded image does not match the reference image") {

   const add = await fetch(
       `${process.env.NEXT_PUBLIC_URL}score/`,
      {
        method: 'POST',
        headers: {
          Authorization: "Token " +process.env.NEXT_PUBLIC_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          product: id,
          user:session?.user?.id,
          clean:"",
          blur:"",
          verified:"",
          fake:5,
          total:"",

        }),
      }
    );
    }




  const mockResult: ValidationResult = {
    status,
    confidence: Math.floor(Math.random() * 30) + 70,
    processingTime: Math.random() * 2 + 1,
    extractedData: data.data.comparison_details,
    validationReasons,
    is_bill:data.data.is_bill,
    productID:id,
    category:category,
  };

  setValidationResult(mockResult);









  } catch (error) {
    console.error("Validation error:", error);
  } finally {
    setIsValidating(false);
  }

  
};

  
  return (
    <div className="my-6 mx-2 lg:mx-6 ">
      <div>
        {/* Header Tabs */}
        <div className="grid grid-cols-2 divide-x divide-accent overflow-hidden rounded-lg border border-1 text-sm text-gray-500 bg-white">
          <div className="flex items-center justify-center gap-2 bg-accent text-white">
            <CiReceipt size={24}/>
            <p className="leading-none">
              <strong className="block font-medium">Receipt</strong>
              <small className="mt-1">Upload your receipt</small>
            </p>
          </div>

          <div className="relative flex items-center justify-center gap-2 p-4 bg-highlights text-white">
            <span className="absolute top-1/2 -left-2 hidden size-4 -translate-y-1/2 rotate-45 border border-accent sm:block ltr:border-s-0 ltr:border-b-0 ltr:bg-white rtl:border-e-0 rtl:border-t-0 rtl:bg-white"></span>
            <MdOutlineRateReview size={24}/>
            <p className="leading-none">
              <strong className="block font-medium">Review</strong>
              <small className="mt-1">Write Review</small>
            </p> 
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 rounded-lg border border-1 bg-white mt-8 space-y-6">
          <ReceiptUpload 
            onFileUpload={handleFileUpload}
            uploadedFile={uploadedFile}
            onValidate={handleValidate}
            isValidating={isValidating}
          />

          {isValidating && <ValidationProgress isValidating={isValidating} />}

          {validationResult && (
            <ValidationResults result={validationResult} />
          )}
        </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-lg border border-1 mt-8 space-y-6 text-sm text-white bg-accent">
          <h1 className="text-xl font-playfair font-semibold">Receipt validation</h1>
          <hr />
          <p>Receipt validation ensures the accuracy and legitimacy of receipts for expenses, reimbursements, and audits. AI automates this process using computer vision, OCR, and machine learning to extract and verify data like merchant names, dates, and amounts.
<br />
Key benefits include faster processing, fraud detection (duplicates/altered receipts), and compliance checks (tax rules, company policies). AI also cross-references receipts with transactions for consistency.


</p>
        </div>


        <div className="p-6 rounded-lg border border-1 mt-8 space-y-6 text-sm  text-white bg-highlights">
          <h1 className="text-xl font-playfair font-semibold">Trusted Score</h1>
          <hr />
         <p>For the best results, please upload clear and legible receipts. High-quality uploads ensure fast and accurate processing, helping you maintain a good score. Blurry, incomplete, or altered receipts may affect your score and delay approval. Make sure the receipt is well-lit, fully visible, and unedited, with all key details like the merchant name, date, and total amount easy to read. Submitting valid receipts helps us verify transactions quickly and keeps your score high. Thank you for your attention to this important step!</p>
        </div>
</div>
      </div>
    </div>
  );
}