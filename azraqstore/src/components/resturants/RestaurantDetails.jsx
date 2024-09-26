import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, ShoppingBag } from 'lucide-react';

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantDetailsAndProducts = async () => {
      try {
        const [restaurantResponse, productsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/getRestaurantById/${id}`),
          axios.get(`http://localhost:5000/api/restaurants/${id}/products`)
        ]);
        setRestaurant(restaurantResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching restaurant details and products:', error);
      }
    };

    fetchRestaurantDetailsAndProducts();
  }, [id]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!restaurant) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Restaurant Details Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="relative h-[600px]">
          <img className="w-full h-full object-cover" src={restaurant.image} alt={restaurant.name} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Star className="text-yellow-400 mr-2" size={24} />
            <span className="text-xl font-semibold">{restaurant.rating.toFixed(1)}</span>
          </div>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          <div className="flex items-start mb-4">
            <MapPin className="text-gray-400 mr-2 mt-1" size={20} />
            <div>
              <p className="font-semibold">العنوان</p>
              <p>{restaurant.address.street}, {restaurant.address.neiborhood}</p>
              <p>{restaurant.address.state}, {restaurant.address.zipCode}</p>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">المطبخ</h2>
            <div className="flex flex-wrap gap-2">
              {restaurant.cuisine.map((item, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">ساعات العمل</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center">
                  <Clock className="text-gray-400 mr-2" size={16} />
                  <span className="capitalize">{day}: </span>
                  <span className="ml-2">
                    {restaurant.openingHours[day].open} - {restaurant.openingHours[day].close}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <ShoppingBag className="mr-2" size={24} />
            قائمة الطعام
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products && products.products && products.products.map((product) => (
              <div 
                key={product._id} 
                className="bg-gray-50 rounded-lg p-4 shadow-sm cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleProductClick(product._id)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-green-600 font-semibold">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { Star, MapPin, Clock } from 'lucide-react';

// const RestaurantDetails = () => {
//     console.log('RestaurantDetails')
//   const [restaurant, setRestaurant] = useState(null);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/restaurants/getRestaurantById/${id}`);
//         setRestaurant(response.data);
//       } catch (error) {
//         console.error('Error fetching restaurant details:', error);
//       }
//     };

//     fetchRestaurantDetails();
//   }, [id]);

//   if (!restaurant) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="relative h-64">
//           <img className="w-full h-full object-cover" src={restaurant.image} alt={restaurant.name} />
//           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
//             <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
//           </div>
//         </div>
//         <div className="p-6">
//           <div className="flex items-center mb-4">
//             <Star className="text-yellow-400 mr-2" size={24} />
//             <span className="text-xl font-semibold">{restaurant.rating.toFixed(1)}</span>
//           </div>
//           <p className="text-gray-600 mb-4">{restaurant.description}</p>
//           <div className="flex items-start mb-4">
//             <MapPin className="text-gray-400 mr-2 mt-1" size={20} />
//             <div>
//               <p className="font-semibold">العنوان</p>
//               <p>{restaurant.address.street}, {restaurant.address.neiborhood}</p>
//               <p>{restaurant.address.state}, {restaurant.address.zipCode}</p>
//             </div>
//           </div>
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">المطبخ</h2>
//             <div className="flex flex-wrap gap-2">
//               {restaurant.cuisine.map((item, index) => (
//                 <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
//                   {item}
//                 </span>
//               ))}
//             </div>
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-2">ساعات العمل</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//               {daysOfWeek.map((day) => (
//                 <div key={day} className="flex items-center">
//                   <Clock className="text-gray-400 mr-2" size={16} />
//                   <span className="capitalize">{day}: </span>
//                   <span className="ml-2">
//                     {restaurant.openingHours[day].open} - {restaurant.openingHours[day].close}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RestaurantDetails;