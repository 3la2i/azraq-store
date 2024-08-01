

// Shared Tailwind CSS classes
const inputClasses = "mt-1 block w-full border border-border rounded-md p-2";
const labelClasses = "block text-sm font-medium text-foreground";
const buttonClasses = "bg-tomato text-secondary-foreground hover:bg-secondary/80 w-full p-2 rounded-md";

const AddItem = () => {
    return (
        <div className="p-6 bg-card rounded-lg shadow-md">
            <div className="mb-4">
                <label className={labelClasses}>Upload Image</label>
                <div className="border-dashed border-2 border-muted p-4 text-center rounded-lg">
                    <input type="file" className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="cursor-pointer text-muted-foreground">Upload</label>
                </div>
            </div>
            
            <div className="mb-4">
                <label className={labelClasses}>Product name</label>
                <input type="text" placeholder="Type here" className={inputClasses} />
            </div>
            
            <div className="mb-4">
                <label className={labelClasses}>Product description</label>
                <textarea placeholder="Write content here" className={inputClasses} rows="4"></textarea>
            </div>
            
            <div className="mb-4 flex justify-between">
                <div className="w-1/2 pr-2">
                    <label className={labelClasses}>Product category</label>
                    <select className={inputClasses}>
                        <option>Sandwich</option>
                        <option>Drink</option>
                        <option>Snack</option>
                    </select>
                </div>
                <div className="w-1/2 pl-2">
                    <label className={labelClasses}>Product price</label>
                    <input type="text"  className={inputClasses} />
                </div>
            </div>
            
            <button className={buttonClasses}>ADD</button>
        </div>
    );
};

export default AddItem;
