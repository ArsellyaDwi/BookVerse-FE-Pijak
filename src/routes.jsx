import { createBrowserRouter, Outlet } from "react-router";
import Homepage from "./pages/home-page";
import BookDetail from "./pages/book-detail";
import CheckoutPage from "./pages/checkout-page";
import PaymentPage from "./pages/payment-page";
import RegisterPage from "./pages/register-page";
import TransactionsPage from "./pages/transactions-page";
import AuthLayout from "./layouts/AuthLayout";
import { AuthProvider } from "./context/auth-context";
import LoginPage from "./pages/login-page";
import { CartProvider } from "./context/cart-context";
import { WishlistProvider } from "./context/wishlist-context";
import ForgotPasswordPage from "./pages/forgot-password";
import ResetPasswordPage from "./pages/reset-password";
import BookListPage from "./pages/book-list-page";
import MyAddressPage from "./pages/my-address-page";
import AddAddressPage from "./pages/add-address-page";
import EditAddressPage from "./pages/edit-address-page";
import MyTransactionsPage from "./pages/my-transactions";
import TransactionDetailPage from "./pages/transaction-detail-page";
import ContactUsPage from "./pages/contact-us-page";
import { ContactProvider } from "./context/contact-context";
import FAQPage from "./pages/faq-page";
import MyAccountPage from "./pages/my-account";
import GenresPage from "./pages/genre-page";
import GenreDetailPage from "./pages/genre-detail-page";
import TermsPage from "./pages/terms";
import PrivacyPage from "./pages/privacy";
import ReturnPolicyPage from "./pages/return-policy";
import EditorsChoicePage from "./pages/editors-choice-page";
import NewReleasesPage from "./pages/new-releases-page";
import RecommendationsPage from "./pages/recommendations-page";
import CommunityQuotes from '@/pages/community-quotes';
import PersonalityQuizPage from "./pages/personality-quiz-page";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <AuthProvider>
        <ContactProvider>
          <WishlistProvider>
            <CartProvider>
              <Outlet />
            </CartProvider>
          </WishlistProvider>
        </ContactProvider>
      </AuthProvider>
    ),
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
        path: "/recommendations",
        element: <RecommendationsPage />,
      },
      {
        path: "/community",
        element: <CommunityQuotes />,
      },
      {
        path: "/personality-quiz",
        element: <PersonalityQuizPage />,
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
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "/genres/all",
        element: <GenresPage />,
      },
      {
        path: "/genres/:slug",
        element: <GenreDetailPage />,
      },
      {
        path: "/books",
        element: <BookListPage />,
      },
      {
        path: "/faq",
        element: <FAQPage />,
      },
      {
        path: "/contact",
        element: <ContactUsPage />,
      },
      {
        path: "/terms",
        element: <TermsPage />,
      },
      {
        path: "/privacy",
        element: <PrivacyPage />,
      },
      {
        path: "/return-policy",
        element: <ReturnPolicyPage />,
      },
      {
        path: "/editors-choice",
        element: <EditorsChoicePage />,
      },
      {
        path: "/new-releases",
        element: <NewReleasesPage />,
      },
      {
        path: "/my-account",
        element: <MyAccountPage />,
      },
      {
        path: "",
        element: <AuthLayout />,
        children: [
          {
            path: "/checkout",
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
            path: "my-address",
            element: <MyAddressPage />,
          },
          {
            path: "/my-address/add",
            element: <AddAddressPage />,
          },
          {
            path: "/my-address/edit/:id",
            element: <EditAddressPage />,
          },
          {
            path: "/payment/:id",
            element: <PaymentPage />,
          },
          {
            path: "/my-transactions",
            element: <MyTransactionsPage />,
          },
          {
            path: "/my-transactions/:id",
            element: <TransactionDetailPage />,
          },
        ],
      },
    ],
  },
]);

export { router };