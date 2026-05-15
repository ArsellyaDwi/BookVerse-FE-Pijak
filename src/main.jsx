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
import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Token dari localStorage:', token); // Debug
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Header Authorization terpasang:', config.headers.Authorization);
        } else {
            console.log('Token tidak ditemukan');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster />
    <LoadingProvider>
      <GlobalLoadingSpinner />
      <RouterProvider router={router} />
    </LoadingProvider>
  </StrictMode>
);