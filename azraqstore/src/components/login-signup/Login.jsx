// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (error[name]) {
      setError(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = response.data;
      
      // Login using context
      login(token, user);
      
      // Navigate based on role
      switch (user.role) {
        case 'restaurant_owner':
          navigate('/restaurant-dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'driver':
          navigate('/driver', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error.email ? 'border-red-500' : ''}`}
          id="email"
          name="email"
          type="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
        />
        {error.email && <p className="text-red-500 text-xs italic">{error.email}</p>}
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${error.password ? 'border-red-500' : ''}`}
          id="password"
          name="password"
          type="password"
          placeholder="******************"
          value={formData.password}
          onChange={handleChange}
        />
        {error.password && <p className="text-red-500 text-xs italic">{error.password}</p>}
      </div>
      {error.form && <p className="text-red-500 text-sm italic mb-4">{error.form}</p>}
      <div className="flex items-center justify-between">
        <button
          className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Sign In'}
        </button>
        
        <Link className='text-tomato' to="/signup">
          <div>Don't have an account?</div>
        </Link>
      </div>
    </form>
  );
};

export default Login;

// for login popup
// import { useState } from "react";
// import { assets } from "../../assets/assets";

// const LoginPopup = ({ setShowLogin }) => {
//   const [currState, setCurrState] = useState("Login");
//   return (
//     <div className="fixed inset-0 z-10 bg-black bg-opacity-60 flex items-center justify-center">
//       <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6 animate-fadeIn">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold">{currState}</h2>
//           <img
//             onClick={() => setShowLogin(false)}
//             src={assets.cross_icon}
//             alt=""
//             className="w-4 cursor-pointer"
//           />
//         </div>
//         <div className="space-y-4">
//           {currState === "Sign Up" && (
//             <input
//               type="text"
//               placeholder="Your name"
//               required
//               className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//             />
//           )}
//           <input
//             type="email"
//             placeholder="Your email"
//             required
//             className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             required
//             className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
//           />
//         </div>
//         <button className="w-full bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition">
//           {currState === "Sign Up" ? "Create account" : "Login"}
//         </button>
//         <div className="flex items-start space-x-2">
//           <input
//             type="checkbox"
//             required
//             className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <p className="text-sm text-gray-600">
//             By continuing, I agree to the terms of use & privacy policy.
//           </p>
//         </div>
//         <p className="text-sm">
//           {currState === "Login" ? (
//             <>
//               Create a new account?{" "}
//               <span
//                 onClick={() => setCurrState("Sign Up")}
//                 className="text-red-500 cursor-pointer font-medium"
//               >
//                 Click here
//               </span>
//             </>
//           ) : (
//             <>
//               Already have an account?{" "}
//               <span
//                 onClick={() => setCurrState("Login")}
//                 className="text-red-500 cursor-pointer font-medium"
//               >
//                 Login here
//               </span>
//             </>
//           )}
//         </p>
//       </form>
//     </div>
//   );
// };

// export default LoginPopup;
