import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Admin = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-4">
          <Link to="/admin/restaurants" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            Restaurants & Products
          </Link>
          <Link to="/admin/drivers" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            Drivers
          </Link>
          <Link to="/admin/users" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            Users
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </div>
    </div>
  )
}

export default Admin
