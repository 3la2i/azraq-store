
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import DeliveryInfo from "./components/DeliveryInfo/DeliveryInfo";
import ContactUs from "./Pages/ContactUs/ContactUs";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Admin from "./Pages/Admin/Admin";
import AddItem from "./Pages/Admin/AddItem/AddItem";
import SideBar from "./Pages/Admin/SideBar/SideBar";
import ListItems from "./Pages/Admin/ListItem/ListItems";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import Orders from "./Pages/Admin/Orders/Orders";
import RestaurantGrid from "./components/resturants/RestaurantGrid";
import RestaurantDetails from "./components/resturants/RestaurantDetails";
import Login from "./components/login-signup/Login";
import SignUp from "./components/login-signup/SignUp";
import ProductDetails from "./components/Products/productDetails";
import DriverOrdersPage from "./Pages/driverpage/driver";
import DriverRouteGuard from "./Pages/driverpage/driverRouteGuard";





const App = () => {
  const location = useLocation();

  // const food_list = [
  //   {
  //     _id: "1",
  //     name: "Greek salad",
  //     image: "path/to/food_1",
  //     price: 12,
  //     description: "Food provides essential nutrients for overall health and well-being",
  //     category: "Salad"
  //   }
  // ];

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/delivryInfo" element={<DeliveryInfo />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/additem" element={<><SideBar/><AddItem /></>} />
        <Route path="/listitems" element={<><SideBar/><ListItems /></>} />
        <Route path="/orders" element={<><SideBar/><Orders /></>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resturant" element={<RestaurantGrid />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductDetails />} />
       
        <Route path="/driver" element={<DriverOrdersPage />} />
        <Route path="/guard" element={<DriverRouteGuard />} />
        
       
      </Routes>
      {location.pathname !== "/admin" && <Footer />}
    </div>
  );
};

export default App;







//for popuplogin
// import Navbar from "./components/Navbar/Navbar";
// import "./App.css";
// import { Routes, Route, useLocation } from "react-router-dom";
// import Home from "./Pages/Home/Home";
// import Cart from "./Pages/Cart/Cart";
// import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
// import Footer from "./components/Footer/Footer";
// import { useState } from "react";
// import LoginPopup from "./components/LoginPopup/LoginPopup";
// import DeliveryInfo from "./components/DeliveryInfo/DeliveryInfo";
// import ContactUs from "./Pages/ContactUs/ContactUs";
// import AboutUs from "./Pages/AboutUs/AboutUs";
// import Admin from "./Pages/Admin/Admin";
// import AddItem from "./Pages/Admin/AddItem/AddItem";
// import SideBar from "./Pages/Admin/SideBar/SideBar";
// import ListItems from "./Pages/Admin/ListItem/ListItems";
// import ProfilePage from "./Pages/ProfilePage/ProfilePage";
// import Orders from "./Pages/Admin/Orders/Orders";
// import RestaurantGrid from "./components/resturants/RestaurantGrid";
// import RestaurantDetails from "./components/resturants/RestaurantDetails";

// const App = () => {
//   const [showLogin, setShowLogin] = useState(false);
//   const location = useLocation(); // Get the current location

//   const food_list = [
//     {
//       _id: "1",
//       name: "Greek salad",
//       image: "path/to/food_1",
//       price: 12,
//       description: "Food provides essential nutrients for overall health and well-being",
//       category: "Salad"
//     }
//   ];

//   return (
//     <>
//       {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
//       <div className="app">
//         <Navbar setShowLogin={setShowLogin} />
//         <Routes>
//           <Route path="/admin" element={<Admin />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/cart" element={<Cart foodList={food_list} />} />
//           <Route path="/order" element={<PlaceOrder />} />
//           <Route path="/delivryInfo" element={<DeliveryInfo />} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/aboutus" element={<AboutUs />} />
//           <Route path="/additem" element={<><SideBar/><AddItem /></>} />
//           <Route path="/listitems" element={<><SideBar/><ListItems /></>} />
//           <Route path="/orders" element={<><SideBar/><Orders /></>} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/resturant" element={<RestaurantGrid />} />
//           <Route path="/restaurant/:id" element={<RestaurantDetails />} />
//         </Routes>
//         {location.pathname !== "/admin" && <Footer />} {/* Conditionally render Footer */}
//       </div>
//     </>
//   );
// };

// export default App;






























// import Navbar from "./components/Navbar/Navbar";
// import "./App.css";
// import { Routes, Route } from "react-router-dom";
// import Home from "./Pages/Home/Home";
// import Cart from "./Pages/Cart/Cart";
// import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
// import Footer from "./components/Footer/Footer";
// import { useState } from "react";
// import LoginPopup from "./components/LoginPopup/LoginPopup";
// import DeliveryInfo from "./components/DeliveryInfo/DeliveryInfo";
// import ContactUs from "./Pages/ContactUs/ContactUs";
// import AboutUs from "./Pages/AboutUs/AboutUs";
// import Admin from "./Pages/Admin/Admin";
// import AddItem from "./Pages/Admin/AddItem/AddItem";
// import SideBar from "./Pages/Admin/SideBar/SideBar";
// import ListItems from "./Pages/Admin/ListItem/ListItems";
// import ProfilePage from "./Pages/ProfilePage/ProfilePage";
// import Orders from "./Pages/Admin/Orders/Orders";
// import RestaurantGrid from "./components/resturants/RestaurantGrid";
// import RestaurantDetails from "./components/resturants/RestaurantDetails";




// const App = () => {
//   const [showLogin, setShowLogin] = useState(false);

//   const food_list = [
//     {
//       _id: "1",
//       name: "Greek salad",
//       image: "path/to/food_1",
//       price: 12,
//       description: "Food provides essential nutrients for overall health and well-being",
//       category: "Salad"
//     }
//   ];

//   return (
//     <>
//       {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
//       <div className="app">
//         <Routes>
//           <Route path="/admin" element={<> <Admin /> </>} />
//           <Route path="/" element={<><Navbar setShowLogin={setShowLogin} /><Home /><Footer /></>} />
//           <Route path="/cart" element={<><Navbar setShowLogin={setShowLogin} /><Cart foodList={food_list} /><Footer /></>} />
//           <Route path="/order" element={<><Navbar setShowLogin={setShowLogin} /><PlaceOrder /><Footer /></>} />
//           <Route path="/delivryInfo" element={<><Navbar setShowLogin={setShowLogin} /><DeliveryInfo /><Footer /></>} />
//           <Route path="/contact" element={<><Navbar setShowLogin={setShowLogin} /><ContactUs /><Footer /></>} />
//           <Route path="/aboutus" element={<><Navbar setShowLogin={setShowLogin} /><AboutUs /><Footer /></>} />
//           <Route path="/additem" element={<><Navbar setShowLogin={setShowLogin} /> <SideBar/><AddItem /> </>} />
//           <Route path="/listitems" element={<><Navbar setShowLogin={setShowLogin} /> <SideBar/><ListItems /> </>} />
//           <Route path="/orders" element={<><Navbar setShowLogin={setShowLogin} /><SideBar/><Orders /></>} />
//           <Route path="/profile" element={<><Navbar setShowLogin={setShowLogin} /><ProfilePage /><Footer /></>} />
//           <Route path="/resturant" element={<><Navbar setShowLogin={setShowLogin} /><RestaurantGrid /><Footer /></>} />
//           <Route path="/restaurant/:id" element={<><Navbar setShowLogin={setShowLogin} /><RestaurantDetails /><Footer /></>} />

//         </Routes>
//       </div>
//     </>
//   );
// };

// export default App;
