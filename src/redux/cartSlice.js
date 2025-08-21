import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems') ? 
               JSON.parse(localStorage.getItem('cartItems')) : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const itemIndex = state.cartItems.findIndex(
                item => item.id === action.payload.id || item._id === action.payload._id
            );

            // Helper function to get stock quantity from new stock structure
            const getStockQuantity = (product) => {
                if (product.stock && typeof product.stock === 'object' && product.stock.quantity !== undefined) {
                    return product.stock.quantity;
                }
                // Fallback to old structure
                return product.stock || 99;
            };

            if (itemIndex >= 0) {
                // If item exists, increase quantity only if less than stock
                if (state.cartItems[itemIndex].cartQuantity < getStockQuantity(action.payload)) {
                    state.cartItems[itemIndex].cartQuantity += 1;
                }
            } else {
                // If item doesn't exist, add new item with quantity 1
                const tempProduct = { ...action.payload, cartQuantity: 1 };
                state.cartItems.push(tempProduct);
            }

            // Update total quantity (sum of all item quantities)
            state.cartTotalQuantity = state.cartItems.reduce(
                (total, item) => total + item.cartQuantity, 0
            );

            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart(state, action) {
            const updatedCartItems = state.cartItems.filter(
                (item) => item._id !== action.payload._id && item.id !== action.payload.id
            );
            state.cartItems = updatedCartItems;
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        decreaseCart(state, action) {
            const itemIndex = state.cartItems.findIndex(
                (item) => item._id === action.payload._id || item.id === action.payload.id
            );
            if (itemIndex >= 0) {
                if (state.cartItems[itemIndex].cartQuantity > 1) {
                    state.cartItems[itemIndex].cartQuantity -= 1;
                } else {
                    state.cartItems = state.cartItems.filter(
                        (item) => item._id !== action.payload._id && item.id !== action.payload.id
                    );
                }
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            }
        },
        getTotals(state) {
            const { total, quantity } = state.cartItems.reduce(
                (cartTotal, cartItem) => {
                    const { price, cartQuantity } = cartItem;
                    cartTotal.total += price * cartQuantity;
                    cartTotal.quantity += cartQuantity;
                    return cartTotal;
                },
                {
                    total: 0,
                    quantity: 0,
                }
            );
            state.cartTotalAmount = total;
            state.cartTotalQuantity = quantity;
        },
        clearCart(state) {
            state.cartItems = [];
            state.cartTotalQuantity = 0;
            state.cartTotalAmount = 0;
            localStorage.removeItem('cartItems');
        }
    },
});

export const { addToCart, removeFromCart, decreaseCart, getTotals, clearCart } = cartSlice.actions;
export default cartSlice.reducer;