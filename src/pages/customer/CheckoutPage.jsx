import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useSessions } from '../../context/SessionContext';
import { usePayments } from '../../context/PaymentContext';
import { formatCurrency } from '../../utils/formatters';
import { AlertTriangle, Upload, ShieldCheck } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, cartTotal, clearCart } = useCart();
    const { createOrder } = useOrders();
    const { activeSession } = useSessions();
    const { enabledMethods } = usePayments();

    const [form, setForm] = useState({
        customerName: '',
        email: '',
        phone: '',
        paymentMethod: '',
        notes: '',
        proofOfPayment: null,
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, proofOfPayment: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.customerName.trim()) errs.customerName = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
        if (!form.phone.trim()) errs.phone = 'Phone number is required';
        if (!form.paymentMethod) errs.paymentMethod = 'Select a payment method';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);

        const order = createOrder({
            items: items.map(i => ({
                productId: i.productId,
                variantId: i.variantId,
                productName: i.productName,
                variantSize: i.variantSize,
                price: i.price,
                quantity: i.quantity,
            })),
            total: cartTotal,
            customerName: form.customerName,
            email: form.email,
            phone: form.phone,
            paymentMethod: form.paymentMethod,
            notes: form.notes,
            proofOfPayment: form.proofOfPayment,
            sessionId: activeSession?.id,
            sessionName: activeSession?.name,
        });

        clearCart();
        navigate(`/order-confirmation/${order.orderNumber}`);
    };

    if (!activeSession) {
        return (
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <AlertTriangle size={28} />
                        </div>
                        <h3>No Active Session</h3>
                        <p>Checkout is only available during an active pre-order session.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const selectedMethod = enabledMethods.find(m => m.id === form.paymentMethod);

    return (
        <section style={{ padding: '48px 0 80px' }}>
            <div className="container">
                <h1 style={{ marginBottom: '32px' }}>Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="checkout-layout">
                        <div className="checkout-form">
                            {/* Disclaimer */}
                            <div className="checkout-disclaimer">
                                <strong><ShieldCheck size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Full Payment Required</strong>
                                Your order will only be confirmed once full payment is received. Items will be dispatched
                                after the session closes and bulk supply is ordered. Expected dispatch timeline will be
                                communicated after session end.
                            </div>

                            {/* Customer Info */}
                            <div className="card">
                                <div className="card-header">
                                    <h3>Customer Information</h3>
                                </div>
                                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            className="form-input"
                                            placeholder="Enter your full name"
                                            value={form.customerName}
                                            onChange={handleChange}
                                        />
                                        {errors.customerName && <span className="form-error">{errors.customerName}</span>}
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                placeholder="your@email.com"
                                                value={form.email}
                                                onChange={handleChange}
                                            />
                                            {errors.email && <span className="form-error">{errors.email}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-input"
                                                placeholder="09XX XXX XXXX"
                                                value={form.phone}
                                                onChange={handleChange}
                                            />
                                            {errors.phone && <span className="form-error">{errors.phone}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="card">
                                <div className="card-header">
                                    <h3>Payment Method</h3>
                                </div>
                                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {enabledMethods.map(method => (
                                        <label
                                            key={method.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '12px',
                                                padding: '16px',
                                                borderRadius: 'var(--radius)',
                                                border: `1.5px solid ${form.paymentMethod === method.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                background: form.paymentMethod === method.id ? 'var(--color-primary-50)' : 'var(--color-bg)',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={form.paymentMethod === method.id}
                                                onChange={handleChange}
                                                style={{ marginTop: '2px' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{method.name}</div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', whiteSpace: 'pre-line' }}>
                                                    {method.details}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                    {errors.paymentMethod && <span className="form-error">{errors.paymentMethod}</span>}

                                    {selectedMethod && (selectedMethod.type === 'bank' || selectedMethod.type === 'ewallet') && (
                                        <div style={{ marginTop: '8px' }}>
                                            <label className="form-label">Upload Proof of Payment (optional)</label>
                                            <div className="file-upload" onClick={() => document.getElementById('proof-upload').click()}>
                                                <input
                                                    type="file"
                                                    id="proof-upload"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                                <Upload size={32} className="file-upload-icon" />
                                                {form.proofOfPayment ? (
                                                    <p style={{ color: 'var(--color-success)' }}>✓ File uploaded</p>
                                                ) : (
                                                    <p>Click to upload <span>proof of payment</span></p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-group">
                                        <label className="form-label">Order Notes (optional)</label>
                                        <textarea
                                            name="notes"
                                            className="form-textarea"
                                            placeholder="Any special instructions..."
                                            value={form.notes}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="checkout-summary">
                            <div className="card">
                                <div className="card-body">
                                    <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                        {items.map(item => (
                                            <div
                                                key={`${item.productId}-${item.variantId}`}
                                                style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}
                                            >
                                                <span style={{ color: 'var(--color-text-secondary)' }}>
                                                    {item.productName} ({item.variantSize}) × {item.quantity}
                                                </span>
                                                <span style={{ fontWeight: 500 }}>
                                                    {formatCurrency(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{
                                        borderTop: '1px solid var(--color-border)',
                                        paddingTop: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '1.25rem',
                                        fontWeight: 700,
                                    }}>
                                        <span>Total</span>
                                        <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(cartTotal)}</span>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={submitting}
                                        style={{ width: '100%', marginTop: '24px' }}
                                    >
                                        {submitting ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default CheckoutPage;
