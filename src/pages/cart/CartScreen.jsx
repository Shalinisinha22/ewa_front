import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, decreaseCart, removeFromCart, getTotals } from '../../redux/cartSlice';
import { useCustomer } from '../../context/CustomerContext';
import { shippingService } from '../../services/shippingService';
import { taxService } from '../../services/taxService';

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
        <div className="cart-container">
            <h2 className="text-2xl font-bold mb-8 text-gray-800">Shopping Cart</h2>
            {cart.cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p>Your cart is currently empty</p>
                    <div className="start-shopping">
                        <Link to="/" className="flex items-center justify-center gap-2">
                            <i className="ri-arrow-left-line"></i>
                            <span>Start Shopping</span>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="cart-items">
                            {cart.cartItems?.map((cartItem) => (
                                <div className="cart-item" key={cartItem._id}>
                                    <div className="cart-product">
                                        <img src={cartItem.image} alt={cartItem.name} />
                                        <div>
                                            <h3>{cartItem.name}</h3>
                                            <p>₹{cartItem.price}</p>
                                            <button onClick={() => handleRemoveFromCart(cartItem)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-product-quantity">
                                        <button onClick={() => handleDecreaseCart(cartItem)}>-</button>
                                        <div className="count">{cartItem.cartQuantity}</div>
                                        <button onClick={() => handleIncreaseCart(cartItem)}>+</button>
                                    </div>
                                    <div className="cart-product-total-price">
                                        ₹{cartItem.price * cartItem.cartQuantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="cart-summary bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                            
                            {/* Shipping Zone Selection */}
                            {availableZones.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shipping Zone
                                    </label>
                                    <select
                                        value={selectedShippingZone?.name || ''}
                                        onChange={(e) => {
                                            const zone = availableZones.find(z => z.name === e.target.value);
                                            setSelectedShippingZone(zone);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        {availableZones.map((zone) => (
                                            <option key={zone.name} value={zone.name}>
                                                {zone.name} - {zone.estimatedDays}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Cost Breakdown */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cart.cartTotalQuantity} items)</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                
                                {shippingCost > 0 && (
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₹{shippingCost.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                {shippingCost === 0 && subtotal > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Shipping</span>
                                        <span>FREE</span>
                                    </div>
                                )}
                                
                                {taxAmount > 0 && (
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span>₹{taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <div className="border-t pt-2">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Free Shipping Progress */}
                            {shippingSettings && shippingSettings.freeShippingThreshold > subtotal && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="text-sm text-blue-700 mb-2">
                                        Add ₹{(shippingSettings.freeShippingThreshold - subtotal).toFixed(2)} more for FREE shipping!
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ 
                                                width: `${Math.min((subtotal / shippingSettings.freeShippingThreshold) * 100, 100)}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <button 
                                className="checkout-button w-full"
                                onClick={handleProceedToCheckout}
                                disabled={cart.cartItems.length === 0 || loading}
                            >
                                {loading ? 'Loading...' : (!isAuthenticated ? 'Login to Checkout' : 'Proceed to Checkout')}
                            </button>
                            
                            <div className="continue-shopping mt-4">
                                <Link to="/" className="flex items-center justify-center gap-2 text-gray-600 hover:text-primary">
                                    <i className="ri-arrow-left-line"></i>
                                    <span>Continue Shopping</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;