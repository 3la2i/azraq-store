import { useState } from "react";
import { assets } from "../../assets/assets";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 grid place-items-center">
      <form className="bg-white text-gray-500 p-8 rounded-lg w-full max-w-xs animate-fadeIn">
        <div className="flex justify-between items-center text-black mb-6">
          <h2 className="text-xl">{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            className="w-4 cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-5 mb-6">
          {currState === "Sign Up" && (
            <input type="text" placeholder="Your name" required className="border border-gray-300 p-2 rounded"/>
          )}
          <input type="email" placeholder="Your email" required className="border border-gray-300 p-2 rounded"/>
          <input type="password" placeholder="Password" required className="border border-gray-300 p-2 rounded"/>
        </div>
        <button className="w-full bg-tomato text-white p-2 rounded text-lg cursor-pointer">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="flex items-start gap-2 mt-4">
          <input type="checkbox" required className="mt-1"/>
          <p className="text-sm">By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        <p className="mt-4 text-sm">
          {currState === "Login" ? (
            <>Create a new account? <span onClick={() => setCurrState("Sign Up")} className="text-tomato font-medium cursor-pointer">Click here</span></>
          ) : (
            <>Already have an account? <span onClick={() => setCurrState("Login")} className="text-tomato font-medium cursor-pointer">Login here</span></>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
