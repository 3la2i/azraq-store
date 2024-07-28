const Header = () => {
    return (
      <div className="h-[34vw] my-[30px] mx-auto bg-[url('/src\assets\headerlogo3.png')] bg-no-repeat bg-contain relative max-w-[80%]">
        <div className="absolute flex flex-col items-start gap-[1.5vw] max-w-[50%] bottom-[10%] left-[6vw] animate-fadeIn">
          <h2 className="font-medium text-white text-[max(4.5vw,22px)]">
            Order your favourite food here
          </h2>
          <p className="text-white text-[1vw]">
            Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our menu satisfies your cravings, enhancing your dining experience, one delicious meal at a time.
          </p>
          <button className="border-none text-[#747474] font-medium px-[2.3vw] py-[1vw] bg-white text-[max(1vw,13px)] rounded-full">
            View Menu
          </button>
        </div>
      </div>
    );
  }
  
  export default Header;
  