import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
// import { food_list } from "../../assets/assets";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = () => {
    const { food_list } = useContext(StoreContext); 

    return (
        <div className="mt-8 max-w-[80%] m-auto" id="food-display">
            <h2 className="text-3xl font-semibold md:text-4xl">
                Top dishes near you
            </h2>
           
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {food_list.map((item, index) => (
                    <FoodItem
                        key={index}
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default FoodDisplay;
