import { useState } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";

const FoodItem = ({ id, name, price, description, image, data }) => {
  const [itemCount, setItemCount] = useState(0);
  return (
    <div className="w-full mx-auto rounded-lg shadow-lg transition duration-300 animate-fadeIn">
      <div className="relative">
        <img className="w-full rounded-t-lg" src={image} alt="" />
        {!itemCount ? (
          <img
            className="w-9 absolute bottom-4 right-4 cursor-pointer rounded-full"
            onClick={() => {
              setItemCount((Prev) => Prev + 1);
            }}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 p-1.5 rounded-full bg-white">
            <img
              onClick={() => setItemCount((Prev) => Prev - 1)}
              className="w-7"
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{itemCount}</p>
            <img
              onClick={() => setItemCount((Prev) => Prev + 1)}
              className="w-7"
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2.5">
          <p className="text-xl font-medium">{name}</p>
          <img className="w-18" src={assets.rating_starts} alt="" />
        </div>
        <p className="text-gray-500 text-xs">{description}</p>
        <p className="text-tomato text-xl font-medium mt-2.5 mb-2.5">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
