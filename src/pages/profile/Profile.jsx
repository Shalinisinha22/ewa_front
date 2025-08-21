import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import API from '../../../api';
import toast from 'react-hot-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });
  const [localError, setLocalError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    line1: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
    isDefault: false
  });
  const navigate = useNavigate();
  const { customer, store, loading, error, updateProfile, logout } = useCustomer();

  // Initialize form data when customer data is available
  React.useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : '',
        gender: customer.gender || ''
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      // Clean up form data before sending
      const cleanFormData = { ...formData };
      
      // Remove empty gender value to avoid validation errors
      if (cleanFormData.gender === '') {
        delete cleanFormData.gender;
      }
      
      await updateProfile(cleanFormData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setLocalError(err.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const updatedAddresses = [...(customer.addresses || []), newAddress];
      await updateProfile({ addresses: updatedAddresses });
      setShowAddressForm(false);
      setNewAddress({
        firstName: '',
        lastName: '',
        line1: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        phone: '',
        isDefault: false
      });
      toast.success('Address added successfully!');
    } catch (err) {
      setLocalError(err.message || 'Failed to add address');
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const updatedAddresses = customer.addresses.filter((_, i) => i !== index);
      await updateProfile({ addresses: updatedAddresses });
      toast.success('Address deleted successfully!');
    } catch (err) {
      setLocalError(err.message || 'Failed to delete address');
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (index) => {
    try {
      const updatedAddresses = customer.addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }));
      await updateProfile({ addresses: updatedAddresses });
    } catch (err) {
      setLocalError(err.message || 'Failed to set default address');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!customer) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">No profile data available</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="mt-1 text-gray-600">Manage your account information</p>
            </div>
            <div className="flex gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition duration-300"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              {(error || localError) && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error || localError}</p>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition duration-300"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setLocalError('');
                        // Reset form data to original values
                        if (customer) {
                          setFormData({
                            firstName: customer.firstName || '',
                            lastName: customer.lastName || '',
                            phone: customer.phone || '',
                            dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : '',
                            gender: customer.gender || ''
                          });
                        }
                      }}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                      <p className="mt-1 text-lg text-gray-900">{customer.firstName || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                      <p className="mt-1 text-lg text-gray-900">{customer.lastName || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg text-gray-900">{customer.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                    <p className="mt-1 text-lg text-gray-900">{customer.phone || 'Not provided'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                      <p className="mt-1 text-lg text-gray-900">
                        {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                      <p className="mt-1 text-lg text-gray-900">
                        {customer.gender ? customer.gender.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Address Management */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition duration-300"
                >
                  {showAddressForm ? 'Cancel' : 'Add Address'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Add Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-4">
                  {customer.addresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium">{address.firstName} {address.lastName}</p>
                            {address.isDefault && (
                              <span className="px-2 py-1 text-xs bg-primary text-white rounded">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.line1}</p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-600">{address.country}</p>
                          {address.phone && (
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(index)}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No addresses saved yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    customer.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone Verified</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    customer.phoneVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.phoneVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="mb-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full btn btn-outline"
                >
                  <i className="ri-shopping-bag-line mr-2"></i>
                  View My Orders
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-medium text-gray-900">
                    {customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Login Count</span>
                  <span className="text-sm font-medium text-gray-900">{customer.loginCount || 0}</span>
                </div>
                {customer.orderStats && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Orders</span>
                      <span className="text-sm font-medium text-gray-900">{customer.orderStats.totalOrders || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="text-sm font-medium text-gray-900">
                      ₹{customer.orderStats.totalSpent || 0}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;