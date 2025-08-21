import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../api';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await API.request(`${API.endpoints.customerOrderDetails}/${orderId}`);
            setOrder(response);
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Order not found</h2>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-check-line text-2xl text-green-600"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600">Thank you for your order. We'll send you an email confirmation shortly.</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div>
                                <p className="text-sm text-gray-600">Order Number</p>
                                <p className="font-medium">{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Order Date</p>
                                <p className="font-medium">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="font-medium text-lg text-primary">
                                    ${order.pricing.total.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="font-medium capitalize">{order.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-primary"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="btn btn-outline"
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
