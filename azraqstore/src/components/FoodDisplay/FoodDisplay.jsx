import { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = () => {
    const { food_list } = useContext(StoreContext);

    // تحقق من البيانات في الكونسول
    console.log('Food List:', food_list);

    if (!food_list || food_list.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="food-display" is="food-display">
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item) => (
                    <FoodItem
                        key={item._id}  // استخدم _id بدلاً من id لأنه هو المعرّف الفريد في البيانات
                        id={item._id}
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
