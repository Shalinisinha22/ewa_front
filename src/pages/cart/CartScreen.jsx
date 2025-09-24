import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, decreaseCart, removeFromCart, getTotals } from '../../redux/cartSlice';
import { useCustomer } from '../../context/CustomerContext';
import { shippingService } from '../../services/shippingService';
import { taxService } from '../../services/taxService';
import EmptyState from '../../Components/EmptyState';
import BackButton from '../../Components/BackButton';

const CartScreen = () => {
    const cart = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { customer, isAuthenticated } = useCustomer();
    
    const [shippingSettings, setShippingSettings] = useState(null);
    const [taxSettings, setTaxSettings] = useState([]);
    const [selectedShippingZone, setSelectedShippingZone] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    useEffect(() => {
        loadStoreSettings();
    }, []);

    const loadStoreSettings = async () => {
        try {
            setLoading(true);
            const [shippingData, taxData] = await Promise.all([
                shippingService.getShippingSettings(),
                taxService.getTaxSettings()
            ]);
            
            setShippingSettings(shippingData);
            setTaxSettings(taxData);
            
            // Set default shipping zone
            const defaultZone = shippingService.getDefaultZone(shippingData);
            setSelectedShippingZone(defaultZone);
        } catch (error) {
            console.error('Error loading store settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const handleDecreaseCart = (product) => {
        dispatch(decreaseCart(product));
    };

    const handleIncreaseCart = (product) => {
        dispatch(addToCart(product));
    };

    const handleProceedToCheckout = () => {
        if (!isAuthenticated) {
            // Redirect to login with return path
            navigate('/login', { state: { from: '/cart' } });
            return;
        }
        
        if (cart.cartItems.length === 0) {
            return;
        }
        
        navigate('/checkout');
    };

    // Calculate costs
    const subtotal = cart.cartTotalAmount;
    const shippingCost = shippingService.calculateShippingCost(
        subtotal, 
        selectedShippingZone, 
        shippingSettings
    );
    const taxAmount = taxService.calculateTax(subtotal, taxSettings);
    const total = subtotal + shippingCost + taxAmount;

    // Get available shipping zones
    const availableZones = shippingSettings ? shippingService.getAvailableZones(shippingSettings) : [];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="mb-4">
                        <BackButton fallbackPath="/shop" text="Continue Shopping" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">Review your items and proceed to checkout</p>
                </div>
                
            {cart.cartItems.length === 0 ? (
                <EmptyState 
                    type="cart"
                    onAction={() => navigate('/shop')}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Cart Items ({cart.cartTotalQuantity})</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                            {cart.cartItems?.map((cartItem) => (
                                    <div className="p-6" key={cartItem._id}>
                                        <div className="flex items-center space-x-4">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <img 
                                                    src={cartItem.image || cartItem.images?.[0] || 'https://via.placeholder.com/100'} 
                                                    alt={cartItem.name}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                            </div>
                                            
                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                    {cartItem.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {cartItem.brand && `Brand: ${cartItem.brand}`}
                                                    {cartItem.category && ` • Category: ${cartItem.category}`}
                                                </p>
                                                <div className="flex items-center mt-2">
                                                    <span className="text-lg font-semibold text-primary">
                                                        ₹{cartItem.price}
                                                    </span>
                                                    {cartItem.oldPrice && (
                                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                                            ₹{cartItem.oldPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button 
                                                        onClick={() => handleDecreaseCart(cartItem)}
                                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg transition-colors"
                                                    >
                                                        <i className="ri-subtract-line"></i>
                                                    </button>
                                                    <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
                                                        {cartItem.cartQuantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleIncreaseCart(cartItem)}
                                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg transition-colors"
                                                    >
                                                        <i className="ri-add-line"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Item Total & Remove */}
                                            <div className="flex flex-col items-end space-y-2">
                                                <div className="text-lg font-semibold text-gray-900">
                                                    ₹{(cartItem.price * cartItem.cartQuantity).toFixed(2)}
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveFromCart(cartItem)}
                                                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    </div>
                                ))}
                                </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm sticky top-8">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                            </div>
                            
                            <div className="p-6 space-y-6">
                            {/* Shipping Zone Selection */}
                            {availableZones.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            <i className="ri-truck-line mr-2"></i>
                                        Shipping Zone
                                    </label>
                                    <select
                                        value={selectedShippingZone?.name || ''}
                                        onChange={(e) => {
                                            const zone = availableZones.find(z => z.name === e.target.value);
                                            setSelectedShippingZone(zone);
                                        }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {availableZones.map((zone) => (
                                            <option key={zone.name} value={zone.name}>
                                                {zone.name} - {zone.estimatedDays}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Free Shipping Progress */}
                            {shippingSettings && shippingSettings.freeShippingThreshold > subtotal && (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center mb-2">
                                            <i className="ri-gift-line text-blue-600 mr-2"></i>
                                            <span className="text-sm font-medium text-blue-800">Free Shipping Available</span>
                                        </div>
                                        <div className="text-sm text-blue-700 mb-3">
                                        Add ₹{(shippingSettings.freeShippingThreshold - subtotal).toFixed(2)} more for FREE shipping!
                                    </div>
                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ 
                                                width: `${Math.min((subtotal / shippingSettings.freeShippingThreshold) * 100, 100)}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                                {/* Cost Breakdown */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span>Subtotal ({cart.cartTotalQuantity} items)</span>
                                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    {shippingCost > 0 && (
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Shipping</span>
                                            <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    {shippingCost === 0 && subtotal > 0 && (
                                        <div className="flex justify-between items-center text-green-600">
                                            <span className="flex items-center">
                                                <i className="ri-check-line mr-1"></i>
                                                Shipping
                                            </span>
                                            <span className="font-medium">FREE</span>
                                        </div>
                                    )}
                                    
                                    {taxAmount > 0 && (
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Tax</span>
                                            <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                            <button 
                                    className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                onClick={handleProceedToCheckout}
                                disabled={cart.cartItems.length === 0 || loading}
                            >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-secure-payment-line"></i>
                                            {!isAuthenticated ? 'Login to Checkout' : 'Proceed to Checkout'}
                                        </>
                                    )}
                            </button>
                            
                                {/* Continue Shopping */}
                                <div className="text-center">
                                    <Link 
                                        to="/shop" 
                                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                                    >
                                    <i className="ri-arrow-left-line"></i>
                                    <span>Continue Shopping</span>
                                </Link>
                                </div>

                                {/* Security Badge */}
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-200">
                                    <i className="ri-shield-check-line text-green-500"></i>
                                    <span>Secure checkout with SSL encryption</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default CartScreen;