import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import { Download, Eye } from 'lucide-react';
import BackButton from '../../Components/BackButton';
import API from '../../api';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadingInvoices, setDownloadingInvoices] = useState({});
    const navigate = useNavigate();
    const { customer } = useCustomer();

    useEffect(() => {
        if (!customer) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [customer, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await API.request(API.endpoints.customerOrders);
            setOrders(response);
        } catch (error) {
            setError('Failed to load orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = async (orderId) => {
        try {
            setDownloadingInvoices(prev => ({ ...prev, [orderId]: true }));
            
            // Get existing invoice (should exist as it's generated automatically)
            const invoice = await API.request(`${API.endpoints.invoices}/order/${orderId}`);

            // Download the invoice
            const response = await fetch(`${API.endpoints.invoiceDownload}/${invoice._id}/download`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice-${invoice.invoiceNumber}.html`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                throw new Error('Failed to download invoice');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert('Failed to download invoice. Please try again.');
        } finally {
            setDownloadingInvoices(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchOrders}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <BackButton fallbackPath="/profile" text="Back to Profile" />
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-shopping-bag-line text-2xl text-gray-400"></i>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="btn btn-primary"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Order #{order.orderNumber}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-4">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/64x64?text=Product'}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded border border-gray-200"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/64x64?text=Product';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Price: ₹{item.price}
                                                </p>
                                                {item.variant && (
                                                    <p className="text-sm text-gray-500">
                                                        {item.variant.name}: {item.variant.value}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t mt-4 pt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                ₹{order.pricing.total.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Payment Status</p>
                                            <p className={`text-sm font-medium ${
                                                order.payment.status === 'completed' 
                                                    ? 'text-green-600' 
                                                    : 'text-yellow-600'
                                            }`}>
                                                {order.payment.status === 'completed' ? 'Paid' : 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            onClick={() => navigate(`/order-success/${order._id}`)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => downloadInvoice(order._id)}
                                            disabled={downloadingInvoices[order._id]}
                                            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                                        >
                                            {downloadingInvoices[order._id] ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                            ) : (
                                                <Download className="h-4 w-4 mr-2" />
                                            )}
                                            {downloadingInvoices[order._id] ? 'Downloading...' : 'Download Invoice'}
                                        </button>
                                    </div>
                                </div>

                                {order.shipping && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                                        <p className="text-sm text-gray-600">
                                            {order.shipping.firstName} {order.shipping.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600">{order.shipping.address.line1}</p>
                                        <p className="text-sm text-gray-600">
                                            {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.zipCode}
                                        </p>
                                        <p className="text-sm text-gray-600">{order.shipping.address.country}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrders;
