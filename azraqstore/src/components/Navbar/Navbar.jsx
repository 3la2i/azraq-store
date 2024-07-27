import { useState } from "react";
import { assets } from "../../assets/assets";

import { Link } from 'react-router-dom';
const Navbar = () => {
  const [menu, setMenu] = useState("menu");

  return (
    <div className="flex justify-between items-center py-5 max-w-[80%] m-auto">
      <Link to="/"><img src={assets.logo} className="w-36 " alt="logo  "  /></Link>
      <ul className="flex list-none gap-5 text-[#49557e] text-lg">
        <li
          onClick={() => setMenu("home")}
          className={`${menu === "home" ? "border-b-2 border-[#49557e] pb-1" : ""} cursor-pointer`}
        >
          home
        </li>
        <li
          onClick={() => setMenu("menu")}
          className={`${menu === "menu" ? "border-b-2 border-[#49557e] pb-1" : ""} cursor-pointer`}
        >
          menu
        </li>
        <li
          onClick={() => setMenu("contact us")}
          className={`${menu === "contact us" ? "border-b-2 border-[#49557e] pb-1" : ""} cursor-pointer`}
        >
          contact us
        </li>
        <li
          onClick={() => setMenu("about us")}
          className={`${menu === "about us" ? "border-b-2 border-[#49557e] pb-1" : ""} cursor-pointer`}
        >
          about us
        </li>
      </ul>
      <div className="flex items-center gap-3.5">
        <img src={assets.search_icon} alt="search icon" />
        <div className="relative">
         <Link to="/cart"> <img src={assets.basket_icon} alt="basket icon" /></Link>
          <div className="absolute min-w-[10px] min-h-[10px] bg-tomato rounded-full top-[-8px] right-[-8px]"></div>
        </div>
        <button className="bg-transparent text-lg text-[#49557e] border border-tomato py-2 px-8 rounded-full transition duration-300 hover:bg-[#fff4f2]">
          sign in
        </button>
      </div>
    </div>
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
