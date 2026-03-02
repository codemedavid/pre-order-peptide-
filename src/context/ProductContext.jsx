import { createContext, useContext, useReducer, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { seedProducts } from '../data/seedData';
import { v4 as uuidv4 } from 'uuid';

const ProductContext = createContext();

const STORAGE_KEY = 'peptide_products';
const SEED_VERSION_KEY = 'peptide_products_version';
const CURRENT_SEED_VERSION = 2; // Bump this when seedData changes

const getInitialProducts = () => {
    const storedVersion = localStorage.getItem(SEED_VERSION_KEY);
    if (!storedVersion || parseInt(storedVersion) < CURRENT_SEED_VERSION) {
        localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION.toString());
        saveToStorage(STORAGE_KEY, seedProducts);
        return seedProducts;
    }
    return loadFromStorage(STORAGE_KEY, seedProducts);
};

const productReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload };
        case 'ADD_PRODUCT':
            return { ...state, products: [...state.products, action.payload] };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products: state.products.map(p =>
                    p.id === action.payload.id ? action.payload : p
                ),
            };
        case 'DELETE_PRODUCT':
            return {
                ...state,
                products: state.products.filter(p => p.id !== action.payload),
            };
        case 'BULK_IMPORT':
            return { ...state, products: [...state.products, ...action.payload] };
        case 'BULK_UPDATE_PRICES':
            return {
                ...state,
                products: state.products.map(p => {
                    const update = action.payload.find(u => u.id === p.id);
                    if (update) {
                        return {
                            ...p,
                            variants: p.variants.map(v => {
                                const vu = update.variants?.find(uv => uv.id === v.id);
                                return vu ? { ...v, price: vu.price } : v;
                            }),
                        };
                    }
                    return p;
                }),
            };
        case 'TOGGLE_AVAILABILITY':
            return {
                ...state,
                products: state.products.map(p =>
                    p.id === action.payload ? { ...p, available: !p.available } : p
                ),
            };
        default:
            return state;
    }
};

export const ProductProvider = ({ children }) => {
    const [state, dispatch] = useReducer(productReducer, {
        products: getInitialProducts(),
    });

    useEffect(() => {
        saveToStorage(STORAGE_KEY, state.products);
    }, [state.products]);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: uuidv4(),
            variants: product.variants.map(v => ({ ...v, id: uuidv4() })),
        };
        dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
        return newProduct;
    };

    const updateProduct = (product) => {
        dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    };

    const deleteProduct = (id) => {
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
    };

    const bulkImport = (products) => {
        const newProducts = products.map(p => ({
            ...p,
            id: uuidv4(),
            variants: (p.variants || []).map(v => ({ ...v, id: uuidv4() })),
            available: true,
        }));
        dispatch({ type: 'BULK_IMPORT', payload: newProducts });
    };

    const bulkUpdatePrices = (updates) => {
        dispatch({ type: 'BULK_UPDATE_PRICES', payload: updates });
    };

    const toggleAvailability = (id) => {
        dispatch({ type: 'TOGGLE_AVAILABILITY', payload: id });
    };

    const getCategories = () => {
        const cats = [...new Set(state.products.map(p => p.category).filter(Boolean))];
        return cats.sort();
    };

    return (
        <ProductContext.Provider value={{
            products: state.products,
            addProduct,
            updateProduct,
            deleteProduct,
            bulkImport,
            bulkUpdatePrices,
            toggleAvailability,
            getCategories,
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('useProducts must be used within ProductProvider');
    return context;
};
