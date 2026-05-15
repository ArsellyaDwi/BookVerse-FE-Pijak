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

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Fetch cart data from API
  const { execute: fetchCart, loading: fetchLoading, refetch } = useQuery({
    url: "cart",
    method: "GET",
    guard: true,
    immediate: false,
    onSuccess: (data) => {
      // Transform API response to match cart structure
      const items = (data || []).map((item) => ({
        id: item.id,
        cart_id: item.cart_id,
        book_id: item.book_id,
        quantity: item.qty || item.quantity || 1,
        book: item.book,
      }));
      setCartItems(items);
      setLoading(false);
    },
    onError: (error) => {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
      setLoading(false);
    },
  });

  // Add to cart mutation (PLUS)
  const { mutate: addToCartMutation, loading: addToCartLoading } = useMutation({
    url: "cart",
    method: "POST",
    guard: true,
    onSuccess: (data) => {
      refetch();

      toast.success(`book(s) added to cart!`);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to add to cart";
      toast.error(message);
    },
  });

  // Minus cart mutation (DECREASE)
  const { mutate: minusCartMutation, loading: minusCartLoading } = useMutation({
    url: "cart/minus",
    method: "POST",
    guard: true,
    onSuccess: (data) => {
      toast.success("Quantity decreased!");
      refetch();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to decrease quantity";
      toast.error(message);
    },
  });

  // Remove from cart mutation (DELETE by ID)
  const { mutate: removeFromCartMutation, loading: removeFromCartLoading } = useMutation({
    url: "/cart",
    method: "DELETE",
    guard: true,
    onSuccess: (data) => {
      refetch();
      toast.success("Book removed from cart!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to remove from cart";
      toast.error(message);
    },
  });

  // Remove by book_id mutation
  const { mutate: removeByBookIdMutation, loading: removeByBookIdLoading } = useMutation({
    url: "/cart",
    method: "DELETE",
    guard: true,
    onSuccess: (data, variables) => {
      refetch();
      toast.success("Book removed from cart!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to remove from cart";
      toast.error(message);
    },
  });

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ADD to cart (PLUS)
  const addToCart = useCallback(
    async (bookId, qty = 1, bookData = null) => {
      if (!isAuthenticated) {
        toast.error("Please login to add to cart");
        return false;
      }

      const result = await addToCartMutation({ book_id: bookId, qty });
      return result;
    },
    [isAuthenticated]
  );

  // MINUS from cart (DECREASE)
  const minusCart = useCallback(
    async (bookId, qty = 1) => {
      if (!isAuthenticated) {
        toast.error("Please login to update cart");
        return false;
      }

      const result = await minusCartMutation({ book_id: bookId, qty });
      return result;
    },
    [isAuthenticated,]
  );

  // Remove from cart by item ID
  const removeFromCart = useCallback(
    async (itemId) => {
      if (!isAuthenticated) {
        toast.error("Please login to remove from cart");
        return false;
      }

      const result = await removeFromCartMutation(
        { item_id: itemId },
        `${itemId}`
      );
      return result;
    },
    [isAuthenticated, removeFromCartMutation]
  );

  // Remove from cart by book ID
  const removeByBookId = useCallback(
    async (bookId) => {
      if (!isAuthenticated) {
        toast.error("Please login to remove from cart");
        return false;
      }

      const result = await removeByBookIdMutation({
      }, `/${bookId}`);
      return result;
    },
    [isAuthenticated, removeByBookIdMutation]
  );

  // Update quantity (combine plus and minus)
  const updateQuantity = useCallback(
    async (bookId, currentQuantity, newQuantity) => {
      if (newQuantity > currentQuantity) {
        // Add more
        const diff = newQuantity - currentQuantity;
        await addToCart(bookId, diff);
      } else if (newQuantity < currentQuantity) {
        // Remove some
        const diff = currentQuantity - newQuantity;
        await minusCart(bookId, diff);
      }
    },
    [addToCart, minusCart]
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please login to clear cart");
      return false;
    }

    // Delete all items by book_id
    for (const item of cartItems) {
      await removeByBookId(item.book_id);
    }
    toast.success("Cart cleared!");
  }, [isAuthenticated, cartItems, removeByBookId]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce(
      (sum, item) => sum + ((parseFloat(item.book?.price) || 0) * (item.quantity || 0)),
      0
    );
  }, [cartItems]);

  const getCartItemId = useCallback(
    (bookId) => {
      const item = cartItems.find((item) => item.book_id === bookId);
      return item?.id;
    },
    [cartItems]
  );

  const getItemQuantity = useCallback(
    (bookId) => {
      const item = cartItems.find((item) => item.book_id === bookId);
      return item?.quantity || 0;
    },
    [cartItems]
  );

  const value = {
    cartItems,
    loading: loading || fetchLoading,
    addToCart,
    minusCart,
    removeFromCart,
    removeByBookId,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItemId,
    getItemQuantity,
    addToCartLoading,
    minusCartLoading,
    removeFromCartLoading,
    removeByBookIdLoading,
    refetchCart: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};