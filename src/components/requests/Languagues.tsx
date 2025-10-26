'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoLanguage } from "react-icons/io5";


interface Language {
  id: number;
  language: string;
  user: number;
  userID: number | string;
}

export default function LanguageKeywords({user}:any) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState<Language[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing keywords for user ID 24
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}languages/?user=${user}`, {
          headers: {
            Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data: Language[] = await res.json();
        setKeywords(data);
      } catch (error) {
        console.error("Error fetching keywords:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  // Add and post a keyword immediately on Enter
  const addAndPostKeyword = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newKeyword = inputValue.trim();
      setInputValue("");
      setIsSubmitting(true);

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("user", user);
        formDataToSend.append("language", newKeyword);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}languages/`, {
          method: "POST",
          headers: {
            Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Refresh the list after successful submission
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_URL}languages/?user=${user}`, {
          headers: {
            Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
          },
        });
        
        if (refreshRes.ok) {
          const data: Language[] = await refreshRes.json();
          setKeywords(data);
        }
      } catch (error) {
        console.error("Error posting keyword:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Delete a keyword by ID
  const deleteKeyword = async (id: number) => {
    try {
      const deleteRes = await fetch(`${process.env.NEXT_PUBLIC_URL}languagesid/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
      });

      if (!deleteRes.ok) {
        throw new Error(`HTTP error! Status: ${deleteRes.status}`);
      }

      // Remove from local state
      setKeywords(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting keyword:", error);
    }
  };

  if (isLoading) {
    return (
     <div>
      <div className="w-full my-4">
        <div className="border border-gray-300 rounded-full p-2 flex flex-wrap gap-2">
          {/* Skeleton for existing language tags */}
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex gap-3 items-center border border-1 border-gray-200 px-3 py-1 rounded-full animate-pulse"
            >
              {/* Language icon skeleton */}
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              
              {/* Language text skeleton */}
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              
              {/* Close icon skeleton */}
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          ))}
          
          {/* Input field skeleton */}
          <div className="flex-grow px-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>
        
        {/* Help text skeleton */}
        <div className="mt-2">
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div>
     
      <div className="w-full ">
         
        <div className="border border-gray-300 rounded-xl sm:rounded-full px-4 py-2 flex flex-wrap gap-2 my-4">
          {keywords.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 items-center border border-1 border-secondary font-medium text-gray-600  px-3 py-1 rounded-full "
            >
                <IoLanguage 
                                size={24} 
                                className='text-gray-400 cursor-pointer' 
                              
                              />
              {item.language}
         
                <IoCloseCircleOutline 
                                size={32} 
                                className='hover:text-accent text-gray-400 cursor-pointer' 
                               onClick={() => deleteKeyword(item.id)}
                              />
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={addAndPostKeyword}
            placeholder={isSubmitting? "saving":"Add a languages"}
            className="flex-grow  px-2 py-1 text-sm rounded-full "
            disabled={isSubmitting}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Press <span className="font-medium text-secondary">Enter</span> to save language.
        </p>
     
      </div>
    </div>
  );
}