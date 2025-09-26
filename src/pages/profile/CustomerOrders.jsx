import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import { Download, Eye, X, RotateCcw, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import BackButton from '../../Components/BackButton';
import API from '../../api';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadingInvoices, setDownloadingInvoices] = useState({});
    const [cancellingOrders, setCancellingOrders] = useState({});
    const [requestingReturns, setRequestingReturns] = useState({});
    const [returnReasons, setReturnReasons] = useState({});
    const [returnSubmittedOrders, setReturnSubmittedOrders] = useState([]);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [bankDetails, setBankDetails] = useState({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: '',
        branchAddress: ''
    });
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
            toast.error('Failed to download invoice. Please try again.');
        } finally {
            setDownloadingInvoices(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        try {
            setCancellingOrders(prev => ({ ...prev, [orderId]: true }));
            
            await API.request(`${API.endpoints.customerOrderCancel}/${orderId}/cancel`, {
                method: 'PUT',
                body: JSON.stringify({})
            });

            // Refresh orders
            await fetchOrders();
            toast.success('Order cancelled successfully');
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(`Failed to cancel order: ${error.message || 'Please try again.'}`);
        } finally {
            setCancellingOrders(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const requestReturn = async (orderId) => {
        const reason = returnReasons[orderId]?.trim();
        if (!reason) {
            toast.error('Please provide a reason for the return request.');
            return;
        }

        // Validate bank details
        if (!bankDetails.accountHolderName || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
            toast.error('Please provide all required bank details.');
            return;
        }

        try {
            setRequestingReturns(prev => ({ ...prev, [orderId]: true }));
            
            await API.request(`${API.endpoints.customerOrderReturn}/${orderId}/return`, {
                method: 'POST',
                body: JSON.stringify({
                    reason: reason,
                    notes: returnReasons[orderId + '_notes'] || '',
                    bankDetails: bankDetails
                })
            });

            // Mark as submitted
            setReturnSubmittedOrders(prev => [...prev, orderId]);
            
            // Refresh orders
            await fetchOrders();
            toast.success('Return request submitted successfully. Our support team will review your request.');
            
            // Clear forms
            setShowReturnModal(false);
            setSelectedOrderId(null);
            setReturnReasons(prev => ({ ...prev, [orderId]: '' }));
            setBankDetails({
                accountHolderName: '',
                bankName: '',
                accountNumber: '',
                ifscCode: '',
                upiId: '',
                branchAddress: ''
            });
        } catch (error) {
            console.error('Error requesting return:', error);
            toast.error(`Failed to submit return request: ${error.message || 'Please try again.'}`);
        } finally {
            setRequestingReturns(prev => ({ ...prev, [orderId]: false }));
        }
    };


    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            case 'return_requested':
                return 'bg-orange-100 text-orange-800';
            case 'refund_completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const canCancelOrder = (order) => {
        return order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing';
    };

    const canRequestReturn = (order) => {
        return order.status === 'delivered' && !returnSubmittedOrders.includes(order._id);
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
        <>
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
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                                        <button
                                            onClick={() => navigate(`/order-success/${order._id}`)}
                                            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => downloadInvoice(order._id)}
                                            disabled={downloadingInvoices[order._id]}
                                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                                        >
                                            {downloadingInvoices[order._id] ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                            ) : (
                                                <Download className="h-4 w-4 mr-2" />
                                            )}
                                            {downloadingInvoices[order._id] ? 'Downloading...' : 'Download Invoice'}
                                        </button>
                                        
                                        {/* Cancel Order Button */}
                                        {canCancelOrder(order) && (
                                            <button
                                                onClick={() => cancelOrder(order._id)}
                                                disabled={cancellingOrders[order._id]}
                                                className="inline-flex items-center px-6 py-3 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                            >
                                                {cancellingOrders[order._id] ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent mr-2" />
                                                ) : (
                                                    <X className="h-4 w-4 mr-2" />
                                                )}
                                                {cancellingOrders[order._id] ? 'Cancelling...' : 'Cancel Order'}
                                            </button>
                                        )}

                                        {/* Return Request Button */}
                                        {canRequestReturn(order) && (
                                            <button
                                                onClick={() => {
                                                    setSelectedOrderId(order._id);
                                                    setShowReturnModal(true);
                                                }}
                                                className="inline-flex items-center px-6 py-3 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                Request Return
                                            </button>
                                        )}

                                        {/* Status Messages if already submitted */}
                                        {order.status === 'delivered' && returnSubmittedOrders.includes(order._id) && (
                                            <div className="inline-flex items-center px-4 py-2 rounded-md bg-blue-100 text-blue-800 text-sm">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Return request submitted - Under review
                                            </div>
                                        )}
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

        {/* Return Request Modal */}
        {showReturnModal && selectedOrderId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <RotateCcw className="h-6 w-6 text-blue-600 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">
                                Request Return
                            </h3>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Return Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Return Reason *
                                </label>
                                <textarea
                                    value={returnReasons[selectedOrderId] || ''}
                                    onChange={(e) => setReturnReasons(prev => ({ ...prev, [selectedOrderId]: e.target.value }))}
                                    placeholder="Please describe why you want to return this order..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                    rows={4}
                                />
                            </div>
                         


                            {/* Additional Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={returnReasons[selectedOrderId + '_notes'] || ''}
                                    onChange={(e) => setReturnReasons(prev => ({ ...prev, [selectedOrderId + '_notes']: e.target.value }))}
                                    placeholder="Any additional information..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                    rows={2}
                                />
                            </div>

                            {/* Bank Details Section */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Bank Details for Refund Processing</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Account Holder Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.accountHolderName}
                                            onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                                            placeholder="Enter full name as per bank records"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bank Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.bankName}
                                            onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                                            placeholder="Enter bank name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Account Number *
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.accountNumber}
                                            onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                                            placeholder="Enter account number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            IFSC Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.ifscCode}
                                            onChange={(e) => setBankDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                                            placeholder="Enter IFSC code"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            UPI ID (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.upiId}
                                            onChange={(e) => setBankDetails(prev => ({ ...prev, upiId: e.target.value }))}
                                            placeholder="Enter UPI ID for faster processing"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Branch Address (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={bankDetails.branchAddress}
                                            onChange={(e) => setBankDetails(prev => ({ ...prev, branchAddress: e.target.value }))}
                                            placeholder="Enter branch address"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowReturnModal(false);
                                    setSelectedOrderId(null);
                                    setReturnReasons(prev => ({ ...prev, [selectedOrderId]: '' }));
                                    setBankDetails({
                                        accountHolderName: '',
                                        bankName: '',
                                        accountNumber: '',
                                        ifscCode: '',
                                        upiId: '',
                                        branchAddress: ''
                                    });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => requestReturn(selectedOrderId)}
                                disabled={requestingReturns[selectedOrderId]}
                                className={`px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50
                                    ${requestingReturns[selectedOrderId] || !returnReasons[selectedOrderId]?.trim() || !bankDetails.accountHolderName || !bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {requestingReturns[selectedOrderId] ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    'Submit Return Request'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default CustomerOrders;
