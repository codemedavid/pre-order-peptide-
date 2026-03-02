import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSessions } from '../../context/SessionContext';
import { formatCurrency } from '../../utils/formatters';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
    const { items, updateQuantity, removeItem, clearCart, cartTotal, cartCount } = useCart();
    const { activeSession } = useSessions();

    if (items.length === 0) {
        return (
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <ShoppingBag size={28} />
                        </div>
                        <h3>Your cart is empty</h3>
                        <p>Browse our products and add items to your cart.</p>
                        <Link to="/products" className="btn btn-primary" style={{ marginTop: '24px' }}>
                            Browse Products
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section style={{ padding: '48px 0 80px' }}>
            <div className="container">
                <div className="page-header">
                    <h1>Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
                    <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                        <Trash2 size={16} /> Clear Cart
                    </button>
                </div>

                <div className="checkout-layout">
                    <div className="cart-items">
                        {items.map(item => (
                            <div key={`${item.productId}-${item.variantId}`} className="cart-item">
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.productName}</div>
                                    <div className="cart-item-variant">{item.variantSize}</div>
                                    {item.category && (
                                        <span className="badge badge-primary" style={{ marginTop: '8px' }}>
                                            {item.category}
                                        </span>
                                    )}
                                </div>

                                <div className="cart-qty">
                                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}>
                                        <Minus size={16} />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}>
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="cart-item-price">
                                    {formatCurrency(item.price * item.quantity)}
                                </div>

                                <button
                                    className="btn btn-ghost btn-icon"
                                    onClick={() => removeItem(item.productId, item.variantId)}
                                    title="Remove item"
                                >
                                    <Trash2 size={18} style={{ color: 'var(--color-danger)' }} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-summary">
                        <div className="card">
                            <div className="card-body">
                                <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                    {items.map(item => (
                                        <div
                                            key={`${item.productId}-${item.variantId}`}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '0.875rem',
                                            }}
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
                                    fontSize: '1.125rem',
                                    fontWeight: 700,
                                }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(cartTotal)}</span>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="btn btn-primary btn-lg"
                                    style={{
                                        width: '100%',
                                        marginTop: '24px',
                                        pointerEvents: !activeSession ? 'none' : 'auto',
                                        opacity: !activeSession ? 0.5 : 1,
                                    }}
                                >
                                    {activeSession ? (
                                        <>Proceed to Checkout <ArrowRight size={18} /></>
                                    ) : (
                                        'Session not active'
                                    )}
                                </Link>

                                {!activeSession && (
                                    <p style={{
                                        fontSize: '0.8125rem',
                                        color: 'var(--color-warning)',
                                        textAlign: 'center',
                                        marginTop: '12px',
                                    }}>
                                        Checkout is only available during an active session.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartPage;
