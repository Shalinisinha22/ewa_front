import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/home/Home";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/shop/ShopPage";
import SingleProduct from "../pages/shop/productDetails/SingleProduct";
import CartScreen from "../pages/cart/CartScreen";
import AboutUs from "../pages/AboutUs";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsConditions from "../pages/TermsConditions";
import ReturnPolicy from "../pages/ReturnPolicy";
import ShippingPolicy from "../pages/ShippingPolicy";
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoute from "../Components/ProtectedRoute"
import NewArrivals from "../pages/NewArrivals";
import BlogPage from "../pages/blog/BlogPage";
import BlogPost from "../pages/blog/BlogPost";

import Profile from "../pages/profile/Profile";
import Wishlist from "../pages/wishlist/Wishlist";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import OrderConfirmationPage from "../pages/checkout/OrderConfirmationPage";
import CustomerOrders from "../pages/profile/CustomerOrders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/new-arrivals",
        element: <NewArrivals />
      },
      {
        path: "/categories/:category",
        element: <CategoryPage />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/shop",
        element: <ShopPage />
      },
      {
        path: "/shop/:id",
        element: <SingleProduct />
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <CartScreen />
          </ProtectedRoute>
        )
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/order-confirmation/:orderId",
        element: (
          <ProtectedRoute>
            <OrderConfirmationPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <CustomerOrders />
          </ProtectedRoute>
        )
      },
  
      {
        path: "/about",
        element: <AboutUs />
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
      },
      {
        path: "/terms-conditions",
        element: <TermsConditions />
      },
      {
        path: "/return-policy",
        element: <ReturnPolicy />
      },
      {
        path: "/shipping-policy",
        element: <ShippingPolicy />
      },
      {
        path: "/blog",
        element: <BlogPage />
      },
      {
        path: "/blog/:id",
        element: <BlogPost />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/wishlist",
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        )
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
      }
    ]
  }
]);

export default router;