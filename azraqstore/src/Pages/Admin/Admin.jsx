import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, Truck, Utensils, ShoppingBag, LogOut, DollarSign, ChevronLeft, ChevronRight, Menu, MessageSquare, Mail, FileText } from 'lucide-react'
import Swal from 'sweetalert2'
import axios from 'axios'

const Admin = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [dashboardStats, setDashboardStats] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Check user role when component mounts
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }

    fetchDashboardStats()
  }, [navigate])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/stats')
      setDashboardStats(response.data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/restaurant-management', icon: Utensils, label: 'Restaurants' },
    { path: '/admin/drivers', icon: Truck, label: 'Drivers' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/profit', icon: DollarSign, label: 'Profit' },
    { path: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
    { path: '/admin/contact-messages', icon: Mail, label: 'Contact Messages' },
    { path: '/admin/requests', icon: FileText, label: 'Requests' },
  ]

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of the admin panel.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
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
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <Icon className="h-10 w-10 text-red-500 mr-4" />
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className={`bg-white shadow-lg transition-all duration-300 ease-in-out hidden md:block ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold text-red-600 ${isSidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-red-600 transition-colors">
            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 ${
                location.pathname === item.path ? 'bg-red-50 text-red-600' : ''
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <button
              className="md:hidden text-gray-500 hover:text-red-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-16 right-0 left-0 z-20">
            <nav className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-red-50 text-red-600' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {location.pathname === '/admin/dashboard' && dashboardStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard icon={Users} label="Users" value={dashboardStats.users} />
              <StatCard icon={Utensils} label="Restaurants" value={dashboardStats.restaurants} />
              <StatCard icon={ShoppingBag} label="Products" value={dashboardStats.products} />
              <StatCard icon={Truck} label="Drivers" value={dashboardStats.drivers} />
              <StatCard icon={ShoppingBag} label="Orders" value={dashboardStats.orders} />
              <StatCard icon={MessageSquare} label="Testimonials" value={dashboardStats.testimonials || 0} />
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Transactions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm font-medium text-gray-500">Cash</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.transactions.cash}</p>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm font-medium text-gray-500">PayPal</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.transactions.paypal}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-white shadow-md rounded-lg p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Admin