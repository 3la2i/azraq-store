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
import Admin from "./Pages/Admin/Admin";
import AddItem from "./Pages/Admin/AddItem/AddItem";
import SideBar from "./Pages/Admin/SideBar/SideBar";
import ListItems from "./Pages/Admin/ListItem/ListItems";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import Orders from "./Pages/Admin/Orders/Orders";




const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  const food_list = [
    {
      _id: "1",
      name: "Greek salad",
      image: "path/to/food_1",
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
    }
  ];

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Routes>
          <Route path="/admin" element={<> <Admin /> </>} />
          <Route path="/" element={<><Navbar setShowLogin={setShowLogin} /><Home /><Footer /></>} />
          <Route path="/cart" element={<><Navbar setShowLogin={setShowLogin} /><Cart foodList={food_list} /><Footer /></>} />
          <Route path="/order" element={<><Navbar setShowLogin={setShowLogin} /><PlaceOrder /><Footer /></>} />
          <Route path="/delivryInfo" element={<><Navbar setShowLogin={setShowLogin} /><DeliveryInfo /><Footer /></>} />
          <Route path="/contact" element={<><Navbar setShowLogin={setShowLogin} /><ContactUs /><Footer /></>} />
          <Route path="/aboutus" element={<><Navbar setShowLogin={setShowLogin} /><AboutUs /><Footer /></>} />
          <Route path="/additem" element={<><Navbar setShowLogin={setShowLogin} /> <SideBar/><AddItem /> </>} />
          <Route path="/listitems" element={<><Navbar setShowLogin={setShowLogin} /> <SideBar/><ListItems /> </>} />
          <Route path="/orders" element={<><Navbar setShowLogin={setShowLogin} /><SideBar/><Orders /><Footer /></>} />
          <Route path="/profile" element={<><Navbar setShowLogin={setShowLogin} /><ProfilePage /><Footer /></>} />

        </Routes>
      </div>
    </>
  );
};

export default App;
