'use client';

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useLocale } from "next-intl";
import Link from "next/link";
import useFetchPostsSearch from "./FetcherSearchPost";
import { useSearchParams } from "next/navigation";
export default function SearchPost() {
  const t = useTranslations('Search');
  const l = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 28;

  const { posts, error, isLoading } = useFetchPostsSearch();

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getLocalizedField = (item: any, field: string) => item[`${field}_${l}`] || item[`${field}_en`];

  const searchParams = useSearchParams();
  const query = searchParams.get('q'); // Get the search query from the URL

  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 custom:grid-cols-4 pb-10 gap-4">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div key={index}>
                  <div  className="h-64 w-full bg-gray-300 animate-pulse"></div>
                  <h1 className="h-7 mt-2 w-2/3 bg-gray-300 animate-pulse" ></h1>
                  <h1 className="h-10 mt-2 w-full bg-gray-300 animate-pulse" ></h1>

        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
    

      {/* Latest News Section */}
      <div className="w-full px-3 sm:px-5">
      <h1 className="text-lg">{t('Found')} {currentItems.length} {t('articles')}{" "}: <span className="font-bold">{query}</span></h1>      <hr className=" mb-12 mt-3"/>
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <SkeletonLoader />
        ) : (
       
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 custom:grid-cols-4 pb-10 gap-4">
            {currentItems.map((item) => (
              <Link key={item.id} href={`/${l}/blog/` + getLocalizedField(item, "url")}>
                <div className="cursor-pointer hover:shadow-2xl hover:bg-secondary hover:text-yel group">
                  <div className="h-72 w-full relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, "image")}`}
                      alt={getLocalizedField(item, "tag")}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="py-3 mb-3 flex flex-col gap-3 group-hover:px-3">
                    <h1 className="font-semibold">{getLocalizedField(item, "title")}</h1>
                    <p className="text-sm text-gray-500 group-hover:text-yel">{getLocalizedField(item, "description").slice(0,300)+"..."}</p>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {posts.length > itemsPerPage && (
          <div className="flex justify-between items-center gap-2 mb-20 mt-10 flex-wrap">
            <button disabled={currentPage === 1} onClick={handlePrevious} className="text-white hover:text-yel flex items-center">
              <MdArrowBackIos className={l === 'ar' ? "rotate-180" : ""} />
              <p className="capitalize font-semibold">{t('previous')}</p>
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-2 rounded-2xl font-bold opacity-70 ${
                    currentPage === index + 1 ? "bg-yel text-secondary" : "bg-secondary text-yel hover:bg-yel hover:text-secondary"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button disabled={currentPage === totalPages} onClick={handleNext} className="text-white hover:text-yel flex items-center">
              <p className="capitalize font-semibold">{t('next')}</p>
              <MdArrowBackIos className={l === 'ar' ? "" : "rotate-180"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
