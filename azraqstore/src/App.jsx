import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import DeliveryInfo from "./components/DeliveryInfo/DeliveryInfo";
import ContactUs from "./Pages/ContactUs/ContactUs";
import AboutUs from "./Pages/AboutUs/AboutUs";



const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const food_list = [
    {
      _id: "1",
      name: "Greek salad",
      image: "path/to/food_1", // قم بإدراج المسار الصحيح للصورة
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
    }
  ];

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        
        <Navbar setShowLogin={setShowLogin} />

        <Routes>
       
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart foodList={food_list} />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/delivryInfo" element={<DeliveryInfo />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Routes>
        <Footer />
        
        
      </div>
    </>
  );
};

export default App;

