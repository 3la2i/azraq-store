
import { Link } from "react-router-dom";


const SideBar = () => {
    return (
      <div className="h-40 flex">
        <div className="bg-primary  p-4 flex flex-col">
          <h2 className="text-primary-foreground text-lg font-bold mb-4">
            Navigation
          </h2>
          <ul className="flex space-x-24 ml-3">
            <li className="flex">
            <Link to="/additem">  <button className="w-96 h-20 py-2 px-4 bg-tomato text-secondary-foreground rounded-lg hover:bg-secondary/80 focus:outline-none">
                Add Item
              </button></Link>
            </li>
            <li className="flex">
            <Link to="/listitems">  <button className="w-96 h-20 py-2 px-4 bg-tomato text-secondary-foreground rounded-lg hover:bg-secondary/80 focus:outline-none">
                List Items
              </button></Link>
            </li>
            <li className="flex">
             <Link to="/orders"> <button className="w-96 h-20 py-2 px-4 bg-tomato text-secondary-foreground rounded-lg hover:bg-secondary/80 focus:outline-none">
                Orders
              </button></Link>
            </li>
            <li className="flex">
              <button className="w-96 h-20 py-2 px-4 bg-tomato text-secondary-foreground rounded-lg hover:bg-secondary/80 focus:outline-none">
               Users
              </button>
            </li>
          </ul>
        </div>
        <div className="flex-1 p-4">{/* Main content area */}</div>
      </div>
    );
  };
  
  export default SideBar;
  