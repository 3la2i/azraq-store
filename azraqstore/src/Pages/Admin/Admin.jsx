import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, Users, Truck, Utensils, ShoppingBag, LogOut } from 'lucide-react'
import Swal from 'sweetalert2'

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/restaurants', icon: Utensils, label: 'Restaurants' },
    { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
    { path: '/admin/drivers', icon: Truck, label: 'Drivers' },
    { path: '/admin/users', icon: Users, label: 'Users' },
  ]

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of the admin panel.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF6347',
      cancelButtonColor: '#718096',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout action here
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        )
      }
    })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold text-tomato ${isSidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-tomato">
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-tomato transition-colors duration-200 ${
                location.pathname === item.path ? 'bg-red-50 text-tomato' : ''
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-tomato transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )





























































  
}

export default Admin
