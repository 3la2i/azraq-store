import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home, Users, Truck, Utensils, ShoppingBag, LogOut, DollarSign } from 'lucide-react'
import Swal from 'sweetalert2'
import axios from 'axios'

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [dashboardStats, setDashboardStats] = useState(null)
  const location = useLocation()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/stats')
      setDashboardStats(response.data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

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

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
      <Icon className="h-8 w-8 text-tomato mr-4" />
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )

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
          {location.pathname === '/admin' && dashboardStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard icon={Users} label="Users" value={dashboardStats.users} />
              <StatCard icon={Utensils} label="Restaurants" value={dashboardStats.restaurants} />
              <StatCard icon={ShoppingBag} label="Products" value={dashboardStats.products} />
              <StatCard icon={Truck} label="Drivers" value={dashboardStats.drivers} />
              <StatCard icon={ShoppingBag} label="Orders" value={dashboardStats.orders} />
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                <div className="flex justify-between">
                  <StatCard icon={DollarSign} label="Cash" value={dashboardStats.transactions.cash} />
                  <StatCard icon={DollarSign} label="PayPal" value={dashboardStats.transactions.paypal} />
                </div>
              </div>
            </div>
          )}
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
