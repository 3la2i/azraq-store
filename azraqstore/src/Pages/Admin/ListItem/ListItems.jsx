
const ListItems = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">All Foods List</h2>
      <table className="min-w-full bg-card border border-border">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="py-2 px-4 border-b border-border">Image</th>
            <th className="py-2 px-4 border-b border-border">Name</th>
            <th className="py-2 px-4 border-b border-border">Category</th>
            <th className="py-2 px-4 border-b border-border">Price</th>
            <th className="py-2 px-4 border-b border-border">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-muted/50">
            <td className="py-2 px-4 border-b border-border">
              <img aria-hidden="true" alt="Food 1" src="https://placehold.co/100x100?text=🥗" />
            </td>
            <td className="py-2 px-4 border-b border-border">Food 1</td>
            <td className="py-2 px-4 border-b border-border">Desserts</td>
            <td className="py-2 px-4 border-b border-border">$10</td>
            <td className="py-2 px-4 border-b border-border">
              <button className="bg-destructive text-destructive-foreground p-1 rounded">X</button>
            </td>
          </tr>
          <tr className="hover:bg-muted/50">
            <td className="py-2 px-4 border-b border-border">
              <img aria-hidden="true" alt="Food 2" src="https://placehold.co/100x100?text=🍲" />
            </td>
            <td className="py-2 px-4 border-b border-border">Food 2</td>
            <td className="py-2 px-4 border-b border-border">Pure Veg</td>
            <td className="py-2 px-4 border-b border-border">$10</td>
            <td className="py-2 px-4 border-b border-border">
              <button className="bg-destructive text-destructive-foreground p-1 rounded">X</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ListItems;
