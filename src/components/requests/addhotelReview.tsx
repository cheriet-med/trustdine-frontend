'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { X, Plus, Calendar, Upload, Award, MapPin, Trash2, Globe } from 'lucide-react';
import TiptapEditor from '@/components/admin-dashboard/Tiptapeditor';
import { LuImagePlus } from "react-icons/lu";
import { AiOutlineFieldNumber } from "react-icons/ai";
import useFetchBooking from './fetchBooking';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import moment from 'moment';
import useFetchAllBookings from './fetchAllBookings';
import {FaStar } from "react-icons/fa"; 
// TypeScript interfaces
interface Product {
  name: string;
  description: string;
  price_per_night: string;
  capacity: string;
  size: string;
  cancellation_policy: string;
  established: string;
  image: File | null;
  type:string;
  longitude: string;
  location: any;
  latitude: any;
  user: any ;
}

interface NearbyAttraction {
  name: string;
  distance: string;
}

interface Award {
  name: string;
  year: string;
}

interface ApiError {
  message: string;
}

interface ImagePreview {
  file: File;
  url: string;
}



export default function AddReviewHotelForm({proid}:any) {
  
const router = useRouter();
   const { data: session, status } = useSession();
  //const { Booking } = useFetchBooking(proid)
const { AllBookings }=useFetchAllBookings()

const date_stay = AllBookings.filter(reservation => reservation.user === session?.user?.id)



  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price_per_night: '',
    capacity: '',
    size: '',
    type: '',
    cancellation_policy: '',
    established: '',
    image: null,
    latitude: '',
    longitude: '',
    location: '',
    user: session?.user?.id,
  });
  
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [nearbyAttractions, setNearbyAttractions] = useState<NearbyAttraction[]>([{ name: '', distance: '' }]);
  const [awards, setAwards] = useState<Award[]>([{ name: '', year: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorname, setErrorname] = useState('');
  const [errordescription, setErrordescription] = useState('');
  const [errorimage, setErrorimage] = useState('');
  const [errorprice, setErrorprice] = useState('');
  const [errortype, setErrortype] = useState('');
  const [errorcancelation, setErrorcancelation] = useState('');
  const [errorlocation, setErrorlocation] = useState('');
  const [errorlatitude, setErrorlatitude] = useState('');
  const [errorlongtitude, setErrorlongtitude] = useState('');


 const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [ratingroom, setRatingroom] = useState(0);
  const [hoverRatingroom, setHoverRatingroom] = useState(0);


  const [ratingvalue, setRatingvalue] = useState(0);
  const [hoverRatingvalue, setHoverRatingvalue] = useState(0);


  const [ratingclearliness, setRatingclearliness] = useState(0);
  const [hoverRatingclearliness, setHoverRatingclearliness] = useState(0);


  const [ratingservice, setRatingservice] = useState(0);
  const [hoverRatingservice, setHoverRatingservice] = useState(0);



  const handleProductChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content: string) => {
    setProduct(prev => ({ ...prev, description: content }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].url);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  
 

  const addAward = () => {
    setAwards([...awards, { name: '', year: '' }]);
  };

  const removeAward = (index: number) => {
    if (awards.length > 1) {
      const updated = awards.filter((_, i) => i !== index);
      setAwards(updated);
    }
  };

  const handleSubmit = async (e: FormEvent) => {

    




    e.preventDefault();
      setErrorname('');
      setErrordescription('');
      setErrorimage('');
      setErrorprice('');
      setErrortype('');
      setErrorcancelation('');
      setErrorlocation('');
      setErrorlatitude('');
      setErrorlongtitude('');
      setErrorMessage('');
   

 if (!product.name.trim()) {
       setErrorname('Enter Review Title Please');
      return;
    }

  if (!product.description.trim()) {
       setErrordescription('Enter Review Description Please');
      return;
    } 
    
  
   if (!product.type.trim()) {
       setErrortype('Enter Trip type Please');
      return;
    }  
   
 setIsSubmitting(true);
    
    setSuccessMessage('');


    try {
    // Create product with JSON
    const productData = {
      product: proid,
      user: product.user,
      title: product.name,
      rating_global:(rating+ratingroom+ratingvalue+ratingclearliness+ratingservice)/5,
      description: product.description,
      trip_type: product.type,
      location: rating,
      room: ratingroom,
      restaurant_space: ratingroom,
      value: ratingvalue,
      clearliness: ratingclearliness,
      service: ratingservice,
      created_at: moment().format('MMMM Do YYYY'),
      stay_date: date_stay && date_stay[0]? moment(date_stay[0].check_in_date).format("MMMM Do YYYY"): "Not Reserved Through Goamico"
    };

    const productResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}productreviews/`, {
      method: 'POST',
      headers: {
        "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!productResponse.ok) {
      const errorData: ApiError = await productResponse.json();
      throw new Error(errorData.message || 'Error creating Review. Please try again.');

    }

    const productResponseData = await productResponse.json();
    const productId = productResponseData.id;
   
      // Submit additional images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const imageFormData = new FormData();
          imageFormData.append('image', images[i].file);
          imageFormData.append('ProductReview', productId);

          const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}reviewsimage/`, {
            method: 'POST',
            headers: {
              "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
            },
            body: imageFormData,
          });

          if (!imageResponse.ok) {
            throw new Error(`Failed to upload image ${i + 1}`);
          }
        }
      }

    

      images.forEach(img => URL.revokeObjectURL(img.url));
      setImages([]);
      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
        setMainImagePreview(null);
      }
     

    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error creating Review. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      router.push(`/en/booking/${proid}`)
    }
  };

  return (
    <div className=" py-4">
      <div className=" px-4">
        <div className="bg-white rounded-2xl  overflow-hidden">
          {/* Header */}
          <div className="bg-highlights px-8 py-6 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold text-white font-playfair">Add Review</h1>
            <p className="text-white mt-2">Fill in all required fields marked with a star. To enhance your post, complete all fields. For best results, use a high-quality image sized 160 x 30</p>
          </div>

          <div className="p-1 max-w-3xl mx-auto">

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
           

                <div>  

                  <div className='mt-1'>
                   <div className=" rounded-xl p-2">
                  <div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Title *</label>
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleProductChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                      placeholder="Enter review summary title"
                    />
                    {errorname && <p className="text-sm mt-2 text-accent">{errorname}</p>}
                  </div>
                  

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Description *</label>
                   <textarea
                    value={product.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder='Write review description'
                    rows={4}
                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                    required
                  />
                 
                   {errordescription && <p className="text-sm mt-2 text-accent">{errordescription}</p>}
                </div>
 <p className="block text-sm font-semibold text-gray-500 my-4">Add special Ratings for every features*</p>
                  {/* Star Rating */}
                    <div className=" my-2 ">
                    <div className='mb-3 flex gap-1 flex-wrap'>
                      <p className="block text-sm font-semibold text-gray-500">Location *  </p>
                    <p className='text-gray-500 text-sm'>What’s your rating for this location and how appealing you find it?</p>
                    </div>
                    
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl ${
                            star <= (hoverRating || rating)
                              ? 'text-accent'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>


<hr className='my-6'/>


                    <div className=" my-2 ">
                    <div className='mb-3 flex gap-1 flex-wrap'>
                      <p className="block text-sm font-semibold text-gray-500">Room *  </p>
                    <p className='text-gray-500 text-sm'>What’s your rating for the room space, comfort, and attractiveness?</p>
                    </div>
                    
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl ${
                            star <= (hoverRatingroom || ratingroom)
                              ? 'text-accent'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRatingroom(star)}
                          onMouseLeave={() => setHoverRatingroom(0)}
                          onClick={() => setRatingroom(star)}
                        />
                      ))}
                    </div>
                  </div>


