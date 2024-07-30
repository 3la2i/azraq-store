
import React from 'react';

const INPUT_CLASS = 'mb-4 p-2 border border-border rounded w-full';
const FLEX_CLASS = 'flex justify-between';
const BUTTON_CLASS = 'bg-tomato  text-secondary-foreground hover:bg-secondary/80 p-2 rounded-lg w-full';

const DeliveryInfo = () => {
  return (
    <div className="flex flex-col md:flex-row p-6 bg-background">
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Delivery Information</h2>
        <form className='flex flex-col '>
          <input type="text" placeholder="First Name" className={INPUT_CLASS} />
          <input  type="text" placeholder="Last Name" className= {INPUT_CLASS}/>
          <input type="email" placeholder="Email" className={INPUT_CLASS} />
          <input type="text" placeholder="Address" className={INPUT_CLASS} />
          <input type="text" placeholder="Info" className={INPUT_CLASS} />
          
         
          <input type="text" placeholder="Phone Number" className={INPUT_CLASS} />
        </form>
      </div>
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Cart Totals</h2>
        <div className="mb-4">
          <div className={FLEX_CLASS}>
            <span>Subtotal</span>
            <span>$60</span>
          </div>
          <div className={FLEX_CLASS}>
            <span>Delivery Fee</span>
            <span>$5</span>
          </div>
          <div className="border-t border-border my-4"></div>
          <div className={`${FLEX_CLASS} font-bold`}>
            <span>Total</span>
            <span>$65</span>
          </div>
        </div>
        <button className={BUTTON_CLASS}>Proceed To Payment</button>
      </div>
    </div>
  );
};

export default DeliveryInfo;

