import Navbar from "./components/Navbar/Navbar";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import DeliveryInfo from "./components/DeliveryInfo/DeliveryInfo";

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
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;

