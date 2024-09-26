import { assets } from "../../assets/assets";

const Footer = () => {
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scroll effect
    });
  };

  return (
    <div className="text-gray-400 bg-gray-900 flex flex-col items-center gap-5 p-5 pt-20 mt-32" id="footer">
      <div className="w-full grid grid-cols-[2fr_1fr_1fr] gap-20">
        <div className="flex flex-col items-start gap-5">
          <img src={assets.logo} alt="Sahtien Logo" className="w-60" /> {/* Adjusted the width to a medium size */}
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, animi,
            dolorum ipsam deleniti repudiandae nisi vel sunt quos, fugit magni
            nobis molestias exercitationem dolorem reiciendis fugiat! Quis
            mollitia iste unde.
          </p>
          <div className="flex gap-3">
            <img src={assets.facebook_icon} alt="Facebook Icon" className="w-10" />
            <img src={assets.twitter_icon} alt="Twitter Icon" className="w-10" />
            <img src={assets.linkedin_icon} alt="LinkedIn Icon" className="w-10" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-5">
          <h2 className="text-white">COMPANY</h2>
          <ul className="flex flex-col gap-2">
            <li className="cursor-pointer" onClick={scrollToTop}>Home</li>
            <li className="cursor-pointer">About us</li>
            <li className="cursor-pointer">Delivery</li>
            <li className="cursor-pointer">Privacy policy</li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-5">
          <h2 className="text-white">GET IN TOUCH</h2>
          <ul className="flex flex-col gap-2">
            <li>+962-795-925-867</li>
            <li>contact@Sahtien.com</li>
          </ul>
        </div>
      </div>
      <hr className="w-full h-0.5 my-5 bg-green-500 border-none" />
      <p className="text-center">© 2024 Sahtien. All rights reserved.</p>
    </div>
  );
};

export default Footer;
