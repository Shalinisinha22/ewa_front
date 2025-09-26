import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import BackButton from '../../Components/BackButton';
import API from '../../api';
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
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
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

  // Bank Details State
  const [showBankForm, setShowBankForm] = useState(false);
  const [editingBankIndex, setEditingBankIndex] = useState(null);
  const [newBankDetails, setNewBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    branchAddress: '',
    accountType: 'savings',
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

  const handleEditAddress = (index) => {
    const address = customer.addresses[index];
    setNewAddress({ ...address });
    setEditingAddressIndex(index);
    setShowAddressForm(true);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const updatedAddresses = [...customer.addresses];
      updatedAddresses[editingAddressIndex] = newAddress;
      await updateProfile({ addresses: updatedAddresses });
      setShowAddressForm(false);
      setEditingAddressIndex(null);
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
      toast.success('Address updated successfully!');
    } catch (err) {
      setLocalError(err.message || 'Failed to update address');
      toast.error('Failed to update address');
    }
  };

  // Bank Details Management
  const handleAddBankDetail = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const updatedBankDetails = [...(customer.bankDetails || []), newBankDetails];
      await updateProfile({ bankDetails: updatedBankDetails });
      setShowBankForm(false);
      setNewBankDetails({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        branchAddress: '',
        accountType: 'savings',
        isDefault: false
      });
      toast.success('Bank details added successfully!');
    } catch (err) {
      setLocalError(err.message || 'Failed to add bank details');
      toast.error('Failed to add bank details');
    }
  };

  const handleDeleteBankDetail = async (index) => {
    try {
      const updatedBankDetails = customer.bankDetails.filter((_, i) => i !== index);
      await updateProfile({ bankDetails: updatedBankDetails });
      toast.success('Bank details deleted successfully!');
    } catch (err) {
      setLocalError(err.message || 'Failed to delete bank details');
      toast.error('Failed to delete bank details');
    }
  };

  const handleSetDefaultBankDetail = async (index) => {
    try {
      const updatedBankDetails = customer.bankDetails.map((bank, i) => ({
        ...bank,
        isDefault: i === index
      }));
      await updateProfile({ bankDetails: updatedBankDetails });
      toast.success('Default bank details updated!');
    } catch (err) {
      setLocalError(err.message || 'Failed to set default bank details');
      toast.error('Failed to set default bank details');
    }
  };

  const handleEditBankDetail = (index) => {
    const bankDetail = customer.bankDetails[index];
    setNewBankDetails({ ...bankDetail });
    setEditingBankIndex(index);
    setShowBankForm(true);
  };

  const handleUpdateBankDetail = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const updatedBankDetails = [...customer.bankDetails];
      updatedBankDetails[editingBankIndex] = newBankDetails;
      await updateProfile({ bankDetails: updatedBankDetails });
      setShowBankForm(false);
      setEditingBankIndex(null);
      setNewBankDetails({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        branchAddress: '',
        accountType: 'savings',
        isDefault: false
      });
      toast.success('Bank details updated successfully!');
    } catch (err) {
      setLocalError(err.message || 'Failed to update bank details');
      toast.error('Failed to update bank details');
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BackButton fallbackPath="/" text="Back to Home" />
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {customer?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
            <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {customer?.firstName} {customer?.lastName}
                    </h1>
                    <p className="text-sm text-gray-500">{customer?.email}</p>
                  </div>
                </div>
            </div>
              <div className="flex items-center gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors"
                >
                    <i className="ri-edit-line mr-1"></i>
                    Edit
                </button>
              )}
              <button
                onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                  <i className="ri-logout-box-line mr-1"></i>
                Logout
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <i className="ri-user-line mr-2 text-primary"></i>
                  Personal Information
                </h2>
              </div>
              
              <div className="p-6">
              {(error || localError) && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                    <div className="flex items-center">
                      <i className="ri-error-warning-line text-red-500 mr-3"></i>
                      <p className="text-red-700 text-sm font-medium">{error || localError}</p>
                    </div>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors font-medium"
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
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">First Name</span>
                      <span className="text-sm text-gray-900">{customer.firstName || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Last Name</span>
                      <span className="text-sm text-gray-900">{customer.lastName || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Email</span>
                      <span className="text-sm text-gray-900">{customer.email}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Phone</span>
                      <span className="text-sm text-gray-900">{customer.phone || 'Not provided'}</span>
                  </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                      <span className="text-sm text-gray-900">
                        {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">Gender</span>
                      <span className="text-sm text-gray-900">
                        {customer.gender ? customer.gender.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Address Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <i className="ri-map-pin-line mr-2 text-primary"></i>
                    Addresses
                  </h2>
                <button
                    onClick={() => {
                      if (showAddressForm) {
                        setShowAddressForm(false);
                        setEditingAddressIndex(null);
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
                      } else {
                        setEditingAddressIndex(null);
                        setShowAddressForm(true);
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
                  >
                    <i className="ri-add-line mr-1"></i>
                  {showAddressForm ? 'Cancel' : 'Add Address'}
                </button>
                </div>
              </div>
              
              <div className="p-6">

              {showAddressForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <form onSubmit={editingAddressIndex !== null ? handleUpdateAddress : handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        value={newAddress.firstName}
                        onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        value={newAddress.lastName}
                        onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Address</label>
                    <input
                      type="text"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                      required
                    />
                  </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        required
                      />
                    </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">State</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        required
                      />
                    </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">ZIP Code</label>
                      <input
                        type="text"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Country</label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        required
                      />
                    </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                    <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                        className="w-5 h-5 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                      <label htmlFor="isDefault" className="ml-3 text-sm font-medium text-blue-800">
                      Set as default address
                    </label>
                  </div>
                  
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                        className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                    >
                        {editingAddressIndex !== null ? 'Update Address' : 'Add Address'}
                    </button>
                    <button
                      type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressIndex(null);
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
                        }}
                        className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                </div>
              )}

              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-6">
                  {customer.addresses.map((address, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            {/* <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                              <i className="ri-map-pin-line text-primary text-xl"></i>
                            </div> */}
                            <div>
                              <p className="text-lg font-semibold text-gray-900">{address.firstName} {address.lastName}</p>
                            {address.isDefault && (
                                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-primary text-white rounded-full">
                                  <i className="ri-check-line mr-1"></i>
                                  Default Address
                                </span>
                            )}
                            </div>
                          </div>
                          <div className="space-y-2 text-gray-700">
                            <p className="flex items-center">
                              <i className="ri-home-line mr-2 text-gray-400"></i>
                              {address.line1}
                            </p>
                            <p className="flex items-center">
                              <i className="ri-map-pin-line mr-2 text-gray-400"></i>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                            <p className="flex items-center">
                              <i className="ri-global-line mr-2 text-gray-400"></i>
                              {address.country}
                            </p>
                          {address.phone && (
                              <p className="flex items-center">
                                <i className="ri-phone-line mr-2 text-gray-400"></i>
                                {address.phone}
                              </p>
                          )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEditAddress(index)}
                            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                          >
                            <i className="ri-edit-line mr-1"></i>
                            Edit
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(index)}
                              className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <i className="ri-star-line mr-1"></i>
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(index)}
                            className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <i className="ri-delete-bin-line mr-1"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-map-pin-line text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-600 text-lg">No addresses saved yet.</p>
                  <p className="text-gray-500 text-sm mt-2">Add your first address to get started.</p>
                </div>
              )}
              </div>
            </div>

            {/* Bank Details Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <i className="ri-bank-line mr-2 text-primary"></i>
                    Bank Details for Refunds
                  </h2>
                  <button
                    onClick={() => {
                      if (showBankForm) {
                        setShowBankForm(false);
                        setEditingBankIndex(null);
                        setNewBankDetails({
                          accountHolderName: '',
                          bankName: '',
                          accountNumber: '',
                          ifscCode: '',
                          upiId: '',
                          branchAddress: '',
                          accountType: 'savings',
                          isDefault: false
                        });
                      } else {
                        setEditingBankIndex(null);
                        setShowBankForm(true);
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
                  >
                    <i className="ri-add-line mr-1"></i>
                    {showBankForm ? 'Cancel' : 'Add Bank Details'}
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {showBankForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      {editingBankIndex !== null ? 'Edit Bank Details' : 'Add New Bank Details'}
                    </h3>
                    <form onSubmit={editingBankIndex !== null ? handleUpdateBankDetail : handleAddBankDetail} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                          <input
                            type="text"
                            value={newBankDetails.accountHolderName}
                            onChange={(e) => setNewBankDetails({...newBankDetails, accountHolderName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                          <input
                            type="text"
                            value={newBankDetails.bankName}
                            onChange={(e) => setNewBankDetails({...newBankDetails, bankName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Account Number</label>
                          <input
                            type="text"
                            value={newBankDetails.accountNumber}
                            onChange={(e) => setNewBankDetails({...newBankDetails, accountNumber: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                          <input
                            type="text"
                            value={newBankDetails.ifscCode}
                            onChange={(e) => setNewBankDetails({...newBankDetails, ifscCode: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">UPI ID (Optional)</label>
                          <input
                            type="text"
                            value={newBankDetails.upiId}
                            onChange={(e) => setNewBankDetails({...newBankDetails, upiId: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">Account Type</label>
                          <select
                            value={newBankDetails.accountType}
                            onChange={(e) => setNewBankDetails({...newBankDetails, accountType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="savings">Savings Account</option>
                            <option value="current">Current Account</option>
                            <option value="nri">NRI Account</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Branch Address (Optional)</label>
                        <input
                          type="text"
                          value={newBankDetails.branchAddress}
                          onChange={(e) => setNewBankDetails({...newBankDetails, branchAddress: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Bank branch address"
                        />
                      </div>
                      
                      <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <input
                          type="checkbox"
                          id="bankIsDefault"
                          checked={newBankDetails.isDefault}
                          onChange={(e) => setNewBankDetails({...newBankDetails, isDefault: e.target.checked})}
                          className="w-5 h-5 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <label htmlFor="bankIsDefault" className="ml-3 text-sm font-medium text-blue-800">
                          Set as default bank details for refunds
                        </label>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                          type="submit"
                          className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                        >
                          {editingBankIndex !== null ? 'Update Bank Details' : 'Add Bank Details'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowBankForm(false);
                            setEditingBankIndex(null);
                            setNewBankDetails({
                              accountHolderName: '',
                              bankName: '',
                              accountNumber: '',
                              ifscCode: '',
                              upiId: '',
                              branchAddress: '',
                              accountType: 'savings',
                              isDefault: false
                            });
                          }}
                          className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {customer.bankDetails && customer.bankDetails.length > 0 ? (
                  <div className="space-y-6">
                    {customer.bankDetails.map((bankDetail, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                                <i className="ri-bank-line text-primary text-xl"></i>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900">{bankDetail.accountHolderName}</p>
                                {bankDetail.isDefault && (
                                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-primary text-white rounded-full">
                                    <i className="ri-check-line mr-1"></i>
                                    Default Bank Details
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2 text-gray-700">
                              <p className="flex items-center">
                                <i className="ri-bank-line mr-2 text-gray-400"></i>
                                <span className="font-medium">Bank:</span> {bankDetail.bankName}
                              </p>
                              <p className="flex items-center">
                                <i className="ri-credit-card-line mr-2 text-gray-400"></i>
                                <span className="font-medium">Account:</span> {bankDetail.accountNumber}
                              </p>
                              <p className="flex items-center">
                                <i className="ri-code-s-slash-line mr-2 text-gray-400"></i>
                                <span className="font-medium">IFSC:</span> {bankDetail.ifscCode}
                              </p>
                              {bankDetail.upiId && (
                                <p className="flex items-center">
                                  <i className="ri-phone-line mr-2 text-gray-400"></i>
                                  <span className="font-medium">UPI ID:</span> {bankDetail.upiId}
                                </p>
                              )}
                              {bankDetail.branchAddress && (
                                <p className="flex items-center">
                                  <i className="ri-map-pin-line mr-2 text-gray-400"></i>
                                  <span className="font-medium">Branch:</span> {bankDetail.branchAddress}
                                </p>
                              )}
                              <p className="flex items-center">
                                <i className="ri-wallet-line mr-2 text-gray-400"></i>
                                <span className="font-medium">Type:</span> {bankDetail.accountType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleEditBankDetail(index)}
                              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                              <i className="ri-edit-line mr-1"></i>
                              Edit
                            </button>
                            {!bankDetail.isDefault && (
                              <button
                                onClick={() => handleSetDefaultBankDetail(index)}
                                className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                <i className="ri-star-line mr-1"></i>
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBankDetail(index)}
                              className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <i className="ri-delete-bin-line mr-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-bank-line text-2xl text-gray-400"></i>
                    </div>
                    <p className="text-gray-600 text-lg">No bank details saved yet.</p>
                    <p className="text-gray-500 text-sm mt-2">Add your bank details for faster refund processing.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <i className="ri-shield-check-line mr-3 text-primary"></i>
                  Account Status
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center">
                    <i className="ri-user-line text-green-600 mr-3"></i>
                    <span className="text-sm font-semibold text-green-800">Status</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    customer.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {customer.status === 'active' ? (
                      <>
                        <i className="ri-check-line mr-1"></i>
                        Active
                      </>
                    ) : (
                      <>
                        <i className="ri-close-line mr-1"></i>
                        Inactive
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center">
                    <i className="ri-mail-line text-blue-600 mr-3"></i>
                    <span className="text-sm font-semibold text-blue-800">Email Verified</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    customer.emailVerified ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {customer.emailVerified ? (
                      <>
                        <i className="ri-check-line mr-1"></i>
                        Verified
                      </>
                    ) : (
                      <>
                        <i className="ri-time-line mr-1"></i>
                        Not Verified
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center">
                    <i className="ri-phone-line text-purple-600 mr-3"></i>
                    <span className="text-sm font-semibold text-purple-800">Phone Verified</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    customer.phoneVerified ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                  }`}>
                    {customer.phoneVerified ? (
                      <>
                        <i className="ri-check-line mr-1"></i>
                        Verified
                      </>
                    ) : (
                      <>
                        <i className="ri-time-line mr-1"></i>
                        Not Verified
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;