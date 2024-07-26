import "./FoodItem.css";

const FoodItem = ({ id, name, price, description, image }) => {
  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          {/* افترض أنك قد تحتاج إلى تصحيح المسار للصورة هنا إذا لم يكن هناك */}
          <img src="path_to_rating_stars" alt="rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
