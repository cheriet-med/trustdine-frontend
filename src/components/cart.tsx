'use client'
// src/contexts/WishlistContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
const WISHLIST_STORAGE_KEY = "wishlist";

// Simplified wishlist item structure
type WishlistItem = {
  id: string;
  image: string;
  title: string;
  dateAdded: Date;
  category:string;
  cuisine:string;
  price_range:string;
  rating:number;
  name:string;
  location:string;
  price: string | number;
  lengtReviews:string | number
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addItemToWishlist: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  removeItemFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isItemInWishlist: (id: string) => boolean;
  getWishlistCount: () => number;
  moveToCart?: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistProviderProps = {
  children: ReactNode;
};

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        try {
          const parsed = JSON.parse(savedWishlist);
          // Convert dateAdded back to Date objects
          const wishlistWithDates = parsed.map((item: any) => ({
            ...item,
            dateAdded: new Date(item.dateAdded)
          }));
          setWishlist(wishlistWithDates);
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  const addItemToWishlist = (item: Omit<WishlistItem, 'dateAdded'>) => {
    setWishlist((prevWishlist) => {
      const existingItem = prevWishlist.find((wishlistItem) => wishlistItem.id === item.id);
      if (existingItem) {
        // Item already exists in wishlist, don't add duplicate
        return prevWishlist;
      }
      // Add new item with current date
      const newItem: WishlistItem = {
        ...item,
        dateAdded: new Date()
      };
      return [...prevWishlist, newItem];
    });
  };

  const removeItemFromWishlist = (id: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  const isItemInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const moveToCart = (id: string) => {
    const item = wishlist.find((wishlistItem) => wishlistItem.id === id);
    if (item) {
      removeItemFromWishlist(id);
      console.log('Item moved to cart:', item);
    }
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        addItemToWishlist, 
        removeItemFromWishlist, 
        clearWishlist, 
        isItemInWishlist, 
        getWishlistCount,
        moveToCart 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = React.useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};