<hr className='my-6'/>



                    <div className=" my-2 ">
                    <div className='mb-3 flex gap-1 flex-wrap'>
                      <p className="block text-sm font-semibold text-gray-500">Value *  </p>
                    <p className='text-gray-500 text-sm'>How many stars would you give for the value you received?</p>
                    </div>
                    
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl ${
                            star <= (hoverRatingvalue || ratingvalue)
                              ? 'text-accent'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRatingvalue(star)}
                          onMouseLeave={() => setHoverRatingvalue(0)}
                          onClick={() => setRatingvalue(star)}
                        />
                      ))}
                    </div>
                  </div>



<hr className='my-6'/>

                    <div className=" my-2 ">
                    <div className='mb-3 flex gap-1 flex-wrap'>
                      <p className="block text-sm font-semibold text-gray-500">Clearliness *  </p>
                    <p className='text-gray-500 text-sm'>How many stars would you give for the cleanliness?</p>
                    </div>
                    
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl ${
                            star <= (hoverRatingclearliness || ratingclearliness)
                              ? 'text-accent'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRatingclearliness(star)}
                          onMouseLeave={() => setHoverRatingclearliness(0)}
                          onClick={() => setRatingclearliness(star)}
                        />
                      ))}
                    </div>
                  </div>


<hr className='my-6'/>


                    <div className=" my-2 ">
                    <div className='mb-3 flex gap-1 flex-wrap'>
                      <p className="block text-sm font-semibold text-gray-500">Service * : </p>
                    <p className='text-gray-500 text-sm'>How would you rate the staff and service?</p>
                    </div>
                    
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer text-2xl ${
                            star <= (hoverRatingservice || ratingservice)
                              ? 'text-accent'
                              : 'text-gray-300'
                          }`}
                          onMouseEnter={() => setHoverRatingservice(star)}
                          onMouseLeave={() => setHoverRatingservice(0)}
                          onClick={() => setRatingservice(star)}
                        />
                      ))}
                    </div>
                  </div>




                  
                  <div className='w-full'>
                    <label className="block text-sm font-semibold text-gray-500 my-6">Tripe type *</label>
                    <input
                      type="text"
                      name="type"
                      value={product.type}
                      onChange={handleProductChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                      placeholder="e.g., Business"
                    />
                     {errortype && <p className="text-sm mt-2 text-accent">{errortype}</p>}
                  </div>

   
                      </div>

                     
            
                </div>      
                
                </div>    
          

<div >
              {/* Images Section */}
              <div >
               
                
   
   
                {/* Additional Images */}
            <div className=" rounded-xl p-2">
                  <label className="block text-sm font-semibold text-gray-500 mb-3">Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <Image 
                        src={img.url} alt={`Preview ${index + 1}`}  
                        width={150}
                        height={150}
                        className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-highlights text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label className="cursor-pointer">
                      <div className="w-full h-24 border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 rounded-lg flex items-center justify-center hover:border-highlights transition-colors">
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {images.length > 0 && (
                    <p className="text-sm text-gray-500">{images.length} additional image(s) selected</p>
                  )}
                </div>
              </div>

<div className='my-2'></div>

            {errorMessage && <p className='text-accent'>{errorMessage}</p>}

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-highlights w-full text-white font-semibold rounded-xl ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
                      Creating Review...
                    </span>
                  ) : (
                    'Create Review'
                  )}
                </button>
              </div>  

                <div className="flex justify-center pt-6 mb-6">
                 
                <button

                  className="px-4 py-2 bg-white w-full text-gray-600 border border-1 font-semibold rounded-xl hover:bg-highlights hover:text-white"  
                  onClick={()=>router.push(`/en/booking/${proid}`)}
                >
                  Cancel
                </button>
              </div>  
              </div>
                 </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}