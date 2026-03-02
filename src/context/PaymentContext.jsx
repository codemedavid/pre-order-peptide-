import { createContext, useContext, useReducer, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { seedPaymentMethods, seedPaymentRules } from '../data/seedData';
import { v4 as uuidv4 } from 'uuid';

const PaymentContext = createContext();

const METHODS_KEY = 'peptide_payment_methods';
const RULES_KEY = 'peptide_payment_rules';

const paymentReducer = (state, action) => {
    switch (action.type) {
        case 'SET_METHODS':
            return { ...state, methods: action.payload };
        case 'ADD_METHOD':
            return { ...state, methods: [...state.methods, action.payload] };
        case 'UPDATE_METHOD':
            return {
                ...state,
                methods: state.methods.map(m =>
                    m.id === action.payload.id ? action.payload : m
                ),
            };
        case 'DELETE_METHOD':
            return {
                ...state,
                methods: state.methods.filter(m => m.id !== action.payload),
            };
        case 'TOGGLE_METHOD':
            return {
                ...state,
                methods: state.methods.map(m =>
                    m.id === action.payload ? { ...m, enabled: !m.enabled } : m
                ),
            };
        case 'SET_RULES':
            return { ...state, rules: action.payload };
        default:
            return state;
    }
};

export const PaymentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(paymentReducer, {
        methods: loadFromStorage(METHODS_KEY, seedPaymentMethods),
        rules: loadFromStorage(RULES_KEY, seedPaymentRules),
    });

    useEffect(() => {
        saveToStorage(METHODS_KEY, state.methods);
    }, [state.methods]);

    useEffect(() => {
        saveToStorage(RULES_KEY, state.rules);
    }, [state.rules]);

    const addMethod = (method) => {
        const newMethod = { ...method, id: uuidv4() };
        dispatch({ type: 'ADD_METHOD', payload: newMethod });
        return newMethod;
    };

    const updateMethod = (method) => {
        dispatch({ type: 'UPDATE_METHOD', payload: method });
    };

    const deleteMethod = (id) => {
        dispatch({ type: 'DELETE_METHOD', payload: id });
    };

    const toggleMethod = (id) => {
        dispatch({ type: 'TOGGLE_METHOD', payload: id });
    };

    const updateRules = (rules) => {
        dispatch({ type: 'SET_RULES', payload: rules });
    };

    const enabledMethods = state.methods.filter(m => m.enabled);

    return (
        <PaymentContext.Provider value={{
            methods: state.methods,
            enabledMethods,
            rules: state.rules,
            addMethod,
            updateMethod,
            deleteMethod,
            toggleMethod,
            updateRules,
        }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayments = () => {
    const context = useContext(PaymentContext);
    if (!context) throw new Error('usePayments must be used within PaymentProvider');
    return context;
};
