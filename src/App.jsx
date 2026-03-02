import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

// Customer pages
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import ResearchProtocolsPage from './pages/customer/ResearchProtocolsPage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/ProductsPage';
import AdminSessionsPage from './pages/admin/SessionsPage';
import AdminPaymentsPage from './pages/admin/PaymentsPage';
import AdminOrdersPage from './pages/admin/OrdersPage';

import './App.css';

const CustomerLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
          <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
          <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
          <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
          <Route path="/order-confirmation/:orderNumber" element={<CustomerLayout><OrderConfirmationPage /></CustomerLayout>} />
          <Route path="/track-order" element={<CustomerLayout><OrderTrackingPage /></CustomerLayout>} />
          <Route path="/research" element={<CustomerLayout><ResearchProtocolsPage /></CustomerLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="sessions" element={<AdminSessionsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
