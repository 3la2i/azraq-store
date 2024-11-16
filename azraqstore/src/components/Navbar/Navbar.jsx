import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react'; // Import the User icon from lucide-react

const Navbar = () => {
  const [menu, setMenu] = useState("menu");
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // Change isLoggedIn to isAuthenticated
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between py-4 px-6">
        <Link to="/">
          <img src={assets.logo} className="w-32" alt="logo" />
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 text-2xl focus:outline-none"
          >
            {isOpen ? "✖️" : "☰"}
          </button>
        </div>

        <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? "block" : "hidden"}`}>
          <ul className="md:flex md:gap-6 mt-4 md:mt-0 list-none text-gray-800 text-lg mr-11">
            <li
              onClick={() => setMenu("home")}
              className={`${
                menu === "home" ? "border-b-2 border-gray-800 pb-1" : ""
              } cursor-pointer`}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              onClick={() => setMenu("contact us")}
              className={`${
                menu === "contact us" ? "border-b-2 border-gray-800 pb-1" : ""
              } cursor-pointer`}
            >
              <Link to="/contact">Contact Us</Link>
            </li>
            <li
              onClick={() => setMenu("about us")}
              className={`${
                menu === "about us" ? "border-b-2 border-gray-800 pb-1" : ""
              } cursor-pointer`}
            >
              <Link to="/aboutus">About Us</Link>
            </li>
            <li
              onClick={() => setMenu("restaurants")}
              className={`${
                menu === "restaurants" ? "border-b-2 border-gray-800 pb-1" : ""
              } cursor-pointer`}
            >
              <Link to="/resturant">Restaurants</Link>
            </li>
            <li
              onClick={() => setMenu("partner")}
              className={`${menu === "partner" ? "border-b-2 border-gray-800 pb-1" : ""} cursor-pointer`}
            >
              <Link to="register/restaurant-owner" className="">
                Become a Partner
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4 mt-4 md:mt-0 md:ml-auto">
            <div className="relative">
              <Link to="/cart">
                <img className="w-8" src={assets.basket_icon} alt="basket icon" />
              </Link>
              <div className="absolute bg-red-500 rounded-full w-2 h-2 top-0 right-0"></div>
            </div>
            {isAuthenticated ? ( // Change isLoggedIn to isAuthenticated
              <div className="flex items-center gap-4">
                <Link 
                  to="/profile"
                  className="text-gray-800 hover:text-red-500 transition-colors"
                >
                  <User size={30} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-lg text-white py-2 px-6 rounded-full transition duration-300 hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-transparent text-lg text-gray-800 border border-red-500 py-2 px-6 rounded-full transition duration-300 hover:bg-red-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-red-500 text-lg text-white py-2 px-6 rounded-full transition duration-300 hover:bg-red-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
