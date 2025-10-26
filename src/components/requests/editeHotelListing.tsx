'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { X, Plus, Calendar, Upload, Award, MapPin, Trash2, Globe, ChefHat, Clock } from 'lucide-react';
import TiptapEditor from '../admin-dashboard/Tiptapeditor';
import { LuImagePlus } from "react-icons/lu";
import { AiOutlineFieldNumber } from "react-icons/ai";
import Image from 'next/image';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { MdOutlineBedroomChild } from "react-icons/md";

// TypeScript interfaces
interface Product {
  name: string;
  user:string;
  description: string;
  price_per_night: string;
  capacity: string;
  size: string;
  cancellation_policy: string;
  established: string;
  image: File | null;
  receipt: File | null;
  type: string;
  longitude: string;
  location: any;
  latitude: any;
  category:string;
  chef: string;
  rooms_number:string;
  opening_hours_monday: string;
  opening_hours_tuesday: string;
  opening_hours_wednesday: string;
  opening_hours_thursday: string;
  opening_hours_friday: string;
  opening_hours_saturday: string;
  opening_hours_sunday: string;
  organic_ingredients: boolean;
  sustainable_seafood: boolean;

}

interface NearbyAttraction {
  id:any,
  name: string;
  distance: string;
  product:any
}

interface Award {
  id:any,
  name: string;
  year: string;
  product:any
}

interface ApiError {
  message: string;
}

interface ImagePreview {

  file: File;
  url: string;
}

interface FetchedImage {
  id: any;
  image: string;
  product: string;
}

interface ListingData {
  id: number;
  user:string;
  name: string;
  description: string;
  price_per_night: string;
  capacity: string;
  size: string;
  types: string;
  cancellation_policy: string;
  established: string;
  image: string;
  receipt:string;
  rooms_number:string;
  latitude: string;
  longtitude: string;
  category:string;
  location: string;
  nearby_attractions: NearbyAttraction[];
  awards: Award[];
  images: string[];
  chef: string;
  opening_hours_monday: string;
  opening_hours_tuesday: string;
  opening_hours_wednesday: string;
  opening_hours_thursday: string;
  opening_hours_friday: string;
  opening_hours_saturday: string;
  opening_hours_sunday: string;
  organic_ingredients: boolean;
  sustainable_seafood: boolean;
}

