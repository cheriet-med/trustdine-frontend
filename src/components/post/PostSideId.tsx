'use client'

import Image from "next/image"
import { useTranslations } from "next-intl";
import useFetchPosts from "./fetcher";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function PostSideId (i:any) {
    const l = useLocale();
    const t1 = useTranslations('Blog-id');
    const { posts, error, isLoading } = useFetchPosts();
    const getLocalizedField = (item: any, field: string) => item[`${field}_${l}`] || item[`${field}_en`];

    const filteredProducts = posts?.filter(
      (product) => product.id !== i.i
    );


    const SkeletonLoader = () => (
      <div className="mx-3 sm:mx-20 lg:mx-0 lg:col-span-2">
   
      {/* Post List Skeleton */}
      <div>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="mb-5">
            {/* Flex Container for Image and Title */}
            <div className="flex gap-5 items-center">
              {/* Image Skeleton */}
              <div className="relative h-24 md:h-40 lg:h-24 w-[500px] bg-gray-200 rounded animate-pulse"></div>

              {/* Title Skeleton */}
              <div className="h-6 w-[700px] bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Divider Skeleton */}
            <div className="border-spacing-1 my-5 border-t border-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
    );



    return(

<div className="mx-3 sm:mx-20 lg:mx-0 lg:col-span-2">
<h4 className="text-lg font-bold capitalize mb-3">{t1('Explore More from Padelv')}</h4>
{isLoading ? (
        <SkeletonLoader/>
        ) : error ? (
          <SkeletonLoader/>
        ) : (
   
         <div>
  {filteredProducts.slice(0,4).map((item) => (       
 <div key={item.id}><Link key={item.id} href={`/${l}/blog/` + getLocalizedField(item, "url")}>
<div className="flex gap-5 items-center">

<div className="relative h-24 md:h-40 lg:h-24 w-[500px]">
<Image
         src={`${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, "image")}`}
         alt={getLocalizedField(item, "tag")}
          fill
          sizes="(max-width: 768px) 100vw, 50vw" // Adjust based on your layout
          style={{ objectFit: "cover" }}
          className="z-0"
          priority
        />
</div>
<h2 className="text-sm sm:text-lg lg:text-base custom:text-lg w-[700px] hover:text-bl hover:underline">
{getLocalizedField(item, "title")}
</h2>

</div>  </Link>
 <hr className="border-spacing-1 my-5" />
 </div>
))}
  </div> 

)}

   



</div>

    )
}