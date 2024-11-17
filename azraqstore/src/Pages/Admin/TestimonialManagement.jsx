import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ToggleLeft, ToggleRight, Check } from 'lucide-react';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/testimonials/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTestimonials(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to fetch testimonials');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/testimonials/toggle-status/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling testimonial status:', error);
      setError('Failed to toggle testimonial status');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Testimonial Management</h2>
      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <div 
            key={testimonial._id} 
            className={`bg-white p-6 rounded-lg shadow-md ${
              !testimonial.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{testimonial.author}</h3>
                <p className="text-gray-600 text-sm">{testimonial.email}</p>
                <div className="flex items-center mt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleToggleStatus(testimonial._id)}
                className={`p-2 ${testimonial.isActive ? 'text-green-600' : 'text-gray-400'} hover:bg-gray-50 rounded-full`}
                title={testimonial.isActive ? 'Deactivate' : 'Activate'}
              >
                {testimonial.isActive ? (
                  <ToggleRight size={20} />
                ) : (
                  <ToggleLeft size={20} />
                )}
              </button>
            </div>
            <p className="text-gray-700">{testimonial.text}</p>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(testimonial.createdAt).toLocaleDateString()}
              {!testimonial.isActive && (
                <span className="ml-2 text-gray-500">(Inactive)</span>
              )}
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-center text-gray-600">No testimonials found</p>
        )}
      </div>
    </div>
  );
};

export default TestimonialManagement; 