export default function EditeHotelForm() {
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
 
  const [product, setProduct] = useState<Product>({
    user:'',
    name: '',
    description: '',
    price_per_night: '',
    capacity: '',
    size: '',
    type: '',
    cancellation_policy: '',
    established: '',
    image: null,
    receipt:null,
    latitude: '',
    longitude: '',
    location: '',
    category:'',
    chef: '',
    rooms_number:'',
    opening_hours_monday: '',
    opening_hours_tuesday: '',
    opening_hours_wednesday: '',
    opening_hours_thursday: '',
    opening_hours_friday: '',
    opening_hours_saturday: '',
    opening_hours_sunday: '',
    organic_ingredients: false,
    sustainable_seafood: false,
  });

  const [fetchedImages, setFetchedImages] = useState<FetchedImage[]>([]);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [nearbyAttractions, setNearbyAttractions] = useState<NearbyAttraction[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
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
  const [recieptPreview, setRecieptPreview] = useState<string | null>(null);
  const [errorreciept, setErrorreciept] = useState('');
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); 

useEffect(() => {
  const fetchAllData = async () => {
    try {
      // Fetch main product data
      const productResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}productid/${query}`, {
        method: 'GET',
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
      });

      if (!productResponse.ok) throw new Error('Failed to fetch listing data');
      const data: ListingData = await productResponse.json();

      // Set product state
     setProduct({
        user: data.user,
        name: data.name || '',
        description: data.description || '',
        price_per_night: data.price_per_night || '',
        capacity: data.capacity || '',
        size: data.size || '',
        type: data.types || '',
        cancellation_policy: data.cancellation_policy || '',
        established: data.established || '',
        image: null, // Keep as null for new uploads
        receipt:null,
        latitude: data.latitude || '',
        longitude: data.longtitude || '',
        location: data.location || '',
        category:data.category || '',
        chef: data.chef,
        rooms_number:data.rooms_number,
        opening_hours_monday: data.opening_hours_monday,
        opening_hours_tuesday: data.opening_hours_tuesday,
        opening_hours_wednesday: data.opening_hours_wednesday,
        opening_hours_thursday: data.opening_hours_thursday,
        opening_hours_friday: data.opening_hours_friday,
        opening_hours_saturday: data.opening_hours_saturday,
        opening_hours_sunday: data.opening_hours_sunday,
        organic_ingredients: data.organic_ingredients,
        sustainable_seafood: data.sustainable_seafood,
      });

      // Handle image
      if (data.image) {
        setMainImagePreview(process.env.NEXT_PUBLIC_IMAGE+'/'+data.image);
      }
      if (data.receipt) {
        setRecieptPreview(process.env.NEXT_PUBLIC_IMAGE+'/'+data.receipt);
      }
      // Fetch related data in parallel
      const [awardsRes, nearbyRes, imagesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_URL}awards/?product=${query}`, {
          method: 'GET',
          headers: {
            "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_URL}nearbyattractions/?product=${query}`, {
          method: 'GET',
          headers: {
            "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_URL}productimage/?product=${query}`, {
          method: 'GET',
          headers: {
            "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          },
        })
      ]);

      // Process all responses
      const [awardsData, nearbyData, imagesData] = await Promise.all([
        awardsRes.ok ? awardsRes.json() : [],
        nearbyRes.ok ? nearbyRes.json() : [],
        imagesRes.ok ? imagesRes.json() : []
      ]);

      // Set states
     setAwards(
  awardsData
    .filter((item: Award) => item.product === data.id) // Filter first
    .map((item: Award) => ({
      id: item.id || '',
      name: item.name || '',
      year: item.year || '',
      product: item.product || '',
    }))
);
      setNearbyAttractions(
        nearbyData
        .filter((item: NearbyAttraction) => item.product === data.id) // Filter first
        .map((item: NearbyAttraction) => ({
        id: item.id || '',
        name: item.name || '',
        distance: item.distance || '',
        product: item.product || '',
      })));

      setFetchedImages(imagesData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  fetchAllData();
}, []);

  

const handleDeleteAward = async (awardId: any, index: number) => {
  // Store the current state in case we need to rollback
  const previousAwards = [...awards];
  
  // Optimistically update the UI
  const newAwards = awards.filter((_, i) => i !== index);
  setAwards(newAwards);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}awardsid/${awardId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
      },
    });

    if (!response.ok) throw new Error('Failed to delete award');
    
    setSuccessMessage('Award deleted successfully!');
    
  } catch (error) {
    console.error('Deletion error:', error);
    // Revert to previous state if deletion fails
    setAwards(previousAwards);
    setErrorMessage(
      error instanceof Error ? error.message : 'Error deleting award. Please try again.'
    );
  }
};







