// import React from 'react'
// import { Routes, Route, useLocation } from "react-router-dom"
// import Navbar from "./components/Navbar/Navbar"
// import Footer from "./components/Footer/Footer"
// import Admin from "./Pages/Admin/Admin"
// import Restaurants from "./Pages/Admin/Restaurants"
// import Products from "./Pages/Admin/Products"
// import Drivers from "./Pages/Admin/Drivers"
// import AllUsers from "./Pages/Admin/AllUsers"
// // ... other imports

// const App = () => {
//   const location = useLocation()

//   return (
//     <div className="app">
//       <Navbar />
//       <Routes>
//         <Route path="/admin" element={<Admin />}>
//           <Route path="restaurants" element={<Restaurants />} />
//           <Route path="products" element={<Products />} />
//           <Route path="drivers" element={<Drivers />} />
//           <Route path="users" element={<AllUsers />} />
//         </Route>
//         {/* ... other routes */}
//       </Routes>
//       {location.pathname !== "/admin" && <Footer />}
//     </div>
//   )
// }

// export default App


import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Cart from "./Pages/Cart/Cart";

import Footer from "./components/Footer/Footer";
import DeliveryInfo from "./components/DeliveryInfo/DeliveryInfo";
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
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cart" element={<Cart />} />
   
        <Route path="/delivryInfo" element={<DeliveryInfo />} />
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
      </Routes>
      {location.pathname !== "/admin" && <Footer />}
      {location.pathname !== "/driver" && <Footer />}
    </div>
  );
};

export default App;