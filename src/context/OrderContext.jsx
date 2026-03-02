import { createContext, useContext, useReducer, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { generateOrderNumber } from '../utils/formatters';

const OrderContext = createContext();

const STORAGE_KEY = 'peptide_orders';

export const ORDER_STATUSES = [
    'Pending Payment',
    'Paid',
    'Ordering Supply',
    'Preparing',
    'Shipped',
    'Completed',
];

const orderReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ORDER':
            return { ...state, orders: [...state.orders, action.payload] };
        case 'UPDATE_ORDER':
            return {
                ...state,
                orders: state.orders.map(o =>
                    o.id === action.payload.id ? { ...o, ...action.payload } : o
                ),
            };
        case 'UPDATE_STATUS':
            return {
                ...state,
                orders: state.orders.map(o =>
                    o.id === action.payload.id
                        ? { ...o, status: action.payload.status, updatedAt: new Date().toISOString() }
                        : o
                ),
            };
        case 'ADD_TRACKING':
            return {
                ...state,
                orders: state.orders.map(o =>
                    o.id === action.payload.id
                        ? { ...o, trackingNumber: action.payload.trackingNumber, courier: action.payload.courier, updatedAt: new Date().toISOString() }
                        : o
                ),
            };
        case 'UPDATE_PAYMENT_STATUS':
            return {
                ...state,
                orders: state.orders.map(o =>
                    o.id === action.payload.id
                        ? { ...o, paymentStatus: action.payload.status, updatedAt: new Date().toISOString() }
                        : o
                ),
            };
        default:
            return state;
    }
};

export const OrderProvider = ({ children }) => {
    const [state, dispatch] = useReducer(orderReducer, {
        orders: loadFromStorage(STORAGE_KEY, []),
    });

    useEffect(() => {
        saveToStorage(STORAGE_KEY, state.orders);
    }, [state.orders]);

    const createOrder = (orderData) => {
        const newOrder = {
            ...orderData,
            id: uuidv4(),
            orderNumber: generateOrderNumber(),
            status: 'Pending Payment',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_ORDER', payload: newOrder });
        return newOrder;
    };

    const updateOrder = (order) => {
        dispatch({ type: 'UPDATE_ORDER', payload: order });
    };

    const updateStatus = (id, status) => {
        dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
    };

    const addTracking = (id, trackingNumber, courier) => {
        dispatch({ type: 'ADD_TRACKING', payload: { id, trackingNumber, courier } });
    };

    const updatePaymentStatus = (id, status) => {
        dispatch({ type: 'UPDATE_PAYMENT_STATUS', payload: { id, status } });
    };

    const getOrderByNumber = (orderNumber) => {
        return state.orders.find(o => o.orderNumber === orderNumber) || null;
    };

    const getOrdersBySession = (sessionId) => {
        return state.orders.filter(o => o.sessionId === sessionId);
    };

    return (
        <OrderContext.Provider value={{
            orders: state.orders,
            createOrder,
            updateOrder,
            updateStatus,
            addTracking,
            updatePaymentStatus,
            getOrderByNumber,
            getOrdersBySession,
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrders must be used within OrderProvider');
    return context;
};