useEffect(() => {
  const fetchimages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}productimage/`, {
        method: 'GET',
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch images data');

      const data: FetchedImage[] = await response.json();
      console.log(data);
      setFetchedImages(data);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching images');
    }
  };

  fetchimages();
}, []);



 const handleReciepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct(prev => ({ ...prev, receipt: file }));
      const url = URL.createObjectURL(file);
      setRecieptPreview(url);
    }
  };

  const removeRecieptImage = () => {
    setProduct(prev => ({ ...prev, receipt: null }));
    if (recieptPreview) {
      URL.revokeObjectURL(recieptPreview);
      setRecieptPreview(null);
    }
  };




const handleDeleteFetchedImage = async (imageId: any, index: number) => {
  const previousImages = [...fetchedImages];
  
  // Optimistically update the UI
  const newImages = fetchedImages.filter((_, i) => i !== index);
  setFetchedImages(newImages);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}productimageid/${imageId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
      },
    });

    if (!response.ok) throw new Error('Failed to delete image');
    
    setSuccessMessage('Image deleted successfully!');
    
  } catch (error) {
    console.error('Deletion error:', error);
    // Revert to previous state if deletion fails
    setFetchedImages(previousImages);
    setErrorMessage(
      error instanceof Error ? error.message : 'Error deleting image. Please try again.'
    );
  }
};


  const handleProductChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };


  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setProduct(prev => ({ ...prev, [name]: checked }));
    };

  const handleDescriptionChange = (content: string) => {
    setProduct(prev => ({ ...prev, description: content }));
  };

  const handleCancellationPolicyChange = (content: string) => {
    setProduct(prev => ({ ...prev, cancellation_policy: content }));
  };

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProduct(prev => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setMainImagePreview(url);
    }
  };

  const removeMainImage = () => {
    setProduct(prev => ({ ...prev, image: null }));
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
      setMainImagePreview(null);
    }
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

  const handleNearbyChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = [...nearbyAttractions];
    updated[index] = { ...updated[index], [name]: value };
    setNearbyAttractions(updated);
  };


const handleDeleteNearby = async (awardId: any, index: number) => {
  // Store the current state in case we need to rollback
  const previousAwards = [...nearbyAttractions];
  
  // Optimistically update the UI
  const newAwards = nearbyAttractions.filter((_, i) => i !== index);
  setNearbyAttractions(newAwards);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}nearbyattractionsid/${awardId}`, {
      method: 'DELETE',
      headers: {
        "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
      },
    });

    if (!response.ok) throw new Error('Failed to delete award');
    
    setSuccessMessage('Award deleted successfully!');
    
  } catch (error) {
    console.error('Deletion error:', error);
    // Revert to previous state if deletion fails
    setNearbyAttractions(previousAwards);
    setErrorMessage(
      error instanceof Error ? error.message : 'Error deleting award. Please try again.'
    );
  }
};



    const handleTimeRangeChange = (dayKey: string, value: string | null) => {
    setProduct(prev => ({ 
      ...prev, 
      [dayKey]: value || '' 
    }));
  };


  const handleAwardChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = [...awards];
    updated[index] = { ...updated[index], [name]: value };
    setAwards(updated);
  };

  const addNearbyAttraction = () => {
    setNearbyAttractions([...nearbyAttractions, {id:'', name: '', distance: '', product:'' }]);
  };

  const removeNearbyAttraction = (index: number) => {
    if (nearbyAttractions.length > 1) {
      const updated = nearbyAttractions.filter((_, i) => i !== index);
      setNearbyAttractions(updated);
    }
  };

  const addAward = () => {
    setAwards([...awards, {id:'', name: '', year: '', product:'' }]);
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
      setErrorreciept('');

 if (!product.name.trim()) {
       setErrorname('Enter Listing Name Please');
      return;
    }

  if (!product.description.trim()) {
       setErrordescription('Enter Listing description Please');
      return;
    } 
  
   if (!product.price_per_night.trim()) {
       setErrorprice('Enter Listing price Please');
      return;
    }   
   if (!product.type.trim()) {
       setErrortype('Enter Listing type Please');
      return;
    }  
     if (!product.location.trim()) {
       setErrorlocation('Enter Listing Location Please');
      return;
    }  
     if (!product.latitude.trim()) {
       setErrorlatitude('Enter Listing latitude Please');
      return;
    }  
     if (!product.longitude.trim()) {
       setErrorlongtitude('Enter Listing longitude Please');
      return;
    }  
   if (!product.cancellation_policy.trim()) {
       setErrorcancelation('Enter Listing Cancellation policy Please');
      return;
    }
    setIsSubmitting(true);
    
    setSuccessMessage('');


    try {
      // Create product with FormData
      const productFormData = new FormData();
      productFormData.append('user', product.user);
      productFormData.append('name', product.name);
      productFormData.append('description', product.description);
      productFormData.append('types', product.type);
      productFormData.append('price_per_night', product.price_per_night);
      productFormData.append('capacity', product.capacity);
      productFormData.append('size', product.size);
      productFormData.append('cancellation_policy', product.cancellation_policy);
      productFormData.append('established', product.established);
      productFormData.append('category', product.category);
      productFormData.append('latitude', product.latitude);
      productFormData.append('longtitude', product.longitude);
      productFormData.append('location', product.location);
      productFormData.append('rooms_number', product.rooms_number);
      productFormData.append('opening_hours_monday', product.opening_hours_monday);
      productFormData.append('opening_hours_tuesday', product.opening_hours_tuesday);
      productFormData.append('opening_hours_wednesday', product.opening_hours_wednesday);
      productFormData.append('opening_hours_thursday', product.opening_hours_thursday);
      productFormData.append('opening_hours_friday', product.opening_hours_friday);
      productFormData.append('opening_hours_saturday', product.opening_hours_saturday);
      productFormData.append('opening_hours_sunday', product.opening_hours_sunday);
      productFormData.append('organic_ingredients', product.organic_ingredients.toString());
      productFormData.append('sustainable_seafood', product.sustainable_seafood.toString());


      if (product.image) {
        productFormData.append('image', product.image);
      }
      if (product.receipt) {
        productFormData.append('receipt', product.receipt);
      }
      const productResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}productid/${query}`, {
        method: 'PUT',
        headers: {
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: productFormData,
      });

      if (!productResponse.ok) {
        const errorData: ApiError = await productResponse.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const productData = await productResponse.json();
      const productId = productData.id;

      // Submit additional images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const imageFormData = new FormData();
          imageFormData.append('image', images[i].file);
          imageFormData.append('product', productId);

          const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_URL}productimage/`, {
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

await Promise.all(
  nearbyAttractions.map(async (attraction) => {
    if (attraction.name.trim() && attraction.distance.trim()) {
      try {
        if (attraction.id) {
          // Update existing
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}nearbyattractionsid/${attraction.id}`, 
            {
              method: 'PUT', // Try PATCH if PUT doesn't work
              headers: {
                "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product: productId,
                name: attraction.name,
                distance: attraction.distance,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to update attraction:', errorData);
            throw new Error('Failed to update attraction');
          }
        } else {
          // Add new
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}nearbyattractions/`, 
            {
              method: 'POST',
              headers: {
                "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product: productId,
                name: attraction.name,
                distance: attraction.distance,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to create attraction:', errorData);
            throw new Error('Failed to create attraction');
          }
        }
      } catch (error) {
        console.error('Error in attraction operation:', error);
        throw error;
      }
    }
  })
);



  await Promise.all(
      awards.map(async (award) => {
        if (award.name.trim()) {
          if (award.id) {
            // Update existing
            await fetch(`${process.env.NEXT_PUBLIC_URL}awardsid/${award.id}`, {
              method: 'PUT',
              headers: {
                "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product: productId,
                name: award.name,
                year: award.year,
              }),
            });
          } else {
            // Add new
            await fetch(`${process.env.NEXT_PUBLIC_URL}awards/`, {
              method: 'POST',
              headers: {
                "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product: productId,
                name: award.name,
                year: award.year,
              }),
            });
          }
        }
      })
    );



      router.push('/en/account/listings'); 
      setSuccessMessage('Listing update successfully!');
      
      // Reset form
      setProduct({
        name: '',
        user:'',
        description: '',
        price_per_night: '',
        capacity: '',
        type:'',
        size: '',
        cancellation_policy: '',
        established: '',
        image: null,
        receipt:null,
        latitude: '',
        longitude: '',
        location: '',
        category:'',
        chef: '',
        rooms_number:'',
        opening_hours_monday: '',
        opening_hours_tuesday: '',
        opening_hours_wednesday: '',
        opening_hours_thursday: '',
        opening_hours_friday: '',
        opening_hours_saturday: '',
        opening_hours_sunday: '',
        organic_ingredients: false,
        sustainable_seafood: false,
      });
      images.forEach(img => URL.revokeObjectURL(img.url));
      setImages([]);
      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
        setMainImagePreview(null);
      }
      setNearbyAttractions([{id:'', name: '', distance: '', product:'' }]);
      setAwards([{id:'', name: '', year: '', product:'' }]);
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error creating Listing. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayNames = [
    { key: 'opening_hours_monday', label: 'Monday' },
    { key: 'opening_hours_tuesday', label: 'Tuesday' },
    { key: 'opening_hours_wednesday', label: 'Wednesday' },
    { key: 'opening_hours_thursday', label: 'Thursday' },
    { key: 'opening_hours_friday', label: 'Friday' },
    { key: 'opening_hours_saturday', label: 'Saturday' },
    { key: 'opening_hours_sunday', label: 'Sunday' },
  ];

  return (
    <div className=" py-4">
      <div className=" px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-highlights px-8 py-6">
            <h1 className="text-3xl font-bold text-white font-playfair ">Edit Listing</h1>
            <p className="text-white mt-2">Fill in all required fields marked with a star. To enhance your post, complete all fields. For best results, use a high-quality image sized 160 x 30</p>
          </div>

          <div className="p-1">
            {/* Status Messages */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 bg-highlights rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-800 font-medium">{successMessage}</span>
              </div>
            )}
            
            {errorMessage && (
              <div className="mb-6 p-4 bg-gray-50 border border-red-200 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </div>
                <span className="text-red-800 font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
           

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">  

                  <div className='mt-1'>
                   <div className="bg-gray-50 rounded-xl p-2">
                  <div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Listing Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={product.name}
                      onChange={handleProductChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                      placeholder="Enter Listing name"
                    />
                    {errorname && <p className="text-sm mt-2 text-accent">{errorname}</p>}
                  </div>
                  

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Description *</label>
                  <TiptapEditor
                    content={product.description}
                    onChange={handleDescriptionChange}
                   
                  />
                   {errordescription && <p className="text-sm mt-2 text-accent">{errordescription}</p>}
                </div>



<div className="flex gap-2 mt-6">
                  <div className='w-full'>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="price_per_night"
                        value={product.price_per_night}
                        onChange={handleProductChange}
                        
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                        placeholder="0.00"
                      />
                    </div>
                     {errorprice && <p className="text-sm mt-2 text-accent">{errorprice}</p>}
                  </div>
                  
                  <div className='w-full'>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Type *</label>
                    <input
                      type="text"
                      name="type"
                      value={product.type}
                      onChange={handleProductChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                      placeholder="e.g., Suite"
                    />
                     {errortype && <p className="text-sm mt-2 text-accent">{errortype}</p>}
                  </div>
</div>
<div className="flex gap-2 mt-4 flex-wrap">
<div className="flex gap-2 w-full">
                  <div className='w-full'>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Capacity</label>
                      <div className="relative">
                      <AiOutlineFieldNumber className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                      type="number"
                      name="capacity"
                      value={product.capacity}
                      onChange={handleProductChange}
                      
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                      placeholder="Guests"
                    />
                  </div> 
                  </div>
                  


                 <div className='w-full'>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={product.size}
                      onChange={handleProductChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                      placeholder="e.g., 1200 sq ft"
                    />
                  </div>

</div>


                                  <div className='w-full'>
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Established Year</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="established"
                        placeholder='e.g., 1993'
                        value={product.established}
                        onChange={handleProductChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                      />
                    </div> 
                     </div>
                <div className="flex gap-4 w-full">
                    <div className='w-full'>
                          <label className="block text-sm font-semibold text-gray-500 mb-2">Location *</label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              name="location"
                              value={product.location}
                              onChange={handleProductChange}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                              placeholder="e.g., Newyork"
                            />
                          </div>
                           {errorlocation && <p className="text-sm mt-2 text-accent">{errorlocation}</p>}
                          </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-2">Number of rooms</label>
                        <div className="relative">
                          <MdOutlineBedroomChild className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            name="chef"
                            value={product.rooms_number}
                            onChange={handleProductChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                            placeholder="Number of rooms"
                          />
                        </div>
                      </div>
                        </div> 
                        
                
                </div>
                
</div>



                      {/* GPS Coordinates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-2">Latitude *</label>
                          <input
                            type="text"
                            name="latitude"
                            value={product.latitude}
                            onChange={handleProductChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                            placeholder="e.g., 40.7128"
                          />
                           {errorlatitude && <p className="text-sm mt-2 text-accent">{errorlatitude}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-2">Longitude *</label>
                          <input
                            type="text"
                            name="longitude"
                            value={product.longitude}
                            onChange={handleProductChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-highlights focus:border-highlights transition-all"
                            placeholder="e.g., -74.0060"
                          />
                           {errorlongtitude && <p className="text-sm mt-2 text-accent">{errorlongtitude}</p>}
                        </div>
                      </div>
                  
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-500 mb-2">Cancellation Policy *</label>
                  <TiptapEditor
                    content={product.cancellation_policy}
                    onChange={handleCancellationPolicyChange}
                   
                  />
                   {errorcancelation && <p className="text-sm mt-2 text-accent">{errorcancelation}</p>}
                </div>  
                </div>      
                
                </div>    
          

<div >
              {/* Images Section */}
              <div >
               
                
             {/* Main Image Display */}
<div className="mb-2 bg-gray-50 rounded-xl p-2 mt-1">
  <label className="block text-sm font-semibold text-gray-500 mb-3">Main Image *</label>
  {!mainImagePreview ? (
    <label className="block w-full cursor-pointer">
      <div className="border-2 bg-white border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-highlights hover:bg-gray-50 transition-all h-72">
        <LuImagePlus className="w-12 h-12 text-gray-400 mx-auto mt-10" />
        <p className="text-lg font-medium text-gray-600 mb-1 font-playfair">Click to upload main image</p>
        <p className="text-sm text-gray-500">PNG, JPG, AVIF up to 10MB</p>
      </div>
      {errorimage && <p className="text-sm mt-2 text-accent">{errorimage}</p>}
      <input
        type="file"
        accept="image/*"
        onChange={handleMainImageChange}
        className="hidden"
      />
    </label>
  ) : (
    <div className="relative inline-block">
      <div className="relative group">
        {/* Use regular img tag for API images, Next.js Image for uploads */}

          <Image
            src={mainImagePreview}
            alt="Main preview"
            width={600}
            height={600}
            className="object-cover h-full w-full rounded-xl shadow-lg border-2 border-gray-200"
          />
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
          <button
            type="button"
            onClick={removeMainImage}
            className="w-10 h-10 bg-highlights text-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors shadow-lg opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="mt-3 text-center">
        <label className="inline-flex items-center gap-2 px-3 py-1 text-gray-800 rounded-3xl hover:bg-gray-100 border border-1 border-secondary transition-colors cursor-pointer font-medium">
          <Upload className="w-4 h-4" />
          Change Image
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )}
</div>
   
                {/* Additional Images */}
<div className="bg-gray-50 rounded-xl p-2">
  <label className="block text-sm font-semibold text-gray-500 mb-3">Additional Images</label>
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
    {/* Display fetched images */}
    {fetchedImages.map((img, index) => (
      <div key={`fetched-${img.id}`} className="relative group">
        <Image 
          src={`${process.env.NEXT_PUBLIC_IMAGE}/${img.image}`}
          alt={`Fetched image ${index + 1}`}
          width={150}
          height={150}
          className="w-full h-24 object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={() => handleDeleteFetchedImage(img.id, index)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-highlights text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
    
    {/* Display uploaded images */}
    {images.map((img, index) => (
      <div key={`uploaded-${index}`} className="relative group">
        <Image 
          src={img.url} 
          alt={`Preview ${index + 1}`}  
          width={150}
          height={150}
          className="w-full h-24 object-cover rounded-lg" 
        />
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-highlights text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
    
    {/* Upload new images button */}
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
  {(fetchedImages.length > 0 || images.length > 0) && (
    <p className="text-sm text-gray-500">
      {fetchedImages.length} existing image(s), {images.length} new image(s) selected
    </p>
  )}
</div>



              </div>

<div className='my-2'></div>







 {/* Reciept Image Display */}
<div className="mb-2 bg-gray-50 rounded-xl p-2 mt-1">
  <label className="block text-sm font-semibold text-gray-500 mb-3">Receipt Image *</label>
  {!recieptPreview ? (
    <label className="block w-full cursor-pointer">
      <div className="border-2 bg-white border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-highlights hover:bg-gray-50 transition-all h-72">
        <LuImagePlus className="w-12 h-12 text-gray-400 mx-auto mt-10" />
        <p className="text-lg font-medium text-gray-600 mb-1 font-playfair">Click to upload receipt image</p>
        <p className="text-sm text-gray-500">PNG, JPG, AVIF up to 10MB</p>
      </div>
      {errorreciept && <p className="text-sm mt-2 text-accent">{errorreciept}</p>}
      <input
        type="file"
        accept="image/*"
        onChange={handleReciepChange}
        className="hidden"
      />
    </label>
  ) : (
    <div className="relative inline-block">
      <div className="relative group">
        {/* Use regular img tag for API images, Next.js Image for uploads */}

          <Image
            src={recieptPreview}
            alt="Main preview"
            width={600}
            height={600}
            className="object-cover h-full w-full rounded-xl shadow-lg border-2 border-gray-200"
          />
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
          <button
            type="button"
            onClick={removeRecieptImage}
            className="w-10 h-10 bg-highlights text-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors shadow-lg opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="mt-3 text-center">
        <label className="inline-flex items-center gap-2 px-3 py-1 text-gray-800 rounded-3xl hover:bg-gray-100 border border-1 border-secondary transition-colors cursor-pointer font-medium">
          <Upload className="w-4 h-4" />
          Change Image
          <input
            type="file"
            accept="image/*"
            onChange={handleReciepChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )}
</div>












              {/* Nearby Attractions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h2 className="font-semibold text-gray-800 flex items-center gap-1 font-playfair">
                    
                      <MapPin className="w-5 h-5 text-gray-500" />
                  
                    Nearby Attractions
                  </h2>
                  <button
                    type="button"
                    onClick={addNearbyAttraction}
                    className="flex items-center gap-2 px-3 py-1  text-gray-600 rounded-3xl hover:bg-gray-100 border border-1 border-secondary transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Attraction
                  </button>
                </div>
                
                <div className="space-y-4">
                  {nearbyAttractions.map((attraction, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-2">Attraction Name</label>
                          <input
                            type="text"
                            name="name"
                            value={attraction.name}
                            onChange={(e) => handleNearbyChange(index, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:highlights focus:border-highlights"
                            placeholder="e.g., Central Park"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Distance</label>
                            <input
                              type="text"
                              name="distance"
                              value={attraction.distance}
                              onChange={(e) => handleNearbyChange(index, e)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:highlights focus:border-highlights"
                              placeholder="e.g., 5 min walk"
                            />
                          </div>
                            {attraction.id == ''? nearbyAttractions.length > 1 && (
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeNearbyAttraction(index)}
                                className="p-2 text-highlights hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          )
                           :
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => handleDeleteNearby(attraction.id,index)}
                                className="p-2 text-highlights hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                         }
                        
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
<div className='my-2'></div>


              {/* Awards */}
              <div className="bg-gray-50 rounded-xl p-6">
               <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                  <h2 className="font-semibold text-gray-800 flex items-center gap-1 font-playfair">
                 
                      <Award className="w-5 h-5 text-gray-500" />
                 
                    Awards & Recognition
                  </h2>
                  <button
                    type="button"
                    onClick={addAward}
                    className="flex items-center gap-2 px-3 py-1  text-gray-600 rounded-3xl hover:bg-gray-100 border border-1 border-secondary transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Award
                  </button>
                </div>
                
                <div className="space-y-4">
                  {awards.map((award, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-2">Award Name</label>
                          <input
                            type="text"
                            name="name"
                            value={award.name}
                            onChange={(e) => handleAwardChange(index, e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-highlights focus:border-highlights"
                            placeholder="e.g., Best Hotel 2024"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Year</label>
                            <input
                              type="number"
                              name="year"
                              value={award.year}
                              onChange={(e) => handleAwardChange(index, e)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-highlights focus:border-highlights"
                              placeholder="2024"
                            />
                          </div>
                          {award.id == ''? awards.length > 1 && (
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeAward(index)}
                                className="p-2 text-highlights hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          )
                           :
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => handleDeleteAward(award.id,index)}
                                className="p-2 text-highlights hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                         }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

               </div>
            

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
                      Edit...
                    </span>
                  ) : (
                    'Edit'
                  )}
                </button>
              </div>  

                <div className="flex justify-center pt-6 mb-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-white w-full text-gray-600 border border-1 font-semibold rounded-xl hover:bg-highlights hover:text-white" 
                  onClick={()=>router.push('/en/account/listings')} 
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