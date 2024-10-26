import React from 'react'
import { Edit2, Trash2, ChevronRight } from 'lucide-react'

const RestaurantList = ({ restaurants, onEdit, onDelete, onSelect, selectedRestaurant }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-red-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-red-600 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-red-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.map((restaurant) => (
              <tr
                key={restaurant._id}
                className={`hover:bg-red-50 transition-colors duration-200 ${
                  selectedRestaurant?._id === restaurant._id ? 'bg-red-100' : ''
                }`}
                onClick={() => onSelect(restaurant)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={`http://localhost:5000/${restaurant.image}`} alt={restaurant.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                      <div className="text-sm text-gray-500">{restaurant.cuisine.join(', ')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2">{restaurant.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(restaurant); }}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(restaurant._id); }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {restaurants.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No restaurants found.</p>
        </div>
      )}
    </div>
  )
}

export default RestaurantList