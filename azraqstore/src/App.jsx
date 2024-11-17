import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Cart from "./Pages/Cart/Cart";

import Footer from "./components/Footer/Footer";

import ContactUs from "./Pages/ContactUs/ContactUs";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Admin from "./Pages/Admin/Admin";

import ProfilePage from "./Pages/ProfilePage/ProfilePage";

import RestaurantGrid from "./components/resturants/RestaurantGrid";
import RestaurantDetails from "./components/resturants/RestaurantDetails";
import Login from "./components/login-signup/Login";
import SignUp from "./components/login-signup/SignUp";
import ProductDetails from "./components/Products/productDetails";
import DriverOrdersPage from "./Pages/driverpage/driver";
import DriverRouteGuard from "./Pages/driverpage/driverRouteGuard";
import LandingPage from "./Pages/Home/Landingpage";
import Restaurants from "./Pages/Admin/Restaurants";
import Products from "./Pages/Admin/Products";
import Drivers from "./Pages/Admin/Drivers";
import AllUsers from "./Pages/Admin/AllUsers";
import RestaurantsPage from "./Pages/Restaurants/RestaurantsPage";

// Add new imports for restaurant owner features
import RestaurantOwnerDashboard from "./Pages/RestaurantOwner/Dashboard";
import RestaurantOwnerRegister from "./components/auth/RestaurantOwnerRegister";
import ProtectedRoute from "./components/ProtectedRoute";

// First import the Profit component at the top
import Profit from "./Pages/Admin/components/Profit";
import RestaurantManagement from "./Pages/Admin/components/RestaurantManagement";
import TestimonialManagement from './Pages/Admin/TestimonialManagement';
import ContactMessages from './Pages/Admin/ContactMessages';

// Add this to your imports
import RequestForm from './Pages/RequestForm/RequestForm';
import RequestManagement from './Pages/Admin/RequestManagement';

const App = () => {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="products" element={<Products />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="profit" element={<Profit />} />
          <Route path="restaurant-management" element={<RestaurantManagement />} />
          <Route path="testimonials" element={<TestimonialManagement />} />
          <Route path="contact-messages" element={<ContactMessages />} />
          <Route path="requests" element={<RequestManagement />} />
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cart" element={<Cart />} />
   
       
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />

     
    
        <Route path="/driver" element={<DriverOrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resturant" element={<RestaurantGrid />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductDetails />} />
       
        <Route path="/guard" element={<DriverRouteGuard />} />
        <Route path="/resturantpage" element={<RestaurantsPage />} />

        {/* Restaurant Owner Routes */}
        <Route 
          path="/restaurant-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['restaurant_owner']}>
              <RestaurantOwnerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/register/restaurant-owner" element={<RestaurantOwnerRegister />} />
    
        <Route path="/request" element={<RequestForm />} />
      </Routes>
      {location.pathname !== "/admin" && <Footer />}
      {/* {location.pathname !== "/driver" && <Footer />} */}
    </div>
  );
};

export default App;
