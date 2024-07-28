

// // Shared Tailwind CSS classes
// const cardStyles = "bg-card rounded-lg p-4";
// const buttonStyles = "text-primary";
// const destructiveButtonStyles = "text-destructive";
// const totalPriceStyles = "text-lg font-semibold";

// const CartItem = ({ name, description, price, quantity }) => {
//     return (
//         <div className={cardStyles + " mb-4"}>
//             <div className="flex text-tomato items-center justify-between mb-2">
//                 <img src="https://placehold.co/100" alt="Food Item" className="w-16 h-16 rounded-lg" />
//                 <div className="flex-1 ml-4">
//                     <h2 className="text-lg font-semibold">{name}</h2>
//                     <p className="text-sm text-muted">{description}</p>
//                 </div>
//                 <p className="text-lg font-semibold">${price}</p>
//             </div>
//             <div className="flex items-center justify-between">
//                 <button className={buttonStyles}>-</button>
//                 <span>{quantity}</span>
//                 <button className={buttonStyles}>+</button>
//                 <button className={destructiveButtonStyles + " ml-4"}>Remove</button>
//             </div>
//         </div>
//     );
// };

// const Cart = () => {
//     return (
//         <div className="bg-background text-tomato min-h-screen">
//             <div className="max-w-4xl mx-auto py-8 px-4">
//                 <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
//                 <CartItem name="Delicious Burger" description="Lorem ipsum dolor sit amet" price="10.99" quantity="1" />
//                 <CartItem name="Crispy Fries" description="Consectetur adipiscing elit" price="5.99" quantity="2" />
//                 <div className={cardStyles}>
//                     <div className="flex justify-between mb-2">
//                         <p className={totalPriceStyles}>Total:</p>
//                         <p className={totalPriceStyles}>$16.98</p>
//                     </div>
//                     <button className="w-full bg-tomato text-white py-2 rounded-lg">Checkout</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Cart;


import { useContext } from "react"
import "./Cart.css"
import { StoreContext } from "../../context/StoreContext"
const Cart = () => {
  const {cartItems,food_list,removeFromCart} = useContext(StoreContext)
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
      </div>
      
    </div>
  )
}

export default Cart
