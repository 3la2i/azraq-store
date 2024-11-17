import React, { useState } from 'react';
import axios from 'axios';
import { Star, Send, Phone, Mail, MapPin } from 'lucide-react';

const inputClasses = "w-full px-3 py-2 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200";
const buttonClasses = "w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: '',
    isTestimonial: false,
    rating: 5
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (formData.isTestimonial) {
        const response = await axios.post('http://localhost:5000/api/testimonials/create', {
          text: formData.message,
          author: formData.name,
          rating: formData.rating,
          email: formData.email
        });
        console.log('Testimonial response:', response.data);
        setSuccess('Thank you for your testimonial! It will be reviewed by our team.');
      } else {
        await axios.post('http://localhost:5000/api/contactus/createContact', {
          from: formData.name,
          subject: formData.subject,
          message: formData.message,
          email: formData.email,
        });
        setSuccess('Your message has been sent!');
      }
      setFormData({ name: '', email: '', message: '', subject: '', isTestimonial: false, rating: 5 });
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Contact Us
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Reach out to us for any inquiries or share your experience!
          </p>
        </div>

        {error && <div className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
        {success && <div className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded-md">{success}</div>}

        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          <div className="bg-white shadow-xl rounded-lg p-6 w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isTestimonial"
                    checked={formData.isTestimonial}
                    onChange={handleChange}
                    className="rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Share your experience as a testimonial</span>
                </label>
              </div>

              {!formData.isTestimonial && (
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="What is this about?"
                    required
                  />
                </div>
              )}

              {formData.isTestimonial && (
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${
                          star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({...prev, rating: star}))}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  {formData.isTestimonial ? 'Your Experience' : 'Message'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder={formData.isTestimonial ? 'Share your experience with our service...' : 'Your message here...'}
                  required
                ></textarea>
              </div>

              <button type="submit" className={buttonClasses}>
                <span className="flex items-center justify-center">
                  <Send className="w-5 h-5 mr-2" />
                  {formData.isTestimonial ? 'Submit Testimonial' : 'Send Message'}
                </span>
              </button>
            </form>
          </div>

          <div className="w-full lg:w-1/3 space-y-8">
            <img 
              className="w-full rounded-lg shadow-lg" 
              src="https://firebasestorage.googleapis.com/v0/b/la2project-4d60e.appspot.com/o/contactimg%2Ffor%20contact.png?alt=media&token=ca3bcc9a-da6b-410f-bcfd-9ed8052684eb" 
              alt="Contact Us" 
            />
            <div className="bg-white shadow-xl rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              <div className="flex items-center space-x-3 text-gray-700">
                <Phone className="w-5 h-5 text-orange-600" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="w-5 h-5 text-orange-600" />
                <span>support@azraqalshamali.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-700">
                <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                <span>123 Food Street, Azraq Alshamali, Jordan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;