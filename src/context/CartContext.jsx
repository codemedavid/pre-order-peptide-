import { createContext, useContext, useReducer, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';

const CartContext = createContext();

const STORAGE_KEY = 'peptide_cart';

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.items.find(
                i => i.productId === action.payload.productId && i.variantId === action.payload.variantId
            );
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        i.productId === action.payload.productId && i.variantId === action.payload.variantId
                            ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
                            : i
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
            };
        }
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(i =>
                    i.productId === action.payload.productId && i.variantId === action.payload.variantId
                        ? { ...i, quantity: Math.max(1, action.payload.quantity) }
                        : i
                ),
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(
                    i => !(i.productId === action.payload.productId && i.variantId === action.payload.variantId)
                ),
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: loadFromStorage(STORAGE_KEY, []),
    });

    useEffect(() => {
        saveToStorage(STORAGE_KEY, state.items);
    }, [state.items]);

    const addItem = (product, variant) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                productId: product.id,
                variantId: variant.id,
                productName: product.name,
                variantSize: variant.size,
                price: variant.price,
                category: product.category,
            },
        });
    };

    const updateQuantity = (productId, variantId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } });
    };

    const removeItem = (productId, variantId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{
            items: state.items,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            cartTotal,
            cartCount,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
