import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Contact Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have any questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-primary rounded-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <i className="ri-map-pin-2-fill text-2xl"></i>
                <div>
                  <h3 className="font-medium">Our Location</h3>
                  <p>Kankarbagh, Patna, Bihar</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <i className="ri-phone-fill text-2xl"></i>
                <div>
                  <h3 className="font-medium">Phone Number</h3>
                  <p>(+91) 9999999999</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <i className="ri-mail-fill text-2xl"></i>
                <div>
                  <h3 className="font-medium">Email Address</h3>
                  <p>support@ewa.com</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="font-medium mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-200 transition-colors">
                  <i className="ri-facebook-fill text-2xl"></i>
                </a>
                <a href="#" className="hover:text-gray-200 transition-colors">
                  <i className="ri-instagram-fill text-2xl"></i>
                </a>
                <a href="#" className="hover:text-gray-200 transition-colors">
                  <i className="ri-twitter-fill text-2xl"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary px-4 py-2 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary px-4 py-2 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary px-4 py-2 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="mt-1 block w-full rounded-md border-2 border-gray-200 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary px-4 py-2 transition-colors duration-200 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary-dark transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;