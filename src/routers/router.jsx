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
import Contact from "../pages/Contact";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoute from "../components/ProtectedRoute"

import Profile from "../pages/profile/Profile";
import Wishlist from "../pages/wishlist/Wishlist";

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
      }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
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