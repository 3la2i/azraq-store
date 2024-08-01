import React from 'react';

// Shared constants for Tailwind classes
const CONTAINER_CLASSES = "border border-border rounded-lg p-4 mb-4";
const SELECT_CLASSES = "bg-secondary text-secondary-foreground border border-border rounded-md p-1 ml-4";
const ADDRESS_CLASSES = "text-muted-foreground";

const OrderItem = ({ itemName, itemCount, totalPrice, address, phone, status }) => {
    return (
        <div className={CONTAINER_CLASSES}>
            <div className="flex items-center">
                <img src="" alt="Order Box" className="w-8 h-8 mr-2" />
                <div className="flex-1">
                    <p className="font-semibold">{itemName}</p>
                    <p className={ADDRESS_CLASSES}>Items: {itemCount}</p>
                    <p className="text-lg font-bold">${totalPrice}</p>
                </div>
                <select className={SELECT_CLASSES}>
                    <option>Delivered</option>
                    <option>Food Processing</option>
                    <option>Out for delivery</option>
                </select>
            </div>
            <div className="mt-2">
                <p className={ADDRESS_CLASSES}>{address}</p>
                <p className={ADDRESS_CLASSES}>{phone}</p>
            </div>
        </div>
    );
};

const Orders = () => {
    // Single order object
    const order = {
        itemName: "Greek salad x 2, Veg salad x 1, Clover Salad x 2, Chicken Salad x 4, Lasagna Rolls x 2, Peri Peri Rolls x 2",
        itemCount: 6,
        totalPrice: 224,
        address: "neighborhood, 123456",
        phone: "0795925867",
        status: "Delivered"
    };

    return (
        <div className="p-6 bg-background">
            <h1 className="text-2xl font-bold mb-4">Order Page</h1>
            <OrderItem
                itemName={order.itemName}
                itemCount={order.itemCount}
                totalPrice={order.totalPrice}
                address={order.address}
                phone={order.phone}
                status={order.status}
            />
        </div>
    );
};

export default Orders;
