import React from 'react'

const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded my-6">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Price</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Restaurant</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {products.map((product) => (
            <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <span className="font-medium">{product.name}</span>
              </td>
              <td className="py-3 px-6 text-left">
                <span>${product.price?.toFixed(2) || 'N/A'}</span>
              </td>
              <td className="py-3 px-6 text-left">
                <span>{product.category?.name || 'N/A'}</span>
              </td>
              <td className="py-3 px-6 text-left">
                <span>{product.restaurant?.name || 'N/A'}</span>
              </td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <button onClick={() => onEdit(product)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => onDelete(product._id)} className="w-4 mr-2 transform hover:text-red-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductList
