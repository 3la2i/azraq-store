import { Link } from 'react-router-dom';
import { assets } from "../../assets/assets";
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="text-gray-400 bg-gray-900 flex flex-col items-center gap-5 p-5 pt-20" id="footer">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        <div className="col-span-1 lg:col-span-2">
          <Link to="/" onClick={scrollToTop} className="block mb-6">
            <img 
              src={assets.logo} 
              alt="Sahtien Logo" 
              className="w-40 md:w-48 lg:w-60" 
            />
          </Link>
          <p className="text-sm leading-relaxed mb-6 max-w-md">
            Welcome to Sahtien - your premier food delivery service in Jordan. 
            We connect you with the finest local restaurants, ensuring quick 
            and reliable delivery right to your doorstep. Experience convenience 
            and quality with every order.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity"
            >
              <img src={assets.facebook_icon} alt="Facebook" className="w-8 md:w-10" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity"
            >
              <img src={assets.twitter_icon} alt="Twitter" className="w-8 md:w-10" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity"
            >
              <img src={assets.linkedin_icon} alt="LinkedIn" className="w-8 md:w-10" />
            </a>
          </div>
        </div>

        <div className="col-span-1">
          <h2 className="text-white font-semibold text-lg mb-4">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <Link 
                to="/" 
                onClick={scrollToTop} 
                className="hover:text-orange-500 transition-colors inline-block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/restaurants" 
                className="hover:text-orange-500 transition-colors inline-block"
              >
                Restaurants
              </Link>
            </li>
            <li>
              <Link 
                to="/delivery-info" 
                className="hover:text-orange-500 transition-colors inline-block"
              >
                Delivery Information
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="hover:text-orange-500 transition-colors inline-block"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy-policy" 
                className="hover:text-orange-500 transition-colors inline-block"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h2 className="text-white font-semibold text-lg mb-4">Contact Info</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Phone className="text-orange-500 w-5 h-5" />
              <span>+962-795-925-867</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-orange-500 w-5 h-5" />
              <span>contact@sahtien.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="text-orange-500 w-5 h-5" />
              <span>Amman, Jordan</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="text-orange-500 w-5 h-5" />
              <span>10:00 AM - 11:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800">
        <div className="text-center space-y-2">
          <p className="text-sm">
            © {new Date().getFullYear()} Sahtien. All rights reserved.
          </p>
          <p className="text-xs">
            Made with <span className="text-red-500">♥</span> in Jordan
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
