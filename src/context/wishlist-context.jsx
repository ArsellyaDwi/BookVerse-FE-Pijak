import { createContext, useContext, useState, ReactNode } from "react";

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToWishlist = (id) => {
    setWishlistItems((prev) => [...prev, id]);
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item !== id));
  };

  const isInWishlist = (id) => {
    return wishlistItems.includes(id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
