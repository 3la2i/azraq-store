import React from 'react'
import { MapPin, Clock, Star, Users, TrendingUp, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AboutUs = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">About Azraq Alshamali Food Delivery</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Transforming the food delivery experience in Azraq Alshamali with innovative technology and community-driven service.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-orange-800">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            At Azraq Alshamali Food Delivery, we're on a mission to revolutionize how people access their favorite meals. 
            We're bridging the gap between local restaurants and customers, ensuring that delicious food is just a few taps away.
          </p>
          <p className="text-lg text-gray-700">
            Our goal is to reduce delivery times from 2 hours to just 30-45 minutes, making food delivery a convenient and practical option for all residents in the Azraq Alshamali area.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-orange-800">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Clock className="h-12 w-12 text-orange-600" />}
              title="Fast Delivery"
              description="We've cut delivery times from 2 hours to just 30-45 minutes."
            />
            <FeatureCard 
              icon={<MapPin className="h-12 w-12 text-orange-600" />}
              title="Local Focus"
              description="We're the first local food delivery service in the Azraq Alshamali region."
            />
            <FeatureCard 
              icon={<Star className="h-12 w-12 text-orange-600" />}
              title="Quality Service"
              description="User-friendly app with real-time order tracking and secure payments."
            />
            <FeatureCard 
              icon={<Users className="h-12 w-12 text-orange-600" />}
              title="Community Support"
              description="We create job opportunities for local delivery partners."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-12 w-12 text-orange-600" />}
              title="Local Economy Boost"
              description="Supporting local restaurants and helping them reach a wider audience."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-12 w-12 text-orange-600" />}
              title="Secure & Reliable"
              description="Robust security measures and reliable service you can trust."
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-orange-800">Our Story</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-4">
              The Azraq Alshamali Food Delivery App was born out of a critical need in our community. With no local delivery options and the nearest services being 100 kilometers away, our residents were facing 2-hour wait times for food delivery.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We saw an opportunity to make a difference. By creating a local delivery network, we've not only solved the problem of long wait times but also contributed to our local economy by creating jobs and supporting local restaurants.
            </p>
            <p className="text-lg text-gray-700">
              Today, we're proud to offer a service that brings convenience, supports local businesses, and strengthens our community ties. Our journey is just beginning, and we're excited to continue growing and improving with the support of our users and partners.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-orange-800">Join Us in Our Journey</h2>
          <div className="bg-orange-100 p-6 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-4">
              Whether you're a food lover, a local restaurant owner, or someone looking for flexible work opportunities, there's a place for you in the Azraq Alshamali Food Delivery community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/resturant')}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Order Now
              </button>
              <button 
                onClick={() => navigate('/register/restaurant-owner')}
                className="bg-white hover:bg-orange-50 text-orange-600 font-bold py-2 px-4 rounded border border-orange-600 transition duration-300"
              >
                join your resturant 
              </button>
              {/* <button className="bg-white hover:bg-orange-50 text-orange-600 font-bold py-2 px-4 rounded border border-orange-600 transition duration-300">
                Become a Delivery Partner
              </button> */}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-orange-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Azraq Alshamali Food Delivery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-orange-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

export default AboutUs