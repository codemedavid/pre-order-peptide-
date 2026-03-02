import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { usePayments } from '../../context/PaymentContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import OrderStatusTracker from '../../components/customer/OrderStatusTracker';
import { CheckCircle, Copy, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const OrderConfirmationPage = () => {
    const { orderNumber } = useParams();
    const { getOrderByNumber } = useOrders();
    const { methods } = usePayments();
    const [copied, setCopied] = useState(false);

    const order = getOrderByNumber(orderNumber);

    if (!order) {
        return (
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="empty-state">
                        <h3>Order not found</h3>
                        <p>The order number "{orderNumber}" was not found.</p>
                        <Link to="/" className="btn btn-primary" style={{ marginTop: '24px' }}>
                            Go Home
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    const paymentMethod = methods.find(m => m.id === order.paymentMethod);

    const copyOrderNumber = () => {
        navigator.clipboard.writeText(order.orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section style={{ padding: '48px 0 80px' }}>
            <div className="container-narrow">
                {/* Success Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 20px',
                            borderRadius: '50%',
                            background: 'var(--color-success-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CheckCircle size={40} style={{ color: 'var(--color-success)' }} />
                    </div>
                    <h1 style={{ marginBottom: '8px' }}>Order Placed!</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Thank you for your pre-order. Your order has been submitted successfully.
                    </p>
                </div>

                {/* Order Number */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-body" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                            Order Number
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>
                                {order.orderNumber}
                            </span>
                            <button className="btn btn-ghost btn-icon" onClick={copyOrderNumber} title="Copy">
                                <Copy size={18} />
                            </button>
                        </div>
                        {copied && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px' }}>Copied!</p>
                        )}
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-body">
                        <h3 style={{ marginBottom: '16px' }}>Order Status</h3>
                        <OrderStatusTracker currentStatus={order.status} />
                    </div>
                </div>

                {/* Payment Instructions */}
                {paymentMethod && (
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-header">
                            <h3>Payment Instructions</h3>
                            <span className="badge badge-warning">Pending Payment</span>
                        </div>
                        <div className="card-body">
                            <div className="checkout-disclaimer" style={{ marginBottom: '16px' }}>
                                <strong>💰 Full payment required to confirm your order</strong>
                                Please complete payment using the details below.
                            </div>
                            <div style={{
                                background: 'var(--color-surface)',
                                padding: '16px',
                                borderRadius: 'var(--radius)',
                                whiteSpace: 'pre-line',
                                fontSize: '0.875rem',
                                lineHeight: '1.8',
                            }}>
                                <strong>{paymentMethod.name}</strong>
                                <br />
                                {paymentMethod.details}
                                <br /><br />
                                <strong>Amount: {formatCurrency(order.total)}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Details */}
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="card-header">
                        <h3>Order Details</h3>
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
                                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
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

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Link to="/products" className="btn btn-secondary">
                        Continue Shopping
                    </Link>
                    <Link to="/track-order" className="btn btn-primary">
                        Track Your Order <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OrderConfirmationPage;
