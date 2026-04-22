import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes.jsx";
import { WishlistProvider } from "./context/wishlist-context";
import { CartProvider } from "./context/cart-context";
import "@/lib/config";
import Toaster from "./components/toaster";
import { LoadingProvider } from "./context/loading-context";
import GlobalLoadingSpinner from "./components/global-loading-spinner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster />
    <LoadingProvider>
      <GlobalLoadingSpinner />
      <WishlistProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </WishlistProvider>
    </LoadingProvider>
  </StrictMode>
);
