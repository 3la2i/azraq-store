import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { assets } from "../../assets/assets";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = response.data;
      
      login(token, user);
      
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
      setErrors({ form: error.response?.data?.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <img 
            src={assets.logo}
            alt="Azraq Alshamali" 
            className="w-32 cursor-pointer"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {errors.password}
                </p>
              )}
            </div>

            {errors.form && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{errors.form}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-600 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
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
