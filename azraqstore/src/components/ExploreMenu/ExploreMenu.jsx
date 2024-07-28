import { menu_list } from "../../assets/assets";

const ExploreMenu = () => {
  return (
    <div className="flex flex-col gap-5  m-auto" id="explore-menu">
      <h1 className="text-[#262626] font-medium text-4xl ml-[11.5rem]">Explore our menu</h1>
      <p className=" text-gray-600 ml-[11.5rem] ">
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients and culinary expertise. Our menu
        satisfies your cravings, enhancing your dining experience, one
        delicious meal at a time.
      </p>
            <div className="flex justify-between   items-center gap-7 text-center my-5 overflow-x-scroll bg-tomato scrollbar-hide h-16">
              {menu_list.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    src={item.menu_image}
                    alt={item.menu_name}
                    className="w-[7.5vw] min-w-[80px] cursor-pointer rounded-full transition duration-200 "
                  />
            <p className="my-2 text-lg cursor-pointer">{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr className="my-2 h-0.5 bg-gray-300 border-none" />
    </div>
  );
};

export default ExploreMenu;
