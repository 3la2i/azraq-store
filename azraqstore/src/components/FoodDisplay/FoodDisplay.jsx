import { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext"; // تأكد من الاسم الصحيح
import { food_list } from "../../assets/assets";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = () => {
    const { food_list } = useContext(StoreContext); // تأكد من استخدام الاسم الصحيح هنا أيضًا

    return (
        <div className="food-display" is="food-display">
            <h2>Top dishes near you</h2>
            {/* يمكنك إضافة العناصر هنا لعرض قائمة الطعام */}
            <div className="food-display-list">
                {food_list.map((item,index)=>{
                    return <FoodItem key={index} id={item.id} name={item.name} description={item.description} price={item.price} image={item.image}/>

                })}
            </div>
        </div>
    );
};

export default FoodDisplay;