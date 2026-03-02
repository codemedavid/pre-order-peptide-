import { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import OrderStatusTracker from '../../components/customer/OrderStatusTracker';
import { Search, Package, Truck } from 'lucide-react';

const OrderTrackingPage = () => {
    const { getOrderByNumber } = useOrders();
    const [searchValue, setSearchValue] = useState('');
    const [order, setOrder] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const found = getOrderByNumber(searchValue.trim());
        setOrder(found);
        setSearched(true);
    };

    return (
        <section style={{ padding: '48px 0 80px' }}>
            <div className="container-narrow">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ marginBottom: '8px' }}>Track Your Order</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Enter your order number to check the status of your pre-order.
                    </p>
                </div>

                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    style={{
                        display: 'flex',
                        gap: '12px',
                        maxWidth: '500px',
                        margin: '0 auto 40px',
                    }}
                >
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter order number (e.g., ORD-...)"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary">
                        <Search size={18} /> Track
                    </button>
                </form>

                {/* Results */}
                {searched && !order && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Package size={28} />
                        </div>
                        <h3>Order not found</h3>
                        <p>
                            No order was found with that number. Please check and try again.
                        </p>
                    </div>
                )}

                {order && (
                    <div style={{ animation: 'slideUp 0.3s ease' }}>
                        {/* Status Tracker */}
                        <div className="card" style={{ marginBottom: '24px' }}>
                            <div className="card-header">
                                <div>
                                    <h3>{order.orderNumber}</h3>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                                        Placed on {formatDateTime(order.createdAt)}
                                    </p>
                                </div>
                                <span className={`badge ${order.status === 'Completed' ? 'badge-success' : order.status === 'Pending Payment' ? 'badge-warning' : 'badge-primary'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="card-body">
                                <OrderStatusTracker currentStatus={order.status} />
                            </div>
                        </div>

                        {/* Tracking Info */}
                        {order.trackingNumber && (
                            <div className="card" style={{ marginBottom: '24px' }}>
                                <div className="card-body" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: 'var(--radius)',
                                        background: 'var(--color-primary-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary)',
                                        flexShrink: 0,
                                    }}>
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Tracking Number</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                            {order.courier && <span>{order.courier} — </span>}
                                            {order.trackingNumber}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="card">
                            <div className="card-header">
                                <h3>Order Items</h3>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {order.items.map((item, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '12px',
                                                background: 'var(--color-surface)',
                                                borderRadius: 'var(--radius)',
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{item.productName}</div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                                                    {item.variantSize} × {item.quantity}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 600 }}>
                                                {formatCurrency(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    borderTop: '1px solid var(--color-border)',
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: 700,
                                    fontSize: '1.125rem',
                                }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrderTrackingPage;
