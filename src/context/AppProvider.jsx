import { ProductProvider } from './ProductContext';
import { SessionProvider } from './SessionContext';
import { CartProvider } from './CartContext';
import { OrderProvider } from './OrderContext';
import { PaymentProvider } from './PaymentContext';

const AppProvider = ({ children }) => {
    return (
        <ProductProvider>
            <SessionProvider>
                <PaymentProvider>
                    <CartProvider>
                        <OrderProvider>
                            {children}
                        </OrderProvider>
                    </CartProvider>
                </PaymentProvider>
            </SessionProvider>
        </ProductProvider>
    );
};

export default AppProvider;
