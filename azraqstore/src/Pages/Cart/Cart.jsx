import { Link } from "react-router-dom";

const TableRow = ({ item }) => (
  <tr className="border-b">
    <td className="py-2">{item.name}</td>
    <td className="py-2">${item.price}</td>
    <td className="py-2">1</td> 
    <td className="py-2">${item.price}</td>
    <td className="py-2 cursor-pointer text-red-500">x</td>
  </tr>
);

const Cart = ({ foodList }) => (
  <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-card rounded shadow-md">
    <h2 className="text-xl font-semibold mb-4">Items</h2>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b">
          <th className="py-2">Title</th>
          <th className="py-2">Price</th>
          <th className="py-2">Quantity</th>
          <th className="py-2">Total</th>
          <th className="py-2">Remove</th>
        </tr>
      </thead>
      <tbody>
        {foodList.map(item => (
          <TableRow key={item._id} item={item} />
        ))}
      </tbody>
    </table>
    <h2 className="text-xl font-semibold mt-6 mb-4">Cart Totals</h2>
    <div className="flex justify-between py-2">
      <span>Subtotal</span>
      <span>$60</span>
    </div>
    <div className="flex justify-between py-2">
      <span>Delivery Fee</span>
      <span>$5</span>
    </div>
    <div className="flex justify-between py-2 font-bold">
      <span>Total</span>
      <span>$65</span>
    </div>
    <div className="mt-4">
      <label htmlFor="promo-code" className="block mb-2">If you have a promo code, enter it here:</label>
      <input type="text" id="promo-code" className="border border-zinc-300 rounded p-2 w-full" placeholder="promo code" />
      <button className="mt-2 bg-secondary text-secondary-foreground bg-tomato p-2 rounded">Submit</button>
    </div>
    <Link to="/delivryInfo">
      <button className="mt-4 w-full bg-primary text-primary-foreground bg-tomato p-2 rounded">PROCEED TO CHECKOUT</button>
    </Link>
  </div>
);

export default Cart;
