import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import useMutation from "@/hooks/use-mutation";
import useQuery from "@/hooks/use-query";
import { useAuth } from "./auth-context";

const WishlistContext = createContext({});

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist data from API
  const { execute: fetchWishlist, loading: fetchLoading, refetch } = useQuery({
    url: "wishlist",
    method: "GET",
    guard: true,
    immediate: false,
    onSuccess: (data) => {
      setWishlistItems(data || []);
      setLoading(false);
    },
    onError: (error) => {
      console.error("Failed to fetch wishlist:", error);
      setWishlistItems([]);
      setLoading(false);
    },
  });

  // Add to wishlist mutation
  const { mutate: addToWishlistMutation, loading: addToWishlistLoading } = useMutation({
    url: "/wishlist",
    method: "POST",
    guard: true,
    onSuccess: (data) => {
      refetch();
      toast.success("Book added to wishlist!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to add to wishlist";
      toast.error(message);
    },
  });

  // Remove from wishlist mutation
  const { mutate: removeFromWishlistMutation, loading: removeFromWishlistLoading } = useMutation({
    url: "/wishlist",
    method: "DELETE",
    guard: true,
    onSuccess: (data, variables) => {
      refetch();
      toast.success("Book removed from wishlist!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to remove from wishlist";
      toast.error(message);
    },
  });

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToWishlist = useCallback(
    async (bookId) => {
      if (!isAuthenticated) {
        toast.error("Please login to add to wishlist");
        return false;
      }

      // Check if already in wishlist
      if (isInWishlist(bookId)) {
        toast.info("Book is already in your wishlist");
        return false;
      }

      const result = await addToWishlistMutation({ book_id: bookId });
      return result;
    },
    [isAuthenticated, addToWishlistMutation, wishlistItems]
  );

  const removeFromWishlist = useCallback(
    async (itemId) => {
      if (!isAuthenticated) {
        toast.error("Please login to remove from wishlist");
        return false;
      }

      const result = await removeFromWishlistMutation(
        { item_id: itemId },
        `/${itemId}`
      );
      return result;
    },
    [isAuthenticated, removeFromWishlistMutation]
  );

  const isInWishlist = useCallback(
    (bookId) => {
      return wishlistItems.some((item) => item.book_id === bookId);
    },
    [wishlistItems]
  );

  const getWishlistItemId = useCallback(
    (bookId) => {
      const item = wishlistItems.find((item) => item.book_id === bookId);
      return item?.id;
    },
    [wishlistItems]
  );

  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    loading: loading || fetchLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistItemId,
    getWishlistCount,
    addToWishlistLoading,
    removeFromWishlistLoading,
    refetchWishlist: fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};