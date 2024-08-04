import { useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from 'react-router-dom';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("menu");
  const [isOpen, setIsOpen] = useState(false);

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
                menu === "about us" ? "border-b-2 border-gray-800    pb-1" : ""
              } cursor-pointer`}
            >
              <Link to="/aboutus">About Us</Link>
            </li>
          </ul>

          <div className="flex items-center gap-4 mt-4 md:mt-0 md:ml-auto">
            <div className="relative">
              <Link to="/cart">
                <img className="w-8" src={assets.basket_icon} alt="basket icon" />
              </Link>
              <div className="absolute bg-red-500 rounded-full w-2 h-2 top-0 right-0"></div>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-transparent text-lg text-gray-800 border border-red-500 py-2 px-6 rounded-full transition duration-300 hover:bg-red-100"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



// import './Header.css'
// const Header = () => {
//   return (
//     <>
//       <div>
//         <header>
//           <div className="flex justify-between items-center h-16 px-8 bg-orange-100 border-b-2 border-orange-300 shadow-md">
//             <div className="logo">
//               <img
//                 src="../images/572f668b6fd540a6acca7dfe42c408c4-free.png"
//                 alt=""
//                 className="w-36"
//               />
//             </div>
//             <div className="hidden">
//               <i className="fa-solid fa-bars"></i>
//               <i className="fa-solid fa-xmark" id="hdcross"></i>
//             </div>
//             <div className="nav">
//               <ul className="flex items-center space-x-6">
//                 <a href="#">
//                   <li className="hover:text-orange-600">Home</li>
//                 </a>
//                 <a href="#">
//                   <li className="hover:text-orange-600">About</li>
//                 </a>
//                 <a href="#">
//                   <li className="hover:text-orange-600">Restaurant</li>
//                 </a>
//                 <a href="#">
//                   <li className="hover:text-orange-600">Food Menu</li>
//                 </a>
//               </ul>
//             </div>
//             <div className="account flex justify-end">
//               <ul className="flex items-center space-x-6">
//                 <a href="#">
//                   <li>
//                     <i className="fa-solid fa-house-chimney"></i>
//                   </li>
//                 </a>
//                 <a href="#">
//                   <li>
//                     <i className="fa-solid fa-magnifying-glass searchicon" id="seachicon2"></i>
//                   </li>
//                 </a>
//                 <a href="#">
//                   <li>
//                     <i className="fa-solid fa-user" id="user-lap"></i>
//                   </li>
//                 </a>
//               </ul>
//             </div>
//           </div>
//         </header>
//       </div>
//     </>
//   );
// };

// export default Header;
