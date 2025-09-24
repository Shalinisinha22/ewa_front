import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Eye, Truck, Package, Clock, CreditCard } from 'lucide-react';
import API from '../../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import BackButton from '../Components/BackButton';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch order details using customer endpoint
      const orderData = await API.request(`${API.endpoints.customerOrderDetails}/${orderId}`);
      setOrder(orderData);

      // Try to fetch existing invoice using customer endpoint
      try {
        const invoiceData = await API.request(`${API.endpoints.invoices}/order/${orderId}`);
        setInvoice(invoiceData);
      } catch (invoiceError) {
        // Invoice doesn't exist yet, that's okay
        console.log('No invoice found yet');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };


  const downloadInvoice = async () => {
    if (!order) return;

    try {
      setDownloadingInvoice(true);
      
      // Debug: Check if customer is logged in
      const token = localStorage.getItem('token');
      const storeId = localStorage.getItem('storeId');
      console.log('Download invoice - Token:', token ? 'Present' : 'Missing');
      console.log('Download invoice - Store ID:', storeId);
      console.log('Download invoice - Order ID:', orderId);
      
      // First, try to generate invoice if it doesn't exist
      if (!invoice) {
        console.log('Invoice not found, attempting to generate...');
        try {
          const generateResponse = await fetch(`${API.endpoints.invoices}/order/${orderId}/generate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'X-Store-ID': storeId || '',
            }
          });

          if (generateResponse.ok) {
            const generateData = await generateResponse.json();
            console.log('Invoice generated successfully:', generateData);
            setInvoice(generateData.invoice);
          } else {
            const generateError = await generateResponse.json();
            console.log('Invoice generation failed:', generateError);
            // Continue to try download anyway
          }
        } catch (generateErr) {
          console.log('Invoice generation error:', generateErr);
          // Continue to try download anyway
        }
      }
      
      // Now try to download the invoice
      const response = await fetch(`${API.endpoints.invoices}/order/${orderId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Store-ID': storeId || '',
        }
      });

      console.log('Download invoice response status:', response.status);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice?.invoiceNumber || order?.orderNumber || orderId}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const errorData = await response.json();
        console.error('Download invoice error:', errorData);
        throw new Error(errorData.message || 'Failed to download invoice');
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert(`Failed to download invoice: ${err.message}`);
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      processing: 'text-purple-600 bg-purple-100',
      shipped: 'text-indigo-600 bg-indigo-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
      refunded: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      completed: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100',
      refunded: 'text-gray-600 bg-gray-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: Package },
      { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
      { id: 'processing', label: 'Processing', icon: Clock },
      { id: 'shipped', label: 'Shipped', icon: Truck },
      { id: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => {
      const stepIndex = statusOrder.indexOf(step.id);
      const isCompleted = stepIndex <= currentIndex;
      const isCurrent = stepIndex === currentIndex;
      
      return {
        ...step,
        completed: isCompleted,
        current: isCurrent
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for could not be found.'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <BackButton fallbackPath="/" text="Back to Home" />
        </div>
        {/* Success Header with Invoice Button */}
        <div className="text-center mb-8 relative">
          {/* <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div> */}
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p> */}
          
          {/* Invoice Section */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-6">
              <div className="flex items-center justify-center">
                <button
                  onClick={downloadInvoice}
                  disabled={downloadingInvoice}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {downloadingInvoice ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Section with Order Tracking - Horizontal Layout */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              {trackingSteps.map((step, stepIdx) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className="flex items-center justify-center mb-3">
                    <span className={`h-12 w-12 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm ${
                      step.completed ? 'bg-green-500' : step.current ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      <step.icon className={`h-6 w-6 ${step.completed || step.current ? 'text-white' : 'text-gray-400'}`} />
                    </span>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${step.completed || step.current ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {step.current && (
                      <p className="text-xs text-blue-600 mt-1 font-medium">Current Status</p>
                    )}
                    {step.completed && (
                      <p className="text-xs text-green-600 mt-1 font-medium">Completed</p>
                    )}
                  </div>
                  
                  {/* Connection Line */}
                  {stepIdx < trackingSteps.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                      step.completed ? 'bg-green-400' : 'bg-gray-300'
                    }`} style={{ 
                      transform: 'translateX(50%)',
                      width: 'calc(100% - 3rem)',
                      zIndex: 1
                    }} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Order Progress</span>
                <span>{Math.round((trackingSteps.filter(step => step.completed).length / trackingSteps.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{ 
                    width: `${(trackingSteps.filter(step => step.completed).length / trackingSteps.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Order Details */}
          <div className="lg:col-span-1">
            {/* Order Summary Card */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment.status)}`}>
                      {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg text-primary">₹{order.pricing.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{order.payment.method.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium">₹{order.payment.amount.toFixed(2)}</span>
                  </div>
                  {order.payment.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium text-sm">{order.payment.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Order Items */}
          <div className="lg:col-span-2">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <div key={index} className="p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <img
                        src={item.product.images[0] || 'https://via.placeholder.com/80x80?text=Product'}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=Product';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          {item.variant.name}: {item.variant.value}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shipping && (
              <div className="bg-white rounded-lg shadow-sm mb-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">
                      {order.shipping.firstName} {order.shipping.lastName}
                    </p>
                    <p className="text-gray-600">{order.shipping.address.line1}</p>
                    {order.shipping.address.line2 && (
                      <p className="text-gray-600">{order.shipping.address.line2}</p>
                    )}
                    <p className="text-gray-600">
                      {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.zipCode}
                    </p>
                    <p className="text-gray-600">{order.shipping.address.country}</p>
                  </div>
                </div>
              </div>
            )}

         

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Orders
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
