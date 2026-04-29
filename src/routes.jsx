import { createBrowserRouter, Outlet } from "react-router";
import Homepage from "./pages/home-page";
import BookDetail from "./pages/book-detail";
import CheckoutPage from "./pages/checkout-page";
import PaymentPage from "./pages/payment-page";
import RegisterPage from "./pages/register-page";
import TransactionsPage from "./pages/transactions-page";
import CartPage from "./pages/cart-page";
import GenresPage from "./pages/genres-page";
import AuthLayout from "./layouts/AuthLayout";
import { AuthProvider } from "./context/auth-context";
import LoginPage from "./pages/login-page";
import { CartProvider } from "./context/cart-context";
import { WishlistProvider } from "./context/wishlist-context";

const router = createBrowserRouter([
  {
    path: "",
    element: <AuthProvider children={
      <WishlistProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </WishlistProvider>

    } />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "books/:id",
        element: <BookDetail />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "genres/:name",
        element: <GenresPage />,
      },
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "payment",
            element: <PaymentPage />,
          },
          {
            path: "transactions",
            element: <TransactionsPage />,
          },
          {
            path: "cart",
            element: <CartPage />,
          },
        ],
      },
    ],
  },
]);

export { router };
