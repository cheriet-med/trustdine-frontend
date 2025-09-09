'use client'
// src/contexts/WishlistContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

// Simplified wishlist item structure
type WishlistItem = {
  id: string;
  image: string;
  title: string;
  dateAdded: Date;
  category: string;
  cuisine: string;
  price_range: string;
  rating: number;
  name: string;
  location: string;
  price: string | number | null;
  lengtReviews: string | number;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addItemToWishlist: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  removeItemFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  isItemInWishlist: (id: string) => boolean;
  getWishlistCount: () => number;
  moveToCart?: (id: string) => void;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistProviderProps = {
  children: ReactNode;
};

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate storage key based on user session
  const getStorageKey = () => {
    if (session?.user?.email) {
      return `wishlist_${session.user.email}`;
    }
    return "wishlist_guest"; // Fallback for non-authenticated users
  };

  // Load wishlist from sessionStorage
  const loadWishlistFromSession = () => {
    if (typeof window !== "undefined") {
      const storageKey = getStorageKey();
      const savedWishlist = sessionStorage.getItem(storageKey);
      
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
          console.error('Error parsing wishlist from sessionStorage:', error);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    }
  };

  // Save wishlist to sessionStorage
  const saveWishlistToSession = (wishlistData: WishlistItem[]) => {
    if (typeof window !== "undefined" && isHydrated) {
      const storageKey = getStorageKey();
      sessionStorage.setItem(storageKey, JSON.stringify(wishlistData));
    }
  };

  // Handle session changes and hydration
  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (typeof window !== "undefined") {
      loadWishlistFromSession();
      setIsHydrated(true);
      setIsLoading(false);
    }
  }, [session, status]);

  // Save wishlist whenever it changes
  useEffect(() => {
    if (isHydrated && !isLoading) {
      saveWishlistToSession(wishlist);
    }
  }, [wishlist, isHydrated, isLoading]);

  // Clear wishlist when user logs out or switches accounts
  useEffect(() => {
    if (isHydrated && status !== "loading") {
      // If user changes (login/logout), reload the appropriate wishlist
      loadWishlistFromSession();
    }
  }, [session?.user?.email, isHydrated, status]);

  const addItemToWishlist = (item: Omit<WishlistItem, 'dateAdded'>) => {
    if (isLoading) return;

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
    if (isLoading) return;

    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id));
  };

  const clearWishlist = () => {
    if (isLoading) return;

    setWishlist([]);
    // Also clear from sessionStorage
    if (typeof window !== "undefined") {
      const storageKey = getStorageKey();
      sessionStorage.removeItem(storageKey);
    }
  };

  const isItemInWishlist = (id: string) => {
    return wishlist.some((item) => item.id === id);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  const moveToCart = (id: string) => {
    if (isLoading) return;

    const item = wishlist.find((wishlistItem) => wishlistItem.id === id);
    if (item) {
      removeItemFromWishlist(id);
      console.log('Item moved to cart:', item);
      // Here you could integrate with a cart context or API
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
        moveToCart,
        isLoading
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